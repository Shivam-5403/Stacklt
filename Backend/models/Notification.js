// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['answer', 'comment', 'mention'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    answerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
