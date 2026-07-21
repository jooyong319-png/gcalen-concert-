import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '게임 출시 캘린더(gcalen.com) 개인정보처리방침 — 수집 항목, 쿠키 및 맞춤형 광고(Google AdSense), 제3자 처리위탁 안내.',
  alternates: { canonical: 'https://gcalen.com/privacy' },
  openGraph: { url: 'https://gcalen.com/privacy', type: 'website' },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="legal">
        <h1>개인정보처리방침</h1>
        <p>게임 출시 캘린더(gcalen.com, 이하 &lsquo;서비스&rsquo;)는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다. 본 방침은 서비스가 어떤 정보를 어떻게 수집·이용하는지 안내합니다.</p>

        <h2>1. 수집하는 정보</h2>
        <p>서비스는 회원가입·로그인 없이 이용할 수 있으며, 이름·이메일·전화번호 등 개인 식별 정보는 수집하지 않습니다. 다음 정보가 수집·저장될 수 있습니다.</p>
        <ul>
          <li><strong>게임/뉴스 댓글 작성 시</strong>: 닉네임, 댓글 내용.</li>
          <li><strong>조회수 집계</strong>: 페이지 방문 기록(집계 목적이며 개인을 식별하지 않습니다).</li>
          <li><strong>이용 분석(Google Analytics)</strong>: 앱·웹 이용 통계를 위해 기기 식별자, 앱/페이지 상호작용 기록이 수집될 수 있습니다.</li>
          <li><strong>브라우저 로컬스토리지</strong>: 위시리스트, 테마 설정, 최근 입력한 닉네임, 중복 조회·추천 방지 값. 이 값들은 이용자의 브라우저에만 저장되며 서버로 전송되지 않습니다.</li>
        </ul>

        <h2>2. 쿠키 및 맞춤형 광고</h2>
        <ul>
          <li>서비스는 광고 게재를 위해 <strong>Google AdSense</strong> 및 <strong>카카오 애드핏(Kakao AdFit)</strong>을 사용할 수 있습니다.</li>
          <li>제3자 광고 사업자는 쿠키·광고 식별자를 사용하여 이용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 게재할 수 있습니다.</li>
          <li>이용자는 <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google 광고 설정</a>에서 맞춤형 광고를 비활성화할 수 있으며, <a href="https://www.aboutads.info" target="_blank" rel="noopener">www.aboutads.info</a>에서 제3자 쿠키를 거부할 수 있습니다.</li>
          <li>Google의 광고 쿠키에 관한 자세한 내용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google 광고 정책</a>을 참고하세요.</li>
        </ul>

        <h2>3. 이용 목적</h2>
        <ul>
          <li>댓글·조회수 등 서비스 기능 제공 및 운영</li>
          <li>이용 통계 분석, 광고 게재 및 서비스 개선</li>
        </ul>

        <h2>4. 처리위탁 및 제3자</h2>
        <p>서비스는 운영을 위해 다음 외부 서비스를 이용합니다.</p>
        <ul>
          <li>Supabase — 댓글·조회수 데이터 저장</li>
          <li>Vercel — 웹사이트 호스팅</li>
          <li>Google Analytics — 이용 통계 분석</li>
          <li>Google AdSense · 카카오 애드핏 — 광고 게재</li>
        </ul>
        <p>이용자의 정보는 위 목적 범위 내에서만 처리되며, 법령에 따른 경우를 제외하고 제3자에게 판매·제공하지 않습니다. 데이터는 전송 구간에서 HTTPS로 암호화됩니다.</p>

        <h2>5. 보유 및 파기</h2>
        <p>댓글은 운영 정책에 따라 삭제될 때까지 보관됩니다.</p>

        <h2>6. 이용자의 권리 및 데이터 삭제 요청</h2>
        <p>게임 출시 캘린더(gcalen.com) 이용자는 다음과 같이 데이터 삭제를 요청할 수 있습니다.</p>
        <ul>
          <li><strong>이메일로 삭제 요청</strong>: 본인이 올린 댓글의 삭제를 원하시면 아래 문의처 이메일로 해당 페이지 링크와 함께 요청해 주세요. 본인 확인 후 지체 없이 삭제해 드립니다.</li>
          <li><strong>삭제되는 데이터</strong>: 댓글 내용.</li>
          <li><strong>보관되는 데이터</strong>: 개인을 식별할 수 없는 집계형 조회수·이용 통계는 서비스 운영을 위해 익명 형태로 보관될 수 있습니다. Google Analytics 이용 데이터는 Google 정책에 따른 보관 기간(최대 14개월) 후 자동 삭제됩니다.</li>
          <li><strong>로컬 데이터</strong>: 위시리스트·테마 등 브라우저 저장 정보는 브라우저 설정에서 직접 삭제할 수 있습니다.</li>
        </ul>

        <h2>7. 문의처</h2>
        <p>개인정보 및 데이터 삭제 관련 문의: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>

        <p className="legal-updated">시행일: 2026년 6월 16일</p>
      </article>
    </PageShell>
  );
}
