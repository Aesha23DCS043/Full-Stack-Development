const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            brand, 
            category, 
            brandName,
            categoryName,
            minPrice, 
            maxPrice, 
            search, 
            featured,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };
        
        if (brand) filter.brand = brand;
        if (category) filter.category = category;
        // Resolve brand/category by name if provided
        if (brandName && !filter.brand) {
            const b = await Brand.findOne({ name: new RegExp(`^${brandName}$`, 'i') });
            if (b) filter.brand = b._id;
        }
        if (categoryName && !filter.category) {
            const c = await Category.findOne({ name: new RegExp(`^${categoryName}$`, 'i') });
            if (c) filter.category = c._id;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (featured !== undefined) filter.featured = featured === 'true';
        if (search) {
            filter.$text = { $search: search };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;
        
        const products = await Product.find(filter)
            .populate('brand', 'name logo')
            .populate('category', 'name')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);
        
        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            brand, // brand id
            category, // category id
            images = [],
            featured = false,
            isActive = true,
            originalPrice,
            tags = []
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            brand,
            category,
            images,
            featured,
            isActive,
            originalPrice,
            tags
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: update product
const updateProduct = async (req, res) => {
    try {
        const update = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: delete (soft by default)
const deleteProduct = async (req, res) => {
    try {
        const { hard = 'false' } = req.query;
        if (hard === 'true') {
            const deleted = await Product.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Product not found' });
            return res.json({ message: 'Product deleted' });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand', 'name description logo website')
            .populate('category', 'name description');
            
        if (!product || !product.isActive) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get products by brand
const getProductsByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const skip = (page - 1) * limit;
        
        const products = await Product.find({ brand: brandId, isActive: true })
            .populate('brand', 'name logo')
            .populate('category', 'name')
            .skip(skip)
            .limit(Number(limit));
            
        const total = await Product.countDocuments({ brand: brandId, isActive: true });
        
        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const skip = (page - 1) * limit;
        
        const products = await Product.find({ category: categoryId, isActive: true })
            .populate('brand', 'name logo')
            .populate('category', 'name')
            .skip(skip)
            .limit(Number(limit));
            
        const total = await Product.countDocuments({ category: categoryId, isActive: true });
        
        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        
        const products = await Product.find({ featured: true, isActive: true })
            .populate('brand', 'name logo')
            .populate('category', 'name')
            .limit(Number(limit))
            .sort({ createdAt: -1 });
            
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const skip = (page - 1) * limit;
        
        const products = await Product.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { description: { $regex: q, $options: 'i' } },
                        { tags: { $in: [new RegExp(q, 'i')] } }
                    ]
                }
            ]
        })
        .populate('brand', 'name logo')
        .populate('category', 'name')
        .skip(skip)
        .limit(Number(limit));
        
        const total = await Product.countDocuments({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { description: { $regex: q, $options: 'i' } },
                        { tags: { $in: [new RegExp(q, 'i')] } }
                    ]
                }
            ]
        });
        
        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                searchQuery: q
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductsByBrand,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
