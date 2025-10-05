import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import { apiDelete, apiGet, apiPost } from './api';
import { Idea, IdeasResponse } from './types';
import IdeaList from './components/IdeaList';
import { useOnline } from './hooks/useOnline';
import { Toast, ToastContainer } from './components/Toast';

export default function App() {
  //!useStates
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votesUsed, setVotesUsed] = useState(0);
  const [loadingById, setLoadingById] = useState<Record<number, boolean>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const votesLimit = 10;

  //!customHooks
  const isOnline = useOnline();
  const sortedIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => b.voteCount - a.voteCount || a.id - b.id);
  }, [ideas]);

  //!useEffects
  async function loadIdeas() {
    try {
      setError(null);
      setLoading(true);
      const data = await apiGet<IdeasResponse>('/ideas');
      setIdeas(data.items);
      setVotesUsed(data.votesUsed);
    } catch (e: any) {
      const msg = e?.message || 'Ошибка загрузки';
      setError(msg);
      pushToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIdeas();
  }, []);

  async function handleVote(id: number) {
    try {
      setError(null);
      setLoadingById((m) => ({ ...m, [id]: true }));
      const res = await apiPost<{ id: number; voteCount: number; votesUsed: number }>(
        `/ideas/${id}/vote`
      );
      setIdeas((prev) =>
        prev.map((it) => (it.id === id ? { ...it, voteCount: res.voteCount, hasVoted: true } : it))
      );
      setVotesUsed(res.votesUsed);
      pushToast('Голос учтён', 'success');
    } catch (e: any) {
      const code = e.code as string | undefined;
      const msg =
        code === 'ALREADY_VOTED'
          ? 'Вы уже голосовали за эту идею'
          : code === 'VOTE_LIMIT_REACHED'
          ? 'Лимит в 10 голосов исчерпан'
          : e?.message || 'Ошибка голосования';
      setError(msg);
      pushToast(msg, 'error');
    } finally {
      setLoadingById((m) => ({ ...m, [id]: false }));
    }
  }

  async function handleUnvote(id: number) {
    try {
      setError(null);
      setLoadingById((m) => ({ ...m, [id]: true }));
      const res = await apiDelete<{ id: number; voteCount: number; votesUsed: number }>(
        `/ideas/${id}/vote`
      );
      setIdeas((prev) =>
        prev.map((it) => (it.id === id ? { ...it, voteCount: res.voteCount, hasVoted: false } : it))
      );
      setVotesUsed(res.votesUsed);
      pushToast('Голос отозван', 'success');
    } catch (e: any) {
      const msg = e?.message || 'Ошибка удаления голоса';
      setError(msg);
      pushToast(msg, 'error');
    } finally {
      setLoadingById((m) => ({ ...m, [id]: false }));
    }
  }

  function pushToast(message: string, type: Toast['type']) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((list) => [...list, { id, type, message }]);
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3500);
  }

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Header offline={!isOnline} />
      <div className="mb-4 text-sm text-gray-700 dark:text-neutral-300">
        Ваши голоса: {votesUsed}/{votesLimit}
      </div>
      <IdeaList
        ideas={sortedIdeas}
        onVote={handleVote}
        onUnvote={handleUnvote}
        votesUsed={votesUsed}
        votesLimit={votesLimit}
        loadingById={loadingById}
        offline={!isOnline}
      />
      <ToastContainer toasts={toasts} onClose={(id) => setToasts((l) => l.filter((t) => t.id !== id))} />
    </div>
  );
}

