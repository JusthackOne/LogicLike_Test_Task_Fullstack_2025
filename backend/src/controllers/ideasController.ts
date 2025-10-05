import { Request, Response } from 'express';
import { z } from 'zod';
import { getClientIp } from '../utils/ip.js';
import {
  ConflictError,
  NotFoundError,
  listIdeasWithVoteFlag,
  voteForIdea,
  removeVote,
  IdeaWithFlag,
} from '../services/voteService.js';

const idParamSchema = z.object({ id: z.string().regex(/^\d+$/).transform(Number) });

export async function getIdeas(req: Request, res: Response) {
  const ip = getClientIp(req);
  const ideas: IdeaWithFlag[] = await listIdeasWithVoteFlag(ip);
  const votesUsed = ideas.filter((i: IdeaWithFlag) => i.hasVoted).length;
  return res.json({ items: ideas, votesUsed, votesLimit: 10 });
}

export async function postVote(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const ip = getClientIp(req);
  try {
    const result = await voteForIdea(id, ip);
    return res.status(201).json({
      id,
      voteCount: result.voteCount,
      hasVoted: true,
      votesUsed: result.totalVotesForIp,
      votesLimit: 10,
    });
  } catch (err: any) {
    if (err instanceof ConflictError) {
      return res.status(409).json({
        error: err.code,
        message: err.message,
      });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: 'NOT_FOUND', message: err.message });
    }
    throw err;
  }
}

export async function deleteVote(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const ip = getClientIp(req);
  try {
    const result = await removeVote(id, ip);
    return res.status(200).json({
      id,
      voteCount: result.voteCount,
      hasVoted: false,
      votesUsed: result.totalVotesForIp,
      votesLimit: 10,
    });
  } catch (err: any) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: 'NOT_FOUND', message: err.message });
    }
    throw err;
  }
}
