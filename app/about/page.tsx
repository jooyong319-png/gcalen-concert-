import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: '소개',
  description: '게임 출시 캘린더(gcalen.com)는 국내외 게임 출시 일정, 신규 서버·대규모 이벤트를 한곳에 모아 매일 직접 큐레이션하는 서비스입니다.',
  alternates: { canonical: 'https://gcalen.com/about' },
  openGraph: { url: 'https://gcalen.com/about', type: 'website' },
};

export default function AboutPage() {
  return (
    <PageShell>
      <article className="legal">
        <h1>게임 출시 캘린더 소개</h1>
        <p><strong>게임 출시 캘린더</strong>(gcalen.com)는 국내외 게임의 출시 일정과 한국 MMORPG 신규 서버·대규모 이벤트를 한곳에 모아 보여주는 서비스입니다. 흩어져 있는 출시 정보를 매일 직접 정리해, 다가오는 신작과 이벤트를 한눈에 확인할 수 있게 만들었습니다.</p>

        <h2>무엇을 다루나요</h2>
        <ul>
          <li><strong>국내 모바일</strong> 게임 출시 일정</li>
          <li><strong>PC·콘솔</strong> 신작 (스팀·PS5·Xbox·스위치)</li>
          <li><strong>글로벌 대작</strong> AAA 게임</li>
          <li><strong>신규 서버 · 대규모 이벤트</strong> (리니지·메이플·오딘 등 신서버 오픈, 대형 업데이트·쇼케이스)</li>
        </ul>

        <h2>어떻게 만드나요</h2>
        <p>모든 일정은 각 게임의 공식 공지·보도자료 등 신뢰할 수 있는 출처를 확인해 큐레이션합니다. <strong>정확성을 최우선</strong>으로 하며, 확인되지 않은 정보는 싣지 않습니다. 데이터는 매일 갱신됩니다.</p>

        <h2>주요 기능</h2>
        <ul>
          <li>월간 <strong>캘린더</strong> / <strong>리스트</strong> 뷰 전환</li>
          <li>카테고리·검색 필터, <strong>위시리스트</strong>(관심 게임 저장)</li>
          <li>게임 상세 페이지에서 <strong>즐겨찾기</strong> · <strong>댓글</strong> · <strong>공유</strong></li>
          <li>각 게임 상세 페이지(출시일·개발/배급사·플랫폼·장르·공식 출처)</li>
        </ul>

        <h2>안내</h2>
        <p>본 서비스는 정보 제공(에디토리얼) 목적이며, 게임명·이미지 등의 저작권은 각 게임사·권리자에게 있습니다. 출시일 등 정보는 변경될 수 있으니 최종 확인은 공식 출처를 참고해 주세요.</p>

        <h2>문의</h2>
        <p>제휴·정정·삭제 요청 등: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>
      </article>
    </PageShell>
  );
}
