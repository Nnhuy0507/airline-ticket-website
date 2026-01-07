const Rating = require('../models/Rating');

class RatingService {
    static async addRating(data) {
        const rating = new Rating(data);
        return rating.save();
    }

    static async getAllRatings() {
        return Rating.find().sort({ createdAt: -1 });
    }
}

module.exports = RatingService;
