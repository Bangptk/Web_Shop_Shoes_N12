const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const productController = require('../controllers/product.controller');

// Ai cũng có thể xem giày
router.get('/', productController.getAllProducts);

// Chỉ Admin mới được thêm giày mới
router.post('/', verifyToken, isAdmin, productController.createProduct);

module.exports = router;

const upload = require('../utils/upload');
// 'image' là cái tên (name) của input file ở phía Frontend
router.post('/', verifyToken, isAdmin, upload.single('image'), productController.createProduct);