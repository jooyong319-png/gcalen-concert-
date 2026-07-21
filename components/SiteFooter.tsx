'use client';
import { usePathname } from 'next/navigation';
import { UI, type Locale } from '@/lib/i18nLabels';

function detectLang(pathname: string): Locale | null {
  const m = pathname.match(/^\/(en|ja)(\/|$)/);
  return m ? (m[1] as Locale) : null;
}

export function SiteFooter() {
  const pathname = usePathname();
  const lang = detectLang(pathname);

  if (!lang) {
    return (
      <footer className="site-footer">
        <p>© 2026 콘서트 캘린더 (gcalen.com)</p>
        <p>문의: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a> · <a href="/blog">모아보기</a></p>
        <p><a href="/about">소개</a> · <a href="/contact">문의하기</a> · <a href="/guide">이용 가이드</a> · <a href="/privacy">개인정보처리방침</a> · <a href="/terms">이용약관</a></p>
        <p className="footer-disclaimer">아티스트명·이미지·상표 등은 각 권리자의 자산이며, 본 사이트는 공연·발매 일정 정보 제공을 목적으로 합니다. 권리자의 요청 시 해당 콘텐츠를 수정·삭제합니다.</p>
      </footer>
    );
  }

  const ui = UI[lang];
  const p = `/${lang}`;
  return (
    <footer className="site-footer">
      <p>© 2026 {ui.siteNameShort} (gcalen.com)</p>
      <p>{ui.contact}: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a> · <a href={`${p}/blog`}>{ui.blog}</a></p>
      <p>
        <a href={`${p}/about`}>{ui.about}</a> · <a href={`${p}/contact`}>{ui.contactPage}</a> · <a href={`${p}/guide`}>{ui.guide}</a> · <a href={`${p}/privacy`}>{ui.privacy}</a> · <a href={`${p}/terms`}>{ui.terms}</a>
      </p>
      <p className="footer-disclaimer">{ui.footerDisclaimer}</p>
    </footer>
  );
}
