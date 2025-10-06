const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getMyCart, syncCart, clearCart } = require('../controllers/cartController');

router.get('/', protect, getMyCart);
router.post('/sync', protect, syncCart);
router.post('/clear', protect, clearCart);

module.exports = router;
