import { Idea } from '../types';
import IdeaCard from './IdeaCard';

type Props = {
  ideas: Idea[];
  onVote: (id: number) => void;
  onUnvote: (id: number) => void;
  votesUsed: number;
  votesLimit: number;
  loadingById?: Record<number, boolean>;
  offline?: boolean;
};

export default function IdeaList({ ideas, onVote, onUnvote, votesUsed, votesLimit, loadingById = {}, offline }: Props) {
  const disableNewVotes = votesUsed >= votesLimit;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onVote={onVote}
          onUnvote={onUnvote}
          disableNewVotes={disableNewVotes}
          loading={!!loadingById[idea.id]}
          offline={offline}
        />
      ))}
    </div>
  );
}

