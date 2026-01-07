const flightServices = require('../services/FlightService')
const airlineService = require('../services/AirlineService');
const airportService = require('../services/AirportService');
const {mongooseToObject} = require('../util/mongoose');
const Ticket = require("../models/Ticket");

class FlightController {
    async getFlightsBySearch(req, res, next) {
        try {
            const airportDeparture = await airportService.getAirportById(req.body.departure_airport_id);
            const airportArrival = await airportService.getAirportById(req.body.arrival_airport_id);
            const flights = await flightServices.getFlightsBySearch(req, res, next);

            for (const flight of flights) {
                const airline = await airlineService.getAirlineById(flight.airline_id);
                flight.airlineInfo = airline;
                flight.from = airportDeparture;
                flight.to = airportArrival;
            }
            const airlines = await airlineService.getAllAirlines(req,res,next);
           
            const formData = req.body;
            formData.from = airportDeparture;
            formData.to = airportArrival;

            const user = await req.user;
            res.render('pages/client/flights-listing', {formData: formData, flights: flights, airlines: airlines, user: mongooseToObject(user)});
           
        } catch (error) {
            console.error(error);
            throw error; 
        }
    };
    // async showSeats(req, res, next) {
    //     const user = await req.user;
    //     res.render('pages/client/booking-seat',{flightData: JSON.parse(req.body.flightData), class: JSON.parse(req.body.inputData).class, user: mongooseToObject(user)});
    // }
    async showSeats(req, res, next) {
    try {
        console.log("---- SHOW SEATS ----");
        console.log("req.body.flightData =", req.body.flightData);
        console.log("req.body.inputData =", req.body.inputData);
        const user = await req.user;

        const flightData = JSON.parse(req.body.flightData);
        const inputData = JSON.parse(req.body.inputData);

        // ⭐ Lấy tất cả ghế đã đặt của chuyến bay
        const tickets = await Ticket.find({ flight_id: flightData._id });

        // ⭐ Trích ra danh sách mã ghế: ["A1", "A2", "B3", ...]
        const bookedSeats = tickets.map(t => t.seat);

        console.log("BOOKED SEATS:", bookedSeats);

        res.render("pages/client/booking-seat", {
            flightData,
            class: inputData.class,
            bookedSeats,  // ⭐ TRUYỀN BIẾN NÀY SANG VIEW
            user: mongooseToObject(user)
        });

    } catch (err) {
        console.error("ERROR showSeats:", err);
        next(err);
    }
}

    async showDetailFlightBooking(req,res,next){
        const seat = req.body.seat;
        const classPricing = req.body.class;
        const flightData = JSON.parse(req.body.flightData);
        flightData.classValue = String(classPricing);
        if (classPricing == "Phổ Thông"){
            flightData.classPricing = flightData.economy_price;
        }   
        else{
            flightData.classPricing = flightData.business_price;
        }   
        const user = await req.user;
        res.render('pages/client/flight-booking-detail', {flightData: flightData, seatNo: seat, user: mongooseToObject(user)});
    }

//     async getFlightsBySearch(req, res, next) {
//     try {
//         // Lấy dữ liệu từ cả 2 nguồn để đảm bảo không mất thông tin khi lọc
//         const searchData = { ...req.body, ...req.query };
        
//         const airportDeparture = await airportService.getAirportById(searchData.departure_airport_id);
//         const airportArrival = await airportService.getAirportById(searchData.arrival_airport_id);
        
//         // FlightService sẽ xử lý logic lọc theo airlineIds trong query
//         const flights = await flightServices.getFlightsBySearch(req, res, next);

//         // ... logic gán airlineInfo giữ nguyên ...

//         res.render('pages/client/flights-listing', {
//             formData: searchData, // Để giữ lại các giá trị đã nhập trên form
//             flights: flights,
//             airlines: await airlineService.getAllAirlines(req,res,next),
//             selectedAirlines: searchData.airlineIds || [], // Truyền mảng ID đã chọn để checkbox giữ trạng thái 'checked'
//             user: mongooseToObject(await req.user)
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// }

}

module.exports = new FlightController;