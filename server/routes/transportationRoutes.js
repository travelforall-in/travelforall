// routes/transportationRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTransportation,
  getAllTransportation,
  getTransportation,
  updateTransportation,
  deleteTransportation,
  addTransportationReview,
  searchTransportation,
  findTransportationRoutes
} = require('../controllers/transportationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/imageUpload');

// Public routes
router.get('/', getAllTransportation);
router.get('/search', searchTransportation);
router.get('/routes', findTransportationRoutes);
router.get('/:id', getTransportation);

// Protected user routes
router.post('/:id/reviews', protect, addTransportationReview);

// Admin routes - protected with admin authentication
router.use(protect);
router.use(authorize('admin'));

router.post('/', upload.array('images', 5), createTransportation);
router.put('/:id', upload.array('images', 5), updateTransportation);
router.delete('/:id', deleteTransportation);

module.exports = router;