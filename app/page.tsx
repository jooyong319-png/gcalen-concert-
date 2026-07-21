import type { Metadata } from 'next';
import { getAllGames, getLastUpdated } from '@/lib/games';
import { Home } from '@/components/Home';

export const metadata: Metadata = {
  title: '콘서트 캘린더 | 내한·콘서트·음원 발매·페스티벌 일정 한눈에',
  description: '콘서트·내한 공연, 음원 발매(컴백), 페스티벌, 팬미팅 일정을 한눈에. 매일 업데이트되는 공연·발매 캘린더.',
  alternates: { canonical: 'https://gcalen.com/' },
  openGraph: { url: 'https://gcalen.com/', type: 'website' },
};

export default async function HomePage() {
  const games = await getAllGames();
  const lastUpdated = await getLastUpdated();
  // 빌드(SSR) 시점의 '현재 시각' 기준값. 클라 첫 렌더도 이 값을 써서 하이드레이션 불일치 제거.
  const serverNow = new Date().toISOString();

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '콘서트 캘린더',
    url: 'https://gcalen.com/',
    description: '콘서트·내한·음원 발매·페스티벌 일정 캘린더',
    inLanguage: 'ko-KR',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Home initialGames={games} lastUpdated={lastUpdated} serverNow={serverNow} initialCalEvents={[]} />
    </>
  );
}
