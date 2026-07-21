import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatPostDate } from '@/lib/blog';
import { PageShell } from '@/components/PageShell';
import { BlogImg } from '@/components/BlogImg';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: '게임 신작 총정리 | 신작 추천·출시 정리·TOP 정리',
  description: '신작 게임 추천, 월간·하반기 출시 정리, 기대작 TOP 리스트, 신규 서버 일정 등 게임 출시 캘린더가 직접 큐레이션한 신작 총정리.',
  alternates: { canonical: 'https://gcalen.com/blog' },
  openGraph: {
    url: 'https://gcalen.com/blog',
    type: 'website',
    title: '게임 신작 총정리',
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <PageShell>
      <section className={styles.indexSection}>
        <header className={styles.header}>
          <h2 className={styles.title}><svg className="ic" aria-hidden="true"><use href="#ic-file" /></svg> 신작 총정리</h2>
          <p className={styles.subtitle}>
            신작 추천, 기대작 TOP 정리, 월간·하반기 출시 정리, 신규 서버 일정
          </p>
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>아직 게시글이 없어요. 곧 첫 글이 올라옵니다!</p>
        ) : (
          <ul className={styles.postList}>
            {posts.map(p => (
              <li key={p.slug} className={p.heroImage ? `${styles.postCard} ${styles.postCardThumb}` : styles.postCard}>
                <Link href={`/blog/${p.slug}`} className={styles.postLink}>
                  {p.heroImage && <BlogImg src={p.heroImage} containerClassName={styles.thumb} />}
                  <div className={styles.postCardBody}>
                    <time className={styles.postDate}>{formatPostDate(p.date)}</time>
                    <h3 className={styles.postTitle}>{p.title}</h3>
                    {p.description && <p className={styles.postDesc}>{p.description}</p>}
                    {p.tags.length > 0 && (
                      <div className={styles.postTags}>
                        {p.tags.map(t => (
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
