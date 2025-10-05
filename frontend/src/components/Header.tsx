export default function Header() {
  return (
    <header className="mb-6 border-b border-gray-200 pb-4 dark:border-neutral-800">
      <h1 className="text-2xl font-bold">LogicLike — Идеи развития</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
        Голосуйте за идеи. Ограничение: не более 10 разных идей с одного IP.
      </p>
    </header>
  );
}

