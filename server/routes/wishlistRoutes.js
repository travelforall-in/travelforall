const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// Base route is /api/wishlist

// All routes are protected
router.use(protect);

router.post('/:id', addToWishlist);
router.get('/', getWishlist);
router.delete('/:id', removeFromWishlist);

module.exports = router;