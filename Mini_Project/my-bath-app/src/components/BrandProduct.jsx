import Reveal from './Reveal';
import { Link } from 'react-router-dom';

function BrandsProduct() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-16">
      <div className="text-center max-w-6xl px-4 w-full">
        <span className="inline-block bg-gray-100 text-gray-500 text-sm px-3 py-1 rounded-full mb-4">
          Premium Brands
        </span>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          World-Class Bathroom Brands
        </h1>
        <p className="text-gray-600 mb-8">
          Partner with the most trusted names in luxury bathroom accessories.
          Each brand brings decades of innovation and craftsmanship to your space.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Jaguar',
              slug: 'jaquar',
              products: '200+',
              desc: 'Premium bathroom solutions with innovative design and superior craftsmanship',
              rating: 4.9,
              img: '/images/jaguar_logo.png', // Path relative to public folder
            },
            {
              name: 'Kohler',
              slug: 'kohler',
              products: '150+',
              desc: 'Bold design and unmatched durability for the modern bathroom',
              rating: 4.8,
              img: '/images/kohler_logo.png', // Ensure this file exists
            },
            {
              name: 'Hindware',
              slug: 'hindware',
              products: '120+',
              desc: 'Trusted quality and elegant designs for every home',
              rating: 4.7,
              img: '/images/hindwar_logo.png', // Ensure this file exists
            },
            {
              name: 'KIDLEN',
              slug: 'kidlen',
              products: '80+',
              desc: 'Contemporary luxury with cutting-edge technology',
              rating: 4.6,
              img: '/images/kidlen_logo.jpg', // Ensure this file exists
            },
          ].map((brand, index) => (
            <Reveal key={index} className="w-full" >
              <Link to={`/brands/${brand.slug}`} className="block group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transform transition-transform duration-200 hover:scale-105" style={{ transitionDelay: `${index * 80}ms` }}>
                <div className="bg-white p-4 rounded-lg shadow-md text-left group-hover:shadow-lg transition-shadow">
                  <img
                    src={brand.img}
                    alt={`${brand.name} logo`}
                    className="w-full h-24 object-contain mb-3 rounded-md"
                  />
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{brand.name}</h2>
                  <div className="text-gray-500 text-sm mb-2 flex items-center">
                    <span className="inline-flex items-center bg-yellow-300 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                      ★ {brand.rating}
                    </span>
                    {brand.products}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{brand.desc}</p>
                  <span className="text-blue-600 group-hover:text-blue-800 font-medium transition-colors inline-flex items-center">
                    Explore {brand.name} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Link to="/brands" className="inline-block mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors">
          View All Brands →
        </Link>
      </div>
    </div>
  );
}

export default BrandsProduct;