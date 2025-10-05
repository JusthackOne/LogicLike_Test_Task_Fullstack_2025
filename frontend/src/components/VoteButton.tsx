import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

type Props = {
  hasVoted: boolean;
  disabled?: boolean;
  onVote: () => void;
  onUnvote: () => void;
  loading?: boolean;
};

export default function VoteButton({ hasVoted, disabled, onVote, onUnvote, loading }: Props) {
  if (hasVoted) {
    return (
      <Button variant="outline" onClick={onUnvote} disabled={loading || disabled}>
        {loading ? (
          <>
            <Spinner className="mr-2" /> Отзываем...
          </>
        ) : (
          'Отозвать голос'
        )}
      </Button>
    );
  }
  return (
    <Button onClick={onVote} disabled={loading || disabled}>
      {loading ? (
        <>
          <Spinner className="mr-2" /> Голосуем...
        </>
      ) : (
        'Проголосовать'
      )}
    </Button>
  );
}

