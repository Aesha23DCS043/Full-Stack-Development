const User = require('../models/User');

// Public: check if an admin exists
const adminExists = async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('_id email');
    res.json({ exists: !!admin, email: admin?.email || null });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
};

// Protected + Admin only: return status for current token
const adminStatus = async (req, res) => {
  try {
    res.json({ ok: true, user: req.user });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
};

module.exports = { adminExists, adminStatus };
