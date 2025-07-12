import Answer from '../models/Answer.js';
import Question from '../models/Questions.js';
import Notification from '../models/Notification.js';

// @route POST /api/answers/:questionId
const addAnswer = async (req, res) => {
    const { content } = req.body;
    const { questionId } = req.params;

    if (!content) {
        return res.status(400).json({ message: 'Answer content is required' });
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const answer = await Answer.create({
            content,
            author: req.user._id,
            question: questionId
        });

        question.answers.push(answer._id);
        await question.save();

        // Send notification to question author
        if (!req.user._id.equals(question.author)) {
            await Notification.create({
                type: 'answer',
                user: question.author,
                fromUser: req.user._id,
                questionId,
                answer: answer._id,
                message: `${req.user.username} answered your question.`
            });
        }

        res.status(201).json(answer);
    } catch (err) {
        res.status(500).json({ message: 'Server error while adding answer' });
    }
};

// @route POST /api/answers/:answerId/vote
const voteAnswer = async (req, res) => {
    const { answerId } = req.params;
    const { voteType } = req.body; // voteType: "up" or "down"

    try {
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        const hasVoted = answer.voters.includes(req.user._id);

        if (hasVoted) {
            // Remove vote
            answer.voters.pull(req.user._id);
            answer.votes -= 1;
        } else {
            // Add vote
            answer.voters.push(req.user._id);
            answer.votes += 1;
        }

        await answer.save();
        res.status(200).json({ votes: answer.votes, voted: !hasVoted });
    } catch (err) {
        res.status(500).json({ message: 'Server error while voting' });
    }
};

// @route PATCH /api/answers/:answerId/accept
const acceptAnswer = async (req, res) => {
    const { answerId } = req.params;

    try {
        const answer = await Answer.findById(answerId).populate('question');
        if (!answer) return res.status(404).json({ message: 'Answer not found' });

        const question = await Question.findById(answer.question._id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        // Only question author can accept
        if (!question.author.equals(req.user._id)) {
            return res.status(403).json({ message: 'Only the question author can accept an answer' });
        }

        question.acceptedAnswer = answer._id;
        await question.save();

        res.status(200).json({ message: 'Answer accepted', answerId: answer._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error while accepting answer' });
    }
};

export { addAnswer, voteAnswer, acceptAnswer };
