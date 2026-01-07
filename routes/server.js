const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // file User.js bạn gửi
const cors = require('cors');
const app = express();
const adminRoute = require("./routes/admin");
const chatController = require('./controllers/ChatController');

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/yourdbname', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API lấy thông tin user theo email (hoặc id)
app.get('/api/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Chat
io.on('connection', (socket) => {
    // Khi khách hàng bắt đầu kết nối chat qua mạng
    socket.on('join_chat', async (userId) => {
        socket.join(userId);
        
        // Gọi Controller để lấy lịch sử cũ
        const history = await chatController.getChatHistory(userId);
        socket.emit('load_history', history);
    });

    // Khi có tin nhắn mới gửi lên từ Client
    socket.on('send_message', async (data) => {
        // Gọi Controller để lưu tin nhắn vào MongoDB
        const savedMsg = await chatController.saveMessage(data);

        // Phát tín hiệu (Emit) lại cho đúng phòng của người dùng đó
        if (savedMsg) {
            io.to(data.userId).emit('receive_message', savedMsg);
        }
    });
});

router.get('/chat-management', (req, res) => {
    // chatController.getChatUsers là hàm lấy danh sách user bạn đã viết ở bước trước
    chatController.getChatUsers(req, res); 
});

//
app.use("/admin", adminRoute);


app.listen(3000, () => console.log('Server running on port 3000'));
