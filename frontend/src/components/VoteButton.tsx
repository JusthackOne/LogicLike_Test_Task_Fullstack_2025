import { Button } from './ui/button';

type Props = {
  hasVoted: boolean;
  disabled?: boolean;
  onVote: () => void;
  onUnvote: () => void;
  loading?: boolean;
};

export default function VoteButton({ hasVoted, disabled, onVote, onUnvote }: Props) {
  if (hasVoted) {
    return (
      <Button variant="outline" onClick={onUnvote} disabled={disabled}>
        Отозвать голос
      </Button>
    );
  }
  return (
    <Button onClick={onVote} disabled={disabled}>
      Проголосовать
    </Button>
  );
}

