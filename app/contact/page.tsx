import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: '문의하기',
  description: '게임 출시 캘린더(gcalen.com) 문의처 — 정보 정정·삭제 요청, 제휴, 저작권, 개인정보 관련 문의를 받습니다.',
  alternates: { canonical: 'https://gcalen.com/contact' },
  openGraph: { url: 'https://gcalen.com/contact', type: 'website' },
};

export default function ContactPage() {
  return (
    <PageShell>
      <article className="legal">
        <h1>문의하기</h1>
        <p>게임 출시 캘린더(gcalen.com)를 이용해 주셔서 감사합니다. 아래 내용은 이메일로 문의해 주시면 확인 후 성실히 답변드리겠습니다.</p>

        <h2>이런 문의를 받습니다</h2>
        <ul>
          <li><strong>정보 정정·삭제 요청</strong> — 출시일, 게임 정보, 게시글·댓글 등 잘못된 정보나 삭제가 필요한 내용</li>
          <li><strong>저작권·권리 관련</strong> — 게임명·이미지·상표 등 권리자의 수정·삭제 요청</li>
          <li><strong>개인정보 관련</strong> — 데이터 열람·삭제 요청 (자세한 내용은 개인정보처리방침 참고)</li>
          <li><strong>제휴·제보</strong> — 신규 게임·서버·이벤트 정보 제보, 협업 제안</li>
        </ul>

        <h2>이메일</h2>
        <p><a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>
        <p>보내실 때 관련 페이지 링크나 구체적인 내용을 함께 적어주시면 더 빠르게 처리할 수 있습니다. 영업일 기준으로 순차 확인하며, 정정·삭제 요청은 확인되는 대로 반영합니다.</p>

        <h2>참고</h2>
        <p>본 서비스는 정보 제공(에디토리얼) 목적이며, 게임 출시일 등은 각 게임사의 사정에 따라 변경될 수 있습니다. 최종 정보는 각 게임의 공식 출처를 함께 확인해 주세요. 서비스 소개는 <a href="/about">소개 페이지</a>, 데이터 처리 방침은 <a href="/privacy">개인정보처리방침</a>에서 확인하실 수 있습니다.</p>
      </article>
    </PageShell>
  );
}
