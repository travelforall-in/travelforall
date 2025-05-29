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
  getPackagesByCity,
  getDomesticCities,
  getInternationalCountries,
  getPackagesByState,  // Ensure this is imported
  getDomesticStates,   // Ensure this is imported
  getInternationalStates // Ensure this is imported
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
router.get('/cities/domestic', getDomesticCities);
router.get('/countries/international', getInternationalCountries);
router.get('/city/:cityName', getPackagesByCity);
router.get('/:id', getPackage);
router.get('/custom/:id', getCustomPackage);

// Routes for state-related operations
router.get('/state/:stateId', getPackagesByState);
router.get('/states/domestic', getDomesticStates);
router.get('/states/international', getInternationalStates);

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
