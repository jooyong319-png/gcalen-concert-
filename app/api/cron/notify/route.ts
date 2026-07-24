import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import gamesKo from '@/data/concerts.ko.json';
import gamesEn from '@/data/concerts.en.json';
import gamesJa from '@/data/concerts.ja.json';
import type { Category, LocaleCode } from '@/lib/types';
import { normalizePrefs } from '@/lib/notifyPrefs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GameLite {
  id: string;
  name: string;
  category: Category;
  release_date: string;
  release_date_approx?: boolean;
  presale_datetime?: string | null;
  general_sale_datetime?: string | null;
}

// 알림 종류 — 사전 타이밍(dday/d1/d3/d7) + 예매 오픈(presale/general)
type NotifyKind = 'dday' | 'd1' | 'd3' | 'd7' | 'presale_open' | 'general_open';
// 사전 타이밍 kind ↔ 오프셋(일)
const OFFSET_KIND: Record<number, NotifyKind> = { 0: 'dday', 1: 'd1', 3: 'd3', 7: 'd7' };
function offsetOfKind(kind: NotifyKind): number | null {
  switch (kind) {
    case 'dday': return 0;
    case 'd1': return 1;
    case 'd3': return 3;
    case 'd7': return 7;
    default: return null; // 예매 오픈 kind
  }
}

const CATEGORY_LABEL: Record<LocaleCode, Record<Category, string>> = {
  ko: {
    concert_tour: '콘서트·내한 공연',
    music_release: '음원 발매(컴백)',
    festival: '페스티벌',
    fanmeeting: '팬미팅',
  },
  en: {
    concert_tour: 'Concerts & Tours',
    music_release: 'Music Release (Comeback)',
    festival: 'Festival',
    fanmeeting: 'Fan Meeting',
  },
  ja: {
    concert_tour: 'コンサート・来日公演',
    music_release: '音源発売(カムバック)',
    festival: 'フェスティバル',
    fanmeeting: 'ファンミーティング',
  },
};

// game_ids는 로케일 접두사(ko-/en-/ja-)가 항상 붙어 있다(RESEARCHER 프롬프트 규칙) — 이걸로
// 해당 id가 어느 concerts.<locale>.json 소속인지, 알림 문구를 어느 언어로 보낼지 정한다.
function localeOfId(id: string): LocaleCode | null {
  const p = id.split('-')[0];
  return p === 'ko' || p === 'en' || p === 'ja' ? p : null;
}

// 알림 제목 접두(사전 타이밍) — 로케일별
function whenPrefix(lang: LocaleCode, kind: NotifyKind): string {
  const off = offsetOfKind(kind);
  if (kind === 'presale_open') return lang === 'ko' ? '선예매 오픈' : lang === 'ja' ? '先行販売開始' : 'Presale open';
  if (kind === 'general_open') return lang === 'ko' ? '예매 오픈' : lang === 'ja' ? '一般販売開始' : 'On sale now';
  if (off === 0) return lang === 'ko' ? '오늘이에요' : lang === 'ja' ? '本日' : 'Today';
  if (off === 1) return lang === 'ko' ? '내일이에요' : lang === 'ja' ? '明日' : 'Tomorrow';
  return lang === 'ko' ? `${off}일 뒤` : lang === 'ja' ? `${off}日後` : `In ${off} days`;
}

function timeOf(iso: string | null | undefined): string {
  return iso ? iso.slice(11, 16) : '';
}
// ISO(오프셋 포함)에서 날짜만(YYYY-MM-DD) — 앞 10자가 곧 그 공연 타임존 기준 로컬 날짜
function dateOnly(iso: string | null | undefined): string | null {
  return iso ? iso.slice(0, 10) : null;
}

function buildPayload(lang: LocaleCode, kind: NotifyKind, g: GameLite): string {
  const cat = CATEGORY_LABEL[lang][g.category];
  const prefix = whenPrefix(lang, kind);
  const title =
    lang === 'ja' ? `${prefix}: ${g.name}` : `${prefix}! ${g.name}`;

  let body: string;
  if (kind === 'presale_open' || kind === 'general_open') {
    const time = timeOf(kind === 'presale_open' ? g.presale_datetime : g.general_sale_datetime);
    body =
      lang === 'ko' ? `${cat} · 오늘 ${time} 예매 시작`
      : lang === 'ja' ? `${cat} · 本日 ${time} 販売開始`
      : `${cat} · Opens today at ${time}`;
  } else {
    body =
      lang === 'ko' ? `${cat} · 지금 확인해보세요.`
      : lang === 'ja' ? `${cat} · 今すぐチェック！`
      : `${cat} — check it out now.`;
  }
  return JSON.stringify({ title, body, url: `/${lang}/concert/${g.id}`, tag: `${g.id}-${kind}` });
}

// KST 기준 N일 뒤 날짜(YYYY-MM-DD)
function kstDateStr(offsetDays = 0): string {
  const kst = new Date(Date.now() + 9 * 3600 * 1000);
  kst.setUTCDate(kst.getUTCDate() + offsetDays);
  return kst.toISOString().slice(0, 10);
}
// 현재 KST 시각(0~23)
function kstHour(): number {
  return new Date(Date.now() + 9 * 3600 * 1000).getUTCHours();
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
          JSON.stringify({ title: '테스트 알림 🔔', body: '푸시가 정상 작동해요!', url: '/ko/wishlist' }),
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
  const hourNow = kstHour();
  // 발송 시각(prefs.hour) 게이팅은 매시간 크론일 때만(CRON_HOURLY=1). 그 외(하루 1회 크론)엔
  // 시각을 무시하고 그때 발송 — Vercel Hobby처럼 크론이 하루 1회만 돌 때도 알림이 정상 발송되게.
  const hourlyMode = process.env.CRON_HOURLY === '1';

  // ko/en/ja는 서로 번역이 아니라 완전히 독립된 콘텐츠라(id도 로케일별로 다름) 셋 다 훑어야
  // 함 — 하나로 합친 맵의 키는 id 자체가 이미 로케일 접두사로 전역 유일하다.
  const allGames: GameLite[] = [
    ...(gamesKo as { games: GameLite[] }).games,
    ...(gamesEn as { games: GameLite[] }).games,
    ...(gamesJa as { games: GameLite[] }).games,
  ];

  // 오프셋 날짜(당일/D-1/D-3/D-7)
  const offsetDate: Record<number, string> = { 0: today, 1: kstDateStr(1), 3: kstDateStr(3), 7: kstDateStr(7) };

  // "오늘 발송 후보"를 gid별로 모아둔다(모든 오프셋 + 예매 오픈). 실제 발송 여부는 구독자별
  // prefs(오프셋/예매/카테고리)로 필터. 날짜 미확정(approx)은 사전 타이밍에서 제외.
  const dueByGid = new Map<string, NotifyKind[]>();
  const addDue = (id: string, kind: NotifyKind) => {
    if (!dueByGid.has(id)) dueByGid.set(id, []);
    dueByGid.get(id)!.push(kind);
  };
  for (const g of allGames) {
    if (!g.release_date_approx) {
      for (const o of [0, 1, 3, 7]) {
        if (g.release_date === offsetDate[o]) addDue(g.id, OFFSET_KIND[o]);
      }
    }
    if (dateOnly(g.presale_datetime) === today) addDue(g.id, 'presale_open');
    if (dateOnly(g.general_sale_datetime) === today) addDue(g.id, 'general_open');
  }
  if (dueByGid.size === 0) {
    return NextResponse.json({ ok: true, sent: 0, note: 'no targets today' });
  }
  const byId = new Map(allGames.map(g => [g.id, g]));

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, game_ids, prefs');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  let pruned = 0;
  let skippedHour = 0;
  for (const s of subs ?? []) {
    const prefs = normalizePrefs(s.prefs);
    // 발송 시각 게이팅(매시간 모드에서만)
    if (hourlyMode && prefs.hour !== hourNow) { skippedHour++; continue; }

    const ids: string[] = s.game_ids ?? [];
    for (const id of ids) {
      const kinds = dueByGid.get(id);
      if (!kinds) continue;
      const g = byId.get(id);
      const lang = localeOfId(id);
      if (!g || !lang) continue;
      if (!prefs.categories.includes(g.category)) continue; // 카테고리 필터

      for (const kind of kinds) {
        const off = offsetOfKind(kind);
        // prefs로 이 kind가 켜져 있는지 확인
        if (off === null) {
          if (!prefs.ticketing) continue;              // 예매 오픈 알림 off
        } else if (!prefs.offsets.includes(off)) {
          continue;                                     // 이 사전 타이밍 미선택
        }

        // 중복 발송 방지: (endpoint, game_id, kind) unique. 충돌하면 이미 보낸 것.
        const { error: logErr } = await supabase
          .from('push_sent_log')
          .insert({ endpoint: s.endpoint, game_id: id, kind });
        if (logErr) continue;

        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            buildPayload(lang, kind, g),
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
  }

  return NextResponse.json({ ok: true, sent, pruned, skippedHour, dueGames: dueByGid.size, subs: subs?.length ?? 0 });
}
