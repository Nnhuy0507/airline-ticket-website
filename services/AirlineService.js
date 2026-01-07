const airline = require('../models/Airline');
const {multipleMongooseToObject} = require('../util/mongoose');
const {mongooseToObject} = require('../util/mongoose')
class AirlineService {
    getAllAirlines = () => {
        return airline.find({})
            .then((airlines) => {
                return multipleMongooseToObject(airlines);
            })
            .catch((error) => {
                throw error;
            });
    }
    getAirlineById = async (id) => {
        try {
          const airlineDatas = await airline.findById(id);
          return mongooseToObject(airlineDatas);
        } catch (error) {
          // console.error(`Error fetching airport by ID: ${error.message}`);
          // throw error; // Rethrow the error or handle it based on your application's needs
        }
      };
}

module.exports = new AirlineService;

