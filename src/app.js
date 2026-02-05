const express = require('express');
const cors = require('cors');
const app = express();

// Middleware để đọc JSON (Bắt buộc cho RESTful)
app.use(express.json());
app.use(cors());

// Khai báo folder public để lưu ảnh giày (Xử lý file)
app.use('/uploads', express.static('uploads'));

// Import Routes
const productRoutes = require('./routes/product.route');
const authRoutes = require('./routes/auth.route');

// Sử dụng Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;