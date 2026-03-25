const db = require('../config/db');

// Đăng ký (Dùng để tạo tài khoản admin ban đầu)
exports.register = async (req, res) => {
    const { fullname, email, password, role } = req.body;
    try {
        await db.execute(
            'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
            [fullname, email, password, role || 'customer']
        );
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        
        if (rows.length > 0) {
            const user = rows[0];
            res.json({
                message: "Đăng nhập thành công",
                user: { id: user.id, fullname: user.fullname, role: user.role }
            });
        } else {
            res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
