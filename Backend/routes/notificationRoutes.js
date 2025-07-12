import express from 'express';
import {
    getNotifications,
    markAsRead
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/notifications
router.get('/', protect, getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', protect, markAsRead);

export default router;
