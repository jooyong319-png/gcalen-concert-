// server-only: DeepL 호출 + Supabase 캐시. 같은 slug+lang은 최초 1회만 API 호출(사용량 절약).
import { supabase, isSupabaseReady } from './supabase';
import type { TranslateLang } from './newsTranslateConfig';

export type { TranslateLang };
export { TRANSLATABLE_NEWS_SLUGS } from './newsTranslateConfig';

const DEEPL_TARGET: Record<TranslateLang, string> = { en: 'EN-US', ja: 'JA' };

export interface NewsTranslation {
  title: string;
  description: string;
  bodyHtml: string;
}

async function callDeepL(texts: string[], targetLang: string, html: boolean): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error('DEEPL_API_KEY 미설정');
  // 무료 티어 키(":fx" 접미사)는 별도 엔드포인트를 씀
  const base = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
  const params = new URLSearchParams();
  for (const t of texts) params.append('text', t);
  params.set('target_lang', targetLang);
  params.set('source_lang', 'KO');
  // 본문(HTML)만 태그 보존 모드로 — 순수 텍스트(제목/설명)에 걸면 따옴표 등이 &quot; 로 HTML 엔티티 이스케이프돼
  // React가 그대로 텍스트로 렌더(디코딩 안 함)하는 문제가 생김.
  if (html) params.set('tag_handling', 'html');

  const res = await fetch(`${base}/v2/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`DeepL 오류(${res.status}): ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { translations: { text: string }[] };
  return data.translations.map(t => t.text);
}

export async function getCachedTranslation(slug: string, lang: TranslateLang): Promise<NewsTranslation | null> {
  if (!isSupabaseReady() || !supabase) return null;
  const { data } = await supabase
    .from('news_translations')
    .select('title,description,body_html')
    .eq('slug', slug)
    .eq('lang', lang)
    .maybeSingle();
  if (!data) return null;
  return { title: data.title, description: data.description ?? '', bodyHtml: data.body_html };
}

export async function translateNews(
  slug: string,
  lang: TranslateLang,
  source: { title: string; description: string; bodyHtml: string }
): Promise<NewsTranslation> {
  const cached = await getCachedTranslation(slug, lang);
  if (cached) return cached;

  const target = DEEPL_TARGET[lang];
  const [[title, description], [bodyHtml]] = await Promise.all([
    callDeepL([source.title, source.description], target, false),
    callDeepL([source.bodyHtml], target, true),
  ]);
  const result: NewsTranslation = { title, description, bodyHtml };

  if (isSupabaseReady() && supabase) {
    // 캐시 저장 실패(중복 등)해도 번역 결과 자체는 반환
    await supabase.from('news_translations').insert({
      slug,
      lang,
      title: result.title,
      description: result.description,
      body_html: result.bodyHtml,
    });
  }
  return result;
}
