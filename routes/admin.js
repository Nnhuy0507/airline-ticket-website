require("dotenv").config();
const express = require("express");
const route = express.Router();
const AdminController = require("../controllers/AdminController");
const TicketService = require("../services/TicketService");
const MailService = require("../services/MailService");
const chatController = require('../controllers/ChatController');


route.get("/manage-flights", AdminController.manageFlight);
route.get("/manage-airlines", AdminController.manageAirlines);

route.get("/manage-user", AdminController.manageUser);
route.get("/manage-ticket", AdminController.manageTicket);
route.get("/test", AdminController.test);

route.post("/create-flight", AdminController.createFlight);
route.post("/delete-flight", AdminController.deleteFlight);
route.post("/data-flight", AdminController.getFlightData);
route.post("/update-flight", AdminController.updateFlight);

route.post("/create-airline", AdminController.createAirline);
route.post("/delete-airline", AdminController.deleteAirline);
route.post("/data-airline", AdminController.getAirlineData);
route.post("/update-airline", AdminController.updateAirline);

route.post("/delete-user", AdminController.deleteUser);
route.post("/data-user", AdminController.getUserData);
route.post("/update-user", AdminController.updateUser);
route.post("/update-verify", AdminController.updateVerify);

route.post("/delete-ticket", AdminController.deleteTicket);


route.post("/confirm", async (req, res) => {
    try {
        const { ticketId } = req.body;

        // 1. update trạng thái vé
        await TicketService.updateStatus(ticketId, "paid");

        // 2. lấy thông tin vé kèm user
        const ticket = await TicketService.getTicketById(ticketId);

        // 3. email người dùng
        const email = ticket.user_id.email;

        // 4. gửi email nếu có
        if (email) {
            await MailService.sendPaymentSuccess(email, ticketId);
            console.log("Email sent to:", email);
        } else {
            console.log("Ticket has no email field!");
        }

        return res.json({ success: true });

    } catch (err) {
        console.error("CONFIRM ERROR:", err);
        return res.status(500).json({ success: false });
    }
});

route.get('/chat-management', chatController.getChatUsers);

// trả về trạng thái đã thanh toán
route.get("/status/:ticketId", async (req, res) => {
    const ticket = await TicketService.getTicketById(req.params.ticketId);
    res.json({ status: ticket.status });
});


module.exports = route;
