import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // Adjust path as needed
import { useAuth } from '../context/AuthContext';
import { getMyAddress } from '../utils/api';

const Payment = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [savedAddress, setSavedAddress] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const { items: ctxItems } = useCart() || {};
  const { user, token } = useAuth();

  const navigate = useNavigate();

  // Load saved address
  useEffect(() => {
    const loadAddress = async () => {
      if (!token) return;
      try {
        const addressData = await getMyAddress(token);
        if (addressData && addressData.address) {
          setSavedAddress(addressData);
          // Pre-populate form with saved address
          setFormData(prev => ({
            ...prev,
            firstName: addressData.fullName?.split(' ')[0] || '',
            lastName: addressData.fullName?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            phone: addressData.phone || '',
            address: addressData.address || '',
            city: addressData.city || '',
            state: addressData.state || '',
            pincode: addressData.zip || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load address:', error);
      }
    };
    loadAddress();
  }, [token, user?.email]);

  // Calculate subtotal, GST, and total (with defensive defaults)
  const items = Array.isArray(ctxItems)
    ? ctxItems.map((it) => ({ ...it, quantity: Number(it.quantity ?? it.qty) || 1 }))
    : [];
  const getItemPrice = (item) => {
    const src = item?.product || item;
    return Number(src?.discountPrice ?? src?.salePrice ?? src?.price ?? src?.mrp ?? item?.price ?? 0) || 0;
  };
  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * (Number(item?.quantity) || 1), 0);
  const gst = subtotal * 0.18; // 18% GST
  const deliveryFee = 0; // Free delivery
  const total = subtotal + gst + deliveryFee;
  const totalItems = items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleBackToReview = () => {
    navigate('/checkout');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // If using saved address, validate saved address data
    if (useSavedAddress && savedAddress) {
      if (!savedAddress.fullName || !savedAddress.address || !savedAddress.city || 
          !savedAddress.state || !savedAddress.zip || !savedAddress.phone) {
        alert('Saved address is incomplete. Please update your profile or fill the form manually.');
        return;
      }
    } else {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
          !formData.address || !formData.city || !formData.state || !formData.pincode) {
        alert('Please fill in all required fields');
        return;
      }
    }
    
    // Prepare order data
    const orderData = useSavedAddress && savedAddress ? {
      firstName: savedAddress.fullName?.split(' ')[0] || '',
      lastName: savedAddress.fullName?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: savedAddress.phone || '',
      address: savedAddress.address || '',
      city: savedAddress.city || '',
      state: savedAddress.state || '',
      pincode: savedAddress.zip || '',
      paymentMethod,
      subtotal,
      gst,
      deliveryFee,
      total,
      items
    } : {
      ...formData,
      paymentMethod,
      subtotal,
      gst,
      deliveryFee,
      total,
      items
    };
    
    // Navigate to confirmation page
    navigate('/confirmation', {
      state: { order: orderData }
    });
  };

  return (
    <div className="min-h-screen bg-[#e8ecef] text-[#607d9e] p-6">
      {/* Back to Cart Link */}
      <Link to="/cart" className="text-sm mb-4 inline-block hover:underline flex items-center">
        <span className="mr-1">&larr;</span> Back to Cart
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-bold text-[#607d9e] mb-2">Payment & Details</h1>
      <p className="text-[#84a4bc] mb-8">
        Secure payment for your premium bathroom accessories.
      </p>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        <div className="flex items-center space-x-2">
          <span className="bg-[#e0e6eb] text-[#84a4bc] rounded-full px-3 py-1 text-sm">1</span>
          <span className="text-[#84a4bc]">Order Review</span>
        </div>
        <span className="text-[#84a4bc]">—</span>
        <div className="flex items-center space-x-2">
          <span className="bg-[#607d9e] text-white rounded-full px-3 py-1 text-sm">2</span>
          <span className="text-[#607d9e]">Payment & Details</span>
        </div>
        <span className="text-[#84a4bc]">—</span>
        <div className="flex items-center space-x-2">
          <span className="bg-[#e0e6eb] text-[#84a4bc] rounded-full px-3 py-1 text-sm">3</span>
          <span className="text-[#84a4bc]">Confirmation</span>
        </div>
      </div>

      {/* Form and Summary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information & Shipping Address */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#607d9e] mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e]"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#607d9e] mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e]"
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#607d9e] mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e]"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#607d9e] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e]"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Saved Address Option */}
          {savedAddress && (
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#607d9e]">
              <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Use Saved Address</h2>
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSavedAddress}
                    onChange={(e) => setUseSavedAddress(e.target.checked)}
                    className="w-4 h-4 text-[#607d9e] border-gray-300 rounded focus:ring-[#607d9e]"
                  />
                  <span className="text-[#607d9e] font-medium">Use my saved address</span>
                </label>
              </div>
              {useSavedAddress && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-[#607d9e] mb-2">{savedAddress.fullName}</h3>
                  <p className="text-gray-600">{savedAddress.address}</p>
                  <p className="text-gray-600">{savedAddress.city}, {savedAddress.state} {savedAddress.zip}</p>
                  <p className="text-gray-600 mt-2">Phone: {savedAddress.phone}</p>
                </div>
              )}
            </div>
          )}

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#607d9e] mb-2">Street Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e] h-20 resize-none"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#607d9e] mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e]"
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#607d9e] mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e]"
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#607d9e] mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607d9e]"
                    placeholder="Enter pincode"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Payment Method</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => handlePaymentChange('card')}
                  className="mr-3 text-[#607d9e]"
                />
                <label htmlFor="card" className="flex items-center space-x-2 text-[#607d9e]">
                  <span className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className={`w-2 h-2 rounded-full ${paymentMethod === 'card' ? 'bg-[#607d9e]' : 'bg-transparent'}`} />
                  </span>
                  <span>Credit/Debit Card</span>
                  <span className="text-[#84a4bc]">(Visa, MasterCard, RuPay)</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="upi"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => handlePaymentChange('upi')}
                  className="mr-3 text-[#607d9e]"
                />
                <label htmlFor="upi" className="flex items-center space-x-2 text-[#607d9e]">
                  <span className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className={`w-2 h-2 rounded-full ${paymentMethod === 'upi' ? 'bg-[#607d9e]' : 'bg-transparent'}`} />
                  </span>
                  <span>UPI Payment</span>
                  <span className="text-[#84a4bc]">(PhonePe, GPay, Paytm)</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => handlePaymentChange('cod')}
                  className="mr-3 text-[#607d9e]"
                />
                <label htmlFor="cod" className="flex items-center space-x-2 text-[#607d9e]">
                  <span className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className={`w-2 h-2 rounded-full ${paymentMethod === 'cod' ? 'bg-[#607d9e]' : 'bg-transparent'}`} />
                  </span>
                  <span>Cash on Delivery</span>
                  <span className="text-[#84a4bc]">(Pay when delivered)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Order Summary</h2>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <p className="text-[#84a4bc]">Subtotal ({totalItems} items)</p>
              <p className="text-[#607d9e]">₹{subtotal.toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#84a4bc]">Delivery Fee</p>
              <p className="text-[#607d9e]">FREE</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#84a4bc]">GST (18%)</p>
              <p className="text-[#607d9e]">₹{gst.toLocaleString()}</p>
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between text-lg font-semibold">
              <p>Total</p>
              <p>₹{total.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-[#84a4bc] text-sm mb-6">
            Free delivery on orders above ₹5,000
          </p>
          <p className="text-[#84a4bc] text-sm">
            <input type="checkbox" id="delivery" className="mr-2" />
            <label htmlFor="delivery">Estimated delivery - 5 business days</label>
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBackToReview}
          className="px-6 py-3 bg-[#e0e6eb] text-[#607d9e] rounded-lg hover:bg-[#d0d5db] transition"
        >
          Back to Review
        </button>
        <button
          onClick={handlePlaceOrder}
          className="px-8 py-3 bg-[#607d9e] text-white rounded-lg hover:bg-[#84a4bc] transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Payment;
