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
    title: 'Terms of Service',
    description: 'Gcalen (gcalen.com) terms of service — service description, comment policy, copyright, and disclaimers.',
    alternates: { canonical: 'https://gcalen.com/en/terms' },
  },
  ja: {
    title: '利用規約',
    description: 'Gcalen(gcalen.com)利用規約 — サービス内容、コメント運営方針、著作権および免責事項について。',
    alternates: { canonical: 'https://gcalen.com/ja/terms' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

function EnBody() {
  return (
    <>
      <h1>Terms of Service</h1>

      <h2>Article 1 (Purpose)</h2>
      <p>These Terms govern the conditions and procedures for using the services provided by Gcalen (gcalen.com, the &ldquo;Service&rdquo;).</p>

      <h2>Article 2 (Service description)</h2>
      <ul>
        <li>The Service provides game release schedules and Korean MMORPG new-server/major-event information from Korea and worldwide, free of charge.</li>
        <li>Published release dates and other information may change, and the Service does not guarantee their accuracy or completeness. Please confirm final details with each game&rsquo;s official sources.</li>
      </ul>

      <h2>Article 3 (User posts / comments)</h2>
      <p>Users may post comments, but must not engage in the following:</p>
      <ul>
        <li>Abusive, defamatory, discriminatory, or hateful speech</li>
        <li>Obscene or illegal content, advertising/spam, or flooding</li>
        <li>Infringing others&rsquo; copyright, personal data, or other rights</li>
      </ul>
      <p>The operator may remove posts that violate the above or are otherwise inappropriate, without prior notice.</p>

      <h2>Article 4 (Copyright)</h2>
      <ul>
        <li>Game names, images, and similar content shown on the Service belong to their respective rights holders and are cited for informational (editorial) purposes.</li>
        <li>Upon a rights holder&rsquo;s request, the relevant content will be promptly edited or removed.</li>
      </ul>

      <h2>Article 5 (Disclaimer)</h2>
      <ul>
        <li>The Service is provided free of charge, and is not liable for damages arising from information accuracy, service interruption, or external links.</li>
        <li>The Service is not responsible for the content of external sites it links to.</li>
      </ul>

      <h2>Article 6 (Changes to these Terms)</h2>
      <p>These Terms may be revised as needed, and any changes will be posted on this page.</p>

      <h2>Article 7 (Contact)</h2>
      <p>Contact: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>

      <p className="legal-updated">Effective date: June 16, 2026</p>
    </>
  );
}

function JaBody() {
  return (
    <>
      <h1>利用規約</h1>

      <h2>第1条(目的)</h2>
      <p>本規約は、Gcalen(gcalen.com、以下「本サービス」)が提供するサービスの利用条件および手続きについて定めるものです。</p>

      <h2>第2条(サービス内容)</h2>
      <ul>
        <li>本サービスは、国内外のゲーム発売日程、新規サーバー・大型イベント情報等を無料で提供します。</li>
        <li>掲載された発売日等の情報は変更される場合があり、本サービスは情報の正確性・完全性を保証しません。最終的な情報は各ゲームの公式情報源をご確認ください。</li>
      </ul>

      <h2>第3条(利用者投稿・コメント)</h2>
      <p>利用者はコメントを投稿できますが、以下の行為をしてはなりません。</p>
      <ul>
        <li>暴言・誹謗中傷・差別・ヘイト表現</li>
        <li>わいせつ・違法情報、広告・スパム、荒らし行為</li>
        <li>他者の著作権・個人情報等の権利を侵害する行為</li>
      </ul>
      <p>運営者は上記に違反する、または不適切と判断した投稿を、事前通知なく削除できます。</p>

      <h2>第4条(著作権)</h2>
      <ul>
        <li>本サービスに表示されるゲーム名・画像等は各権利者に著作権があり、本サービスは情報提供(エディトリアル)目的でこれらを引用しています。</li>
        <li>権利者からの要請があった場合、該当コンテンツを速やかに修正・削除します。</li>
      </ul>

      <h2>第5条(免責事項)</h2>
      <ul>
        <li>本サービスは無料で提供され、情報の正確性、サービスの中断、外部リンク等により生じた損害について責任を負いません。</li>
        <li>本サービスに含まれる外部サイトのリンク先の内容について責任を負いません。</li>
      </ul>

      <h2>第6条(規約の変更)</h2>
      <p>本規約は必要に応じて変更される場合があり、変更時は本ページに掲示します。</p>

      <h2>第7条(お問い合わせ)</h2>
      <p>お問い合わせ: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>

      <p className="legal-updated">施行日: 2026年6月16日</p>
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
