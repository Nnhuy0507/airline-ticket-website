const express = require('express');
const route = express.Router();
const siteController = require('../controllers/SiteController');
const userController = require('../controllers/UserController');
const authenticationController = require('../controllers/AuthenticationController');
const accessRoute = require('./access')
const ticketService = require("../services/TicketService");
const Ticket = require('../models/Ticket'); 

route.post('/passenger', siteController.showPassengerInfo);

// Route nhận POST từ booking-detail

route.get("/booking-detail/:ticketId", async (req, res) => {
    try {
        const ticketId = req.params.ticketId;

        const ticket = await Ticket.findById(ticketId)
            .populate("flight_id")
            .populate("airline_id")
            .populate("user_id");

        if (!ticket) {
            return res.send("Không tìm thấy vé!");
        }

        // ⭐ LẤY GIÁ TỪ QUERY
        let totalPrice = Number(req.query.price);
        console.log("PRICE QUERY:", req.query.price);
        console.log("TOTAL PRICE PARSED:", totalPrice);

        if (isNaN(totalPrice)) {
            totalPrice = 0;
        }

        res.render("pages/client/booking-detail", {
            ticket,
            flightData: ticket.flight_id,
            user: ticket.user_id,
            totalPrice
        });

    } catch (error) {
        console.error("Lỗi load booking-detail:", error);
        res.send("Lỗi server");
    }
});


// route.post('/ticket-info', siteController.showTicket);
route.get("/ticket-info/:ticketId", siteController.showTicket);

route.get('/ticket-list', authenticationController.checkNotAuthenticated, siteController.ticketList)

route.use('/', accessRoute);

module.exports = route;