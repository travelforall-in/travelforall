// routes/adminVendorRoutes.js
const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllVendors,
  getVendor,
  updateVendorStatus,
  deleteVendor,
  getVendorHotels,
  getVendorBookings,
  updateVendorHotelStatus,
  getVendorDashboardStats
} = require('../controllers/adminVendorController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// Base route is /api/admin/vendors

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('admin'));

// Vendor dashboard stats
router.get('/dashboard-stats', getVendorDashboardStats);

// Vendor management routes
router.get('/', getAllVendors);
router.get('/:id', getVendor);
router.put('/:id/status', updateVendorStatus);
router.delete('/:id', deleteVendor);

// Vendor hotels management
router.get('/:id/hotels', getVendorHotels);
router.put('/hotels/:hotelId/status', updateVendorHotelStatus);

// Vendor bookings management
router.get('/:id/bookings', getVendorBookings);

module.exports = router;