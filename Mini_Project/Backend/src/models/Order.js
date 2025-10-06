const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  brand: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
    },
    paymentMethod: {
      method: {
        type: String,
        enum: ['COD', 'QR', 'UPI', 'CARD', 'NETBANKING', 'Manual'],
        default: 'COD',
      },
      cardLast4: String,
      upiId: String,
      upiTxnId: String,
      qrReference: String,
      provider: String, // e.g., Razorpay/Paytm/PhonePe
      notes: String,
      paidAt: Date,
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
