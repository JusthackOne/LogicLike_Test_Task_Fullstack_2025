import { Router } from "express";
import { deleteVote, getIdeas, postVote } from "../controllers/ideasController.js";

const router = Router();

router.get("/", getIdeas);
router.post("/:id/vote", postVote);
router.delete("/:id/vote", deleteVote);

export default router;
