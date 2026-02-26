const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'Username is required'], trim: true },
  result: {
    type: [Number],
    default: [],
    validate: {
      validator: (value) => value.every((item) => Number.isInteger(item) && item >= -1),
      message: 'result must contain integers greater than or equal to -1'
    }
  },
  attempts: { type: Number, default: 0, min: 0 },
  points: { type: Number, default: 0, min: 0 },
  achieved: { type: String, default: '', trim: true, maxlength: 100 }
}, { timestamps: true });

resultSchema.index({ points: -1, createdAt: -1 });

module.exports = mongoose.model('Result', resultSchema);
