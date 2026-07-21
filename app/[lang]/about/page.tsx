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
    title: 'About',
    description: 'Gcalen (gcalen.com) curates game release schedules and Korean MMORPG new-server/major-event dates from Korea and worldwide.',
    alternates: { canonical: 'https://gcalen.com/en/about' },
  },
  ja: {
    title: 'サイトについて',
    description: 'Gcalen(gcalen.com)は国内外のゲーム発売日程と韓国MMORPGの新規サーバー・大型イベント情報を毎日キュレーションするサービスです。',
    alternates: { canonical: 'https://gcalen.com/ja/about' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

function EnBody() {
  return (
    <>
      <h1>About Gcalen</h1>
      <p><strong>Gcalen</strong> (gcalen.com) brings together game release schedules from Korea and worldwide, plus Korean MMORPG new-server openings and major events, in one place. We manually curate scattered release information every day so you can see upcoming titles and events at a glance.</p>

      <h2>What we cover</h2>
      <ul>
        <li><strong>Domestic mobile</strong> game releases (Korea)</li>
        <li><strong>PC & console</strong> new releases (Steam, PS5, Xbox, Switch)</li>
        <li><strong>Global AAA</strong> titles</li>
        <li><strong>New servers & major events</strong> (Lineage, MapleStory, Odin, and more — new server openings, major updates, showcases)</li>
      </ul>

      <h2>How it&rsquo;s made</h2>
      <p>Every schedule is curated from official announcements and press releases. We prioritize <strong>accuracy</strong> above all and don&rsquo;t publish unverified information. Data is refreshed daily.</p>

      <h2>Key features</h2>
      <ul>
        <li>Toggle between monthly <strong>calendar</strong> and <strong>list</strong> views</li>
        <li>Category/search filters, a <strong>wishlist</strong> to save games you&rsquo;re watching</li>
        <li><strong>Favorites</strong>, <strong>comments</strong>, and <strong>sharing</strong> on game detail pages</li>
        <li>Per-game detail pages with release date, developer/publisher, platforms, genre, and official sources</li>
      </ul>

      <h2>Note</h2>
      <p>This service exists for informational (editorial) purposes. Game names, images, and related copyrights belong to their respective owners. Release dates and other details may change — please check official sources for the latest information.</p>

      <h2>Contact</h2>
      <p>For partnerships, corrections, or removal requests: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>
    </>
  );
}

function JaBody() {
  return (
    <>
      <h1>Gcalenについて</h1>
      <p><strong>Gcalen</strong>(gcalen.com)は、国内外のゲーム発売日程と韓国MMORPGの新規サーバー・大型イベント情報を一箇所にまとめたサービスです。散らばった発売情報を毎日手作業で整理し、今後の新作やイベントを一目で確認できるようにしています。</p>

      <h2>取り扱う情報</h2>
      <ul>
        <li><strong>韓国国内モバイル</strong>ゲームの発売日程</li>
        <li><strong>PC・コンソール</strong>新作(Steam・PS5・Xbox・Switch)</li>
        <li><strong>グローバルAAA</strong>タイトル</li>
        <li><strong>新規サーバー・大型イベント</strong>(リネージュ、メイプルストーリー、オーディンなどの新規サーバーオープン、大型アップデート、ショーケース)</li>
      </ul>

      <h2>どうやって作っているか</h2>
      <p>すべての日程は各ゲームの公式発表・プレスリリースなど信頼できる情報源を確認してキュレーションしています。<strong>正確性を最優先</strong>とし、未確認の情報は掲載しません。データは毎日更新されます。</p>

      <h2>主な機能</h2>
      <ul>
        <li>月間<strong>カレンダー</strong> / <strong>リスト</strong>表示の切り替え</li>
        <li>カテゴリ・検索フィルター、<strong>ウィッシュリスト</strong>(気になるゲームの保存)</li>
        <li>ゲーム詳細ページでの<strong>お気に入り</strong>・<strong>コメント</strong>・<strong>共有</strong></li>
        <li>各ゲームの詳細ページ(発売日・開発/販売元・対応機種・ジャンル・公式情報源)</li>
      </ul>

      <h2>ご案内</h2>
      <p>本サービスは情報提供(エディトリアル)を目的としており、ゲーム名・画像等の著作権は各権利者に帰属します。発売日などの情報は変更される場合がありますので、最終確認は公式情報源をご参照ください。</p>

      <h2>お問い合わせ</h2>
      <p>提携・訂正・削除のご依頼など: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>
    </>
  );
}

export default async function Page({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  return (
    <PageShell lang={params.lang}>
      <article className="legal">
        {params.lang === 'en' ? <EnBody /> : <JaBody />}
      </article>
    </PageShell>
  );
}
