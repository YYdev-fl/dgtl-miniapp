const express = require('express');
const { syncUserData } = require('../controllers/userController.js');

const router = express.Router();

router.post('/sync', syncUserData);

module.exports = router;
