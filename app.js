const express = require('express')
const app = express()
const hbs = require('express-handlebars').engine;
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const cors = require('cors');
// config passport
const initializeGooglePassport = require('./config/oauth2');
const initializePassport = require('./config/passport-config');
// config gg passport

//chat
const Message = require('./models/Message'); 
const User = require('./models/User'); 
const http = require('http');
const server = http.createServer(app); // Tạo server từ app express
const { Server } = require("socket.io");
const io = new Server(server); // KHỞI TẠO BIẾN io TẠI ĐÂY
const chatController = require('./controllers/ChatController');
const { getGeminiReply } = require('./services/geminiService');
const geminiTimeouts = {};

require('dotenv').config({path: './config/.env'});

// Connect to Database
const db = require('./config/db');
db.connect();
const port = process.env.PORT;
const customHelpers = require('./util/customHelpers');
app.use(cors());

app.use(session({
    secret: 'mysecretkey',
    resave: false,        
    saveUninitialized: false,
    cookie: {
        secure: false,
    }
}));
app.use(express.json());
app.use(flash());
app.use(passport.initialize()) 
app.use(passport.session())

// init Google passport
initializeGooglePassport(passport);


// // innitalizepassport config
initializePassport(passport);

io.on('connection', (socket) => {
    console.log('Có kết nối mới:', socket.id);

    // 1. Join phòng chat
    socket.on('join_chat', async (userId) => {
        socket.join(userId);
        try {
            const history = await Message.find({ user_id: userId }).sort({ createdAt: 1 }).lean();
            socket.emit('load_history', history);
        } catch (err) {
            console.error("Lỗi nạp lịch sử:", err);
        }
    });

    // 2. Người dùng gửi tin nhắn
    socket.on('send_message', async (data) => {
        let { userId, userName, content } = data;
        try {
            const savedMsg = await chatController.saveMessage(userId, 'user', content);
            const userDoc = await User.findById(userId).lean();
            const displayUserEmail = userDoc ? userDoc.email : "No email";

            io.emit('admin_receive_new_message', {
                userId: userId,
                userEmail: displayUserEmail, 
                content: content,
                createdAt: savedMsg.createdAt
            });
            io.to(userId).emit('receive_message', savedMsg);

           
            if (geminiTimeouts[userId]) {
                clearTimeout(geminiTimeouts[userId]);
            }

            geminiTimeouts[userId] = setTimeout(async () => {
                const lastMsg = await Message.findOne({ user_id: userId }).sort({ createdAt: -1 }).lean();
                
                // Chỉ phản hồi nếu tin nhắn cuối cùng vẫn là của người dùng (Admin chưa trả lời)
                if (lastMsg && lastMsg.sender === 'user') {
                    console.log(`🤖 Gemini đang trả lời cho user: ${userId}`);
                    const aiContent = await getGeminiReply(content);
                    const savedAiMsg = await chatController.saveMessage(userId, 'admin', aiContent);

                    io.to(userId).emit('receive_message', savedAiMsg);
                    io.emit('admin_receive_new_message', {
                        userId: userId,
                        content: "Bot: " + aiContent,
                        sender: 'admin'
                    });
                }
                // Sau khi chạy xong, xóa tham chiếu trong object
                delete geminiTimeouts[userId];
            }, 10000); 

        } catch (error) {
            console.error("Lỗi socket khách gửi:", error.message);
        }
    });

    // 3. Admin trả lời tin nhắn
    socket.on('admin_send_message', async (data) => {
        const { userId, content } = data;
        try {
            // --- QUAN TRỌNG: Hủy bỏ Gemini Timer ngay khi Admin trả lời ---
            if (geminiTimeouts[userId]) {
                console.log(`✅ Admin đã trả lời. Hủy lệnh chờ Gemini cho user: ${userId}`);
                clearTimeout(geminiTimeouts[userId]);
                delete geminiTimeouts[userId];
            }

            const savedMsg = await chatController.saveMessage(userId, 'admin', content);

            io.to(userId).emit('receive_message', savedMsg);
            io.emit('admin_receive_new_message', {
                userId: userId,
                content: "Bạn: " + content,
                sender: 'admin'
            });
        } catch (error) {
            console.error("Lỗi socket admin gửi:", error.message);
        }
    });
});

app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        ...customHelpers.helpers,
        
        // Helper so sánh bằng (==)
        eq: function (a, b) {
            return a == b;
        },
        for: function(from, to, incr, block) {
            let accum = '';
            for(let i = from; i <= to; i += incr){
              accum += block.fn({index: i});
            }
            return accum;
          },
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        incremented: function(index) {
            index++;
            return index;
        },
        format_datetime: function(date) {
            date = new Date(date)
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
          
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
          
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        },
        format_date: function(date) {
            date = new Date(date)
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
          
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
          
            return `${day}-${month}-${year}`;
        },
        format_currency: function(amount) {
            return amount.toLocaleString('vi-VN');
        },
        convertMap: function (map) {
            let object = {};
            map.forEach((value, key) => {
                object[key] = value;
            });
            return object;
        },
        ifCond: function (v1, operator, v2, options) {

            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    } 
}))
app.set('view engine', 'hbs')
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use('/select-flight', express.static(__dirname + '/public'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);

const initRoute = require('./routes');
initRoute(app);

const ratingRouter = require('./routes/rating');
app.use('/rating', ratingRouter);

const clientRouter = require('./routes/search');
app.use('/search', clientRouter);

// init Route middle


//app.listen(port, ()=> console.log(`Server listening on port: ${port}`));
server.listen(port, () => {
    console.log(`Server & Chat đang chạy tại: http://localhost:${port}`);
});
