// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
 updateUserDetails,
 changeUserPassword,
  updateUserPreferences,
  getUserPreferences
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Base route is /api/users

// All routes are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserDetails);
router.put('/changePassword', changeUserPassword)
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);

module.exports = router;