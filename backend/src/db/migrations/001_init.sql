CREATE TABLE IF NOT EXISTS ideas (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  voter_ip INET NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (idea_id, voter_ip)
);

CREATE INDEX IF NOT EXISTS idx_votes_voter_ip ON votes(voter_ip);
CREATE INDEX IF NOT EXISTS idx_votes_idea_id ON votes(idea_id);

