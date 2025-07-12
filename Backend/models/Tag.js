// models/Tag.js
import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: 30
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  // You can track how many times this tag has been used
  usageCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Automatically generate slug from name if not provided
tagSchema.pre('validate', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s\W-]+/g, '-');
  }
  next();
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
