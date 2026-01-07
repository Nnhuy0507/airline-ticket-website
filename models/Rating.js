const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, trim: true, lowercase: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  message: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
