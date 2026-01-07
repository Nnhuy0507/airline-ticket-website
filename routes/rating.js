const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

router.get('/list', async (req, res) => {
  try {
    const list = await Rating.find().sort({ createdAt: -1 });

    const total = list.length;

    let avg = 0;
    if (total > 0) {
      avg = list.reduce((sum, item) => sum + item.rating, 0) / total;
    }

    return res.json({
      total,
      average: avg,
      list
    });

  } catch (err) {
    console.error('Error fetching ratings:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// POST /rating  -- lưu đánh giá
router.post('/', async (req, res) => {
  try {
    const { userEmail, rating, message } = req.body;

    if (!userEmail || typeof rating === 'undefined') {
      return res.status(400).json({ error: 'userEmail và rating là bắt buộc' });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      return res.status(400).json({ error: 'rating phải là số từ 0 đến 5' });
    }

    const newRating = new Rating({
      userEmail,
      rating: numericRating,
      message: message || ''
    });

    const saved = await newRating.save();
    return res.status(201).json({ message: 'saved', data: saved });
  } catch (err) {
    console.error('Error saving rating:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
