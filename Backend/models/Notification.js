// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['answer', 'comment', 'mention'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true });

notificationSchema.pre('validate', function(next) {
  if (this.type === 'answer' && !this.answer) {
    return next(new Error('Notifications of type "answer" must include an answer ID.'));
  }
  if (this.type === 'comment' && !this.answer) {
    return next(new Error('Notifications of type "comment" must include an answer ID.'));
  }
  if (this.type === 'mention' && !this.question && !this.answer) {
    return next(new Error('Notifications of type "mention" must include a target question or answer.'));
  }
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
