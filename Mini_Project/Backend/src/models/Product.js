const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            required: false,
            min: [0, 'Original price cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: [true, 'Brand is required'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        images: [{
            type: String, // Array of image URLs
        }],
        specifications: {
            type: Map,
            of: String, // Key-value pairs for product specifications
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        rating: {
            average: {
                type: Number,
                default: 0,
                min: [0, 'Rating cannot be negative'],
                max: [5, 'Rating cannot exceed 5'],
            },
            count: {
                type: Number,
                default: 0,
                min: [0, 'Rating count cannot be negative'],
            },
        },
        tags: [{
            type: String,
            trim: true,
        }],
    },
    {
        timestamps: true,
    }
);

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
