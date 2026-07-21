import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllNews, getNewsTranslation, formatPostDate } from '@/lib/news';
import { PageShell } from '@/components/PageShell';
import { BlogImg } from '@/components/BlogImg';
import { LOCALES, type Locale } from '@/lib/i18nLabels';
import styles from '@/app/blog/blog.module.css';
import n from '@/app/news/news.module.css';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Game News | New Releases, Updates, Launches',
    description: 'Daily-curated game news from Korea and worldwide — new releases, updates, pre-registration, and launch announcements.',
    alternates: { canonical: 'https://gcalen.com/en/news' },
  },
  ja: {
    title: 'ゲームニュース | 新作・アップデート・発売情報',
    description: '国内外の新作、アップデート、事前予約、発売情報を毎日整理。Gcalenがキュレーションする最新ゲームニュース。',
    alternates: { canonical: 'https://gcalen.com/ja/news' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const H2: Record<Locale, string> = { en: 'Game News', ja: 'ゲームニュース' };
const SUBTITLE: Record<Locale, string> = {
  en: 'New releases, updates, pre-registration, and launch news — curated daily.',
  ja: '新作・アップデート・事前予約・発売情報を毎日整理。',
};
const EMPTY: Record<Locale, string> = { en: 'No news yet — check back soon!', ja: 'まだニュースがありません。近日公開予定です!' };
const UNTRANSLATED_TAG: Record<Locale, string> = { en: '(Korean only)', ja: '(韓国語のみ)' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const items = await getAllNews();

  // 항목별로 번역이 있으면 그 언어 제목/설명 + /lang/news/slug로, 없으면 한국어 + /news/slug로(폴백).
  const rows = await Promise.all(items.map(async it => {
    const t = await getNewsTranslation(it.slug, lang);
    return {
      slug: it.slug,
      href: t ? `/${lang}/news/${it.slug}` : `/news/${it.slug}`,
      title: t ? t.title : it.title,
      description: t ? t.description : it.description,
      translated: !!t,
      date: it.date,
      source: it.source,
      heroImage: it.heroImage,
    };
  }));

  return (
    <PageShell lang={lang}>
      <section className={styles.indexSection}>
        <header className={styles.header}>
          <h2 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg> {H2[lang]}</h2>
          <p className={styles.subtitle}>{SUBTITLE[lang]}</p>
        </header>

        {rows.length === 0 ? (
          <p className={styles.empty}>{EMPTY[lang]}</p>
        ) : (
          <ul className={styles.postList}>
            {rows.map(it => (
              <li key={it.slug} className={it.heroImage ? `${styles.postCard} ${styles.postCardThumb}` : styles.postCard}>
                <a href={it.href} className={styles.postLink}>
                  {it.heroImage && <BlogImg src={it.heroImage} containerClassName={styles.thumb} />}
                  <div className={styles.postCardBody}>
                    <time className={styles.postDate}>
                      {formatPostDate(it.date)}
                      {it.source && <span className={n.sourceBadge}>{it.source}</span>}
                    </time>
                    <h3 className={styles.postTitle}>
                      {it.title}
                      {!it.translated && <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 400 }}> {UNTRANSLATED_TAG[lang]}</span>}
                    </h3>
                    {it.description && <p className={styles.postDesc}>{it.description}</p>}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
