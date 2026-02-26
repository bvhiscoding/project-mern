const mongoose = require('mongoose');

const questionItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    question: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 2,
        message: 'Each question must have at least 2 options'
      }
    }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  questions: { type: [questionItemSchema], default: [] },
  answers: {
    type: [Number],
    default: [],
    validate: {
      validator: (value) => value.every((item) => Number.isInteger(item) && item >= 0),
      message: 'answers must contain non-negative integers'
    }
  }
}, { timestamps: true });

questionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema);
