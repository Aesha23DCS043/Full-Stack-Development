import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // Adjust path as needed
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

const Confirmation = () => {
  const [order, setOrder] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart() || {};

  useEffect(() => {
    // Get order data passed from Payment page
    if (location.state?.order) {
      setOrder(location.state.order);
    }
  }, [location.state]);

  const handleCancelOrder = () => {
    if (isCancelling || !clearCart) return;
    
    setIsCancelling(true);
    
    // Simulate cancellation processing
    setTimeout(() => {
      try {
        if (clearCart) {
          clearCart(); // Clear the cart
        }
        setIsCancelling(false);
        navigate('/'); // Navigate back to home
      } catch (error) {
        console.error('Error cancelling order:', error);
        setIsCancelling(false);
        alert('Error cancelling order. Please try again.');
      }
    }, 1500);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#e8ecef] text-[#607d9e] p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-[#84a4bc]">Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecef] text-[#607d9e] p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-[#607d9e] mb-4">Order Confirmed!</h1>
          <p className="text-[#84a4bc] mb-8">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Order Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-medium">#{Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-medium">₹{order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span className="font-medium">5-7 business days</span>
            </div>
            <div className="flex justify-between">
              <span>Order Status:</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#607d9e] mb-4">Order Items</h3>
          <div className="space-y-3">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mr-3 rounded" />
                  <div>
                    <p className="text-[#607d9e] font-medium">{item.name}</p>
                    <p className="text-[#84a4bc] text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-[#607d9e]">₹{(item.discountPrice * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#607d9e] mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#607d9e] font-medium">Name:</p>
              <p className="text-[#84a4bc]">{order.firstName} {order.lastName}</p>
            </div>
            <div>
              <p className="text-[#607d9e] font-medium">Email:</p>
              <p className="text-[#84a4bc]">{order.email}</p>
            </div>
            <div>
              <p className="text-[#607d9e] font-medium">Phone:</p>
              <p className="text-[#84a4bc]">{order.phone}</p>
            </div>
            <div>
              <p className="text-[#607d9e] font-medium">Address:</p>
              <p className="text-[#84a4bc]">{order.address}</p>
              <p className="text-[#84a4bc]">{order.city}, {order.state} - {order.pincode}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 justify-center mb-8">
          <Link
            to="/"
            className="px-6 py-3 bg-[#e0e6eb] text-[#607d9e] rounded-lg hover:bg-[#d0d5db] transition"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-[#607d9e] text-white rounded-lg hover:bg-[#84a4bc] transition"
          >
            Print Receipt
          </button>
        </div>

        {/* Cancel Order Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <XCircle size={24} className="text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-red-800">Cancel Order</h3>
          </div>
          <p className="text-red-700 mb-4">
            You can cancel this order within 30 minutes of placement. Note that the order will be cancelled and your payment will be refunded within 5-7 business days.
          </p>
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isCancelling 
                ? 'bg-red-300 text-red-700 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isCancelling ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Cancelling Order...
              </>
            ) : (
              'Cancel Order'
            )}
          </button>
          {isCancelling && (
            <p className="text-sm text-red-600 mt-2">Processing cancellation. Please wait...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
