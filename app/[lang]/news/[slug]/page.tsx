import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllNews, getNewsBySlug, markdownToHtml, formatPostDate } from '@/lib/news';
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
    const slugs = (await getAllNews(lang)).map(it => it.slug);
    for (const slug of slugs) params.push({ lang, slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const lang = params.lang;
  const item = await getNewsBySlug(params.slug, lang);
  if (!item) return { title: UI[lang].notFound };

  const url = `https://whenstage.com/${lang}/news/${item.slug}`;
  return {
    title: `${item.title} | ${UI[lang].siteName}`,
    description: item.description.slice(0, 158),
    alternates: { canonical: url },
    openGraph: { title: item.title, description: item.description, url, type: 'article' },
  };
}

export default async function LocaleNewsPage({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const ui = UI[lang];

  const item = await getNewsBySlug(params.slug, lang);
  if (!item) notFound();

  const html = markdownToHtml(item.content);

  return (
    <PageShell lang={lang}>
      <article className={styles.post}>
        <a href={`/${lang}/news`} className={styles.backLink}>{ui.backToList}</a>
        {item.heroImage && <BlogHero src={item.heroImage} alt={item.title} />}
        <header className={styles.postHeader}>
          <time className={styles.postDate}>
            {formatPostDate(item.date)}
            {item.source && <span className={n.sourceBadge}>{item.source}</span>}
          </time>
          <h1 className={styles.postH1}>{item.title}</h1>
          {item.description && <p className={styles.postLead}>{item.description}</p>}
        </header>
        <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: html }} />
        {item.sourceUrl && (
          <div className={n.sourceBox}>
            <strong>{ui.source}</strong>: {item.source && `${item.source} · `}
            <a href={item.sourceUrl} target="_blank" rel="noopener nofollow">{item.sourceUrl}</a>
          </div>
        )}
      </article>
    </PageShell>
  );
}
