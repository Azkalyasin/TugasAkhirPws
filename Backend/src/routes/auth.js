const express = require('express');
const { register, login, getProfile, regenerateApiKey } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const authRateLimit = require('../middleware/rateLimiter');


const router = express.Router();

console.log({
  register,
  login,
  getProfile,
  regenerateApiKey,
});


// Public routes
router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.post('/regenerate-key', authenticate, regenerateApiKey);

module.exports = router;