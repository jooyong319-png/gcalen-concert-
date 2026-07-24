// 프레임워크 비의존 토스트 싱글톤 — useSyncExternalStore로 구독.
export interface ToastAction { label: string; onClick: () => void; }
export interface ToastData { message: string; action?: ToastAction; }

let current: ToastData | null = null;
let token = 0;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach(l => l());
}

// action이 있으면 버튼이 달린 토스트(예: 첫 찜 후 "알림 켜기"). 결정이 필요하니 지속시간을 넉넉히 준다.
export function showToast(message: string, ms = 1800, action?: ToastAction): void {
  current = { message, action };
  const my = ++token;
  emit();
  setTimeout(() => {
    if (my === token) {
      current = null;
      emit();
    }
  }, ms);
}

export function dismissToast(): void {
  current = null;
  token++; // 대기 중인 자동 해제 타이머 무효화
  emit();
}

export function subscribeToast(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getToast(): ToastData | null {
  return current;
}
