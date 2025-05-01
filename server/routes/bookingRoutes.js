//bookingRouts
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, bookingValidation } = require('../utils/validation');

// User routes (protected)
router.use(protect);

// Booking routes for users
router.post('/', validate(bookingValidation), createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Admin route to get all bookings
router.get('/admin/all', authorize('admin'), getAllBookings);

module.exports = router;