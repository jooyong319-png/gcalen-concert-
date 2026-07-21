'use client';
import { useEffect, useState } from 'react';
import { calcDayDiff } from '@/lib/utils';
import { useLocale } from '@/hooks/useLocale';
import { UI, CAL, type Locale } from '@/lib/i18nLabels';

interface Props {
  releaseDate: string;        // 'YYYY-MM-DD'
  approx: boolean;            // 출시일 미확정(예정)
}

interface Dday { text: string; stage: 'today' | 'soon' | 'far'; }

function compute(releaseDate: string, approx: boolean, lang: Locale | null): Dday {
  const tba = lang ? UI[lang].tba : '미정';
  if (approx) return { text: tba, stage: 'far' };
  const diff = calcDayDiff(releaseDate);
  const released = lang ? CAL[lang].released : '출시됨';
  return {
    text: diff < 0 ? released : diff === 0 ? 'D-DAY' : `D-${diff}`,
    stage: diff === 0 ? 'today' : diff > 0 && diff <= 7 ? 'soon' : 'far',
  };
}

// 상세 페이지는 SSG(정적 생성)라 서버에서 D-day를 계산하면 '빌드 시점'에 고정된다.
// 날짜 의존 값을 mount 후 클라에서 계산해 항상 방문 시각 기준으로 정확하게 표시한다.
// 첫 페인트는 미정(approx 제외) → 하이드레이션 불일치 회피(ViewCounter와 동일 규약).
export function DdayBadge({ releaseDate, approx }: Props) {
  const lang = useLocale();
  const tba = lang ? UI[lang].tba : '미정';
  const [dd, setDd] = useState<Dday | null>(approx ? { text: tba, stage: 'far' } : null);

  useEffect(() => {
    setDd(compute(releaseDate, approx, lang));
  }, [releaseDate, approx, lang]);

  if (!dd) return null; // mount 전(날짜 미확정) — 채워지면 표시

  return <span className={`dday-badge dday-${dd.stage}`}>{dd.text}</span>;
}
