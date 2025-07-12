// models/Question.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, // HTML from rich text
        required: true
    },
    tags: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer'
        }
    ],
    acceptedAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;
