// controllers/ChatController.js
const Message = require('../models/Message');
const User = require('../models/User');

class ChatController {
    // Hàm này dùng để lấy lại tin nhắn cũ khi người dùng load trang web
    async getChatHistory(userId) {
        try {
            return await Message.find({ user_id: userId }).sort({ timestamp: 1 });
        } catch (error) {
            console.error("Lỗi lấy lịch sử chat:", error);
            return [];
        }
    }
    // Lưu tin nhắn
    async saveMessage(userId, sender, content, fileUrl = null, fileType = null) {
        try {
            const newMessage = new Message({
                user_id: userId,
                sender: sender, 
                content: content,
                createdAt: new Date()
            });
            return await newMessage.save();
        } catch (error) {
            console.error("Lỗi lưu DB:", error);
        }
    }

    // Lấy lịch sử (Dùng trong socket.on('join_chat'))
    async getChatHistory(userId) {
        return await Message.find({ user_id: userId })
                            .sort({ createdAt: 1 }) // Sắp xếp từ cũ đến mới
                            .lean();
    }

async getChatUsers(req, res) {
    try {
        const uniqueUserIds = await Message.distinct('user_id');
        const users = await User.find({ _id: { $in: uniqueUserIds } }).select('email').lean();

        const usersWithLastMsg = await Promise.all(users.map(async (u) => {
            const lastMsg = await Message.findOne({ user_id: u._id })
                                         .sort({ createdAt: -1 }) // Lấy tin nhắn mới nhất
                                         .lean();
            
            return {
                _id: u._id,
                email: u.email,
                lastMessage: lastMsg ? (lastMsg.sender === 'admin' ? "Bạn: " : "") + lastMsg.content : "Nhấn để xem...",
                lastTime: lastMsg ? lastMsg.createdAt : 0
            };
        }));

        // Sắp xếp: Ai vừa nhắn tin xong sẽ nhảy lên đầu danh sách
        usersWithLastMsg.sort((a, b) => b.lastTime - a.lastTime);

        res.render('pages/admin/chat-management', {
            layout: 'admin', 
            users: usersWithLastMsg
        });
    } catch (error) {
        res.status(500).send("Lỗi nạp danh sách");
    }
}
}
module.exports = new ChatController();