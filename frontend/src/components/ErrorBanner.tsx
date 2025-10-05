type Props = { message: string };

export default function ErrorBanner({ message }: Props) {
  return (
    <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-600/40 dark:bg-red-950 dark:text-red-200">
      {message}
    </div>
  );
}
