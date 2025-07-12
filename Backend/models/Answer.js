// models/Answer.js
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    voters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;
