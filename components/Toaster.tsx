'use client';
import { useSyncExternalStore } from 'react';
import { subscribeToast, getToast } from '@/lib/toast';

export function Toaster() {
  const msg = useSyncExternalStore(subscribeToast, getToast, () => null);
  return (
    <div className="toast-wrap" aria-live="polite" aria-atomic="true">
      {msg && <div className="toast" role="status">{msg}</div>}
    </div>
  );
}
