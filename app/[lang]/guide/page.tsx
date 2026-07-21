import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { LOCALES, type Locale } from '@/lib/i18nLabels';

interface Props { params: { lang: string }; }
function isLocale(v: string): v is Locale { return (LOCALES as string[]).includes(v); }

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

const META: Record<Locale, Metadata> = {
  en: {
    title: 'Game Pre-Registration & New Server Guide | FAQ',
    description: 'Game pre-registration, MMORPG new servers, why release dates change, Nintendo Switch 2, cross-play — answers to common questions.',
    alternates: { canonical: 'https://gcalen.com/en/guide' },
  },
  ja: {
    title: 'ゲーム事前予約・新規サーバーガイド | よくある質問',
    description: 'ゲーム事前予約、MMORPG新規サーバー、発売日が変わる理由、Nintendo Switch 2、クロスプレイなど、よくある質問をまとめたガイド。',
    alternates: { canonical: 'https://gcalen.com/ja/guide' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

interface Faq { q: string; a: string; }

const FAQS_EN: Faq[] = [
  {
    q: 'What is game pre-registration?',
    a: 'Pre-registration lets you sign up for launch notifications and rewards before a game officially releases. It&rsquo;s especially common for mobile games — often, the more people pre-register, the bigger the day-one rewards for everyone. So pre-registration isn&rsquo;t just a notification signup; it can meaningfully affect your early progress.',
  },
  {
    q: 'What are MMORPG new servers / reboot worlds, and when should I start?',
    a: 'A new server is a freshly opened game world, separate from existing servers. Since everyone starts from the same point, it&rsquo;s the most favorable option for new and returning players. A "reboot world" usually refers to a special server with different monetization or rules. New servers offer the biggest first-mover advantage and rewards on opening day, so it&rsquo;s best to start right when a server you&rsquo;re interested in opens.',
  },
  {
    q: 'Why do game release dates change so often?',
    a: 'Release dates can shift for many reasons — development timelines, quality improvements (bug fixes, added content), content rating review, or marketing strategy. Games announced only as "Q3 2026," for example, don&rsquo;t have a confirmed date yet and are more likely to move. It&rsquo;s best to check each game&rsquo;s official source for the latest schedule.',
  },
  {
    q: 'What&rsquo;s the difference between Nintendo Switch 2 and the original Switch?',
    a: 'Switch 2 is the next-generation successor to the original Nintendo Switch, offering higher performance. Some new titles are Switch 2 exclusive and won&rsquo;t run on the original Switch, while others support both. Always check which system a game supports before buying.',
  },
  {
    q: 'What is cross-play / cross-platform?',
    a: 'Cross-play lets players on different devices (e.g. PC and mobile, or PS5 and Xbox) play together. Cross-platform/cross-save support means you can continue a game on PC that you started on mobile. Many recent Korean MMORPG releases support PC/mobile cross-play, so it&rsquo;s worth checking if it fits how you play.',
  },
  {
    q: 'How do I use the Gcalen release calendar?',
    a: 'Gcalen shows upcoming releases from Korea and worldwide — mobile, PC, console, and global AAA titles, plus Korean MMORPG new-server schedules — all in one place. Use calendar view to scan a month at a glance, or list view to browse by date. Save games you&rsquo;re watching to your wishlist, and use category filters to narrow down by genre.',
  },
  {
    q: 'Can I get release notifications?',
    a: 'Yes. If you install the app (add to home screen) and turn on notifications, you&rsquo;ll get alerts the day before and on the day a wishlisted game launches. You don&rsquo;t need to install anything to use the wishlist itself, and data refreshes daily.',
  },
];

const FAQS_JA: Faq[] = [
  {
    q: 'ゲームの事前予約とは何ですか?',
    a: '事前予約(事前登録)とは、ゲームが正式発売される前に発売通知や特典をあらかじめ申し込むことです。特にモバイルゲームで活発で、事前予約の参加人数が一定数を超えると発売初日の特典が増える仕組みが多く見られます。つまり事前予約は単なる通知登録ではなく、発売初期の成長スピードを左右する重要なステップです。',
  },
  {
    q: 'MMORPGの新規サーバー・リブートワールドとは何ですか?いつ始めるのがいいですか?',
    a: '新規サーバーとは、既存サーバーとは別に新しく開かれるゲームの世界です。全員が同じスタートラインから始まるため、新規・復帰プレイヤーに最も有利です。リブートワールドは課金体系やルールを異なる設計にした特殊サーバーを指すことが多いです。新規サーバーはオープン初日の先行者利益と特典が最も大きいため、気になるサーバーはオープン日に合わせて始めるのが有利です。',
  },
  {
    q: 'ゲームの発売日はなぜよく変わるのですか?',
    a: '発売日は開発スケジュール、品質向上(バグ修正・コンテンツ追加)、レーティング審査、マーケティング戦略など様々な理由で延期・変更される場合があります。特に「2026年第3四半期予定」のように四半期・年単位でしか発表されていないゲームは、具体的な日付が未確定のため変動しやすい状態です。正確な日程は各ゲームの公式情報源もあわせて確認することをおすすめします。',
  },
  {
    q: 'Nintendo Switch 2とSwitchは何が違いますか?',
    a: 'Switch 2は既存のNintendo Switchの後継となる次世代機で、より高い性能を提供します。一部の新作はSwitch 2専用として発売され、従来のSwitchでは動作しない場合がある一方、両方に対応するゲームもあります。購入前にゲームがどちらの機種に対応しているか必ず確認しましょう。',
  },
  {
    q: 'クロスプレイ・クロスプラットフォームとは何ですか?',
    a: 'クロスプレイとは、異なる機器(例:PCとモバイル、PS5とXbox)のユーザーが一緒にプレイできる機能です。クロスプラットフォーム・クロスセーブに対応していれば、PCでプレイしていたゲームをモバイルで続けて楽しむこともできます。最近の韓国産新作MMORPGはPC・モバイルのクロスプレイに対応する場合が多いため、ご自身のプレイ環境に合うか確認するとよいでしょう。',
  },
  {
    q: 'Gcalenのゲーム発売カレンダーはどう使えばいいですか?',
    a: 'Gcalenは国内外の新作発売日、モバイル・PC・コンソール・グローバル大作、韓国MMORPGの新規サーバー日程を一箇所で表示します。カレンダー表示で1か月分をざっと確認したり、リスト表示で日付順に確認したりできます。気になるゲームはウィッシュリストに保存し、カテゴリフィルターで好きなジャンルだけを絞り込むこともできます。',
  },
  {
    q: '発売通知は受け取れますか?',
    a: 'はい。アプリ(ホーム画面に追加)で発売通知をオンにすると、ウィッシュリストに保存したゲームの発売前日と当日に通知が届きます。インストールしなくてもウィッシュリスト機能で気になるゲームをまとめておくことができ、データは毎日更新されます。',
  },
];

const H1: Record<Locale, string> = {
  en: 'Game Pre-Registration & New Server Guide',
  ja: 'ゲーム事前予約・新規サーバーガイド',
};
const INTRO: Record<Locale, React.ReactNode> = {
  en: (
    <p>
      Tracking releases, pre-registration, and new servers comes with a lot of confusing terms. We&rsquo;ve
      collected the most common questions here. For deeper new-release analysis, see our{' '}
      <a href="/en/blog">Roundups</a>; for actual schedules, check{' '}
      <a href="/en/upcoming-games">Upcoming</a>, <a href="/en/pre-registration">Pre-Registration</a>, and{' '}
      <a href="/en/new-servers">New Servers</a>.
    </p>
  ),
  ja: (
    <p>
      ゲームの発売・事前予約・新規サーバーを追いかけていると、紛らわしい用語や疑問が多く出てきます。ゲーマーがよく尋ねる質問を一箇所にまとめました。より詳しい新作分析は
      {' '}<a href="/ja/blog">まとめ記事</a>で、実際の日程は{' '}<a href="/ja/upcoming-games">発売予定</a>・
      {' '}<a href="/ja/pre-registration">事前予約</a>・<a href="/ja/new-servers">新規サーバー</a>ページでご確認ください。
    </p>
  ),
};
const FOOTER_H2: Record<Locale, string> = { en: 'Daily-updated game schedules', ja: '毎日更新されるゲーム日程' };
const FOOTER_P: Record<Locale, string> = {
  en: 'Gcalen (gcalen.com) refreshes Korean and worldwide release dates, plus new-server and major-event info, every day. Check scattered release info in one place, and never miss a launch you care about.',
  ja: 'Gcalen(gcalen.com)は国内外の新作発売日や新規サーバー・大型イベント情報を毎日新しく整理しています。散らばった発売情報を1ページで確認し、気になるゲームの発売日を見逃さないようにしましょう。',
};

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const faqs = lang === 'en' ? FAQS_EN : FAQS_JA;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
    })),
  };

  return (
    <PageShell lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <article className="legal">
        <h1>{H1[lang]}</h1>
        {INTRO[lang]}

        {faqs.map(f => (
          <section key={f.q}>
            <h2>{f.q}</h2>
            <p dangerouslySetInnerHTML={{ __html: f.a }} />
          </section>
        ))}

        <h2>{FOOTER_H2[lang]}</h2>
        <p>{FOOTER_P[lang]}</p>
      </article>
    </PageShell>
  );
}
