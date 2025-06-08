// routes/hotelBookingRoutes.js
const express = require('express');
const router = express.Router();

// Import controllers
const {
  createHotelBooking,
  getUserHotelBookings,
  getHotelBooking,
  cancelHotelBooking,
  getAllHotelBookings,
  updateHotelBookingStatus,
  getHotelBookingAnalytics
} = require('../controllers/hotelBookingController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../utils/validation');

// Hotel booking validation
const hotelBookingValidation = [
  // Add specific validation for hotel bookings
];

// ===== PUBLIC/USER ROUTES =====
// Protected routes for users
router.use(protect);

// User hotel booking operations
router.post('/', createHotelBooking);
router.get('/', getUserHotelBookings);
router.get('/:id', getHotelBooking);
router.put('/:id/cancel', cancelHotelBooking);

// ===== ADMIN ROUTES =====
// Admin-only routes
router.get('/admin/all', authorize('admin'), getAllHotelBookings);
router.put('/admin/:id/status', authorize('admin'), updateHotelBookingStatus);
router.get('/admin/analytics', authorize('admin'), getHotelBookingAnalytics);

module.exports = router;