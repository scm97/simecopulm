const express = require('express');
const router = express.Router();
const customHeader = require('../middleware/customHeader');
const authController = require('../controllers/AuthController');

//TODO http://localhost:3000/auth

router.post('/register', authController.register_token);

router.post('/login', authController.login_token);

module.exports = router;