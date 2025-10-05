import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ErrorBanner from "./components/ErrorBanner";
import { apiDelete, apiGet, apiPost } from "./api";
import { Idea, IdeasResponse } from "./types";
import IdeaList from "./components/IdeaList";

export default function App() {
  //!useStates
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votesUsed, setVotesUsed] = useState(0);
  const votesLimit = 10;

  //!customHooks
  const sortedIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => b.voteCount - a.voteCount || a.id - b.id);
  }, [ideas]);

  //!useEffects
  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<IdeasResponse>("/ideas");
        setIdeas(data.items);
        setVotesUsed(data.votesUsed);
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleVote(id: number) {
    try {
      setError(null);
      const res = await apiPost<{ id: number; voteCount: number; votesUsed: number }>(`/ideas/${id}/vote`);
      setIdeas((prev) => prev.map((it) => (it.id === id ? { ...it, voteCount: res.voteCount, hasVoted: true } : it)));
      setVotesUsed(res.votesUsed);
    } catch (e: any) {
      const code = e.code as string | undefined;
      if (code === "ALREADY_VOTED") setError("Вы уже голосовали за эту идею");
      else if (code === "VOTE_LIMIT_REACHED") setError("Лимит в 10 голосов исчерпан");
      else setError(e.message || "Ошибка голосования");
    }
  }

  async function handleUnvote(id: number) {
    try {
      setError(null);
      const res = await apiDelete<{ id: number; voteCount: number; votesUsed: number }>(`/ideas/${id}/vote`);
      setIdeas((prev) => prev.map((it) => (it.id === id ? { ...it, voteCount: res.voteCount, hasVoted: false } : it)));
      setVotesUsed(res.votesUsed);
    } catch (e: any) {
      setError(e.message || "Ошибка удаления голоса");
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Header />
      {error && <ErrorBanner message={error} />}
      <div className="mb-4 text-sm text-gray-700 dark:text-neutral-300">
        Ваши голоса: {votesUsed}/{votesLimit}
      </div>
      <IdeaList
        ideas={sortedIdeas}
        onVote={handleVote}
        onUnvote={handleUnvote}
        votesUsed={votesUsed}
        votesLimit={votesLimit}
      />
    </div>
  );
}
