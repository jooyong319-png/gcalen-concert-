import { ImageResponse } from 'next/og';

// 소셜 공유 미리보기 이미지(OG/Twitter 카드, 1200x630) — 사이트 전역 폴백(app/layout.tsx가
// /og-image.png로 참조) + 콘서트 상세 페이지가 image_url 없을 때 쓰는 폴백. "티켓 스텁 W"
// 마크 + 새 레이저 워시 톤으로 갱신(2026-07-23, 이전엔 구 브랜드 그라데이션 그대로였음).
// runtime='edge' — nodejs는 로컬 Windows에서 next/og 폰트 로더가 깨지는 기존 버그가 있어
// (app-icon 라우트 주석 참고) 폰트를 로컬 fs 대신 자기 자신에게 fetch해서 우회.
export const runtime = 'edge';

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  // 가변 폰트(woff2)는 이 next/og 번들 버전이 파싱 못 함(wOF2 시그니처 미지원) — otf 사용.
  const fontData = await fetch(new URL('/fonts/pretendard-bold.otf', origin)).then(r => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b1220',
          fontFamily: 'Pretendard',
        }}
      >
        <svg width="92" height="92" viewBox="0 0 32 32" style={{ marginBottom: 30 }}>
          <rect x="4" y="7" width="24" height="18" rx="4" fill="#33d6ff" />
          <circle cx="4" cy="16" r="3.2" fill="#0b1220" />
          <circle cx="28" cy="16" r="3.2" fill="#0b1220" />
          <path
            d="M9 13 L12.5 20 L16 14 L19.5 20 L23 13"
            fill="none"
            stroke="#0b1220"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, color: '#eaf2fb', letterSpacing: -2 }}>WhenStage</div>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: '#8fa3bf', marginTop: 18 }}>
          콘서트 · 발매 · 페스티벌 · 팬미팅 캘린더
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: 'Pretendard', data: fontData, weight: 800, style: 'normal' }] }
  );
}
