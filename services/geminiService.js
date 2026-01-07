const { GoogleGenerativeAI } = require("@google/generative-ai");

// Khởi tạo Gemini với API Key từ file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getGeminiReply(userMessage) {
    try {
        const prompt = `Bạn là trợ lý ảo hỗ trợ khách hàng của một đại lý bán vé máy bay. 
        Hãy trả lời tin nhắn sau của khách một cách lịch sự, hỗ trợ và ngắn gọn: "${userMessage}"`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return "Xin lỗi, hiện tại tôi đang bận. Nhân viên hỗ trợ sẽ phản hồi bạn ngay!";
    }
}

module.exports = { getGeminiReply };