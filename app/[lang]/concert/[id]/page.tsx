import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames, getGameById, getGameTranslation, getTranslatedGameIds, getLastUpdated } from '@/lib/games';
import { CATEGORY_LABELS, UI, LOCALES, type Locale } from '@/lib/i18nLabels';
import { PageShell } from '@/components/PageShell';

interface Props {
  params: { lang: string; id: string };
}

function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

// SSG: 번역(description_en/ja)이 있는 게임 × 지원 언어만 생성 — 없으면 그 언어 페이지 자체가 안 생김
export async function generateStaticParams() {
  const games = await getAllGames();
  const params: { lang: Locale; id: string }[] = [];
  for (const lang of LOCALES) {
    const ids = await getTranslatedGameIds(lang);
    for (const id of ids) params.push({ lang, id });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const game = await getGameById(params.id);
  if (!game) return { title: UI[params.lang].notFound };
  const t = await getGameTranslation(params.id, params.lang);
  if (!t) return { title: `${game.name_en ?? game.name_ko} — ${UI[params.lang].siteName}`, robots: { index: false } };

  const url = `https://gcalen.com/${params.lang}/concert/${params.id}`;
  const koUrl = `https://gcalen.com/concert/${params.id}`;
  const ogImage = game.image_url || 'https://gcalen.com/og-image.png';
  const title = `${t.name} — ${UI[params.lang].siteName}`;

  return {
    title,
    description: t.description.slice(0, 158),
    alternates: {
      canonical: url,
      languages: { ko: koUrl, en: `https://gcalen.com/en/concert/${params.id}`, ja: `https://gcalen.com/ja/concert/${params.id}` },
    },
    openGraph: { title, description: t.description, url, type: 'article', images: [{ url: ogImage }] },
    twitter: { card: 'summary_large_image', title, description: t.description.slice(0, 158), images: [ogImage] },
  };
}

export default async function LocaleGamePage({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const ui = UI[lang];

  const game = await getGameById(params.id);
  if (!game) notFound();
  const t = await getGameTranslation(params.id, lang);
  const koUrl = `https://gcalen.com/concert/${params.id}`;

  // 번역 없는 게임을 스위처로 눌러 들어온 경우 — redirect()는 이 라우트의 정적 캐싱과 충돌해
  // 신뢰할 수 없이 동작해(첫 요청 결과가 영구 캐시됨) 일반 조건부 렌더로 대체(404/리다이렉트 아님).
  if (!t) {
    return (
      <PageShell lang={lang}>
        <article className="game-detail">
          <h1>{game.name_en ?? game.name_ko}</h1>
          <p>{ui.notTranslated}</p>
          <p><a href={koUrl} className="detail-link">{ui.viewOriginal}</a></p>
        </article>
      </PageShell>
    );
  }

  const lastUpdatedIso = await getLastUpdated();
  const dateStr = game.release_date_approx
    ? ui.tba
    : new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(
        new Date(game.release_date)
      );

  const videoGameLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: t.name,
    image: game.image_url || 'https://gcalen.com/og-image.png',
    ...(game.platforms.length ? { gamePlatform: game.platforms, operatingSystem: game.platforms } : {}),
    ...(game.genres.length ? { genre: game.genres } : {}),
    ...(game.publisher ? { publisher: { '@type': 'Organization', name: game.publisher } } : {}),
    ...(game.developer ? { author: { '@type': 'Organization', name: game.developer } } : {}),
    datePublished: game.release_date,
    dateModified: lastUpdatedIso,
    description: t.description,
    inLanguage: lang,
    url: `https://gcalen.com/${lang}/concert/${params.id}`,
  };

  return (
    <PageShell lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameLd) }} />
      <article className="game-detail">
        <div className="detail-head">
          <span className={`category-tag cat-bg-${game.category}`}>{CATEGORY_LABELS[lang][game.category]}</span>
        </div>
        <h1>{t.name}</h1>
        {game.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.image_url} alt={t.name} style={{ width: '100%', maxWidth: 480, borderRadius: 12, margin: '1rem 0' }} />
        )}
        <p className="release-date">
          <strong>{ui.releaseDate}:</strong> {dateStr}
        </p>
        <p className="desc">{t.description}</p>
        <ul className="detail-meta">
          {game.developer && <li><strong>{ui.developer}</strong>{game.developer}</li>}
          {game.publisher && <li><strong>{ui.publisher}</strong>{game.publisher}</li>}
          {game.platforms.length > 0 && <li><strong>{ui.platforms}</strong>{game.platforms.join(', ')}</li>}
          {game.genres.length > 0 && <li><strong>{ui.genres}</strong>{game.genres.join(', ')}</li>}
        </ul>
        <p>
          <a href={koUrl} className="detail-link">{ui.viewOriginal}</a>
        </p>
      </article>
    </PageShell>
  );
}
