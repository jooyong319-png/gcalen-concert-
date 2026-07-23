# 남은 작업 (2026-07-23 갱신)

## 완료된 것 (참고용 — 다시 하지 말 것)
- [x] 카피 정리("게임" 표현 → 콘서트 도메인) — about/guide/contact/privacy/terms/blog/news,
      i18nLabels.ts의 EN/JA "game" 잔재(홈 meta description 포함, SEO 버그였음)까지 전수 수정
- [x] 콘서트 전용 리서처 프롬프트(RESEARCHER_KO/EN/JA), 뉴스/블로그/아티스트 리서처 프롬프트
      전부 로케일별 완전 독립 구조로 정착, `prompts/` 폴더로 정리
- [x] 아티스트 목록/상세, 공연장 목록/상세, 상세 페이지 사이드바 맥락화
- [x] 콘텐츠 자동화(`prompts/PLANNER.md`) + 기획/개발 자동화(`PRODUCT_PLANNER`/`PRODUCT_DEVELOPER`)
      파이프라인 구축, `BACKLOG.md`로 인계
- [x] Vercel 배포 연결 확인, Supabase 프로젝트를 이 프로젝트 전용으로 완전히 새로 구성
      (gcalen과 분리 완료 — 예전엔 "미확인"이었으나 2026-07-23에 실제 env 설정하며 확인됨)
- [x] 1차+2차 비주얼 오버홀(Motion 도입 → "무대 조명 + 티켓 스텁" 컨셉으로 전면 재작업),
      gcalen 죽은 코드/CSS/컴포넌트 대청소([[decisions]]/[[design-audit]] 참고)
- [x] 에드센스 승인용 콘텐츠 볼륨 확보(블로그/뉴스/아티스트 소개글 대량 보강)
- [x] SEO 감사·수정 — `<html lang>` 서버 렌더링(멀티 루트 레이아웃), OG 태그, JSON-LD
      4종(Event/MusicGroup/MusicVenue/Article/NewsArticle), hreflang, Google Search Console
      등록 + sitemap 제출까지 완료
- [x] 웹푸시 알림 파이프라인 KO 전용 → KO/EN/JA 전체 대응, "껐는데 새로고침하면 다시 켜짐"
      버그 수정(permission과 subscription은 다른 상태라는 게 원인이었음)
- [x] 검색에 아티스트 영문/로마자 별칭 매칭(`data/artist-aliases.json`) 추가
- [x] 사용자 제보 기능(예매 링크 제보/수정, 아티스트 정보 수정·등록 신청) + 관리자 검토 큐

## 사용자가 직접 처리해야 하는 것(자동화 프롬프트가 손댈 수 없는 영역)
- [ ] (해당 없음 — Vercel/Supabase 연결 상태는 전부 확인·설정 완료됨)

## 기획/개발 자동화(`prompts/PRODUCT_PLANNER.md`/`prompts/PRODUCT_DEVELOPER.md`)가 판단해서 진행할 것
`BACKLOG.md`가 실제 소스 오브 트루스(상태 최신). 2026-07-23 기준 대기 중인 항목:
- [ ] `-01` 저장소 루트 잔재 `og-image.png`(gcalen 스캐폴드, `public/og-image.png`와는 별개) 제거
- [ ] `-03` `components/PreRegCountdown.module.css` → `TicketingPhase.module.css` 리네임
      (컴포넌트는 이미 TicketingPhase인데 CSS 파일명만 gcalen 시절 이름 그대로 남음)
- [ ] `-04` (P1) soft-404 조사·수정 — `notFound()` 화면은 정상인데 HTTP 상태 코드가 200으로
      나가는 문제. 원인 조사 필요, 프레임워크 레벨 제약으로 못 고치면 보류 처리하고 근거 기록

그 외엔 이 문서 + `PROJECT_STATUS.md` + `BACKLOG.md` + 실제 코드베이스를 보고 스스로 다음
우선순위를 판단할 것(막연한 신규 아이디어보다 관찰된 구체적 문제 우선). 최대 3개까지만
새로 등록하고, 확신 가는 게 없으면 0개도 정상.
