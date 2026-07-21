// 프레임워크 비의존 토스트 싱글톤 — useSyncExternalStore로 구독.
let current: string | null = null;
let token = 0;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach(l => l());
}

export function showToast(message: string, ms = 1800): void {
  current = message;
  const my = ++token;
  emit();
  setTimeout(() => {
    if (my === token) {
      current = null;
      emit();
    }
  }, ms);
}

export function subscribeToast(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getToast(): string | null {
  return current;
}
