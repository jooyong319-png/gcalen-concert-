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
    title: 'Contact',
    description: 'Contact Gcalen (gcalen.com) for corrections, removal requests, partnerships, copyright, or privacy inquiries.',
    alternates: { canonical: 'https://gcalen.com/en/contact' },
  },
  ja: {
    title: 'お問い合わせ',
    description: 'Gcalen(gcalen.com)へのお問い合わせ — 情報の訂正・削除依頼、提携、著作権、個人情報に関するご相談を受け付けています。',
    alternates: { canonical: 'https://gcalen.com/ja/contact' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

function EnBody() {
  return (
    <>
      <h1>Contact</h1>
      <p>Thanks for using Gcalen (gcalen.com). Email us with the details below and we&rsquo;ll review and respond.</p>

      <h2>We accept</h2>
      <ul>
        <li><strong>Correction / removal requests</strong> — incorrect release dates, game info, posts, or comments</li>
        <li><strong>Copyright / rights issues</strong> — requests from rights holders to edit or remove game names, images, or trademarks</li>
        <li><strong>Privacy inquiries</strong> — data access/deletion requests (see our Privacy Policy for details)</li>
        <li><strong>Partnerships / tips</strong> — new game, server, or event info, or collaboration proposals</li>
      </ul>

      <h2>Email</h2>
      <p><a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>
      <p>Including a link to the relevant page and specific details helps us respond faster. We review requests on business days and act on corrections/removals as soon as they&rsquo;re verified.</p>

      <h2>Note</h2>
      <p>This service exists for informational (editorial) purposes, and release dates may change at the discretion of each game&rsquo;s publisher. Please confirm final details with official sources. See our <a href="/en/about">About page</a> for more on the service, and our <a href="/en/privacy">Privacy Policy</a> for data handling.</p>
    </>
  );
}

function JaBody() {
  return (
    <>
      <h1>お問い合わせ</h1>
      <p>Gcalen(gcalen.com)をご利用いただきありがとうございます。以下の内容でメールいただければ、確認のうえ誠実にご対応いたします。</p>

      <h2>受け付けている内容</h2>
      <ul>
        <li><strong>情報の訂正・削除依頼</strong> — 発売日、ゲーム情報、投稿・コメントなど誤った情報や削除が必要な内容</li>
        <li><strong>著作権・権利関連</strong> — ゲーム名・画像・商標等について権利者様からの修正・削除依頼</li>
        <li><strong>個人情報関連</strong> — データの閲覧・削除依頼(詳細はプライバシーポリシーをご参照ください)</li>
        <li><strong>提携・情報提供</strong> — 新作ゲーム・サーバー・イベント情報の提供、協業のご提案</li>
      </ul>

      <h2>メール</h2>
      <p><a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>
      <p>該当ページのリンクや具体的な内容を添えていただくと、より迅速に対応できます。営業日順に確認し、訂正・削除依頼は確認でき次第反映いたします。</p>

      <h2>ご参考</h2>
      <p>本サービスは情報提供(エディトリアル)を目的としており、発売日等は各ゲームメーカーの事情により変更される場合があります。最終的な情報は各ゲームの公式情報源をご確認ください。サービス紹介は<a href="/ja/about">サイトについて</a>、データの取り扱いは<a href="/ja/privacy">プライバシーポリシー</a>をご覧ください。</p>
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
