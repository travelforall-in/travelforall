// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  getLocationHotels,
  getLocationTransportation,
  searchLocations,
  getFeaturedLocations
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/imageUpload');

// Public routes
router.get('/', getLocations);
router.get('/search', searchLocations);
router.get('/featured', getFeaturedLocations);
router.get('/:id', getLocation);
router.get('/:id/hotels', getLocationHotels);
router.get('/:id/transportation', getLocationTransportation);

// Admin routes - protected with admin authentication
router.use(protect);
router.use(authorize('admin'));

router.post('/', upload.array('images', 5), createLocation);
router.put('/:id', upload.array('images', 5), updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;