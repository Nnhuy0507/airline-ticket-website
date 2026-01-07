const { convertTimetoAsiaHCM } = require('../util/datetimeConvert')
const flight = require('../models/Flight');
class FlightService {
  getAllFlights = () => {
    return flight.find({}).populate('airline_id').populate('departure_airport_id').populate('arrival_airport_id')
      .then((flights) => {
        return flights;
      })
      .catch((error) => {
        throw error;
      });
  }
  getFlightsBySearch = (req, res, next) => {
    const startDate = req.body.departure_datetime;
    return flight.find({
      departure_airport_id: req.body.departure_airport_id,
      arrival_airport_id: req.body.arrival_airport_id,
    })
      .then((flights) => {
        const formattedFlights = flights.map((flight) => {
          const departureDatetimeFormatted = convertTimetoAsiaHCM(flight.departure_datetime);
          const arrivalDatetimeFormatted = convertTimetoAsiaHCM(flight.arrival_datetime);
          return {
            ...flight.toObject(),
            departure_datetime: departureDatetimeFormatted,
            arrival_datetime: arrivalDatetimeFormatted,
          };
        });
        const resultFlights = formattedFlights.filter((flight) => {
          const flightDepartureDate = flight.departure_datetime;
          if (flightDepartureDate.includes(startDate)) {
            return flight;
          }
        });
        return resultFlights;
      })
      .catch((error) => {
        throw error;
      });
  }

  getFlightById = (id) => {
    try {
        return flight.findById(id).exec()
    } catch (error) {
      throw error
    }
  }
}

module.exports = new FlightService;

