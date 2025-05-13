const express = require('express');
const router = express.Router();
const {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
  addReview,
  getFeaturedPackages,
  getPackagesByType, 
  searchPackages,
  getMostPopularPackages,
  createCustomPackage,
  getCustomPackage,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getPackagesByCity    // Add the new function
} = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, packageValidation, customPackageValidation } = require('../utils/validation');
const upload = require('../middleware/imageUpload');

// Public routes
router.get('/', getPackages);
router.get('/featured', getFeaturedPackages);
router.get('/popular', getMostPopularPackages);
router.get('/type/:type', getPackagesByType);
router.get('/search', searchPackages);  // Improved search function
router.get('/city/:cityName', getPackagesByCity);  // New route for city-based search
router.get('/:id', getPackage);
router.get('/custom/:id', getCustomPackage);

// Protected routes
router.use(protect);

// User routes
router.post('/:id/reviews', addReview);
router.post('/custom', validate(customPackageValidation), createCustomPackage);
router.post('/wishlist/:id', addToWishlist);
router.get('/wishlist', getWishlist);
router.delete('/wishlist/:id', removeFromWishlist);

// Admin only routes with file upload middleware
router.post(
  '/',
  authorize('admin'),
  upload.array('images', 5),
  validate(packageValidation),
  createPackage
);
router.put(
  '/:id',
  authorize('admin'),
  upload.array('images', 5),
  updatePackage
);
router.delete('/:id', authorize('admin'), deletePackage);

module.exports = router;