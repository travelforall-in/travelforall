const express = require('express');
const router = express.Router();
const {
  createCustomPackage,
  getCustomPackage,
  updateCustomPackage,
  cancelCustomPackage,
  getUserCustomPackages
} = require('../controllers/customPackageController');
const { protect } = require('../middleware/authMiddleware');

// Base route is /api/custom-packages

// All routes are protected
router.use(protect);

router.post('/', createCustomPackage);
router.get('/user', getUserCustomPackages);
router.get('/:id', getCustomPackage);
router.put('/:id', updateCustomPackage);
router.put('/:id/cancel', cancelCustomPackage);

module.exports = router;