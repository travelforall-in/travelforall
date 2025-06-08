// routes/vendorRoutes.js
const express = require('express');
const router = express.Router();

// Import controllers
const {
  registerVendor,
  loginVendor,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/vendorAuthController');

const {
  createHotel,
  getVendorHotels,
  getVendorHotel,
  updateVendorHotel,
  deleteVendorHotel,
  getHotelAnalytics
} = require('../controllers/vendorHotelController');

const {
  getVendorBookings,
  getVendorBooking,
  updateBookingStatus,
  getBookingAnalytics,
  getBookingsByDateRange,
  exportBookings
} = require('../controllers/vendorBookingController');

const {
  getDashboardStats,
  getRevenueAnalytics,
  getOccupancyAnalytics
} = require('../controllers/vendorDashboardController');

// Import middleware
const { protectVendor, checkHotelOwnership } = require('../middleware/vendorMiddleware');
const upload = require('../middleware/imageUpload');
const { validate, hotelValidation } = require('../utils/validation');

// ===== AUTH ROUTES =====
// Public routes
router.post('/auth/register', registerVendor);
router.post('/auth/login', loginVendor);

// Protected vendor routes
router.use(protectVendor); // All routes below require vendor authentication

// Vendor profile routes
router.get('/auth/me', getMe);
router.put('/auth/profile', updateProfile);
router.put('/auth/change-password', changePassword);
router.post('/auth/logout', logout);

// ===== HOTEL MANAGEMENT ROUTES =====
// Hotel CRUD operations
router.post('/hotels', upload.array('images', 10), validate(hotelValidation), createHotel);
router.get('/hotels', getVendorHotels);
router.get('/hotels/:id', getVendorHotel);
router.put('/hotels/:id', upload.array('images', 10), updateVendorHotel);
router.delete('/hotels/:id', deleteVendorHotel);

// Hotel analytics
router.get('/hotels/:id/analytics', getHotelAnalytics);

// ===== BOOKING MANAGEMENT ROUTES =====
// Booking operations
router.get('/bookings', getVendorBookings);
router.get('/bookings/analytics', getBookingAnalytics);
router.get('/bookings/by-date', getBookingsByDateRange);
router.get('/bookings/export', exportBookings);
router.get('/bookings/:id', getVendorBooking);
router.put('/bookings/:id/status', updateBookingStatus);

// ===== DASHBOARD ROUTES =====
// Dashboard analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/revenue', getRevenueAnalytics);
router.get('/dashboard/occupancy', getOccupancyAnalytics);

module.exports = router;