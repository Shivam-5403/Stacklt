import express from 'express';
import {
    createQuestion,
    getAllQuestions,
    getQuestionById
} from '../controllers/questionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/questions
router.get('/', getAllQuestions);

// GET /api/questions/:id
router.get('/:id', getQuestionById);

// POST /api/questions
router.post('/', protect, createQuestion);

export default router;
