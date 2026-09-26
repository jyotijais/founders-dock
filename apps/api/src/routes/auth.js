const express = require('express');
const router = express.Router();
const { signup, getMe } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

//Public routes
router.post('/signup', signup);

//Protected routes
router.get('/me', verifyToken, getMe);

module.exports = router;