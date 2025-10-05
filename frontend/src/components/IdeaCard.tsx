import { Idea } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import VoteButton from './VoteButton';

type Props = {
  idea: Idea;
  onVote: (id: number) => void;
  onUnvote: (id: number) => void;
  disableNewVotes: boolean;
  loading?: boolean;
  offline?: boolean;
};

export default function IdeaCard({ idea, onVote, onUnvote, disableNewVotes, loading, offline }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{idea.title}</CardTitle>
        <div className="text-sm text-gray-600 dark:text-neutral-400">{idea.voteCount} голосов</div>
      </CardHeader>
      <CardContent>
        <CardDescription>{idea.description}</CardDescription>
        <div className="mt-4">
          <VoteButton
            hasVoted={idea.hasVoted}
            disabled={!idea.hasVoted && (disableNewVotes || !!offline)}
            loading={loading}
            onVote={() => onVote(idea.id)}
            onUnvote={() => onUnvote(idea.id)}
          />
          {!idea.hasVoted && disableNewVotes && (
            <div className="mt-1 text-xs text-gray-500">Лимит голосов исчерпан</div>
          )}
          {offline && (
            <div className="mt-1 text-xs text-gray-500">Вы офлайн — действия недоступны</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

