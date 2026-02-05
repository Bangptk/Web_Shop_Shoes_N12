exports.createOrder = async (req, res) => {
    try {
        // ... Logic lưu đơn hàng vào CSDL ...
        const newOrder = { id: 1, customer: "Nguyễn Văn A", total: "1.200.000đ" };

        // Lấy đối tượng io đã set ở app.js
        const io = req.app.get('socketio');
        
        // Gửi thông báo đến tất cả mọi người (hoặc chỉ Admin)
        io.emit('new-order-alert', {
            message: "Có đơn hàng giày mới!",
            order: newOrder
        });

        res.status(201).json({ message: "Đặt hàng thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};