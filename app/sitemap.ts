import type { MetadataRoute } from 'next';
import { getAllGames, getLastUpdated } from '@/lib/games';
import { getAllPosts, getPostTranslation } from '@/lib/blog';
import { getAllNews, getNewsTranslation } from '@/lib/news';
import { LOCALES, type Locale } from '@/lib/i18nLabels';

const BASE = 'https://gcalen.com';

function staticAlternates(path: (lang: Locale) => string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const lang of LOCALES) languages[lang] = `${BASE}${path(lang)}`;
  return languages;
}

const STATIC_PAGES: { path: (lang: Locale) => string; changeFrequency: 'daily' | 'monthly' | 'yearly'; priority: number }[] = [
  { path: lang => `/${lang}`, changeFrequency: 'daily', priority: 0.9 },
  { path: lang => `/${lang}/news`, changeFrequency: 'daily', priority: 0.7 },
  { path: lang => `/${lang}/blog`, changeFrequency: 'daily', priority: 0.65 },
  { path: lang => `/${lang}/guide`, changeFrequency: 'monthly', priority: 0.6 },
  { path: lang => `/${lang}/about`, changeFrequency: 'monthly', priority: 0.45 },
  { path: lang => `/${lang}/contact`, changeFrequency: 'monthly', priority: 0.35 },
  { path: lang => `/${lang}/privacy`, changeFrequency: 'yearly', priority: 0.25 },
  { path: lang => `/${lang}/terms`, changeFrequency: 'yearly', priority: 0.25 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // ko/en/ja 완전 대칭 정적 페이지 — 언어별로 항상 존재하므로 hreflang alternate 전부 포함
  const staticUrls: MetadataRoute.Sitemap = [];
  for (const page of STATIC_PAGES) {
    for (const lang of LOCALES) {
      staticUrls.push({
        url: `${BASE}${page.path(lang)}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: staticAlternates(page.path) },
      });
    }
  }

  // 콘서트/발매 상세 — 로케일별로 완전히 독립된 데이터(id가 서로 다름)라 언어간 hreflang 매핑 없이 등록
  const gameUrls: MetadataRoute.Sitemap = [];
  for (const lang of LOCALES) {
    const [games, dataUpdatedStr] = await Promise.all([getAllGames(lang), getLastUpdated(lang)]);
    const dataUpdated = new Date(dataUpdatedStr);
    for (const g of games) {
      const upcoming = g.release_date_approx || g.release_date >= todayStr;
      const priority = g.pre_registration ? 0.85 : upcoming ? 0.75 : 0.6;
      gameUrls.push({
        url: `${BASE}/${lang}/concert/${g.id}`,
        lastModified: dataUpdated,
        changeFrequency: g.pre_registration || upcoming ? 'daily' : 'weekly',
        priority,
      });
    }
  }

  // 블로그 — ko 원본은 항상 존재, en/ja는 번역 파일(.en.md/.ja.md)이 있는 것만 URL 생성
  const posts = await getAllPosts();
  const blogUrls: MetadataRoute.Sitemap = [];
  for (const p of posts) {
    const [enT, jaT] = await Promise.all([getPostTranslation(p.slug, 'en'), getPostTranslation(p.slug, 'ja')]);
    const languages: Record<string, string> = { ko: `${BASE}/ko/blog/${p.slug}` };
    if (enT) languages.en = `${BASE}/en/blog/${p.slug}`;
    if (jaT) languages.ja = `${BASE}/ja/blog/${p.slug}`;
    const lastModified = new Date(p.date);
    blogUrls.push({ url: `${BASE}/ko/blog/${p.slug}`, lastModified, changeFrequency: 'monthly', priority: 0.75, alternates: { languages } });
    if (enT) blogUrls.push({ url: `${BASE}/en/blog/${p.slug}`, lastModified, changeFrequency: 'monthly', priority: 0.65, alternates: { languages } });
    if (jaT) blogUrls.push({ url: `${BASE}/ja/blog/${p.slug}`, lastModified, changeFrequency: 'monthly', priority: 0.65, alternates: { languages } });
  }

  // 뉴스 — 블로그와 동일한 번역 존재 여부 기반 패턴
  const news = await getAllNews();
  const newsUrls: MetadataRoute.Sitemap = [];
  for (const it of news) {
    const [enT, jaT] = await Promise.all([getNewsTranslation(it.slug, 'en'), getNewsTranslation(it.slug, 'ja')]);
    const languages: Record<string, string> = { ko: `${BASE}/ko/news/${it.slug}` };
    if (enT) languages.en = `${BASE}/en/news/${it.slug}`;
    if (jaT) languages.ja = `${BASE}/ja/news/${it.slug}`;
    const lastModified = new Date(it.date);
    newsUrls.push({ url: `${BASE}/ko/news/${it.slug}`, lastModified, changeFrequency: 'weekly', priority: 0.7, alternates: { languages } });
    if (enT) newsUrls.push({ url: `${BASE}/en/news/${it.slug}`, lastModified, changeFrequency: 'weekly', priority: 0.6, alternates: { languages } });
    if (jaT) newsUrls.push({ url: `${BASE}/ja/news/${it.slug}`, lastModified, changeFrequency: 'weekly', priority: 0.6, alternates: { languages } });
  }

  return [...staticUrls, ...gameUrls, ...blogUrls, ...newsUrls];
}
