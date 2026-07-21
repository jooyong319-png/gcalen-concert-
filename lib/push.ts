'use client';
// 웹 푸시 구독 클라이언트 헬퍼 — Supabase에 구독정보 + 찜 game_ids 저장.
import { supabase, isSupabaseReady } from './supabase';

// env에 붙여넣을 때 따라온 공백/줄바꿈/따옴표 제거(있으면 subscribe 실패 원인)
const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim().replace(/^["']|["']$/g, '');

// 마지막 실패 사유(화면 토스트 진단용)
let lastPushError: string | null = null;
export function getLastPushError(): string | null { return lastPushError; }

export function pushConfigured(): boolean {
  return !!VAPID_PUBLIC;
}

export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function getReg(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null;
  try { return await navigator.serviceWorker.ready; } catch { return null; }
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  const reg = await getReg();
  if (!reg) return null;
  return reg.pushManager.getSubscription();
}

async function saveSubscription(sub: PushSubscription, gameIds: string[]): Promise<void> {
  if (!isSupabaseReady() || !supabase) throw new Error('Supabase 미설정');
  const json = sub.toJSON();
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      endpoint: sub.endpoint,
      p256dh: json.keys?.p256dh ?? '',
      auth: json.keys?.auth ?? '',
      game_ids: gameIds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' },
  );
  if (error) throw new Error('DB ' + error.message);
}

export type SubscribeResult = 'ok' | 'denied' | 'unsupported' | 'error';

export async function subscribePush(gameIds: string[]): Promise<SubscribeResult> {
  if (!pushSupported() || !VAPID_PUBLIC) return 'unsupported';
  // 이미 허용된 경우 재요청하지 않음(중복 프롬프트 방지)
  let perm: NotificationPermission = Notification.permission;
  if (perm === 'default') {
    try { perm = await Notification.requestPermission(); } catch { return 'error'; }
  }
  if (perm !== 'granted') return 'denied';
  const reg = await getReg();
  if (!reg) return 'unsupported';
  lastPushError = null;
  let sub: PushSubscription;
  try {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
    });
  } catch (e) {
    lastPushError = 'subscribe: ' + ((e as Error)?.message || String(e));
    console.error('[push] subscribe 실패', e);
    return 'error';
  }
  try {
    await saveSubscription(sub, gameIds);
  } catch (e) {
    lastPushError = 'save: ' + ((e as Error)?.message || String(e));
    console.error('[push] save 실패', e);
    return 'error';
  }
  return 'ok';
}

export async function unsubscribePush(): Promise<void> {
  const sub = await getCurrentSubscription();
  if (!sub) return;
  const endpoint = sub.endpoint;
  try { await sub.unsubscribe(); } catch { /* ignore */ }
  if (isSupabaseReady() && supabase) {
    await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
  }
}

// 찜 목록 변경 시 구독자의 game_ids 동기화(구독 없으면 무시)
export async function syncGameIds(gameIds: string[]): Promise<void> {
  const sub = await getCurrentSubscription();
  if (!sub || !isSupabaseReady() || !supabase) return;
  await supabase
    .from('push_subscriptions')
    .update({ game_ids: gameIds, updated_at: new Date().toISOString() })
    .eq('endpoint', sub.endpoint);
}
