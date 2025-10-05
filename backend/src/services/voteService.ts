import { pool } from "../db/pool.js";

export type IdeaWithFlag = {
  id: number;
  title: string;
  description: string;
  voteCount: number;
  hasVoted: boolean;
};

export class ConflictError extends Error {
  code: "ALREADY_VOTED" | "VOTE_LIMIT_REACHED";
  constructor(code: "ALREADY_VOTED" | "VOTE_LIMIT_REACHED", message?: string) {
    super(message || code);
    this.code = code;
  }
}

export class NotFoundError extends Error {}

export async function listIdeasWithVoteFlag(voterIp: string): Promise<IdeaWithFlag[]> {
  const { rows } = await pool.query(
    `SELECT i.id, i.title, i.description, i.vote_count,
            (v.id IS NOT NULL) AS has_voted
       FROM ideas i
  LEFT JOIN votes v
         ON v.idea_id = i.id AND v.voter_ip = $1::inet
   ORDER BY i.vote_count DESC, i.id ASC`,
    [voterIp]
  );
  return rows.map(
    (r: { id: number; title: string; description: string; vote_count: number; has_voted: boolean | null }) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      voteCount: Number(r.vote_count),
      hasVoted: r.has_voted === true,
    })
  );
}

export async function getIdeaOrThrow(id: number) {
  const { rows } = await pool.query("SELECT id, vote_count FROM ideas WHERE id = $1", [id]);
  if (rows.length === 0) throw new NotFoundError("Idea not found");
  return { id: rows[0].id as number, voteCount: Number(rows[0].vote_count) };
}

export async function getTotalVotesForIp(voterIp: string) {
  const { rows } = await pool.query("SELECT COUNT(DISTINCT idea_id) AS cnt FROM votes WHERE voter_ip = $1::inet", [
    voterIp,
  ]);
  return Number(rows[0]?.cnt || 0);
}

export async function voteForIdea(ideaId: number, voterIp: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const idea = await client.query("SELECT 1 FROM ideas WHERE id = $1", [ideaId]);
    if (idea.rows.length === 0) throw new NotFoundError("Idea not found");

    await client.query("SELECT id FROM votes WHERE voter_ip = $1::inet FOR UPDATE", [voterIp]);

    const already = await client.query("SELECT 1 FROM votes WHERE idea_id = $1 AND voter_ip = $2::inet", [
      ideaId,
      voterIp,
    ]);
    if (already.rows.length > 0) {
      throw new ConflictError("ALREADY_VOTED", "Already voted for this idea");
    }

    const totalRes = await client.query("SELECT COUNT(DISTINCT idea_id) AS cnt FROM votes WHERE voter_ip = $1::inet", [
      voterIp,
    ]);
    const total = Number(totalRes.rows[0]?.cnt || 0);
    if (total >= 10) {
      throw new ConflictError("VOTE_LIMIT_REACHED", "Vote limit reached for this IP");
    }

    await client.query("INSERT INTO votes (idea_id, voter_ip) VALUES ($1, $2::inet)", [ideaId, voterIp]);
    await client.query("UPDATE ideas SET vote_count = vote_count + 1 WHERE id = $1", [ideaId]);

    const newCountRes = await client.query("SELECT vote_count FROM ideas WHERE id=$1", [ideaId]);
    const voteCount = Number(newCountRes.rows[0].vote_count);

    await client.query("COMMIT");
    return { voteCount, totalVotesForIp: total + 1 };
  } catch (err: any) {
    await client.query("ROLLBACK");
    if (err?.code === "23505") {
      // unique_violation on (idea_id, voter_ip)
      throw new ConflictError("ALREADY_VOTED", "Already voted for this idea");
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function removeVote(ideaId: number, voterIp: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const idea = await client.query("SELECT 1 FROM ideas WHERE id = $1", [ideaId]);
    if (idea.rows.length === 0) throw new NotFoundError("Idea not found");

    const del = await client.query("DELETE FROM votes WHERE idea_id = $1 AND voter_ip = $2::inet RETURNING 1", [
      ideaId,
      voterIp,
    ]);
    if (del.rows.length === 0) {
      throw new NotFoundError("Vote not found for this IP");
    }

    await client.query("UPDATE ideas SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = $1", [ideaId]);
    const newCountRes = await client.query("SELECT vote_count FROM ideas WHERE id=$1", [ideaId]);
    const voteCount = Number(newCountRes.rows[0].vote_count);

    const totalRes = await client.query("SELECT COUNT(DISTINCT idea_id) AS cnt FROM votes WHERE voter_ip = $1::inet", [
      voterIp,
    ]);
    const total = Number(totalRes.rows[0]?.cnt || 0);

    await client.query("COMMIT");
    return { voteCount, totalVotesForIp: total };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
