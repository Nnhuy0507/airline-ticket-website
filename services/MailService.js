const nodemailer = require("nodemailer");
require("dotenv").config();  // nếu bạn chưa gọi ở chỗ khác

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// hàm gửi mail thông báo thanh toán thành công
async function sendPaymentSuccess(toEmail, ticketId) {
    const mailOptions = {
        from: `"Airline Support" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Xác nhận thanh toán vé máy bay",
        html: `
            <h2>🎉 Thanh toán thành công!</h2>
            <p>Xin chào,</p>
            <p>Vé của bạn có mã <strong>${ticketId}</strong> đã được admin xác nhận thanh toán.</p>
            <p>Bạn có thể truy cập website để xem chi tiết vé ở phần "Vé của tôi" hoặc trang Ticket Info.</p>
            <br/>
            <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendPaymentSuccess
};
