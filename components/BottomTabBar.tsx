'use client';
import { usePathname } from 'next/navigation';
import { UI, CAL, type Locale } from '@/lib/i18nLabels';

interface Tab {
  href: string;
  label: string;
  icon: string;
}

function detectLang(pathname: string): Locale | null {
  const m = pathname.match(/^\/(en|ja)(\/|$)/);
  return m ? (m[1] as Locale) : null;
}

// 설치 앱(standalone) 전용 하단 내비. 웹(브라우저)에선 CSS로 숨김.
function buildTabs(lang: Locale | null): Tab[] {
  if (!lang) {
    return [
      { href: '/', label: '캘린더', icon: 'ic-calendar' },
      { href: '/news', label: '뉴스', icon: 'ic-flame' },
      { href: '/blog', label: '모아보기', icon: 'ic-file' },
      { href: '/wishlist', label: '찜', icon: 'ic-star' },
    ];
  }
  const ui = UI[lang];
  const t = CAL[lang];
  const p = `/${lang}`;
  return [
    { href: p, label: ui.calendar, icon: 'ic-calendar' },
    { href: `${p}/news`, label: ui.news, icon: 'ic-flame' },
    { href: `${p}/blog`, label: ui.blog, icon: 'ic-file' },
    { href: `${p}/wishlist`, label: t.wishlist, icon: 'ic-star' },
  ];
}

export function BottomTabBar() {
  const pathname = usePathname();
  const lang = detectLang(pathname);
  const home = lang ? `/${lang}` : '/';
  const TABS = buildTabs(lang);

  return (
    <nav className="bottom-tabbar" aria-label={lang ? CAL[lang].appBottomNavAria : '앱 하단 메뉴'}>
      {TABS.map(tab => {
        const active = tab.href === home ? pathname === home : pathname.startsWith(tab.href);
        // 이미 그 탭이면 이동 대신 맨 위로 스크롤(앱 관습)
        const onClick = active
          ? (e: React.MouseEvent) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          : undefined;
        return (
          <a
            key={tab.href}
            href={tab.href}
            className="bottom-tab"
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
          >
            <span className="tab-ico">
              <svg className="ic" aria-hidden="true"><use href={`#${tab.icon}`} /></svg>
            </span>
            <span>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
