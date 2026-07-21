import type { Metadata } from 'next';
import { getAllGames } from '@/lib/games';
import { PageShell } from '@/components/PageShell';
import { WishlistView } from '@/components/WishlistView';

export const metadata: Metadata = {
  title: '내 즐겨찾기',
  description: '즐겨찾기한 공연·발매 일정을 한눈에 모아봅니다.',
  robots: { index: false, follow: true }, // 개인화 페이지는 색인 제외
};

export default async function WishlistPage() {
  const games = await getAllGames();
  return (
    <PageShell>
      <WishlistView games={games} />
    </PageShell>
  );
}
