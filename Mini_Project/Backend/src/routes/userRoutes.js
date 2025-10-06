const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getMyAddress, updateMyAddress } = require('../controllers/userController');

router.get('/me/address', protect, getMyAddress);
router.put('/me/address', protect, updateMyAddress);

module.exports = router;
