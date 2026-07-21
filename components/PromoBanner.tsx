import styles from './PromoBanner.module.css';

type Variant = 'calendar' | 'update';

interface Props {
  variant: Variant;
}

// 양옆 레일 하단 프로모 배너 — accent 색면으로 시각 포인트(데이터 불필요).
// calendar: 블루 계열 / update: warm(amber) 계열로 색감 분리.
const CONTENT: Record<Variant, { icon: string; title: string; sub: string }> = {
  calendar: {
    icon: 'ic-calendar',
    title: '구글 캘린더 연동',
    sub: '게임 상세에서 출시일을 내 캘린더에 바로 추가',
  },
  update: {
    icon: 'ic-flame',
    title: '매일 오전 9시 업데이트',
    sub: '국내외 신작·신규 서버 일정을 매일 새로 큐레이션',
  },
};

export function PromoBanner({ variant }: Props) {
  const { icon, title, sub } = CONTENT[variant];
  return (
    <div className={`${styles.banner} ${styles[variant]}`}>
      <span className={styles.emoji} aria-hidden="true"><svg className="ic"><use href={`#${icon}`} /></svg></span>
      <div className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.sub}>{sub}</span>
      </div>
    </div>
  );
}
