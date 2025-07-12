import Notification from '../models/Notification.js';

// @route GET /api/notifications
// @desc  Get current user's notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ isRead: 1, createdAt: -1 }) // unread first, then latest
            .limit(20)
            .populate('fromUser', 'username')
            .populate('questionId', 'title')
            .populate('answer', '_id');

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

// @route PATCH /api/notifications/:id/read
// @desc  Mark a notification as read
const markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findOne({
            _id: id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update notification' });
    }
};

export { getNotifications, markAsRead };
