import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllNews, getNewsBySlug, getNewsTranslation, getTranslatedNewsSlugs, markdownToHtml, formatPostDate } from '@/lib/news';
import { UI, LOCALES, type Locale } from '@/lib/i18nLabels';
import { PageShell } from '@/components/PageShell';
import { BlogHero } from '@/components/BlogHero';
import styles from '@/app/blog/blog.module.css';
import n from '@/app/news/news.module.css';

interface Props {
  params: { lang: string; slug: string };
}

function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

export async function generateStaticParams() {
  const params: { lang: Locale; slug: string }[] = [];
  for (const lang of LOCALES) {
    const slugs = await getTranslatedNewsSlugs(lang);
    for (const slug of slugs) params.push({ lang, slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const item = await getNewsBySlug(params.slug);
  if (!item) return { title: UI[params.lang].notFound };
  const t = await getNewsTranslation(item.slug, params.lang);
  if (!t) return { title: `${item.title} — ${UI[params.lang].siteName}`, robots: { index: false } };

  const url = `https://gcalen.com/${params.lang}/news/${item.slug}`;
  return {
    title: `${t.title} | ${UI[params.lang].siteName}`,
    description: t.description.slice(0, 158),
    alternates: {
      canonical: url,
      languages: {
        ko: `https://gcalen.com/news/${item.slug}`,
        en: `https://gcalen.com/en/news/${item.slug}`,
        ja: `https://gcalen.com/ja/news/${item.slug}`,
      },
    },
    openGraph: { title: t.title, description: t.description, url, type: 'article' },
  };
}

export default async function LocaleNewsPage({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const ui = UI[lang];

  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();
  const t = await getNewsTranslation(item.slug, lang);
  const koUrl = `https://gcalen.com/news/${item.slug}`;

  // redirect()는 이 라우트의 정적 캐싱과 충돌해 신뢰할 수 없이 동작해 일반 조건부 렌더로 대체.
  if (!t) {
    return (
      <PageShell lang={lang}>
        <article className={styles.post}>
          <h1 className={styles.postH1}>{item.title}</h1>
          <p>{ui.notTranslated}</p>
          <p><a href={koUrl} className="detail-link">{ui.viewOriginal}</a></p>
        </article>
      </PageShell>
    );
  }

  const html = markdownToHtml(t.content);

  return (
    <PageShell lang={lang}>
      <article className={styles.post}>
        <a href={`/${lang}/news`} className={styles.backLink}>{ui.backToList}</a>
        {item.heroImage && <BlogHero src={item.heroImage} alt={t.title} />}
        <header className={styles.postHeader}>
          <time className={styles.postDate}>
            {formatPostDate(item.date)}
            {item.source && <span className={n.sourceBadge}>{item.source}</span>}
          </time>
          <h1 className={styles.postH1}>{t.title}</h1>
          {t.description && <p className={styles.postLead}>{t.description}</p>}
        </header>
        <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: html }} />
        {item.sourceUrl && (
          <div className={n.sourceBox}>
            <strong>{ui.source}</strong>: {item.source && `${item.source} · `}
            <a href={item.sourceUrl} target="_blank" rel="noopener nofollow">{item.sourceUrl}</a>
          </div>
        )}
        <p>
          <a href={koUrl} className="detail-link">{ui.viewOriginal}</a>
        </p>
      </article>
    </PageShell>
  );
}
