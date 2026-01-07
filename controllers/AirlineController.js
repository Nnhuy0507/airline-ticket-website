const airlineService = require('../services/AirlineService')

class AirlineController {
    getAllAirline(req, res, next) {
        airlineService.getAllAirlines()
            .then((airlines) => {
                res.status(200).json({ message: "ok", data: airlines });//api
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            });
    }
}


module.exports = new AirlineController;