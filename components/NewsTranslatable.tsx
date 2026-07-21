'use client';
import { useState } from 'react';
import { ViewCounter } from './ViewCounter';
import { TRANSLATABLE_NEWS_SLUGS } from '@/lib/newsTranslateConfig';
import styles from '@/app/blog/blog.module.css';
import n from '@/app/news/news.module.css';
import t from './NewsTranslatable.module.css';

type Lang = 'ko' | 'en' | 'ja';
const LABELS: Record<Lang, string> = { ko: '한국어', en: 'English', ja: '日本語' };

interface Content {
  title: string;
  description: string;
  bodyHtml: string;
}

interface Props {
  slug: string;
  date: string;
  source: string;
  tags: string[];
  original: Content;
}

// 뉴스 온디맨드 번역(DeepL). 서버가 항상 원문(ko)으로 먼저 렌더 → SEO/크롤러엔 원문만 보임,
// 버튼 클릭 시에만 클라에서 /api/translate 호출·캐시(사용량 절약). 지원 글은 API 라우트에서 화이트리스트.
export function NewsTranslatable({ slug, date, source, tags, original }: Props) {
  const [lang, setLang] = useState<Lang>('ko');
  const [cache, setCache] = useState<Partial<Record<Lang, Content>>>({ ko: original });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = cache[lang] ?? original;
  const translatable = TRANSLATABLE_NEWS_SLUGS.has(slug);

  async function switchTo(next: Lang) {
    setError(null);
    if (cache[next]) {
      setLang(next);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, lang: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '번역에 실패했어요');
      setCache(c => ({ ...c, [next]: data }));
      setLang(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : '번역에 실패했어요');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className={styles.postHeader}>
        <time className={styles.postDate}>
          {date}
          {source && <span className={n.sourceBadge}>{source}</span>}
        </time>
        {translatable && (
          <div className={t.langBar} role="group" aria-label="언어 선택">
            {(['ko', 'en', 'ja'] as Lang[]).map(l => (
              <button
                key={l}
                type="button"
                className={`${t.langBtn} ${lang === l ? t.langActive : ''}`}
                onClick={() => switchTo(l)}
                disabled={loading}
                aria-pressed={lang === l}
              >
                {LABELS[l]}
              </button>
            ))}
            {loading && <span className={t.status}>번역 중…</span>}
          </div>
        )}
        {error && <p className={t.error}>{error}</p>}
        <h1 className={styles.postH1}>{current.title}</h1>
        <ViewCounter gameId={`news:${slug}`} />
        {current.description && <p className={styles.postLead}>{current.description}</p>}
        {tags.length > 0 && (
          <div className={styles.postTags}>
            {tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
      </header>
      <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: current.bodyHtml }} />
    </>
  );
}
