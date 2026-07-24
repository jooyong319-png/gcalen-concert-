'use client';
import { useSyncExternalStore } from 'react';
import { subscribeToast, getToast, dismissToast } from '@/lib/toast';

export function Toaster() {
  const toast = useSyncExternalStore(subscribeToast, getToast, () => null);
  return (
    <div className="toast-wrap" aria-live="polite" aria-atomic="true">
      {toast && (
        <div className="toast" role="status">
          <span className="toast-msg">{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              className="toast-action"
              onClick={() => { toast.action!.onClick(); dismissToast(); }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
