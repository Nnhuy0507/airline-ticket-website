const airport = require('../models/Airport');
const {multipleMongooseToObject} = require('../util/mongoose');
const {mongooseToObject} = require('../util/mongoose');
class AirportService {
    getAllAirport = () => {
        return airport.find({})
            .then((airports) => {
                return multipleMongooseToObject(airports);
            })
            .catch((error) => {
                throw error;
            });
    }
    getAirportById = async (id) => {
        try {
          const airportDatas = await airport.findById(id);
      
          return mongooseToObject(airportDatas);
        } catch (error) {
         
        }
      };
}

module.exports = new AirportService;

