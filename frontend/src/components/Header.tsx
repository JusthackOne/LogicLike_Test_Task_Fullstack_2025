export default function Header({ offline, inFlightCount = 0 }: { offline?: boolean; inFlightCount?: number }) {
  return (
    <header className="mb-6 border-b border-gray-200 pb-4 dark:border-neutral-800">
      <h1 className="text-2xl font-bold">LogicLike — Идеи развития</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
        Голосуйте за идеи. Ограничение: не более 10 разных идей с одного IP.
      </p>
      <div className="mt-2 flex gap-2 text-sm">
        {offline && (
          <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200">
            Офлайн: действия временно недоступны
          </span>
        )}
        {inFlightCount > 0 && (
          <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200">
            Выполняется запросов: {inFlightCount}
          </span>
        )}
      </div>
    </header>
  );
}
