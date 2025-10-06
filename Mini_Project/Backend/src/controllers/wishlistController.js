const Wishlist = require('../models/Wishlist');

// Get my wishlist
const getMyWishlist = async (req, res) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json(wl?.products || []);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: e.message });
  }
};

// Add a product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const wl = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { new: true, upsert: true }
    ).populate('products');

    res.status(200).json(wl.products);
  } catch (e) {
    res.status(500).json({ message: 'Failed to add to wishlist', error: e.message });
  }
};

// Remove a product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: 'productId param is required' });

    const wl = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { new: true }
    ).populate('products');

    res.status(200).json(wl?.products || []);
  } catch (e) {
    res.status(500).json({ message: 'Failed to remove from wishlist', error: e.message });
  }
};

module.exports = { getMyWishlist, addToWishlist, removeFromWishlist };
