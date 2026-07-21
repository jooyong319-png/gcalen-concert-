import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGames } from '@/lib/games';
import { PageShell } from '@/components/PageShell';
import { WishlistView } from '@/components/WishlistView';
import { LOCALES, type Locale } from '@/lib/i18nLabels';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: { title: 'My Wishlist', description: 'Your saved games and their release schedules, all in one place.', robots: { index: false, follow: true } },
  ja: { title: 'マイウィッシュリスト', description: '保存したゲームの発売日程を一箇所で確認できます。', robots: { index: false, follow: true } },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

const NOTICE: Record<Locale, string> = {
  en: 'The wishlist view below uses this site’s standard (Korean) interface. Games you save here are also visible from the Korean pages.',
  ja: '以下のウィッシュリスト画面は本サイトの標準(韓国語)インターフェースです。ここで保存したゲームは韓国語ページからも確認できます。',
};

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const games = await getAllGames();
  return (
    <PageShell lang={lang}>
      <p style={{ padding: '0.8rem 1rem 0', fontSize: '0.85rem', color: 'var(--text-faint)' }}>{NOTICE[lang]}</p>
      <WishlistView games={games} />
    </PageShell>
  );
}
