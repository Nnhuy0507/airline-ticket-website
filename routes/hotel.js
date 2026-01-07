// routes/hotels.js
const express = require('express');
const route = express.Router();
const Hotel = require('../models/Hotel');  // Thêm model
const hotelController = require('../controllers/HotelController'); 
 

route.get('/:city', hotelController.getHotelsByCity);



module.exports = route;