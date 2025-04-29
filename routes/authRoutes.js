//authrouts.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  registerAdmin, 
  loginAdmin, 
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, registerValidation, loginValidation } = require('../utils/validation');

// User routes
router.post('/register', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);

// Admin routes
router.post('/admin/register', validate(registerValidation), registerAdmin);
router.post('/admin/login', validate(loginValidation), loginAdmin);

// Get current user
router.get('/me', protect, getMe);

// Logout route (for both users and admins)
router.post('/logout', protect, logout);

module.exports = router;