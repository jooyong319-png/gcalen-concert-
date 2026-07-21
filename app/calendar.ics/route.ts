import { getUpcomingGames } from '@/lib/games';
import { CATEGORY_META } from '@/lib/types';

export const dynamic = 'force-static';
export const revalidate = 3600;

// ICS 텍스트 이스케이프 (쉼표/세미콜론/백슬래시/줄바꿈)
function esc(s: string): string {
  return (s || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export async function GET() {
  const games = (await getUpcomingGames()).filter(g => !g.release_date_approx);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//gcalen//game-release-calendar//KR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:게임 출시 캘린더',
    'X-WR-CALDESC:국내외 신작·신규 서버 출시 일정 (gcalen.com)',
    'X-WR-TIMEZONE:Asia/Seoul',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
  ];

  for (const g of games) {
    const date = g.release_date.replace(/-/g, ''); // YYYYMMDD
    const cat = CATEGORY_META[g.category]?.label ?? '';
    const desc = `${cat ? `[${cat}] ` : ''}${g.description ?? ''}\nhttps://gcalen.com/game/${g.id}`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${g.id}@gcalen.com`,
      `DTSTAMP:${date}T000000Z`,
      `DTSTART;VALUE=DATE:${date}`,
      `SUMMARY:${esc(g.name_ko)} 출시`,
      `DESCRIPTION:${esc(desc)}`,
      `URL:https://gcalen.com/game/${g.id}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  const body = lines.join('\r\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="gcalen.ics"',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
