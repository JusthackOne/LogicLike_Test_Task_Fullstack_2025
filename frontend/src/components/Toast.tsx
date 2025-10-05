import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

export function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: number) => void }) {
  const base = 'pointer-events-auto mb-2 flex items-start gap-3 rounded-md border p-3 shadow-lg';
  const colorByType: Record<ToastType, string> = {
    success: 'border-green-300 bg-green-50 text-green-900 dark:border-green-700/40 dark:bg-green-950 dark:text-green-100',
    error:
      'border-red-300 bg-red-50 text-red-900 dark:border-red-700/40 dark:bg-red-950 dark:text-red-100',
    info: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700/40 dark:bg-blue-950 dark:text-blue-100',
  };
  return (
    <div className={`${base} ${colorByType[toast.type]}`} role="status" aria-live="polite">
      <div className="flex-1 text-sm">{toast.message}</div>
      <button
        className="rounded px-2 text-xs opacity-80 hover:opacity-100"
        aria-label="Закрыть"
        onClick={() => onClose(toast.id)}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: Toast[];
  onClose: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}

