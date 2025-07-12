import Tag from '../models/Tag.js';

// @route GET /api/tags
// @desc  Get all tags
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find({}).sort({ usageCount: -1 }); // optional sort
        res.status(200).json(tags);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tags' });
    }
};

// @route POST /api/tags
// @desc  Create a new tag (admin/user with rights)
const createTag = async (req, res) => {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: 'Tag name is required' });

    try {
        const existing = await Tag.findOne({ name: name.trim() });

        if (existing) {
            return res.status(400).json({ message: 'Tag already exists' });
        }

        const tag = await Tag.create({ name, description });

        res.status(201).json(tag);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create tag' });
    }
};

export { getAllTags, createTag };
