import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getUpcomingGamesByCategory, getLastUpdated, formatKoreanDate, formatShortDate, getKoreanWeekday, getGameTranslation } from '@/lib/games';
import { CATEGORY_META, type Game } from '@/lib/types';
import { WishlistButton } from '@/components/WishlistButton';
import { GameReactions } from '@/components/GameReactions';
import { DdayBadge } from '@/components/DdayBadge';
import { ShareButton } from '@/components/ShareButton';
import { ViewCounter } from '@/components/ViewCounter';
import { DetailCover } from '@/components/DetailCover';
import { PreRegCountdown } from '@/components/PreRegCountdown';
import { Comments } from '@/components/Comments';
import { PageShell } from '@/components/PageShell';

interface Props {
  params: { id: string };
}

// SSG: 모든 항목 ID로 정적 페이지 생성
export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map(g => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const games = await getAllGames();
  const game = games.find(g => g.id === params.id);
  if (!game) return { title: '일정을 찾을 수 없음' };

  const catLabel = CATEGORY_META[game.category]?.label ?? game.category;
  const dateStr = formatKoreanDate(game.release_date);
  const url = `https://gcalen.com/concert/${game.id}`;

  const isPreReg = !!game.pre_registration;
  const preRegStr = game.pre_registration_date ? formatKoreanDate(game.pre_registration_date) : '';

  const titleText = isPreReg
    ? `${game.name_ko} 사전예약/티켓 일정`
    : `${game.name_ko} 일정 ${dateStr}`;
  const title = `${titleText} | 콘서트 캘린더`;

  const desc = (isPreReg
    ? `${game.name_ko}${game.name_en ? ` (${game.name_en})` : ''} 사전예약/티켓팅${preRegStr ? `이 ${preRegStr}에 시작` : ' 진행 중'}됩니다. ${game.publisher ? `주최 ${game.publisher}. ` : ''}${game.description ?? ''}`
    : `${game.name_ko}${game.name_en ? ` (${game.name_en})` : ''} 일정은 ${dateStr}입니다. ${game.developer ? `아티스트/기획사 ${game.developer}, ` : ''}${game.publisher ? `주최 ${game.publisher}. ` : ''}${game.description ?? ''}`
  ).slice(0, 158);

  const keywords = [
    game.name_ko,
    ...(game.name_en ? [game.name_en] : []),
    `${game.name_ko} 일정`,
    catLabel,
    ...game.platforms,
    ...game.genres,
    '콘서트 일정', '내한 공연',
  ];

  const ogImage = game.image_url || '/og-image.png';
  const lastUpdated = await getLastUpdated();

  const [enT, jaT] = await Promise.all([
    getGameTranslation(game.id, 'en'),
    getGameTranslation(game.id, 'ja'),
  ]);
  const languages: Record<string, string> = { ko: url };
  if (enT) languages.en = `https://gcalen.com/en/concert/${game.id}`;
  if (jaT) languages.ja = `https://gcalen.com/ja/concert/${game.id}`;

  return {
    title: { absolute: title },
    description: desc,
    keywords,
    alternates: { canonical: url, languages },
    openGraph: {
      title, description: desc, url, type: 'article',
      siteName: '콘서트 캘린더', locale: 'ko_KR',
      publishedTime: lastUpdated, modifiedTime: lastUpdated,
      section: catLabel,
      images: [{ url: ogImage, alt: `${game.name_ko} 대표 이미지` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  };
}

export default async function ConcertPage({ params }: Props) {
  const games = await getAllGames();
  const game = games.find(g => g.id === params.id);
  if (!game) notFound();

  const catLabel = CATEGORY_META[game.category]?.label ?? game.category;
  const dateStr = formatKoreanDate(game.release_date);
  const weekday = game.release_date_approx ? '' : ` (${getKoreanWeekday(game.release_date)})`;
  const url = `https://gcalen.com/concert/${game.id}`;
  const preRegStr = game.pre_registration_date ? formatKoreanDate(game.pre_registration_date) : '';
  const preRegEndStr = game.pre_registration_end_date ? formatKoreanDate(game.pre_registration_end_date) : '';
  const isPreReg = !!game.pre_registration;
  const lastUpdatedIso = await getLastUpdated();
  const lastUpdatedStr = formatKoreanDate(lastUpdatedIso.slice(0, 10));

  const related: Game[] = (await getUpcomingGamesByCategory(game.category))
    .filter(g => g.id !== game.id)
    .sort((a, b) => a.release_date.localeCompare(b.release_date))
    .slice(0, 6);

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: game.name_ko,
    image: game.image_url || 'https://gcalen.com/og-image.png',
    startDate: game.release_date,
    ...(game.publisher ? { organizer: { '@type': 'Organization', name: game.publisher } } : {}),
    description: game.description ?? '',
    inLanguage: 'ko',
    url,
    ...(isPreReg ? {
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/PreOrder',
        ...(game.pre_registration_url ? { url: game.pre_registration_url } : {}),
        ...(game.pre_registration_date ? { validFrom: game.pre_registration_date } : {}),
      },
    } : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://gcalen.com/' },
      { '@type': 'ListItem', position: 2, name: game.name_ko, item: url },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="detail-backdrop">
        <nav className="breadcrumb" aria-label="위치">
          <a href="/">홈</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{game.name_ko}</span>
        </nav>

        <article className="game-detail">
          <div className="detail-header">
            <DetailCover imageUrl={game.image_url} alt={`${game.name_ko} 대표 이미지`} category={game.category} />
            <div className="detail-header-info">
              <div className="detail-head">
                <span className={`category-tag cat-bg-${game.category}`}>{catLabel}</span>
                <DdayBadge releaseDate={game.release_date} approx={game.release_date_approx} />
              </div>
              <h1>{game.name_ko}</h1>
              {game.name_en && game.name_en !== game.name_ko && (
                <p className="name-en">{game.name_en}</p>
              )}
              <div className="detail-release-row">
                <p className="release-date">
                  <svg className="ic" aria-hidden="true"><use href="#ic-calendar" /></svg> 일정: {game.release_date_approx ? '미정' : `${dateStr}${weekday}`}
                </p>
                <ViewCounter gameId={game.id} />
              </div>
            </div>
          </div>
          {game.pre_registration && (
            <PreRegCountdown startDate={game.pre_registration_date} endDate={game.pre_registration_end_date} />
          )}
          {game.description && <p className="desc">{game.description}</p>}
          <ul className="detail-meta">
            {game.developer && <li><strong>아티스트/기획사</strong>{game.developer}</li>}
            {game.publisher && <li><strong>주최</strong>{game.publisher}</li>}
            {game.platforms.length > 0 && <li><strong>장소</strong>{game.platforms.join(', ')}</li>}
            {game.genres.length > 0 && <li><strong>태그</strong>{game.genres.join(', ')}</li>}
          </ul>
          <div className="detail-actions">
            {game.pre_registration_url && (
              <a className="detail-link prereg-cta" href={game.pre_registration_url} target="_blank" rel="noopener">
                티켓/사전예약 하러 가기 <svg className="ic" aria-hidden="true"><use href="#ic-arrow-ur" /></svg>
              </a>
            )}
            <WishlistButton id={game.id} className="detail-link" />
            <ShareButton url={url} title={game.name_ko} className="detail-link" />
            {game.source_url && (
              <a className="detail-link" href={game.source_url} target="_blank" rel="noopener">공식 출처 →</a>
            )}
          </div>
          <GameReactions gameId={game.id} />
          <p className="detail-updated">
            <time dateTime={lastUpdatedIso}>마지막 업데이트: {lastUpdatedStr}</time>
          </p>
        </article>

        <Comments gameId={game.id} />

        {related.length > 0 && (
          <section className="detail-related">
            <h2>{catLabel} 더보기</h2>
            <div className="related-grid">
              {related.map(r => (
                <a key={r.id} href={`/concert/${r.id}`} className="related-card">
                  <span className="related-name">{r.name_ko}</span>
                  <span className="related-date">
                    {r.release_date_approx ? '미정' : formatShortDate(r.release_date)}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
