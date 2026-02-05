const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);

// Khởi tạo Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép mọi Frontend truy cập để test
    }
});

// Lắng nghe kết nối
io.on('connection', (socket) => {
    console.log('Có người dùng vừa kết nối: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối');
    });
});

// Gắn io vào app để có thể dùng ở các Controller khác
app.set('socketio', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại port: ${PORT}`);
});