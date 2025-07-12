import express from 'express';
import {
    getAllTags,
    createTag
} from '../controllers/tagController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/tags
router.get('/', getAllTags);

// POST /api/tags
router.post('/', protect, createTag);

export default router;
