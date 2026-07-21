import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllNews, getNewsBySlug, getNewsTranslation, getRelatedNews, markdownToHtml, formatPostDate } from '@/lib/news';
import { PageShell } from '@/components/PageShell';
import { Comments } from '@/components/Comments';
import { BlogImg } from '@/components/BlogImg';
import { BlogHero } from '@/components/BlogHero';
import { NewsTranslatable } from '@/components/NewsTranslatable';
import styles from '../../blog/blog.module.css';
import n from '../news.module.css';

interface Props { params: { slug: string }; }

export async function generateStaticParams() {
  const items = await getAllNews();
  return items.map(it => ({ slug: it.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNewsBySlug(params.slug);
  if (!item) return { title: '뉴스를 찾을 수 없음' };
  const url = `https://gcalen.com/news/${item.slug}`;
  const ogImage = item.heroImage ?? 'https://gcalen.com/og-image.png';

  const [enT, jaT] = await Promise.all([
    getNewsTranslation(item.slug, 'en'),
    getNewsTranslation(item.slug, 'ja'),
  ]);
  const languages: Record<string, string> = { ko: url };
  if (enT) languages.en = `https://gcalen.com/en/news/${item.slug}`;
  if (jaT) languages.ja = `https://gcalen.com/ja/news/${item.slug}`;

  return {
    title: item.title,
    description: item.description.slice(0, 158),
    alternates: { canonical: url, languages },
    openGraph: {
      title: item.title,
      description: item.description,
      url,
      type: 'article',
      publishedTime: item.date,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description.slice(0, 158),
      images: [ogImage],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();

  const html = markdownToHtml(item.content);
  const related = await getRelatedNews(item.slug, 4);
  const url = `https://gcalen.com/news/${item.slug}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.description,
    datePublished: item.date,
    dateModified: item.date,
    ...(item.heroImage ? { image: [item.heroImage] } : { image: ['https://gcalen.com/og-image.png'] }),
    author: { '@type': 'Organization', name: '게임 출시 캘린더', url: 'https://gcalen.com' },
    publisher: {
      '@type': 'Organization',
      name: '게임 출시 캘린더',
      url: 'https://gcalen.com',
      logo: { '@type': 'ImageObject', url: 'https://gcalen.com/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    keywords: item.tags.join(', '),
    // 원 출처 표기 (인용 기반 요약임을 구조화 데이터로도 명시)
    ...(item.sourceUrl ? { isBasedOn: item.sourceUrl } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://gcalen.com/' },
      { '@type': 'ListItem', position: 2, name: '게임 뉴스', item: 'https://gcalen.com/news' },
      { '@type': 'ListItem', position: 3, name: item.title, item: url },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <article className={styles.post}>
        <Link href="/news" className={styles.backLink}>← 게임 뉴스 목록으로</Link>
        {item.heroImage && <BlogHero src={item.heroImage} alt={item.title} />}
        <NewsTranslatable
          slug={item.slug}
          date={formatPostDate(item.date)}
          source={item.source}
          tags={item.tags}
          original={{ title: item.title, description: item.description, bodyHtml: html }}
        />

        {/* 출처 박스 — 원문 링크 명시 (저작권/애드센스 안전판) */}
        {item.sourceUrl && (
          <div className={n.sourceBox}>
            <strong>출처</strong>: {item.source && `${item.source} · `}
            <a href={item.sourceUrl} target="_blank" rel="noopener nofollow">{item.sourceUrl}</a>
            <span className={n.sourceNote}>
              본문은 원문을 요약·재구성한 것입니다. 저작권은 원 매체에 있으며, 자세한 내용은 원문을 확인하세요.
            </span>
          </div>
        )}

        <Comments gameId={`news:${item.slug}`} placeholder="이 뉴스에 대한 댓글 (최대 500자)" />

        {related.length > 0 && (
          <nav className={styles.related} aria-label="관련 뉴스">
            <h2 className={styles.relatedTitle}>관련 게임 뉴스</h2>
            <ul className={styles.relatedList}>
              {related.map(r => (
                <li key={r.slug} className={styles.relatedCard}>
                  <Link href={`/news/${r.slug}`} className={styles.relatedLink}>
                    {r.heroImage && <BlogImg src={r.heroImage} containerClassName={styles.relatedThumb} />}
                    <div className={styles.relatedBody}>
                      <time className={styles.relatedDate}>{formatPostDate(r.date)}</time>
                      <span className={styles.relatedName}>{r.title}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </PageShell>
  );
}
