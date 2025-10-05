type Props = { message: string; onClose?: () => void };

export default function ErrorBanner({ message, onClose }: Props) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-600/40 dark:bg-red-950 dark:text-red-200">
      <div>{message}</div>
      {onClose && (
        <button
          className="rounded border border-transparent px-2 py-1 text-xs hover:border-red-400 hover:bg-red-100 dark:hover:bg-red-900"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ✕
        </button>
      )}
    </div>
  );
}
