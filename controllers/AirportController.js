const airportService = require('../services/AirportService');


class AirportController {
    async getAllAirport(req, res, next) {
        try {
            const airports = await airportService.getAllAirport();
            return airports; 
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
    async getAirportById(id) {
        try {
            const airport = await airportService.getAirportById(id);
            return airport; 
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
}



module.exports = new AirportController;