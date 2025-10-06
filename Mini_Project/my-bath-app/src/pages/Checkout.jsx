import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // Adjust path based on your structure
import { useAuth } from '../context/AuthContext';
import { getProduct, getMyAddress } from '../utils/api.js';

const Checkout = () => {
  const { items: ctxItems } = useCart() || {}; // items are { id, qty }
  const { user, token } = useAuth();
  const sourceItems = Array.isArray(ctxItems) ? ctxItems : [];
  const [cartItems, setCartItems] = useState([]); // enriched items with details + quantity
  const [loading, setLoading] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const navigate = useNavigate();

  // Helpers to normalize item fields
  const getItemPrice = (item) => {
    // Support both flat and nested product shapes
    const src = item?.product || item;
    const p = src?.discountPrice ?? src?.salePrice ?? src?.price ?? src?.mrp ?? 0;
    return Number(p) || 0;
  };
  const getItemQty = (item) => Number(item?.quantity) || 1;
  const getItemName = (item) => (item?.product?.name || item?.name || item?.title || 'Product');
  const getItemImage = (item) => {
    const src = item?.product || item;
    if (Array.isArray(src?.images) && src.images.length) return src.images[0];
    return src?.image || src?.img || src?.thumbnail || '';
  };

  // Load saved address
  useEffect(() => {
    const loadAddress = async () => {
      if (!token) return;
      try {
        setAddressLoading(true);
        const addressData = await getMyAddress(token);
        if (addressData && addressData.address) {
          setSavedAddress(addressData);
        }
      } catch (error) {
        console.error('Failed to load address:', error);
      } finally {
        setAddressLoading(false);
      }
    };
    loadAddress();
  }, [token]);

  // Enrich items by fetching product details based on id
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!sourceItems.length) {
        if (active) setCartItems([]);
        return;
      }
      setLoading(true);
      try {
        const details = await Promise.all(
          sourceItems.map(async (ci) => {
            try {
              const prod = await getProduct(ci.id);
              return { ...prod, quantity: Number(ci.qty) || 1 };
            } catch {
              // Fallback: preserve whatever fields are already present in cart item (guest carts often store full product data)
              return { ...ci, quantity: Number(ci.qty || ci.quantity) || 1 };
            }
          })
        );
        if (active) setCartItems(details);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [sourceItems]);

  // Calculate subtotal, GST, and total
  const subtotal = cartItems.reduce((sum, item) => sum + getItemPrice(item) * getItemQty(item), 0);
  const gst = subtotal * 0.18; // 18% GST
  const deliveryFee = 0; // Free delivery
  const total = subtotal + gst + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + getItemQty(item), 0);
  const isCartEmpty = sourceItems.length === 0;

  const formatCurrency = (value) =>
    Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const handleContinueToPayment = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-[#e8ecef] text-[#607d9e] p-6">
      {/* Back to Cart Link */}
      <Link to="/cart" className="text-sm mb-4 inline-block hover:underline flex items-center">
        <span className="mr-1">&larr;</span> Back to Cart
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-bold text-[#607d9e] mb-2">Checkout</h1>
      <p className="text-[#84a4bc] mb-8">
        Secure payment for your premium bathroom accessories.
      </p>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        <div className="flex items-center space-x-2">
          <span className="bg-[#607d9e] text-white rounded-full px-3 py-1 text-sm">1</span>
          <span className="text-[#607d9e]">Order Review</span>
        </div>
        <span className="text-[#84a4bc]">—</span>
        <div className="flex items-center space-x-2">
          <span className="bg-[#e0e6eb] text-[#84a4bc] rounded-full px-3 py-1 text-sm">2</span>
          <span className="text-[#84a4bc]">Payment & Details</span>
        </div>
        <span className="text-[#84a4bc]">—</span>
        <div className="flex items-center space-x-2">
          <span className="bg-[#e0e6eb] text-[#84a4bc] rounded-full px-3 py-1 text-sm">3</span>
          <span className="text-[#84a4bc]">Confirmation</span>
        </div>
      </div>

      {/* Review Order and Summary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Review Your Order */}
        <div>
          <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Review Your Order</h2>
          {isCartEmpty ? (
            <p className="text-[#84a4bc]">Your cart is empty.</p>
          ) : loading ? (
            <p className="text-[#84a4bc]">Loading your cart...</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id ?? item._id ?? item.product?._id ?? item.sku} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex items-center">
                  <img
                    src={getItemImage(item)}
                    alt={getItemName(item)}
                    className="w-16 h-16 object-contain mr-4 rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-[#607d9e]">{getItemName(item)}</h3>
                    <p className="text-[#84a4bc] text-sm">Qty: {getItemQty(item)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#84a4bc] text-xs">₹{formatCurrency(getItemPrice(item))} × {getItemQty(item)}</p>
                  <p className="text-[#607d9e] font-medium">₹{formatCurrency(getItemPrice(item) * getItemQty(item))}</p>
                </div>
              </div>
            ))
          )}

          {/* Delivery Address Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Delivery Address</h2>
            {addressLoading ? (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-[#84a4bc]">Loading address...</p>
              </div>
            ) : savedAddress ? (
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#607d9e]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-[#607d9e]">{savedAddress.fullName}</h3>
                  <Link 
                    to="/profile" 
                    className="text-sm text-[#84a4bc] hover:text-[#607d9e] underline"
                  >
                    Edit Address
                  </Link>
                </div>
                <div className="text-[#84a4bc]">
                  <p>{savedAddress.address}</p>
                  <p>{savedAddress.city}, {savedAddress.state} {savedAddress.zip}</p>
                  <p className="mt-2">Phone: {savedAddress.phone}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-dashed border-[#84a4bc]">
                <p className="text-[#84a4bc] mb-2">No saved address found.</p>
                <Link 
                  to="/profile" 
                  className="text-[#607d9e] hover:text-[#84a4bc] underline"
                >
                  Add your address in Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Order Summary</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <p className="text-[#84a4bc]">Subtotal ({totalItems} items)</p>
              <p className="text-[#607d9e]">₹{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-[#84a4bc]">Delivery Fee</p>
              <p className="text-[#607d9e]">FREE</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-[#84a4bc]">GST (18%)</p>
              <p className="text-[#607d9e]">₹{formatCurrency(gst)}</p>
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between mb-4">
              <p className="text-[#607d9e] font-semibold">Total</p>
              <p className="text-[#607d9e] font-semibold">₹{formatCurrency(total)}</p>
            </div>
            <p className="text-[#84a4bc] text-sm mb-4">
              Free delivery on orders above ₹5,000
            </p>
            <button
              onClick={handleContinueToPayment}
              disabled={isCartEmpty}
              aria-disabled={isCartEmpty}
              className={`w-full py-3 rounded-lg transition text-white ${
                isCartEmpty
                  ? 'bg-[#c1cfdb] cursor-not-allowed'
                  : 'bg-[#607d9e] hover:bg-[#84a4bc]'
              }`}
              title={isCartEmpty ? 'Add items to your cart to continue' : 'Proceed to payment'}
            >
              {isCartEmpty ? 'Cart is Empty' : 'Continue to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;