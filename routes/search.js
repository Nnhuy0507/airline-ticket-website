const express = require('express');
const router = express.Router();
const Airline = require('../models/Airline');
const Hotel = require('../models/Hotel');

router.get('/', (req, res) => {
    const user = req.user;
    res.render("pages/client/search", { user });
});

// Lấy danh sách hãng bay
router.get('/airlines', async (req, res) => {
    try {
        const airlines = await Airline.find().sort({ airline_name: 1 });
        res.json(airlines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Lấy danh sách city khách sạn
router.get('/hotel-cities', async (req, res) => {
    try {
        const cities = await Hotel.distinct('city');
        res.json(cities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
