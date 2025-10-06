import React from 'react';
import { Link } from 'react-router-dom';
import BrandProductCard from '../../components/BrandProductCard';
import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../../utils/api';

const Kidlen = () => {
  return (
    <div className="min-h-screen w-screen bg-[#f5f7fa] dark:bg-gray-900 text-[#607d9e] p-6">
      {/* Back to Home Link */}
      <Link to="/" className="text-sm mb-4 inline-block hover:underline">&larr; Back to Home</Link>

      {/* Brand Overview Section */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8">
        <div className="flex-1">
          <span className="inline-block bg-[#e0e6eb] text-[#607d9e] text-sm px-3 py-1 rounded-full mb-2">
            Premium Brand
          </span>
          <h1 className="text-4xl font-bold text-[#607d9e] mb-2">Kidlen</h1>
          <p className="text-[#607d9e] mb-4">
            Kidlen is a trusted brand in bathroom solutions, offering a wide range of modern and stylish 
            sanitaryware, faucets, and accessories. Known for durability and customer satisfaction, Kidlen 
            provides reliable products designed to enhance every bathroom experience.
          </p>
          <div className="space-y-2 text-sm">
            <p><span className="text-[#84a4bc]">Founded</span> 2011</p>
            <p><span className="text-[#84a4bc]">Headquarters</span> Bangluru, India</p>
            <p><span className="text-[#84a4bc]">Products</span> 3 Items</p>
            <p><span className="text-[#84a4bc]">Specialties</span> 4 Areas</p>
          </div>
        </div>
        <div className="w-54 h-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center rounded-xl shadow-sm p-4">
          <img src="/images/kidlen_logo.jpg" alt="Kidlen Logo" className="h-full object-contain" />
        </div>
      </div>

      {/* Specialties Section */}
      <div className="w-full mt-8">
        <h2 className="text-2xl font-semibold text-[#607d9e] mb-2">Our Specialties</h2>
        <p className="text-[#84a4bc] mb-4">
          Kidlen excels in these core areas, offering innovative and high-quality solutions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Sanitaryware', 'Bathroom Fittings', 'Faucets', 'Accessories'].map((specialty) => (
            <div
              key={specialty}
              className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-32 text-center hover:shadow-md transition"
            >
              <span className="text-[#84a4bc]">{specialty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="w-full mt-8">
        <div className="flex items-center mb-4">
          <span className="inline-block bg-[#e0e6eb] text-[#607d9e] text-sm px-3 py-1 rounded-full mr-2">
            Premium Collection
          </span>
          <h2 className="text-2xl font-semibold text-[#607d9e]">Kidlen Products</h2>
        </div>
        <p className="text-[#84a4bc] mb-4">
          Explore Kidlen’s premium collection of bathroom fittings and sanitaryware, 
          designed with precision and crafted for comfort.
        </p>
        {(() => {
          const local = [
            { slug: 'kidlen-premium-basin-mixer', name: 'Kidlen Premium Basin Mixer', price: '₹10,500', discountPrice: '₹6,200', discountNumeric: 6200, rating: 4.7, image: '/itemimg/kidlen1.jpeg', category: 'Mixers' },
            { slug: 'kidlen-luxury-shower-system', name: 'Kidlen Luxury Shower System', price: '₹20,000', discountPrice: '₹11,500', discountNumeric: 11500, rating: 4.8, image: '/itemimg/kidlen2.jpeg', category: 'Showers' },
            { slug: 'kidlen-smart-wc', name: 'Kidlen Smart WC', price: '₹16,000', discountPrice: '₹9,800', discountNumeric: 9800, rating: 4.6, image: '/itemimg/kidlen3.jpeg', category: 'WC' },
          ];
          const [remote, setRemote] = useState([]);
          useEffect(() => {
            (async () => {
              try {
                const data = await getProducts({ brandName: 'Kidlen' });
                const mapped = (data.products || []).map(p => ({
                  slug: p._id,
                  name: p.name,
                  discountNumeric: p.price,
                  discountPrice: `₹${Number(p.price).toLocaleString('en-IN')}`,
                  price: p.originalPrice ? `₹${Number(p.originalPrice).toLocaleString('en-IN')}` : undefined,
                  rating: p.rating?.average ?? 4.7,
                  image: p.images?.[0] || '/public/placeholder.png',
                  category: p.category?.name || 'Category'
                }));
                setRemote(mapped);
              } catch {
                setRemote([]);
              }
            })();
          }, []);
          const products = useMemo(() => (remote.length ? remote : local), [remote]);
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <BrandProductCard key={p.slug} product={p} brand="Kidlen" />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Kidlen;
