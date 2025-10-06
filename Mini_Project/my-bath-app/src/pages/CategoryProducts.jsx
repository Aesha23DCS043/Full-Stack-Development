import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BrandProductCard from '../components/BrandProductCard';
import { getProducts } from '../utils/api';

const CATEGORY_TITLE = {
  taps: 'Taps',
  showers: 'Showers',
  sinks: 'Sinks',
};

const allProducts = [
  // Taps
  { slug: 'jaquar-tap', name: 'Jaquar Tap', discountNumeric: 12000, discountPrice: '₹12,000', price: '₹18,000', rating: 4.7, image: '/itemimg/jaq3.jpeg', category: 'Taps', brand: 'Jaquar' },
  { slug: 'kohler-modern-faucet', name: 'Kohler Modern Faucet', discountNumeric: 10500, discountPrice: '₹10,500', price: '₹15,000', rating: 4.9, image: '/images/kohler_faucet.png', category: 'Taps', brand: 'Kohler' },
  { slug: 'kidlen-premium-basin-mixer', name: 'Kidlen Premium Basin Mixer', discountNumeric: 6200, discountPrice: '₹6,200', price: '₹10,500', rating: 4.7, image: '/itemimg/kidlen1.jpeg', category: 'Taps', brand: 'Kidlen' },
  // Showers
  { slug: 'jaquar-maze-shower-system', name: 'Jaquar Maze Shower System', discountNumeric: 9000, discountPrice: '₹9,000', price: '₹25,000', rating: 4.8, image: '/itemimg/jaq2.jpeg', category: 'Showers', brand: 'Jaquar' },
  { slug: 'kohler-rain-shower-system', name: 'Kohler Rain Shower System', discountNumeric: 22000, discountPrice: '₹22,000', price: '₹35,000', rating: 4.8, image: '/images/kohler_shower.png', category: 'Showers', brand: 'Kohler' },
  { slug: 'hindware-overhead-shower', name: 'Hindware Overhead Shower', discountNumeric: 7500, discountPrice: '₹7,500', price: '₹12,000', rating: 4.7, image: '/itemimg/hindware_shower.jpg', category: 'Showers', brand: 'Hindware' },
  // Sinks
  { slug: 'hindware-wall-hung-basin', name: 'Hindware Wall Hung Basin', discountNumeric: 5200, discountPrice: '₹5,200', price: '₹8,500', rating: 4.8, image: '/itemimg/hindware_sink.jpg', category: 'Sinks', brand: 'Hindware' },
  { slug: 'kidlen-smart-wc', name: 'Kidlen Smart WC', discountNumeric: 9800, discountPrice: '₹9,800', price: '₹16,000', rating: 4.6, image: '/itemimg/kidlen3.jpeg', category: 'Sinks', brand: 'Kidlen' },
  { slug: 'kohler-smart-toilet', name: 'Kohler Smart Toilet', discountNumeric: 65000, discountPrice: '₹65,000', price: '₹80,000', rating: 4.7, image: '/images/kohler_toilet.png', category: 'Sinks', brand: 'Kohler' },
];

const CategoryProducts = () => {
  const { slug } = useParams();
  const title = CATEGORY_TITLE[slug] || 'Category';

  const [remote, setRemote] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts({ categoryName: title });
        // Map backend products to BrandProductCard shape
        const mapped = (data.products || []).map(p => ({
          slug: p._id,
          name: p.name,
          discountNumeric: p.price,
          discountPrice: `₹${Number(p.price).toLocaleString('en-IN')}`,
          price: p.originalPrice ? `₹${Number(p.originalPrice).toLocaleString('en-IN')}` : undefined,
          rating: p.rating?.average ?? 4.7,
          image: p.images?.[0] || '/public/placeholder.png',
          category: p.category?.name || title,
          brand: p.brand?.name || 'Brand',
        }));
        setRemote(mapped);
      } catch (e) {
        setRemote([]);
      }
    })();
  }, [title]);

  const products = useMemo(() => {
    if (remote.length) return remote;
    if (slug === 'taps') return allProducts.filter(p => p.category.toLowerCase() === 'taps');
    if (slug === 'showers') return allProducts.filter(p => p.category.toLowerCase() === 'showers');
    if (slug === 'sinks') return allProducts.filter(p => p.category.toLowerCase() === 'sinks');
    return [];
  }, [slug, remote]);

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-sm"><Link to="/" className="hover:underline">Home</Link> {">"} <span className="capitalize">{title}</span></div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-gray-600 dark:text-gray-300">Explore {title.toLowerCase()} across premium brands. Add items to your cart and checkout.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <BrandProductCard key={`${slug}-${p.slug}`} product={p} brand={p.brand} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
