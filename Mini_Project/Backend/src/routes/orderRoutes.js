const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, markOrderPaid } = require('../controllers/orderController');

/**
 * Orders
 */
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.post('/:id/pay', protect, isAdmin, markOrderPaid);

module.exports = router;
