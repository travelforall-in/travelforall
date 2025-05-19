// routes/stateRoutes.js
const express = require('express');
const router = express.Router();
const {
  createState,
  getStates,
  getState,
  updateState,
  deleteState,
  getStatesByType,
  searchStates,
  getCitiesByState,
  getPackagesByState
} = require('../controllers/stateController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/imageUpload');

// Public routes
router.get('/', getStates);
router.get('/type/:type', getStatesByType);
router.get('/search', searchStates);
router.get('/:id', getState);
router.get('/:id/cities', getCitiesByState);
router.get('/:id/packages', getPackagesByState);

// Admin only routes with file upload middleware
router.use(protect);
router.use(authorize('admin'));

router.post(
  '/',
  upload.array('images', 5),
  createState
);

router.put(
  '/:id',
  upload.array('images', 5),
  updateState
);

router.delete('/:id', deleteState);

module.exports = router;