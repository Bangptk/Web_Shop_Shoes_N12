const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào request để dùng ở controller
        next();
    } catch (err) {
        res.status(403).json({ message: "Token không hợp lệ!" });
    }
};

// Check quyền Admin (chỉ Admin mới được CRUD sản phẩm)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ dành cho Admin!" });
    }
};

module.exports = { verifyToken, isAdmin };