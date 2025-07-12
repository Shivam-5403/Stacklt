import express from 'express';
import {
    addAnswer,
    voteAnswer,
    acceptAnswer
} from '../controllers/answerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/answers/:questionId
router.post('/:questionId', protect, addAnswer);

// POST /api/answers/:answerId/vote
router.post('/:answerId/vote', protect, voteAnswer);

// PATCH /api/answers/:answerId/accept
router.patch('/:answerId/accept', protect, acceptAnswer);

export default router;
