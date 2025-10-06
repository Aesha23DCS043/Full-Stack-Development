import React from "react";
import { Link } from "react-router-dom";
import BrandProductCard from "../../components/BrandProductCard";
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../../utils/api";

const Hindware = () => {
  return (
    <div className="min-h-screen w-screen bg-[#f5f7fa] dark:bg-gray-900 text-[#607d9e] p-6">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="text-sm mb-4 inline-block hover:underline"
      >
        &larr; Back to Home
      </Link>

      {/* Brand Overview Section */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8">
        <div className="flex-1">
          <span className="inline-block bg-[#e0e6eb] text-[#607d9e] text-sm px-3 py-1 rounded-full mb-2">
            Premium Brand
          </span>
          <h1 className="text-4xl font-bold text-[#607d9e] mb-2">Hindware</h1>
          <p className="text-[#607d9e] mb-4">
            Hindware is a leading bathroom solutions brand in India, recognized
            for its stylish, durable, and innovative sanitaryware and fittings.
            With decades of trust, Hindware offers a wide portfolio of products
            catering to modern households and commercial spaces.
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-[#84a4bc]">Founded</span> 1960
            </p>
            <p>
              <span className="text-[#84a4bc]">Headquarters</span> Gurugram,
              India
            </p>
            <p>
              <span className="text-[#84a4bc]">Products</span> 3 Items
            </p>
            <p>
              <span className="text-[#84a4bc]">Specialties</span> 4 Areas
            </p>
          </div>
        </div>
        <div className="w-54 h-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center rounded-xl shadow-sm p-4">
          <img src="/images/hindwar_logo.png" alt="Hindware Logo" className="h-full object-contain" />
        </div>
      </div>

      {/* Specialties Section */}
      <div className="w-full mt-8">
        <h2 className="text-2xl font-semibold text-[#607d9e] mb-2">
          Our Specialties
        </h2>
        <p className="text-[#84a4bc] mb-4">
          Hindware excels in these key areas, delivering innovation and trust
          for every home.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "Sanitaryware",
            "Bathroom Fittings",
            "Wellness Solutions",
            "Tiles & Accessories",
          ].map((specialty) => (
            <div
              key={specialty}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center h-32 text-center hover:shadow-md transition"
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
          <h2 className="text-2xl font-semibold text-[#607d9e]">
            Hindware Products
          </h2>
        </div>
        <p className="text-[#84a4bc] mb-4">
          Explore Hindware’s premium range of sanitaryware and bathroom
          fittings, crafted with precision to match modern lifestyles.
        </p>
        {(() => {
          const local = [
            { slug: 'hindware-wall-hung-basin', name: 'Hindware Wall Hung Basin', price: '₹8,500', discountPrice: '₹5,200', discountNumeric: 5200, rating: 4.8, image: '/itemimg/hindware_sink.jpg', category: 'Basins' },
            { slug: 'hindware-overhead-shower', name: 'Hindware Overhead Shower', price: '₹12,000', discountPrice: '₹7,500', discountNumeric: 7500, rating: 4.7, image: '/itemimg/hindware_shower.jpg', category: 'Showers' },
            { slug: 'hindware-floor-mounted-wc', name: 'Hindware Floor Mounted WC', price: '₹15,000', discountPrice: '₹10,000', discountNumeric: 10000, rating: 4.6, image: '/itemimg/hindware_wc.jpeg', category: 'WC' },
          ];
          const [remote, setRemote] = useState([]);
          useEffect(() => {
            (async () => {
              try {
                const data = await getProducts({ brandName: 'Hindware' });
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
                <BrandProductCard key={p.slug} product={p} brand="Hindware" />
              ))}
            </div>
          );
        })()}
        
      </div>
    </div>
  );
};

export default Hindware;
