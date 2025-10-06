const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getMyWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

// Get my wishlist
router.get('/', protect, getMyWishlist);

// Add product to wishlist
router.post('/', protect, addToWishlist);

// Remove product from wishlist
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
