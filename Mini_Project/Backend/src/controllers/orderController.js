const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');

// Create a new order (from cart)
// Expects: { items: [{ name, image, price, qty, brand }], shippingAddress, paymentMethod }
const createOrder = async (req, res) => {
  try {
    let { items, shippingAddress = {}, paymentMethod = {} } = req.body;

    // If no items passed, pull from user's cart
    if (!items || !Array.isArray(items) || items.length === 0) {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || !cart.items.length) {
        return res.status(400).json({ message: 'No items to order' });
      }
      items = cart.items.map(ci => ({
        product: ci.product?._id,
        name: ci.product?.name || 'Product',
        image: ci.product?.images?.[0],
        price: ci.price,
        qty: ci.quantity,
        brand: ci.product?.brand?.name,
      }));
    }

    // Fill shippingAddress from saved address if not provided
    const user = await User.findById(req.user._id);
    const hasIncomingAddress = shippingAddress && Object.values(shippingAddress).some(Boolean);
    if (!hasIncomingAddress && user?.shippingAddress) {
      shippingAddress = user.shippingAddress;
    }
    // If provided, update saved address on user
    if (hasIncomingAddress) {
      user.shippingAddress = shippingAddress;
      await user.save();
    }

    const itemsPrice = items.reduce((sum, it) => sum + Number(it.price) * Number(it.qty), 0);
    const shippingPrice = 0;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending',
    });

    // Clear user's cart after order placed
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], totalAmount: 0, totalItems: 0 } },
      { new: true }
    );

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get my orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get order by id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };

// ADMIN: list all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ADMIN: update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ADMIN: mark order as paid (supports multiple payment methods)
const markOrderPaid = async (req, res) => {
  try {
    const {
      method = 'Manual',
      cardLast4,
      upiId,
      upiTxnId,
      qrReference,
      provider,
      notes,
    } = req.body || {};

    const paymentMethod = {
      method,
      cardLast4,
      upiId,
      upiTxnId,
      qrReference,
      provider,
      notes,
      paidAt: new Date(),
    };

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Paid', paymentMethod },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports.getAllOrders = getAllOrders;
module.exports.updateOrderStatus = updateOrderStatus;
module.exports.markOrderPaid = markOrderPaid;
