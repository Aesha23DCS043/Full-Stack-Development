import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const brands = [
  { name: 'Jaguar', slug: 'jaquar', rating: 4.9, products: '200+', img: '/images/jaguar_logo.png' },
  { name: 'Kohler', slug: 'kohler', rating: 4.8, products: '150+', img: '/images/kohler_logo.png' },
  { name: 'Hindware', slug: 'hindware', rating: 4.7, products: '120+', img: '/images/hindwar_logo.png' },
  { name: 'KIDLEN', slug: 'kidlen', rating: 4.6, products: '80+', img: '/images/kidlen_logo.jpg' },
];

export default function AllBrands() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block bg-gray-100 text-gray-500 text-sm px-3 py-1 rounded-full mb-4">All Brands</span>
          <h1 className="text-4xl font-bold text-gray-800">Explore Premium Brands</h1>
          <p className="text-gray-600 mt-2">Choose a brand to view its collection.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <Reveal key={brand.slug}>
              <Link
                to={`/brands/${brand.slug}`}
                className="block group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transform transition-transform duration-200 hover:scale-105"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="bg-white p-4 rounded-lg shadow-md text-left group-hover:shadow-lg transition-shadow">
                  <img src={brand.img} alt={`${brand.name} logo`} className="w-full h-24 object-contain mb-3 rounded-md" />
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{brand.name}</h2>
                  <div className="text-gray-500 text-sm mb-2 flex items-center">
                    <span className="inline-flex items-center bg-yellow-300 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">★ {brand.rating}</span>
                    {brand.products}
                  </div>
                  <p className="text-blue-600 group-hover:text-blue-800 font-medium transition-colors inline-flex items-center">Explore {brand.name} →</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
