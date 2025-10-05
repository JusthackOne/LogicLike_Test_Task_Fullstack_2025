export type Idea = {
  id: number;
  title: string;
  description: string;
  voteCount: number;
  hasVoted: boolean;
};

export type IdeasResponse = {
  items: Idea[];
  votesUsed: number;
  votesLimit: number;
};

