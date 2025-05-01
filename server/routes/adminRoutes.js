//adminRouts.js
const express = require('express');
const router = express.Router();
const {
  getPackages,
  getBookings,
  updateBookingStatus,
  getUsers,
  getDashboardStats,
  deleteUser
} = require('../controllers/adminController');
const { logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply middleware to all routes
router.use(protect);
router.use(adminMiddleware);

// Package management routes
router.get('/packages', getPackages);

// Booking management routes
router.get('/bookings', getBookings);
router.put('/bookings/:id', updateBookingStatus);

// User management routes
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Admin logout route
router.post('/logout', logout);

module.exports = router;