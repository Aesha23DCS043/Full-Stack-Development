const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get current user's cart
const getMyCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(cart);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load cart', error: e.message });
  }
};

// Replace cart with provided items (sync from client)
// Body: { items: [{ productId, qty }] }
const syncCart = async (req, res) => {
  try {
    const { items = [] } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    // Build item list with price snapshot
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [String(p._id), p]));

    cart.items = items
      .filter(i => productMap.has(String(i.productId)) && i.qty > 0)
      .map(i => {
        const p = productMap.get(String(i.productId));
        return { product: p._id, quantity: i.qty, price: p.price };
      });

    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (e) {
    res.status(500).json({ message: 'Failed to sync cart', error: e.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], totalAmount: 0, totalItems: 0 } },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (e) {
    res.status(500).json({ message: 'Failed to clear cart', error: e.message });
  }
};

module.exports = { getMyCart, syncCart, clearCart };
