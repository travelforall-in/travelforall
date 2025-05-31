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


// const express = require('express');
// const router = express.Router();
// const {
//   addToWishlist,
//   getWishlist,
//   removeFromWishlist
// } = require('../controllers/wishlistController');
// const { protect } = require('../middleware/authMiddleware');

// // Base route is /api/wishlist
// router.use(protect);

// router.post('/', addToWishlist);            // expects { userId, packageId }
// router.get('/:userId', getWishlist);        // expects userId in URL
// router.delete('/:packageId', removeFromWishlist); // expects userId in body, packageId in URL

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const wishlistController = require('../controllers/wishlistController');

// router.post('/', wishlistController.addToWishlist);
// router.get('/:userId', wishlistController.getWishlist);
// router.delete('/:packageId', wishlistController.removeFromWishlist);

// module.exports = router;