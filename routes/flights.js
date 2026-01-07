const express = require('express');
const route = express.Router();
const flightController = require('../controllers/FlightController');
const authenticationController = require('../controllers/AuthenticationController');
const siteController = require('../controllers/SiteController');

route.post('/booking-seat', authenticationController.checkNotAuthenticated, flightController.showSeats);

route.post('/flight-detail-booking',authenticationController.checkNotAuthenticated, flightController.showDetailFlightBooking);

route.post('/', authenticationController.checkNotAuthenticated, flightController.getFlightsBySearch);

route.get('/ticket-list', authenticationController.checkNotAuthenticated, siteController.ticketList)

route.get('/airline/:id', (req, res) => {
  const airportId = req.params.id;

  airlineService.getAirlineById()
    .then((airport) => {
      if (!airport) {
        return res.status(404).json({ message: 'Airport not found' });
      }

      res.json(airport); // Send the airport data as a JSON response
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});// api

route.get('/airport/:id', (req, res) => {
    const airportId = req.params.id;
  
    airportService.getAirportById(airportId)
      .then((airport) => {
        if (!airport) {
          return res.status(404).json({ message: 'Airport not found' });
        }
  
        res.json(airport); // Send the airport data as a JSON response
      })
      .catch((error) => {
        res.status(500).json({ error: 'An error occurred' });
      });
  });



module.exports = route;