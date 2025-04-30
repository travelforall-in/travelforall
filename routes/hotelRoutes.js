// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
  addHotelReview,
  searchHotels,
  getFeaturedHotels
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/imageUpload');

// Public routes
router.get('/', getHotels);
router.get('/search', searchHotels);
router.get('/featured', getFeaturedHotels);
router.get('/:id', getHotel);

// Protected user routes
router.post('/:id/reviews', protect, addHotelReview);

// Admin routes - protected with admin authentication
router.use(protect);
router.use(authorize('admin'));

router.post('/', upload.array('images', 10), createHotel);
router.put('/:id', upload.array('images', 10), updateHotel);
router.delete('/:id', deleteHotel);

module.exports = router;