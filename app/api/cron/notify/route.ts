import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import gamesData from '@/data/concerts.ko.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GameLite {
  id: string;
  name: string;
  release_date: string;
  release_date_approx?: boolean;
}

// KST 기준 N일 뒤 날짜(YYYY-MM-DD)
function kstDateStr(offsetDays = 0): string {
  const kst = new Date(Date.now() + 9 * 3600 * 1000);
  kst.setUTCDate(kst.getUTCDate() + offsetDays);
  return kst.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  // 보안: Vercel Cron이 주입하는 Authorization: Bearer <CRON_SECRET> 확인
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:devju546@gmail.com';
  if (!url || !serviceKey || !vapidPublic || !vapidPrivate) {
    return NextResponse.json({ error: 'missing env' }, { status: 500 });
  }

  webpush.setVapidDetails(subject, vapidPublic, vapidPrivate);
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // 테스트 모드: ?test=1 → 날짜 무관 구독자 전원에게 1발(파이프라인 검증용)
  if (new URL(req.url).searchParams.get('test') === '1') {
    const { data: subs, error: e } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth');
    if (e) return NextResponse.json({ error: e.message }, { status: 500 });
    let sent = 0;
    let pruned = 0;
    for (const s of subs ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({ title: '테스트 알림 🔔', body: '푸시가 정상 작동해요!', url: '/wishlist' }),
        );
        sent++;
      } catch (err: unknown) {
        const code = (err as { statusCode?: number })?.statusCode;
        if (code === 404 || code === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', s.endpoint);
          pruned++;
        }
      }
    }
    return NextResponse.json({ ok: true, test: true, sent, pruned, subs: subs?.length ?? 0 });
  }

  const today = kstDateStr(0);
  const tomorrow = kstDateStr(1);
  const games = (gamesData as { games: GameLite[] }).games;
  const byId = new Map(games.map(g => [g.id, g]));

  // 대상: 오늘 출시(dday) / 내일 출시(d1) — 미정 제외
  const targets: { id: string; kind: 'dday' | 'd1' }[] = [];
  for (const g of games) {
    if (g.release_date_approx) continue;
    if (g.release_date === today) targets.push({ id: g.id, kind: 'dday' });
    else if (g.release_date === tomorrow) targets.push({ id: g.id, kind: 'd1' });
  }
  if (targets.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, note: 'no targets today' });
  }

  const targetIds = targets.map(t => t.id);
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, game_ids')
    .overlaps('game_ids', targetIds);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  let pruned = 0;
  for (const s of subs ?? []) {
    const ids: string[] = s.game_ids ?? [];
    for (const t of targets) {
      if (!ids.includes(t.id)) continue;

      // 중복 발송 방지: (endpoint, game_id, kind) unique. 충돌하면 이미 보낸 것.
      const { error: logErr } = await supabase
        .from('push_sent_log')
        .insert({ endpoint: s.endpoint, game_id: t.id, kind: t.kind });
      if (logErr) continue;

      const g = byId.get(t.id)!;
      const payload = JSON.stringify({
        title: t.kind === 'dday' ? `오늘 출시! ${g.name}` : `내일 출시! ${g.name}`,
        body:
          t.kind === 'dday'
            ? `${g.name} 오늘 출시돼요. 지금 확인해 보세요.`
            : `${g.name} 내일 출시 예정이에요.`,
        url: `/ko/concert/${g.id}`,
        tag: `${g.id}-${t.kind}`,
      });

      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        );
        sent++;
      } catch (err: unknown) {
        const code = (err as { statusCode?: number })?.statusCode;
        if (code === 404 || code === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', s.endpoint);
          pruned++;
        }
      }
    }
  }

  return NextResponse.json({ ok: true, sent, pruned, targets: targets.length, subs: subs?.length ?? 0 });
}
