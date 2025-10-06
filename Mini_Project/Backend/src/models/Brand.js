const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Brand description is required'],
            trim: true,
        },
        logo: {
            type: String, // URL to brand logo
            required: false,
        },
        website: {
            type: String, // Brand website URL
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Brand', brandSchema);
