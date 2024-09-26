const express = require('express');
const { authController } = require('../controllers/authController');
const telegramAuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', telegramAuthMiddleware, authController);

module.exports = router;
