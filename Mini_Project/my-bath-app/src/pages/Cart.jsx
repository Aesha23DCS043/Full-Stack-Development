import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, addToCart, removeFromCart, clearCart, loading, refreshCart } = useCart();
  const { show } = useToast();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const inc = (it) => addToCart(it, 1);
  const dec = (it) => {
    if (it.qty <= 1) return removeFromCart(it.id);
    // add negative one by reconstructing
    addToCart({ ...it }, -1);
  };

  const checkout = () => {
    if (!items.length) return;
    navigate('/checkout');
  };

  const handleRefresh = async () => {
    await refreshCart();
    show('Cart refreshed', 'success');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Your Cart</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-gray-600 dark:text-gray-300 text-center py-8">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            Loading cart...
          </div>
        ) : items.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">Your cart is empty.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{it.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{it.brand}</div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">₹{(it.price).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => dec(it)} className="p-1.5 rounded border hover:bg-gray-50 dark:hover:bg-gray-700"><Minus size={16}/></button>
                    <span className="w-8 text-center">{it.qty}</span>
                    <button onClick={() => inc(it)} className="p-1.5 rounded border hover:bg-gray-50 dark:hover:bg-gray-700"><Plus size={16}/></button>
                  </div>
                  <button onClick={() => removeFromCart(it.id)} className="p-2 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={() => { clearCart(); show('Cart cleared', 'info'); }} className="text-sm text-red-600 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20">Clear Cart</button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700 h-max">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span>Shipping</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <button onClick={checkout} className="w-full mt-4 rounded-lg bg-[#2d3b54] text-white py-2 hover:bg-[#3b4f72] transition">Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
