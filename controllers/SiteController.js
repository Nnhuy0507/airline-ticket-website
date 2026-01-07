const airportController = require('../controllers/AirportController');
const {mongooseToObject} = require('../util/mongoose');
const ticketService = require('../services/TicketService');
const { multipleMongooseToObject } = require("../util/mongoose");

class SiteController {
    async index(req, res, next) {

      const user = await req.user;
      let airports = await airportController.getAllAirport();
      res.render("pages/client/index", {airports, user: mongooseToObject(user)});
       
    }
    async showPassengerInfo(req,res,next){
        const {
            firstName,lastName,phoneNumber,email,Dob,seatNo
          } = req.body;
        
          const passenger = {
            firstName,lastName,phoneNumber,email,Dob, seatNo
          };
          let seatNoValue = JSON.parse(seatNo);
          passenger.seatNo = seatNoValue;
        const flightData = JSON.parse(req.body.flightData);
        const user = await req.user;
        res.render("pages/client/personal-info-verify", {flightData: flightData, passengerInfo: passenger, user: mongooseToObject(user)});
    }
    async showPaymentBooking(req, res, next){
        const flightData = JSON.parse(req.body.flightData);
        let passengerInfo;
        if(req.body.passengerInfo){
           passengerInfo = JSON.parse(req.body.passengerInfo);
        }
        else{
           passengerInfo = null
           let seatNoValue = JSON.parse(req.body.seatNo);
           flightData.seatNo = seatNoValue;
        }
        const user = await req.user;
        res.render("pages/client/booking-detail", {flightData, passengerInfo, user: mongooseToObject(user)});
    }

async showTicket(req, res) {
    try {
        const ticketId = req.params.ticketId;

        const ticket = await ticketService.getTicketById(ticketId);
        if (!ticket) {
            return res.send("Không tìm thấy vé!");
        }

        const flightData = ticket.flight_id.toObject ? ticket.flight_id.toObject() : ticket.flight_id;
        const user = ticket.user_id;
        const passengerInfo = ticket.passenger_info;

        // Tạo seatNo hiển thị
        let seatNoValue;
        if (passengerInfo && passengerInfo.seatNo) {
            seatNoValue = passengerInfo.seatNo;
        } else if (ticket.seat) {
            seatNoValue = ticket.seat;
        } else {
            seatNoValue = "Chưa có ghế";
        }

        // Gán seatNo + departureDate + departureTime vào flightData
        flightData.seatNo = seatNoValue;

        const dt = new Date(flightData.departure_datetime);
        flightData.departureDate = dt.toLocaleDateString("vi-VN");
        flightData.departureTime = dt.toLocaleTimeString("vi-VN", {
            hour: '2-digit',
            minute: '2-digit'
        });

        res.render("pages/client/ticket-info", {
            ticket,
            flightData,
            passengerInfo,
            user: mongooseToObject(user)
        });

    } catch (error) {
        console.error("SHOW TICKET ERROR:", error);
        res.send("Lỗi hiển thị vé!");
    }
}



    async ticketList(req, res, next) {
      try {
        const user = req.user
        if (user) {
          const ticket_list = await ticketService.getTicketByUser(user._id)
          res.render('pages/client/list-ticket.hbs', {ticket_list: multipleMongooseToObject(ticket_list), user: mongooseToObject(user)})
        } else {
          res.redirect('/')
        }
      } catch (error) {
        throw error
      }
    }

// hiển thị ở trang payment-booking
    // HIỂN THỊ TRANG THANH TOÁN payment-booking
async showPaymentBooking(req, res, next) {

    const flightData = JSON.parse(req.body.flightData);
    // lấy giá từ form gửi lên
    const classPricing = req.body.classPricing;
    const classValue = req.body.classValue;


    let passengerInfo;
    if (req.body.passengerInfo) {
        passengerInfo = JSON.parse(req.body.passengerInfo);
    } else {
        passengerInfo = null;
    }

    // giữ lại giá
    flightData.classPricing = Number(classPricing);
    flightData.classValue = classValue;

    const user = req.user;

    // Tạo mã vé tạm để hiển thị ở trang thanh toán
    const generatedTicketCode = "TCK-" + Date.now();

    // Tổng tiền chuyến bay
    const totalPrice =
          flightData.classPricing
       || flightData.price
       || flightData.class_price
       || 0;

    res.render("pages/client/booking-detail", {
        flightData,
        passengerInfo,
        user: mongooseToObject(user),
        generatedTicketCode,
        totalPrice
    });
}

    
    showAccountPage(req, res) {
    // Lấy thông tin người dùng đã xác thực
    const user = req.user; 
    
    // Render view 'account' và truyền dữ liệu người dùng
    res.render("/account", { 
        title: "Tài khoản của tôi", 
        user: mongooseToObject(user), 
        layout: 'main' 
    });
}
   
}

module.exports = new SiteController;