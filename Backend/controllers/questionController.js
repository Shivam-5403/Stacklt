import Question from '../models/Questions.js';
import Tag from '../models/Tag.js';
import Answer from '../models/Answer.js';

// @route POST /api/questions
const createQuestion = async (req, res) => {
    const { title, description, tags } = req.body;

    if (!title || !description || !tags || tags.length === 0) {
        return res.status(400).json({ message: 'Title, description, and at least one tag are required' });
    }

    try {
        // Validate tag IDs
        const existingTags = await Tag.find({ _id: { $in: tags } });
        if (existingTags.length !== tags.length) {
            return res.status(400).json({ message: 'One or more tags are invalid' });
        }

        const question = await Question.create({
            title,
            description,
            tags,
            author: req.user._id
        });

        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating question' });
    }
};

// @route GET /api/questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({})
            .sort({ createdAt: -1 })
            .populate('author', 'username')
            .populate('tags', 'name slug');

        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching questions' });
    }
};

// @route GET /api/questions/:id
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'answers',
                populate: { path: 'author', select: 'username' },
                options: { sort: { createdAt: -1 } }
            })
            .populate('tags', 'name slug');

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching question' });
    }
};

export { createQuestion, getAllQuestions, getQuestionById };
