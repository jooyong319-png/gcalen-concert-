import { NextRequest, NextResponse } from 'next/server';
import { getNewsBySlug, markdownToHtml } from '@/lib/news';
import { translateNews } from '@/lib/translate';
import { TRANSLATABLE_NEWS_SLUGS, type TranslateLang } from '@/lib/newsTranslateConfig';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const slug = body?.slug;
  const lang = body?.lang;

  if (typeof slug !== 'string' || (lang !== 'en' && lang !== 'ja')) {
    return NextResponse.json({ error: '잘못된 요청' }, { status: 400 });
  }
  if (!TRANSLATABLE_NEWS_SLUGS.has(slug)) {
    return NextResponse.json({ error: '이 글은 아직 번역을 지원하지 않아요' }, { status: 403 });
  }

  const news = await getNewsBySlug(slug);
  if (!news) return NextResponse.json({ error: '글을 찾을 수 없어요' }, { status: 404 });

  try {
    const result = await translateNews(slug, lang as TranslateLang, {
      title: news.title,
      description: news.description,
      bodyHtml: markdownToHtml(news.content),
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '번역에 실패했어요' },
      { status: 500 }
    );
  }
}
