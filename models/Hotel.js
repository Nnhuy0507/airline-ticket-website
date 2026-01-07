const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    name: String,
    city: String,
    address: String,
    description: String,
    rating: Number,
    score: Number,
    reviews: Number,
    price: Number,
    imageURL: String,
    amenities: [String],
});

// module.exports = mongoose.model('Hotel', HotelSchema);
module.exports = mongoose.model('Hotel', HotelSchema, 'hotel');

