// 다국어(/en, /ja) 페이지 공용 UI 문구 — 정적 딕셔너리(번역 API 미사용, 직접 작성).
import type { Category } from './types';

export type Locale = 'en' | 'ja';
export const LOCALES: Locale[] = ['en', 'ja'];

// 게임명/설명 — 리서처가 채운 name_en/name_ja, description_en/ja가 있으면 그걸, 없으면 한국어로 폴백.
// 캘린더·리스트·모달 등 게임 데이터를 보여주는 모든 곳에서 공용으로 사용.
interface LocalizableGameName { name_ko: string; name_en?: string | null; name_ja?: string | null; }
interface LocalizableGameDesc { description: string | null; description_en?: string | null; description_ja?: string | null; }

export function gameName(g: LocalizableGameName, lang: Locale | null): string {
  if (!lang) return g.name_ko;
  if (lang === 'ja') return g.name_ja || g.name_en || g.name_ko;
  return g.name_en || g.name_ko;
}

export function gameDescription(g: LocalizableGameDesc, lang: Locale | null): string | null {
  if (!lang) return g.description;
  const d = lang === 'en' ? g.description_en : g.description_ja;
  return d || g.description;
}

// 쿠폰/게임 허브(data/coupons.json) 게임명 — name_en/name_ja가 있으면 그걸, 없으면 정리된 한국어 표기로 폴백.
interface LocalizableCouponName { name: string; name_en?: string | null; name_ja?: string | null; }
export function couponGameName(v: LocalizableCouponName, lang: Locale | null): string {
  if (!lang) return v.name;
  if (lang === 'ja') return v.name_ja || v.name_en || v.name;
  return v.name_en || v.name;
}

// 게임쇼/할인/시즌 등 data/events.json 이벤트 제목 — 리서처가 채운 title_en/ja가 있으면 그걸, 없으면 한국어로 폴백.
interface LocalizableEventTitle { title: string; title_en?: string | null; title_ja?: string | null; }
export function eventTitle(e: LocalizableEventTitle, lang: Locale | null): string {
  if (!lang) return e.title;
  if (lang === 'ja') return e.title_ja || e.title_en || e.title;
  return e.title_en || e.title;
}

// coupons.json의 term 필드('쿠폰'|'리딤코드') 표시용 번역 — 데이터 자체는 안 바꾸고 화면 표기만.
export const TERM_LABELS: Record<Locale, Record<string, string>> = {
  en: { '쿠폰': 'coupon codes', '리딤코드': 'redeem codes' },
  ja: { '쿠폰': 'クーポン', '리딤코드': 'リディームコード' },
};
export function termLabel(term: string, lang: Locale | null): string {
  if (!lang) return term;
  return TERM_LABELS[lang][term] ?? term;
}

// events.json 이벤트 타입(game_show/sale/season/free_game) 라벨
export const EVENT_TYPE_LABELS: Record<Locale, Record<'game_show' | 'sale' | 'season' | 'free_game', string>> = {
  en: { game_show: 'Game Show', sale: 'Sale', season: 'New Season', free_game: 'Free' },
  ja: { game_show: 'ゲームショー', sale: 'セール', season: '新シーズン', free_game: '無料' },
};

export const CATEGORY_LABELS: Record<Locale, Record<Category, string>> = {
  en: {
    concert_tour: 'Concerts & Tours',
    music_release: 'Music Release (Comeback)',
    festival: 'Festival',
    fanmeeting: 'Fan Meeting',
  },
  ja: {
    concert_tour: 'コンサート・来日公演',
    music_release: '音源発売(カムバック)',
    festival: 'フェスティバル',
    fanmeeting: 'ファンミーティング',
  },
};

interface UiStrings {
  siteName: string;
  siteNameShort: string;
  home: string;
  calendar: string;
  news: string;
  blog: string;
  releaseDate: string;
  platforms: string;
  genres: string;
  developer: string;
  publisher: string;
  tba: string;
  viewOriginal: string;
  backToList: string;
  publishedOn: string;
  source: string;
  notFound: string;
  notTranslated: string;
  contact: string;
  about: string;
  contactPage: string;
  guide: string;
  privacy: string;
  terms: string;
  footerDisclaimer: string;
  siteDescription: string;
}

export const UI: Record<Locale, UiStrings> = {
  en: {
    siteName: 'Concert Calendar — Tours, Comebacks & Festivals',
    siteNameShort: 'Concert Calendar',
    home: 'Home',
    calendar: 'Calendar',
    news: 'News',
    blog: 'Roundups',
    releaseDate: 'Date',
    platforms: 'Venue',
    genres: 'Tags',
    developer: 'Artist / Agency',
    publisher: 'Organizer',
    tba: 'TBA',
    viewOriginal: 'View full interactive page (Korean) →',
    backToList: '← Back to list',
    publishedOn: 'Published',
    source: 'Source',
    notFound: 'Page not found.',
    notTranslated: "This page hasn't been translated into English yet.",
    contact: 'Contact',
    about: 'About',
    contactPage: 'Contact',
    guide: 'Guide',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    footerDisclaimer: 'Artist names, images, and trademarks are property of their respective rights holders. This site exists to provide schedule information and will edit or remove content upon a rights holder’s request.',
    siteDescription: 'Track Korean and global game release dates, pre-registrations, new server openings, and events in one calendar — updated daily.',
  },
  ja: {
    siteName: 'コンサートカレンダー — 来日公演・カムバック・フェス',
    siteNameShort: 'コンサートカレンダー',
    home: 'ホーム',
    calendar: 'カレンダー',
    news: 'ニュース',
    blog: 'まとめ記事',
    releaseDate: '日程',
    platforms: '会場',
    genres: 'タグ',
    developer: 'アーティスト/所属事務所',
    publisher: '主催',
    tba: '未定',
    viewOriginal: '詳細ページ(韓国語・全機能)を見る →',
    backToList: '← 一覧へ戻る',
    publishedOn: '公開日',
    source: '出典',
    notFound: 'ページが見つかりません。',
    notTranslated: 'このページはまだ日本語に翻訳されていません。',
    contact: 'お問い合わせ',
    about: 'サイトについて',
    contactPage: 'お問い合わせ',
    guide: 'ガイド',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    footerDisclaimer: 'アーティスト名・画像・商標等は各権利者の資産であり、本サイトは日程情報の提供を目的としています。権利者の要請があれば該当コンテンツを速やかに修正・削除します。',
    siteDescription: '国内外のゲーム発売日程・事前予約・新規サーバー・イベント情報を一つのカレンダーにまとめて毎日更新しています。',
  },
};

// hreflang용 언어 코드(Next Metadata alternates.languages 키)
export const HREFLANG: Record<Locale, string> = { en: 'en', ja: 'ja' };

// 캘린더/리스트/모달 등 딥 컴포넌트용 UI 문구 (usePathname 자체 감지 컴포넌트에서 사용)
interface CalUiStrings {
  searchPlaceholder: string;
  wishlist: string;
  wishlistOnly: string;
  viewCalendar: string;
  viewList: string;
  today: string;
  noImage: string;
  lastUpdated: string;
  noSchedule: string;
  totalCount: string;
  free: string;
  comingSoon: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  weekdays: string[]; // Sun..Sat
  close: string;
  official: string;
  addToWishlist: string;
  removeFromWishlist: string;
  share: string;
  comments: string;
  commentPlaceholder: string;
  postComment: string;
  nickname: string;
  loading: string;
  released: string;
  goTo: string;
  prevMonth: string;
  nextMonth: string;
  goToToday: string;
  noReleaseThisMonth: string;
  swipeHint: string;
  closePanel: string;
  noScheduleThisDate: string;
  preRegTag: string;
  deadlineTag: string;
  preRegStartBadge: string;
  preRegEndBadge: string;
  ongoing: string;
  closed: string;
  all: string;
  categoryFilter: string;
  prevYear: string;
  nextYear: string;
  monthSelect: string;
  months: string[]; // Jan..Dec short
  noDateSet: string;
  noApproxGames: string;
  noReleaseThisMonthYear: (monthYearLabel: string) => string;
  pickOtherMonth: string;
  viewSource: string;
  goToPreReg: string;
  favorited: string;
  favorite: string;
  fullPage: string;
  copied: string;
  preRegLive: string;
  preRegTimeLeft: string;
  preRegClosedText: string;
  preRegDeadlineTba: string;
  preRegInfo: string;
  startsOn: (label: string) => string;
  totalItems: (count: number) => string;
  noScheduleRegistered: string;
  copy: string;
  copiedCheck: string;
  expiredTag: string;
  expiredUntil: (label: string) => string;
  copyAria: (code: string) => string;
  noActiveCoupons: string;
  officialRedeemPage: (name: string, term: string) => string;
  pastCoupons: (term: string) => string;
  couponIntro: (name: string, term: string) => string;
  howToUse: (name: string, term: string) => string;
  faqTitle: (name: string, term: string) => string;
  otherGameCoupons: (term: string) => string;
  gameHub: (name: string) => string;
  releaseInfo: (name: string) => string;
  allCoupons: string;
  lastUpdatedCouponNote: (dateLabel: string) => string;
  gameCoupons: string;
  scheduleCount: (count: number) => string;
  scheduleTitle: (name: string) => string;
  upcomingTag: string;
  fullGameList: string;
  otherGameCouponsShort: string;
  gcalenHome: string;
  noValidCodesShort: string;
  hubLastUpdatedNote: (dateLabel: string) => string;
  couponFor: (name: string, term: string) => string;
  myWishlist: string;
  myWishlistSub: string;
  wishlistEmptyText: string;
  wishlistEmptyHint: string;
  releaseDateTba: string;
  removeFromWishlistAria: (name: string) => string;
  notifyTitle: string;
  notifyToggleAria: string;
  notifyDeniedSub: string;
  notifyNormalSub: string;
  notifyOnToast: string;
  notifyOffToast: string;
  notifyDeniedToast: string;
  notifyFailToast: (reason: string) => string;
  notifyUnknownError: string;
  freeGamesAria: string;
  freeGamesTitle: string;
  freeGamesTag: string;
  freeDaysLeft: (days: number) => string;
  freeFromDate: (mmdd: string) => string;
  appBottomNavAria: string;
  switchToLight: string;
  switchToDark: string;
  recommendedSchedule: string;
  eventEnds: (title: string) => string;
  freeStarts: (title: string) => string;
  freeEnds: (title: string) => string;
}

export const CAL: Record<Locale, CalUiStrings> = {
  en: {
    searchPlaceholder: 'Search games…',
    wishlist: 'Wishlist',
    wishlistOnly: 'Wishlist only',
    viewCalendar: 'Calendar',
    viewList: 'List',
    today: 'Today',
    noImage: 'No image',
    lastUpdated: 'Data last updated',
    noSchedule: 'No games scheduled.',
    totalCount: 'Total',
    free: 'Free',
    comingSoon: 'Coming soon',
    days: 'D', hours: 'H', minutes: 'M', seconds: 'S',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    close: 'Close',
    official: 'Official source →',
    addToWishlist: 'Add to wishlist',
    removeFromWishlist: 'Remove from wishlist',
    share: 'Share',
    comments: 'Comments',
    commentPlaceholder: 'Comment on this game (max 500 chars)',
    postComment: 'Post',
    nickname: 'Nickname',
    loading: 'Loading…',
    released: 'Released',
    goTo: 'View',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    goToToday: 'Today',
    noReleaseThisMonth: 'No releases scheduled this month.',
    swipeHint: 'Swipe or use ‹ › to browse other months.',
    closePanel: 'Close panel',
    noScheduleThisDate: 'Nothing scheduled on this date.',
    preRegTag: 'Pre-reg',
    deadlineTag: 'Deadline',
    preRegStartBadge: 'Pre-registration opens',
    preRegEndBadge: 'Pre-registration closes',
    ongoing: 'Ongoing',
    closed: 'Closed',
    all: 'All',
    categoryFilter: 'Category & event filter',
    prevYear: 'Previous year',
    nextYear: 'Next year',
    monthSelect: 'Select month',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    noDateSet: 'TBA',
    noApproxGames: 'No games with a TBA release date.',
    noReleaseThisMonthYear: (label) => `No releases in ${label}.`,
    pickOtherMonth: 'Pick another month from the tabs above.',
    viewSource: 'View source',
    goToPreReg: 'Go to pre-registration',
    favorited: 'Favorited',
    favorite: 'Favorite',
    fullPage: 'Full page',
    copied: 'Copied',
    preRegLive: 'Pre-registration open',
    preRegTimeLeft: 'Time left to pre-register',
    preRegClosedText: 'Pre-registration closed',
    preRegDeadlineTba: 'Pre-registration deadline TBA',
    preRegInfo: 'Pre-registration info',
    startsOn: (label) => `Starts ${label}`,
    totalItems: (count) => `${count} total`,
    noScheduleRegistered: 'No games scheduled here yet.',
    copy: 'Copy',
    copiedCheck: 'Copied ✓',
    expiredTag: 'Expired',
    expiredUntil: (label) => `${label} · expired`,
    copyAria: (code) => `Copy ${code}`,
    noActiveCoupons: 'No active codes right now. Check the recently-expired codes and how to redeem below.',
    officialRedeemPage: (name, term) => `Open ${name} official ${term} redemption page →`,
    pastCoupons: (term) => `Past ${term} (expired)`,
    couponIntro: (name, term) =>
      `${name} ${term} codes are free reward codes the publisher gives out during official broadcasts, major updates, and anniversary events. This page collects only codes verified on official channels and refreshes daily; expired codes stay visible for 90 days for reference. Codes are often first-come, first-served or time-limited, so redeem them as soon as they appear — some may require a specific server or account condition, so check each code's reward description.`,
    howToUse: (name, term) => `How to redeem ${name} ${term}`,
    faqTitle: (name, term) => `${name} ${term} FAQ`,
    otherGameCoupons: (term) => `Other games' ${term}`,
    gameHub: (name) => `${name} hub (coupons & schedule) →`,
    releaseInfo: (name) => `${name} release info →`,
    allCoupons: 'All game coupons →',
    lastUpdatedCouponNote: (dateLabel) => `Last updated: ${dateLabel}. Codes are verified against official channels and status changes when expired or exhausted.`,
    gameCoupons: 'Game Coupons',
    scheduleCount: (count) => `${count} scheduled`,
    scheduleTitle: (name) => `${name} release, update & event schedule`,
    upcomingTag: 'Upcoming',
    fullGameList: 'Full game list →',
    otherGameCouponsShort: 'Other game coupons →',
    gcalenHome: 'Game release calendar →',
    noValidCodesShort: 'No active codes right now. See the dedicated page for recently expired codes and how to redeem.',
    hubLastUpdatedNote: (dateLabel) => `Last updated: ${dateLabel}. Codes and schedules are verified against official channels.`,
    couponFor: (name, term) => `${name} ${term}`,
    myWishlist: 'My Wishlist',
    myWishlistSub: 'Release schedules for games you’re watching.',
    wishlistEmptyText: 'No games in your wishlist yet.',
    wishlistEmptyHint: 'Tap the star button on a game’s page to add it.',
    releaseDateTba: 'Release date TBA',
    removeFromWishlistAria: (name) => `Remove ${name} from wishlist`,
    notifyTitle: 'Release notifications',
    notifyToggleAria: 'Toggle release notifications',
    notifyDeniedSub: 'Please allow notifications in your browser settings.',
    notifyNormalSub: 'We’ll notify you the day before and on the day your wishlisted games release.',
    notifyOnToast: 'Release notifications turned on',
    notifyOffToast: 'Release notifications turned off',
    notifyDeniedToast: 'Notification permission was denied',
    notifyFailToast: (reason) => `Notification setup failed: ${reason}`,
    notifyUnknownError: 'Unknown error',
    freeGamesAria: 'Free game giveaways',
    freeGamesTitle: 'Free right now',
    freeGamesTag: 'Epic Games',
    freeDaysLeft: (days) => `Free · ${days} day${days === 1 ? '' : 's'} left`,
    freeFromDate: (mmdd) => `Free from ${mmdd}`,
    appBottomNavAria: 'App bottom menu',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    recommendedSchedule: 'Recommended schedule',
    eventEnds: (title) => `${title} ends`,
    freeStarts: (title) => `${title} free starts`,
    freeEnds: (title) => `${title} free ends`,
  },
  ja: {
    searchPlaceholder: 'ゲームを検索…',
    wishlist: 'お気に入り',
    wishlistOnly: 'お気に入りのみ表示',
    viewCalendar: 'カレンダー',
    viewList: 'リスト',
    today: '今日',
    noImage: '画像なし',
    lastUpdated: 'データ最終更新',
    noSchedule: '登録されている予定がありません。',
    totalCount: '合計',
    free: '無料',
    comingSoon: '発売間近',
    days: '日', hours: '時間', minutes: '分', seconds: '秒',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    close: '閉じる',
    official: '公式情報 →',
    addToWishlist: 'お気に入りに追加',
    removeFromWishlist: 'お気に入りから削除',
    share: '共有',
    comments: 'コメント',
    commentPlaceholder: 'このゲームへのコメント(最大500文字)',
    postComment: '投稿',
    nickname: 'ニックネーム',
    loading: '読み込み中…',
    released: '発売済み',
    goTo: '見る',
    prevMonth: '前月',
    nextMonth: '翌月',
    goToToday: '今日',
    noReleaseThisMonth: '今月の発売予定はありません。',
    swipeHint: 'スワイプまたは‹ ›で他の月を見る。',
    closePanel: 'パネルを閉じる',
    noScheduleThisDate: 'この日には予定がありません。',
    preRegTag: '事前予約',
    deadlineTag: '締切',
    preRegStartBadge: '事前予約開始',
    preRegEndBadge: '事前予約締切',
    ongoing: '受付中',
    closed: '終了',
    all: 'すべて',
    categoryFilter: 'カテゴリ・イベントフィルター',
    prevYear: '前年',
    nextYear: '翌年',
    monthSelect: '月を選択',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    noDateSet: '未定',
    noApproxGames: '発売日未定のゲームはありません。',
    noReleaseThisMonthYear: (label) => `${label}の発売予定はありません。`,
    pickOtherMonth: '上のタブから他の月を選んでください。',
    viewSource: '出典を見る',
    goToPreReg: '事前予約はこちら',
    favorited: 'お気に入り済み',
    favorite: 'お気に入り',
    fullPage: '詳細ページ',
    copied: 'コピーしました',
    preRegLive: '事前予約受付中',
    preRegTimeLeft: '事前予約締切までの時間',
    preRegClosedText: '事前予約は終了しました',
    preRegDeadlineTba: '事前予約締切日は未定',
    preRegInfo: '事前予約情報',
    startsOn: (label) => `${label}開始`,
    totalItems: (count) => `合計${count}件`,
    noScheduleRegistered: 'まだ登録されている予定がありません。',
    copy: 'コピー',
    copiedCheck: 'コピーしました ✓',
    expiredTag: '期限切れ',
    expiredUntil: (label) => `${label}・期限切れ`,
    copyAria: (code) => `${code}をコピー`,
    noActiveCoupons: '現在有効なコードはありません。下記の最近期限切れになったコードと使い方をご確認ください。',
    officialRedeemPage: (name, term) => `${name}公式${term}登録ページを開く →`,
    pastCoupons: (term) => `過去の${term}(期限切れ)`,
    couponIntro: (name, term) =>
      `${name}の${term}は、公式配信や大型アップデート、記念イベントの際に配布される無料報酬コードです。このページは公式チャンネルで確認できたコードのみを毎日更新して掲載し、期限切れのコードも参考用に90日間表示します。コードは先着順・期間限定のことが多いため、公開されたらすぐに登録するのがおすすめです。サーバーやアカウントの条件が必要な場合もあるため、各コードの報酬内容をご確認ください。`,
    howToUse: (name, term) => `${name} ${term}の使い方`,
    faqTitle: (name, term) => `${name} ${term}によくある質問`,
    otherGameCoupons: (term) => `他のゲームの${term}`,
    gameHub: (name) => `${name}ハブ(クーポン・日程) →`,
    releaseInfo: (name) => `${name}の発売情報 →`,
    allCoupons: 'ゲームクーポン一覧 →',
    lastUpdatedCouponNote: (dateLabel) => `最終更新: ${dateLabel}。コードは公式チャンネルを基に確認しており、期限切れ・終了時は表示が変わります。`,
    gameCoupons: 'ゲームクーポン',
    scheduleCount: (count) => `${count}件の予定`,
    scheduleTitle: (name) => `${name}の発売・アップデート・イベント情報`,
    upcomingTag: '予定',
    fullGameList: 'ゲーム一覧を見る →',
    otherGameCouponsShort: '他のゲームクーポン →',
    gcalenHome: 'ゲーム発売カレンダー →',
    noValidCodesShort: '現在有効なコードはありません。専用ページで最近期限切れのコードと使い方を確認できます。',
    hubLastUpdatedNote: (dateLabel) => `最終更新: ${dateLabel}。コード・日程は公式チャンネルを基に確認しています。`,
    couponFor: (name, term) => `${name} ${term}`,
    myWishlist: 'マイお気に入り',
    myWishlistSub: '気になるゲームの発売日程をまとめました。',
    wishlistEmptyText: 'まだお気に入りに追加したゲームがありません。',
    wishlistEmptyHint: 'ゲーム詳細ページのお気に入りボタンから追加できます。',
    releaseDateTba: '発売日未定',
    removeFromWishlistAria: (name) => `${name}をお気に入りから削除`,
    notifyTitle: '発売通知',
    notifyToggleAria: '発売通知の切り替え',
    notifyDeniedSub: 'ブラウザの設定で通知を許可してください。',
    notifyNormalSub: 'お気に入りゲームの発売前日と当日にお知らせします。',
    notifyOnToast: '発売通知をオンにしました',
    notifyOffToast: '発売通知をオフにしました',
    notifyDeniedToast: '通知の許可が拒否されました',
    notifyFailToast: (reason) => `通知の設定に失敗しました: ${reason}`,
    notifyUnknownError: '不明なエラー',
    freeGamesAria: '無料ゲーム配布',
    freeGamesTitle: '今すぐ無料',
    freeGamesTag: 'Epic Games',
    freeDaysLeft: (days) => `無料 · 残り${days}日`,
    freeFromDate: (mmdd) => `${mmdd}から無料`,
    appBottomNavAria: 'アプリ下部メニュー',
    switchToLight: 'ライトモードに切り替え',
    switchToDark: 'ダークモードに切り替え',
    recommendedSchedule: 'おすすめの日程',
    eventEnds: (title) => `${title} 終了`,
    freeStarts: (title) => `${title} 無料開始`,
    freeEnds: (title) => `${title} 無料終了`,
  },
};
