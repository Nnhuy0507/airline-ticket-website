const RatingService = require('../services/ratingService');

exports.submitRating = async (req, res) => {
    try {
        const { userEmail, stars, review } = req.body;
        if (!userEmail || !stars) {
            return res.status(400).json({ status: 'error', message: 'Email và đánh giá sao là bắt buộc' });
        }

        const savedRating = await RatingService.addRating({ userEmail, stars, review });
        res.json({ status: 'success', data: savedRating });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await RatingService.getAllRatings();
        res.json({ status: 'success', data: ratings });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
