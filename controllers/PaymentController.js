const axios = require("axios");
const crypto = require("crypto");

class PaymentController {

    // Tạo QR
    async momoQR(req, res) {
    try {
        const { amount } = req.body;

        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

        const requestId = partnerCode + Date.now();
        const orderId = requestId;

        const redirectUrl = "http://localhost:3000/payment-success";
        const ipnUrl = "http://localhost:3000/payment/momo-ipn";
        const requestType = "captureWallet";
        const extraData = "";
        const orderInfo = "Thanh toán QR MoMo";

        const rawSignature =
            `accessKey=${accessKey}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${ipnUrl}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&partnerCode=${partnerCode}` +
            `&redirectUrl=${redirectUrl}` +
            `&requestId=${requestId}` +
            `&requestType=${requestType}`;

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            partnerName: "MoMo Test",
            storeId: "MoMoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang: "vi",
            requestType,
            extraData,
            signature
        };

        const response = await axios.post(
            "https://test-payment.momo.vn/v2/gateway/api/create",
            requestBody
        );

        // 👉 ĐÚNG VỊ TRÍ — đặt log ở đây
        console.log("🔍 MoMo Response:", response.data);

        return res.json({
            qrCodeUrl: response.data.qrCodeUrl
        });

    } catch (err) {
        console.error("❌ Lỗi MoMo:", err.response?.data || err);
        res.status(500).json({ error: "Lỗi tạo QR MoMo" });
    }
}

}

module.exports = new PaymentController();
