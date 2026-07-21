import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostTranslation, formatPostDate } from '@/lib/blog';
import { PageShell } from '@/components/PageShell';
import { BlogImg } from '@/components/BlogImg';
import { LOCALES, type Locale } from '@/lib/i18nLabels';
import styles from '@/app/blog/blog.module.css';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Game Roundups | New Release Picks, Monthly Summaries, Top Lists',
    description: 'New release picks, monthly and half-year roundups, most-anticipated lists, and new-server schedules — curated by Gcalen.',
    alternates: { canonical: 'https://gcalen.com/en/blog' },
  },
  ja: {
    title: 'まとめ記事 | 新作おすすめ・発売情報まとめ・TOPリスト',
    description: '新作おすすめ、月間・下半期発売まとめ、期待作TOPリスト、新規サーバー情報など、Gcalenがキュレーションするまとめ記事。',
    alternates: { canonical: 'https://gcalen.com/ja/blog' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const H2: Record<Locale, string> = { en: 'Roundups', ja: 'まとめ記事' };
const SUBTITLE: Record<Locale, string> = {
  en: 'New release picks, most-anticipated top lists, monthly/half-year roundups, and new-server schedules.',
  ja: '新作おすすめ、期待作TOPリスト、月間・下半期発売まとめ、新規サーバー情報。',
};
const EMPTY: Record<Locale, string> = { en: 'No posts yet — check back soon!', ja: 'まだ記事がありません。近日公開予定です!' };
const UNTRANSLATED_TAG: Record<Locale, string> = { en: '(Korean only)', ja: '(韓国語のみ)' };

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const posts = await getAllPosts();

  const rows = await Promise.all(posts.map(async p => {
    const t = await getPostTranslation(p.slug, lang);
    return {
      slug: p.slug,
      href: t ? `/${lang}/blog/${p.slug}` : `/blog/${p.slug}`,
      title: t ? t.title : p.title,
      description: t ? t.description : p.description,
      translated: !!t,
      date: p.date,
      heroImage: p.heroImage,
    };
  }));

  return (
    <PageShell lang={lang}>
      <section className={styles.indexSection}>
        <header className={styles.header}>
          <h2 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-file" /></svg> {H2[lang]}</h2>
          <p className={styles.subtitle}>{SUBTITLE[lang]}</p>
        </header>

        {rows.length === 0 ? (
          <p className={styles.empty}>{EMPTY[lang]}</p>
        ) : (
          <ul className={styles.postList}>
            {rows.map(p => (
              <li key={p.slug} className={p.heroImage ? `${styles.postCard} ${styles.postCardThumb}` : styles.postCard}>
                <a href={p.href} className={styles.postLink}>
                  {p.heroImage && <BlogImg src={p.heroImage} containerClassName={styles.thumb} />}
                  <div className={styles.postCardBody}>
                    <time className={styles.postDate}>{formatPostDate(p.date)}</time>
                    <h3 className={styles.postTitle}>
                      {p.title}
                      {!p.translated && <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 400 }}> {UNTRANSLATED_TAG[lang]}</span>}
                    </h3>
                    {p.description && <p className={styles.postDesc}>{p.description}</p>}
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
