import type { MetadataRoute } from 'next';
import { getAllGames, getLastUpdated, getTranslatedGameIds } from '@/lib/games';
import { getAllPosts, getTranslatedSlugs } from '@/lib/blog';
import { getAllNews, getTranslatedNewsSlugs } from '@/lib/news';
import { LOCALES } from '@/lib/i18nLabels';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getAllGames();
  const now = new Date();
  const dataUpdated = new Date(await getLastUpdated());
  const todayStr = now.toISOString().slice(0, 10);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: 'https://gcalen.com/', lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: 'https://gcalen.com/news', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://gcalen.com/blog', lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: 'https://gcalen.com/guide', lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://gcalen.com/about', lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://gcalen.com/contact', lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://gcalen.com/privacy', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://gcalen.com/terms', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const gameUrls: MetadataRoute.Sitemap = games.map(g => {
    const upcoming = g.release_date_approx || g.release_date >= todayStr;
    const priority = g.pre_registration ? 0.85 : upcoming ? 0.75 : 0.6;
    return {
      url: `https://gcalen.com/concert/${g.id}`,
      lastModified: dataUpdated,
      changeFrequency: (g.pre_registration || upcoming ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority,
    };
  });

  const posts = await getAllPosts();
  const blogUrls: MetadataRoute.Sitemap = posts.map(p => ({
    url: `https://gcalen.com/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const news = await getAllNews();
  const newsUrls: MetadataRoute.Sitemap = news.map(it => ({
    url: `https://gcalen.com/news/${it.slug}`,
    lastModified: new Date(it.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 다국어(/en, /ja) — 콘텐츠(일정/블로그/뉴스)는 번역이 실제로 존재하는 항목만(빈 페이지 방지)
  const localeUrls: MetadataRoute.Sitemap = [];
  for (const lang of LOCALES) {
    const [gameIds, blogSlugs, newsSlugs] = await Promise.all([
      getTranslatedGameIds(lang),
      getTranslatedSlugs(lang),
      getTranslatedNewsSlugs(lang),
    ]);
    for (const id of gameIds) {
      localeUrls.push({ url: `https://gcalen.com/${lang}/concert/${id}`, lastModified: dataUpdated, changeFrequency: 'weekly', priority: 0.6 });
    }
    for (const slug of blogSlugs) {
      localeUrls.push({ url: `https://gcalen.com/${lang}/blog/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 });
    }
    for (const slug of newsSlugs) {
      localeUrls.push({ url: `https://gcalen.com/${lang}/news/${slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 });
    }
    const p = `https://gcalen.com/${lang}`;
    localeUrls.push(
      { url: p, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${p}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
      { url: `${p}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
      { url: `${p}/guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${p}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
      { url: `${p}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.35 },
      { url: `${p}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.25 },
      { url: `${p}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.25 }
    );
  }

  return [...staticUrls, ...blogUrls, ...newsUrls, ...gameUrls, ...localeUrls];
}
