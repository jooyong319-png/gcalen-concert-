import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNews, formatPostDate } from '@/lib/news';
import { PageShell } from '@/components/PageShell';
import { BlogImg } from '@/components/BlogImg';
import styles from '../blog/blog.module.css';
import n from './news.module.css';

export const metadata: Metadata = {
  title: '게임 뉴스 | 신작·업데이트·출시 소식 한눈에',
  description: '국내외 게임 신작, 업데이트, 사전예약, 출시 소식을 매일 정리. 게임 출시 캘린더가 큐레이션한 최신 게임 뉴스.',
  alternates: { canonical: 'https://gcalen.com/news' },
  openGraph: {
    url: 'https://gcalen.com/news',
    type: 'website',
    title: '게임 뉴스',
  },
};

export default async function NewsIndexPage() {
  const items = await getAllNews();

  return (
    <PageShell>
      <section className={styles.indexSection}>
        <header className={styles.header}>
          <h2 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-flame" /></svg> 게임 뉴스</h2>
          <p className={styles.subtitle}>
            신작·업데이트·사전예약·출시 소식을 매일 정리
          </p>
        </header>

        {items.length === 0 ? (
          <p className={styles.empty}>아직 뉴스가 없어요. 곧 첫 소식이 올라옵니다!</p>
        ) : (
          <ul className={styles.postList}>
            {items.map(it => (
              <li key={it.slug} className={it.heroImage ? `${styles.postCard} ${styles.postCardThumb}` : styles.postCard}>
                <Link href={`/news/${it.slug}`} className={styles.postLink}>
                  {it.heroImage && <BlogImg src={it.heroImage} containerClassName={styles.thumb} />}
                  <div className={styles.postCardBody}>
                    <time className={styles.postDate}>
                      {formatPostDate(it.date)}
                      {it.source && <span className={n.sourceBadge}>{it.source}</span>}
                    </time>
                    <h3 className={styles.postTitle}>{it.title}</h3>
                    {it.description && <p className={styles.postDesc}>{it.description}</p>}
                    {it.tags.length > 0 && (
                      <div className={styles.postTags}>
                        {it.tags.map(t => (
                          <span key={t} className={styles.tag}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
