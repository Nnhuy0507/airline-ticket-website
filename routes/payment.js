const express = require("express");
const route = express.Router();
const PaymentController = require("../controllers/PaymentController");
const ticketService = require("../services/TicketService");
const flightService = require("../services/FlightService");
const authenticationController = require("../controllers/AuthenticationController");
const Flight = require("../models/Flight");
const Ticket = require("../models/Ticket");

// API tạo QR MoMo
route.post("/momo-qr", PaymentController.momoQR);

// API nhận thông báo thanh toán từ MoMo
route.post("/momo-ipn", (req, res) => {
    try {
        console.log("📩 Nhận IPN từ MoMo:", req.body);

        if (req.body.resultCode === 0) {
            console.log("🎉 Thanh toán thành công. orderId:", req.body.orderId);

            // TODO: Lưu DB, update trạng thái vé
            return res.status(200).send("OK");
        }

        console.log("❌ Thanh toán thất bại:", req.body.message);
        return res.status(200).send("FAILED");

    } catch (err) {
        console.error("❌ Lỗi IPN:", err);
        return res.status(500).send("ERROR");
    }
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    console.log("❌ User chưa đăng nhập.");
    return res.redirect("/login");
}

route.post("/create-ticket", async (req, res) => {
    try {
        const flightData = JSON.parse(req.body.flightData);
        const seatNo     = req.body.seatNo;
        const price      = Number(req.body.classPricing);
        const classType  = req.body.classValue;

        

        const ticket = await ticketService.createTicket({
            airline_id: flightData.airline_id,
            flight_id: flightData._id,
            user_id: req.user._id,
            seat: seatNo,
            ticket_class: classType,
            price: price,
            status: "unpaid"
        });

        // return res.redirect("/booking-detail/" + ticket._id);
        return res.redirect(`/booking-detail/${ticket._id}?price=${price}`);


    } catch (err) {
        console.error("❌ ERROR CREATE TICKET:", err);
        return res.status(500).send("Server error");
    }
});



// route.get("/booking-detail/:ticketId", async (req, res) => {
//     try {
//         const ticket = await Ticket.findById(req.params.ticketId)
//             .populate("airline_id")
//             .populate("user_id")
//             .populate({
//                 path: "flight_id",
//                 populate: [
//                     { path: "departure_airport_id" },
//                     { path: "arrival_airport_id" }
//                 ]
//             });

//         if (!ticket) return res.send("Không tìm thấy vé!");

//         // ⭐ GIÁ TRUYỀN TỪ TRANG TRƯỚC
//         let totalPrice = req.query.price;

//         console.log("🔍 PRICE FROM QUERY:", totalPrice);

//         // ⭐ CHUYỂN THÀNH SỐ
//         totalPrice = parseInt(totalPrice);

//         console.log("🔍 PRICE AFTER PARSE:", totalPrice);

//         // Nếu vẫn NaN thì gán 0
//         if (isNaN(totalPrice)) totalPrice = 0;

//         res.render("pages/client/booking-detail", {
//             ticket,
//             flightData: ticket.flight_id,
//             airlineData: ticket.airline_id,
//             user: ticket.user_id,
//             totalPrice      // ⭐ GỬI SANG VIEW HBS
//         });

//     } catch (err) {
//         console.error("❌ ERROR:", err);
//         res.send("Lỗi server");
//     }
// });




//xử lý yêu cầu xác nhận thanh toán của ng dùng
route.post("/pending", async (req, res) => {
    try {
        const { ticketId } = req.body;

        const updated = await ticketService.updateStatus(ticketId, "pending");

        return res.json({ success: true, ticket: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
});

//ử lý xác nhận thanh toán
// route.post("/confirm", async (req, res) => {
//     try {
//         const { ticketId } = req.body;

//         const updated = await ticketService.updateStatus(ticketId, "paid");

//         res.json({ success: true, ticket: updated });
//     } catch (err) {
//         console.error(err);
//         res.json({ success: false });
//     }
// });
route.post("/confirm", async (req, res) => {
    try {
        const { ticketId } = req.body;

        // 1. Cập nhật trạng thái ticket sang paid
        await ticketService.updateStatus(ticketId, "paid");

        // 2. Lấy ticket + email người dùng từ populate
        const ticket = await ticketService.getTicketById(ticketId);

        if (!ticket || !ticket.user_id || !ticket.user_id.email) {
            return res.json({ success: false, message: "Không tìm thấy email người dùng" });
        }

        const userEmail = ticket.user_id.email;

        // 3. Gửi email thông báo thanh toán
        await MailService.sendPaymentSuccess(userEmail, ticketId);

        // 4. Trả phản hồi cho admin
        return res.json({ success: true });

    } catch (err) {
        console.error("ERROR CONFIRM:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});


// kiểm tra trạng thái vé
route.get("/status/:ticketId", async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        console.log("CHECK STATUS ticketId =", ticketId);

        const ticket = await ticketService.getTicketById(ticketId);
        console.log("TICKET FOUND =", ticket);

        if (!ticket) {
            return res.json({ status: null });
        }

        res.json({ status: ticket.status });
    } catch (err) {
        console.error("STATUS ERROR:", err);
        res.json({ status: null });
    }
});


module.exports = route;
