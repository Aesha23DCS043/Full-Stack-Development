const Brand = require('../models/Brand');
const Product = require('../models/Product');

// List all brands (active only)
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single brand by id
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand || !brand.isActive) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get featured brands
const getFeaturedBrands = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const brands = await Brand.find({ isActive: true, featured: true })
      .limit(Number(limit))
      .sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBrands,
  getBrandById,
  getFeaturedBrands,
};
