// routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCity,
  getCities,
  getCity,
  updateCity,
  deleteCity,
  getCitiesByType,
  searchCities,
  getPackagesByCity
} = require('../controllers/cityController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/imageUpload');

// Public routes
router.get('/', getCities);
router.get('/type/:type', getCitiesByType);
router.get('/search', searchCities);
router.get('/:id', getCity);
router.get('/:id/packages', getPackagesByCity);

// Admin only routes with file upload middleware
router.use(protect);
router.use(authorize('admin'));

router.post(
  '/',
  upload.array('images', 5),
  createCity
);

router.put(
  '/:id',
  upload.array('images', 5),
  updateCity
);

router.delete('/:id', deleteCity);

module.exports = router;