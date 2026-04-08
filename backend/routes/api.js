const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update/:id', authController.updateProfile);
router.post('/auth/google', authController.googleLogin);

module.exports = router;
