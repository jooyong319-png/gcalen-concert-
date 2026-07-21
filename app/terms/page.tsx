import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: '이용약관',
  description: '게임 출시 캘린더(gcalen.com) 이용약관 — 서비스 내용, 댓글 운영 정책, 저작권 및 면책 안내.',
  alternates: { canonical: 'https://gcalen.com/terms' },
  openGraph: { url: 'https://gcalen.com/terms', type: 'website' },
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="legal">
        <h1>이용약관</h1>

        <h2>제1조 (목적)</h2>
        <p>본 약관은 게임 출시 캘린더(gcalen.com, 이하 &lsquo;서비스&rsquo;)가 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정합니다.</p>

        <h2>제2조 (서비스 내용)</h2>
        <ul>
          <li>서비스는 국내외 게임 출시 일정, 신규 서버·대규모 이벤트 정보 등을 무료로 제공합니다.</li>
          <li>게재된 출시일 등 정보는 변경될 수 있으며, 서비스는 정보의 정확성·완전성을 보장하지 않습니다. 최종 정보는 각 게임의 공식 출처를 확인하시기 바랍니다.</li>
        </ul>

        <h2>제3조 (이용자 게시물 / 댓글)</h2>
        <p>이용자는 댓글을 작성할 수 있으며, 다음 행위를 해서는 안 됩니다.</p>
        <ul>
          <li>욕설·비방·차별·혐오 표현</li>
          <li>음란·불법 정보, 광고·스팸, 도배</li>
          <li>타인의 저작권·개인정보 등 권리를 침해하는 행위</li>
        </ul>
        <p>운영자는 위 규정에 위반되거나 부적절한 게시물을 사전 통지 없이 삭제할 수 있습니다.</p>

        <h2>제4조 (저작권)</h2>
        <ul>
          <li>서비스에 표시되는 게임명·이미지 등은 각 게임사·권리자에게 저작권이 있으며, 서비스는 정보 제공(에디토리얼) 목적으로 이를 인용합니다.</li>
          <li>권리자의 요청이 있을 경우 해당 콘텐츠를 신속히 수정·삭제합니다.</li>
        </ul>

        <h2>제5조 (면책)</h2>
        <ul>
          <li>서비스는 무료로 제공되며, 정보의 정확성, 서비스 중단, 외부 링크 등으로 발생한 손해에 대해 책임지지 않습니다.</li>
          <li>서비스에 포함된 외부 사이트 링크의 내용에 대해서는 책임지지 않습니다.</li>
        </ul>

        <h2>제6조 (약관 변경)</h2>
        <p>본 약관은 필요 시 변경될 수 있으며, 변경 시 본 페이지에 게시합니다.</p>

        <h2>제7조 (문의)</h2>
        <p>문의: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>

        <p className="legal-updated">시행일: 2026년 6월 16일</p>
      </article>
    </PageShell>
  );
}
