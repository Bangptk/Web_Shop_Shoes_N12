const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ==========================================
// 1. CẤU HÌNH MIDDLEWARE
// ==========================================
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Tạo thư mục 'uploads' tự động
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static('uploads')); 

// ==========================================
// 2. KẾT NỐI DATABASE
// ==========================================
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234', // Mật khẩu MySQL của bạn
  database: 'web_shoes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('--- LỖI KẾT NỐI DATABASE: ', err.message);
  } else {
    console.log('--- DATABASE ĐÃ KẾT NỐI THÀNH CÔNG ---');
    connection.release();
  }
});

// ==========================================
// 3. CẤU HÌNH MULTER (UPLOAD FILE)
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ==========================================
// 4. CÁC API HỆ THỐNG
// ==========================================

// --- API ĐĂNG NHẬP ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
    if (results.length > 0) {
      const user = results[0];
      res.json({
        message: "Đăng nhập thành công",
        user: { id: user.id, fullname: user.fullname, role: user.role }
      });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
    }
  });
});

// --- API THỐNG KÊ DASHBOARD ---
// Gộp chung 1 API để Frontend dễ gọi
app.get('/api/admin/stats', (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM products) as totalProducts,
      (SELECT COUNT(*) FROM orders) as totalOrders,
      (SELECT IFNULL(SUM(total_money), 0) FROM orders) as totalRevenue
  `; 
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// Alias cho API status nếu Dashboard gọi /status
app.get('/api/admin/status', (req, res) => {
  const sql = `SELECT (SELECT COUNT(*) FROM products) as totalProducts, (SELECT COUNT(*) FROM orders) as totalOrders, (SELECT IFNULL(SUM(total_money), 0) FROM orders) as totalRevenue`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// --- API SẢN PHẨM ---
app.get('/api/products', (req, res) => {
  const sql = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    ORDER BY p.id DESC`;
    
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : '';

  const sql = "INSERT INTO products (name, price, description, image_url, category_id) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, price, description, image_url, category_id || null], (err, result) => {
    if (err) return res.status(500).json({message: "Lỗi khi thêm sản phẩm"});
    res.json({ message: "Thêm thành công!", id: result.insertId });
  });
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const { name, price, description, category_id } = req.body;
  let sql = "UPDATE products SET name=?, price=?, description=?, category_id=? WHERE id=?";
  let params = [name, price, description, category_id, req.params.id];

  if (req.file) {
    sql = "UPDATE products SET name=?, price=?, description=?, image_url=?, category_id=? WHERE id=?";
    params = [name, price, description, `/uploads/${req.file.filename}`, category_id, req.params.id];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cập nhật thành công" });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Xóa thành công!" });
  });
});

// --- API DANH MỤC ---
app.get('/api/categories', (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  db.query("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Thêm danh mục thành công", id: result.insertId });
  });
});

app.delete('/api/categories/:id', (req, res) => {
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Đã xóa danh mục" });
  });
});

// --- API ĐƠN HÀNG ---
app.get('/api/orders', (req, res) => {
  const sql = `
    SELECT o.*, u.fullname as customer_name 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.order_date DESC`;
    
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cập nhật thành công!" });
  });
});

// Chi tiết đơn hàng (CỰC KỲ QUAN TRỌNG: Đã sửa product_variants_id có chữ S)
app.get('/api/orders/:id/details', (req, res) => {
  const orderId = req.params.id;
  const sql = `
    SELECT 
      od.id, 
      od.quantity, 
      od.price, 
      p.name AS product_name, 
      p.image_url
    FROM order_details od
    JOIN product_variants pv ON od.product_variants_id = pv.id
    JOIN products p ON pv.product_id = p.id
    WHERE od.order_id = ?`;

  db.query(sql, [orderId], (err, results) => {
    if (err) {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
    res.json(results);
  });
});

// API Đăng ký thành viên
app.post('/api/register', (req, res) => {
    const { fullname, email, password } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const checkEmail = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmail, [email], (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: "Email này đã được sử dụng!" });
        }

        // Thêm người dùng mới (Mặc định role là 'customer')
        const sql = "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, 'customer')";
        db.query(sql, [fullname, email, password], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Đăng ký tài khoản thành công!" });
        });
    });
});

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id; // Lấy ID từ URL (ví dụ: /api/products/5)
  
  const query = `
    SELECT products.*, categories.name as category_name 
    FROM products 
    LEFT JOIN categories ON products.category_id = categories.id 
    WHERE products.id = ?
  `;

  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).send(err);
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(result[0]); // Trả về duy nhất 1 sản phẩm đầu tiên tìm được
  });
});

// API lấy các phiên bản (Size) của một sản phẩm cụ thể
app.get('/api/products/:id/variants', (req, res) => {
  const productId = req.params.id;
  const sql = "SELECT id, size, stock_quantity FROM product_variants WHERE product_id = ?";
  
  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("Lỗi lấy size sản phẩm:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// API lưu đơn hàng từ giỏ hàng (Cho bước tiếp theo)
app.post('/api/orders/checkout', (req, res) => {
  const { user_id, total_money, address, phone, details } = req.body;
  
  // 1. Chèn vào bảng orders
  const sqlOrder = "INSERT INTO orders (user_id, total_money, address, phone, status, order_date) VALUES (?, ?, ?, ?, 'Chờ xử lý', NOW())";
  
  db.query(sqlOrder, [user_id, total_money, address, phone], (err, result) => {
    if (err) return res.status(500).json(err);
    
    const orderId = result.insertId;
    
    // 2. Chèn vào bảng order_details (details là mảng các sản phẩm trong giỏ)
    const detailValues = details.map(item => [orderId, item.variant_id, item.quantity, item.price]);
    const sqlDetails = "INSERT INTO order_details (order_id, product_variants_id, quantity, price) VALUES ?";
    
    db.query(sqlDetails, [detailValues], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Đặt hàng thành công!", orderId });
    });
  });
});



// ==========================================
// 5. KHỞI CHẠY SERVER
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
