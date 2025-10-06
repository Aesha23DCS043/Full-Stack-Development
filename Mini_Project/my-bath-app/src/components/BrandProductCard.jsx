import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const BrandProductCard = ({ product, brand }) => {
  const { addToCart } = useCart();
  const { show } = useToast();

  const handleAdd = () => {
    const priceNumber = Number(product.discountNumeric ?? product.priceNumeric ?? 0);
    const cartItem = {
      id: `${brand}-${product.slug}`,
      productId: product.slug, // when coming from backend, slug is _id
      name: product.name,
      price: priceNumber,
      image: product.image,
      brand,
    };
    addToCart(cartItem, 1);
    show(`${product.name} added to cart`, 'success');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition">
      <div className="w-full h-48 bg-[#f0f4f7] dark:bg-gray-900/40 flex items-center justify-center rounded-lg mb-3 overflow-hidden">
        <img src={product.image} alt={product.name} className="max-h-full object-contain" />
      </div>
      <p className="text-[#84a4bc] text-xs mb-1">{product.category || 'Bathware'}</p>
      <h3 className="text-[#2d3b54] dark:text-gray-100 font-medium mb-1">{product.name}</h3>
      <div className="flex items-center justify-center gap-1 text-yellow-500 text-sm mb-1">
        <Star size={14} fill="#fbbf24" color="#fbbf24" />
        <span className="text-gray-600 dark:text-gray-300">{product.rating ?? 4.7}</span>
      </div>
      <div className="text-[#2d3b54] dark:text-gray-200 mb-3 flex items-center justify-center gap-2">
        {product.price && (
          <span className="line-through opacity-60">{product.price}</span>
        )}
        <span className="text-[#ff4d4d] font-semibold">{product.discountPrice || formatINR(product.discountNumeric)}</span>
      </div>
      <button onClick={handleAdd} className="w-full inline-flex items-center justify-center gap-2 bg-[#2d3b54] text-white py-2 rounded-lg hover:bg-[#3b4f72] transition">
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  );
};

export default BrandProductCard;
