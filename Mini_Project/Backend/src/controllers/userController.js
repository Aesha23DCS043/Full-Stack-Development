const User = require('../models/User');

const getMyAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('shippingAddress');
    res.json(user?.shippingAddress || {});
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch address', error: e.message });
  }
};

const updateMyAddress = async (req, res) => {
  try {
    const { fullName, address, city, state, zip, phone } = req.body || {};
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { shippingAddress: { fullName, address, city, state, zip, phone } } },
      { new: true, runValidators: false }
    ).select('shippingAddress');
    res.json(user.shippingAddress || {});
  } catch (e) {
    res.status(500).json({ message: 'Failed to update address', error: e.message });
  }
};

module.exports = { getMyAddress, updateMyAddress };
