// packageRoutes.js (updated)
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
  createCustomPackage,   // New function
  getCustomPackage,      // New function
  addToWishlist,         // New function
  getWishlist,           // New function
  removeFromWishlist     // New function
} = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, packageValidation, customPackageValidation } = require('../utils/validation');
const upload = require('../middleware/imageUpload');

// Public routes
router.get('/', getPackages);
router.get('/featured', getFeaturedPackages);
router.get('/popular', getMostPopularPackages);
router.get('/type/:type', getPackagesByType);
router.get('/search', searchPackages);
router.get('/:id', getPackage);
router.get('/custom/:id', getCustomPackage);  // Custom package details

// Protected routes
router.use(protect);

// User routes
router.post('/:id/reviews', addReview);
router.post('/custom', validate(customPackageValidation), createCustomPackage);  // Create custom package
router.post('/wishlist/:id', addToWishlist);  // Add to wishlist
router.get('/wishlist', getWishlist);  // Get user's wishlist
router.delete('/wishlist/:id', removeFromWishlist);  // Remove from wishlist

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