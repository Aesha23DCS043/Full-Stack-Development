const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        items: [cartItemSchema],
        totalAmount: {
            type: Number,
            default: 0,
            min: [0, 'Total amount cannot be negative'],
        },
        totalItems: {
            type: Number,
            default: 0,
            min: [0, 'Total items cannot be negative'],
        },
    },
    {
        timestamps: true,
    }
);

// Calculate totals before saving
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
