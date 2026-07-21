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
    title: 'Privacy Policy',
    description: 'Gcalen (gcalen.com) privacy policy — data we collect, cookies and personalized ads (Google AdSense), and third-party processing.',
    alternates: { canonical: 'https://gcalen.com/en/privacy' },
  },
  ja: {
    title: 'プライバシーポリシー',
    description: 'Gcalen(gcalen.com)のプライバシーポリシー — 収集項目、クッキーおよびパーソナライズ広告(Google AdSense)、第三者への処理委託について。',
    alternates: { canonical: 'https://gcalen.com/ja/privacy' },
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return META[params.lang];
}

function EnBody() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>Gcalen (gcalen.com, the &ldquo;Service&rdquo;) values your privacy and complies with applicable law. This policy explains what information the Service collects and how it&rsquo;s used.</p>

      <h2>1. Information we collect</h2>
      <p>The Service can be used without signing up or logging in, and we don&rsquo;t collect personal identifiers like name, email, or phone number. The following may be collected and stored:</p>
      <ul>
        <li><strong>When posting a game/news comment</strong>: nickname and comment content.</li>
        <li><strong>View counts</strong>: page visit records (for aggregate purposes only; not personally identifying).</li>
        <li><strong>Usage analytics (Google Analytics)</strong>: device identifiers and app/page interaction data may be collected for usage statistics.</li>
        <li><strong>Browser local storage</strong>: wishlist, theme setting, last-used nickname, and duplicate-view/like prevention values. These stay in your browser and are never sent to our servers.</li>
      </ul>

      <h2>2. Cookies and personalized ads</h2>
      <ul>
        <li>The Service may use <strong>Google AdSense</strong> and <strong>Kakao AdFit</strong> to display ads.</li>
        <li>Third-party ad providers may use cookies and ad identifiers to serve personalized ads based on your prior visits.</li>
        <li>You can disable personalized ads at <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>, and opt out of third-party cookies at <a href="https://www.aboutads.info" target="_blank" rel="noopener">www.aboutads.info</a>.</li>
        <li>See <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google&rsquo;s Advertising Policy</a> for more on Google&rsquo;s ad cookies.</li>
      </ul>

      <h2>3. Purpose of use</h2>
      <ul>
        <li>Providing and operating service features such as comments and view counts</li>
        <li>Usage analytics, ad delivery, and service improvement</li>
      </ul>

      <h2>4. Third-party processing</h2>
      <p>The Service relies on the following external providers to operate:</p>
      <ul>
        <li>Supabase — stores comments and view-count data</li>
        <li>Vercel — website hosting</li>
        <li>Google Analytics — usage analytics</li>
        <li>Google AdSense · Kakao AdFit — ad delivery</li>
      </ul>
      <p>Your information is processed only within the purposes above and is not sold or shared with third parties except as required by law. Data is encrypted in transit via HTTPS.</p>

      <h2>5. Retention and disposal</h2>
      <p>Comments are retained until deleted per our operating policy.</p>

      <h2>6. Your rights and data deletion requests</h2>
      <p>Gcalen (gcalen.com) users may request data deletion as follows:</p>
      <ul>
        <li><strong>Request deletion by email</strong>: to delete a comment you posted, email us with a link to the relevant page. We&rsquo;ll verify and delete it promptly.</li>
        <li><strong>Data that gets deleted</strong>: comment content.</li>
        <li><strong>Data that may be retained</strong>: aggregate, non-identifying view-count/usage statistics may be retained anonymously for service operation. Google Analytics data is automatically deleted per Google&rsquo;s retention policy (up to 14 months).</li>
        <li><strong>Local data</strong>: wishlist, theme, and other browser-stored data can be cleared directly from your browser settings.</li>
      </ul>

      <h2>7. Contact</h2>
      <p>For privacy or data-deletion inquiries: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>

      <p className="legal-updated">Effective date: June 16, 2026</p>
    </>
  );
}

function JaBody() {
  return (
    <>
      <h1>プライバシーポリシー</h1>
      <p>Gcalen(gcalen.com、以下「本サービス」)は利用者の個人情報を大切に扱い、関連法令を遵守します。本ポリシーは、本サービスがどのような情報をどのように収集・利用するかを説明するものです。</p>

      <h2>1. 収集する情報</h2>
      <p>本サービスは会員登録・ログインなしでご利用いただけ、氏名・メールアドレス・電話番号等の個人識別情報は収集しません。以下の情報が収集・保存される場合があります。</p>
      <ul>
        <li><strong>ゲーム/ニュースへのコメント投稿時</strong>: ニックネーム、コメント内容。</li>
        <li><strong>閲覧数の集計</strong>: ページ訪問記録(集計目的のみで、個人を特定しません)。</li>
        <li><strong>利用分析(Google Analytics)</strong>: アプリ・ウェブの利用統計のため、デバイス識別子やページ操作記録が収集される場合があります。</li>
        <li><strong>ブラウザのローカルストレージ</strong>: ウィッシュリスト、テーマ設定、直近入力したニックネーム、重複閲覧・いいね防止用の値。これらは利用者のブラウザにのみ保存され、サーバーへは送信されません。</li>
      </ul>

      <h2>2. クッキーおよびパーソナライズ広告</h2>
      <ul>
        <li>本サービスは広告配信のため<strong>Google AdSense</strong>および<strong>カカオAdFit</strong>を使用する場合があります。</li>
        <li>第三者広告事業者は、クッキーや広告識別子を用いて過去の訪問履歴に基づくパーソナライズ広告を配信する場合があります。</li>
        <li><a href="https://adssettings.google.com" target="_blank" rel="noopener">Google広告設定</a>でパーソナライズ広告を無効にでき、<a href="https://www.aboutads.info" target="_blank" rel="noopener">www.aboutads.info</a>で第三者クッキーを拒否できます。</li>
        <li>Googleの広告クッキーについての詳細は<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google広告ポリシー</a>をご参照ください。</li>
      </ul>

      <h2>3. 利用目的</h2>
      <ul>
        <li>コメント・閲覧数等のサービス機能の提供・運営</li>
        <li>利用統計分析、広告配信およびサービス改善</li>
      </ul>

      <h2>4. 処理委託および第三者提供</h2>
      <p>本サービスは運営のため以下の外部サービスを利用しています。</p>
      <ul>
        <li>Supabase — コメント・閲覧数データの保存</li>
        <li>Vercel — ウェブサイトホスティング</li>
        <li>Google Analytics — 利用統計分析</li>
        <li>Google AdSense・カカオAdFit — 広告配信</li>
      </ul>
      <p>利用者の情報は上記目的の範囲内でのみ処理され、法令に基づく場合を除き第三者に販売・提供しません。データは送信区間でHTTPSにより暗号化されます。</p>

      <h2>5. 保有および破棄</h2>
      <p>コメントは運営ポリシーに従い、削除されるまで保管されます。</p>

      <h2>6. 利用者の権利およびデータ削除依頼</h2>
      <p>Gcalen(gcalen.com)の利用者は、以下の方法でデータ削除を依頼できます。</p>
      <ul>
        <li><strong>メールによる削除依頼</strong>: ご自身が投稿したコメントの削除をご希望の場合、該当ページのリンクを添えて下記の連絡先までメールでご依頼ください。本人確認のうえ速やかに削除いたします。</li>
        <li><strong>削除されるデータ</strong>: コメント内容。</li>
        <li><strong>保管されるデータ</strong>: 個人を特定できない集計形式の閲覧数・利用統計は、サービス運営のため匿名の形で保管される場合があります。Google Analyticsの利用データはGoogleのポリシーに基づく保管期間(最長14か月)経過後、自動的に削除されます。</li>
        <li><strong>ローカルデータ</strong>: ウィッシュリスト・テーマ等のブラウザ保存情報は、ブラウザの設定から直接削除できます。</li>
      </ul>

      <h2>7. お問い合わせ先</h2>
      <p>個人情報およびデータ削除に関するお問い合わせ: <a href="mailto:devju546@gmail.com">devju546@gmail.com</a></p>

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
