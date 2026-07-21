'use client';
import { useEffect, useRef } from 'react';

// 애드핏 160x600 유닛 (좌/우 각각). 두 ins를 먼저 렌더하고 ba.min.js를 1번만 로드해
// 카카오 로더가 두 유닛을 모두 처리하도록 함(유닛별 스크립트 주입 시 한쪽이 누락되는 문제 방지).
const UNIT_LEFT = 'DAN-wydIrmDap9p6SfsL';
const UNIT_RIGHT = 'DAN-f105yFOUDHPM2pdq';
// 로컬(개발)에선 애드핏이 도메인 잠금으로 안 뜨므로 위치 확인용 placeholder 표시.
const IS_DEV = process.env.NODE_ENV === 'development';

export function SideRailAds() {
  const loaded = useRef(false);
  useEffect(() => {
    if (IS_DEV || loaded.current) return;
    loaded.current = true;
    const s = document.createElement('script');
    s.src = '//t1.kakaocdn.net/kas/static/ba.min.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  if (IS_DEV) {
    return (
      <>
        <aside className="side-rail side-rail-left" aria-hidden="true"><div className="side-rail-ph">광고 영역<br />160×600</div></aside>
        <aside className="side-rail side-rail-right" aria-hidden="true"><div className="side-rail-ph">광고 영역<br />160×600</div></aside>
      </>
    );
  }

  return (
    <>
      <aside className="side-rail side-rail-left" aria-hidden="true">
        <ins className="kakao_ad_area" style={{ display: 'none' }}
          data-ad-unit={UNIT_LEFT} data-ad-width="160" data-ad-height="600" />
      </aside>
      <aside className="side-rail side-rail-right" aria-hidden="true">
        <ins className="kakao_ad_area" style={{ display: 'none' }}
          data-ad-unit={UNIT_RIGHT} data-ad-width="160" data-ad-height="600" />
      </aside>
    </>
  );
}
