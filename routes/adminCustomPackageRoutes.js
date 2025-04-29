const express = require('express');
const router = express.Router();
const {
  getCustomPackages,
  updateCustomPackageStatus,
  createCustomPackageItinerary,
  deleteCustomPackage
} = require('../controllers/adminController'); // Change to use existing adminController

const { protect, authorize } = require('../middleware/authMiddleware');

// Base route is /api/admin/custom-packages

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/', getCustomPackages);
router.put('/:id', updateCustomPackageStatus);
router.post('/:id/itinerary', createCustomPackageItinerary);
router.delete('/:id', deleteCustomPackage);

module.exports = router;