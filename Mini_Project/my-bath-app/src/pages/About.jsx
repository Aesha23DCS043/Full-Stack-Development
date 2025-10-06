import React from 'react';
import Reveal from '../components/Reveal';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-[#e8ecef] text-[#607d9e] p-6 animate-fade-in">
      {/* Header Section */}
      <Reveal>
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: '60ms' }}>
          <h1 className="text-5xl font-bold text-[#607d9e] mb-2">About LuxBath</h1>
          <p className="text-[#84a4bc] mb-8">
            Transforming bathrooms into luxury sanctuaries with premium accessories from the world's finest brands. We believe your bathroom should be a space of comfort, elegance, and functionality.
          </p>
        </div>
      </Reveal>

      {/* Mission Section */}
      <Reveal>
        <div className="max-w-4xl mx-auto mt-12 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <h2 className="text-3xl font-semibold text-[#607d9e] mb-6">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#607d9e] mb-4">
                At LuxBath, we're passionate about elevating your daily routines through exceptional design and quality. Our carefully curated collection features premium bathroom accessories that blend aesthetic appeal with practical functionality.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[#84a4bc]">Premium Quality</span>
                <span className="text-[#84a4bc]">&#x1F4C2;</span>
                <p className="text-[#607d9e]">
                  We partner with world-renowned brands to bring you the finest bathroom accessories that combine luxury with functionality.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#84a4bc]">Expert Team</span>
                <span className="text-[#84a4bc]">&#x1F465;</span>
                <p className="text-[#607d9e]">
                  Our team of designers and engineers work closely with manufacturers to ensure every product meets our high standards.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#84a4bc]">Warranty Assured</span>
                <span className="text-[#84a4bc]">&#x1F6E1;</span>
                <p className="text-[#607d9e]">
                  Every product comes with comprehensive warranty coverage and our commitment to customer satisfaction.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#84a4bc]">Fast Delivery</span>
                <span className="text-[#84a4bc]">&#x1F4E6;</span>
                <p className="text-[#607d9e]">
                  Quick and secure delivery nationwide with professional installation services available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Brand Partners Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-3xl font-semibold text-[#607d9e] mb-6">Our Brand Partners</h2>
        <p className="text-[#84a4bc] mb-8">
          We've carefully selected partnerships with industry leaders who share our vision for luxury and quality.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { name: 'Jaquar', year: 'Est: 1960', desc: 'Luxury Taps & Fittings. Leading international brand known for innovative bathroom solutions and contemporary designs.' },
            { name: 'Kohler', year: 'Est: 1873', desc: 'Complete Bathroom Solutions. American heritage brand delivering bold innovation and timeless craftsmanship.' },
            { name: 'Hindware', year: 'Est: 1960', desc: 'Sanitaryware & Faucets. Trusted Indian brand offering comprehensive bathroom and kitchen solutions.' },
            { name: 'KIDLEN', year: 'Est: 2010', desc: 'Smart Bathroom Fixtures. Premium brand focusing on modern elegance and cutting-edge bathroom technology.' },
          ].map((partner, idx) => (
            <Reveal key={partner.name}>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition animate-fade-in-up" style={{ animationDelay: `${200 + idx * 80}ms` }}>
                <h3 className="text-lg font-medium text-[#607d9e]">{partner.name}</h3>
                <p className="text-[#84a4bc] text-sm mb-2">{partner.year}</p>
                <p className="text-[#607d9e] text-sm">{partner.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Why Choose LuxBath Section */}
      <Reveal>
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-3xl font-semibold text-[#607d9e] mb-6">Why Choose LuxBath?</h2>
          <p className="text-[#84a4bc] mb-8">
            More than just a retailer, we're your partners in creating the bathroom of your dreams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Reveal>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition animate-fade-in-up" style={{ animationDelay: '260ms' }}>
                <span className="text-[#84a4bc] mb-2 inline-block">&#x1F4C2;</span>
                <h3 className="text-[#607d9e] font-medium mb-2">Premium Quality</h3>
                <p className="text-[#607d9e] text-sm">
                  We partner with world-renowned brands to bring you the finest bathroom accessories that combine luxury with functionality.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                <span className="text-[#84a4bc] mb-2 inline-block">&#x1F465;</span>
                <h3 className="text-[#607d9e] font-medium mb-2">Expert Team</h3>
                <p className="text-[#607d9e] text-sm">
                  Our team of designers and engineers work closely with manufacturers to ensure every product meets our high standards.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                <span className="text-[#84a4bc] mb-2 inline-block">&#x1F6E1;</span>
                <h3 className="text-[#607d9e] font-medium mb-2">Warranty Assured</h3>
                <p className="text-[#607d9e] text-sm">
                  Every product comes with comprehensive warranty coverage and our commitment to customer satisfaction.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                <span className="text-[#84a4bc] mb-2 inline-block">&#x1F4E6;</span>
                <h3 className="text-[#607d9e] font-medium mb-2">Fast Delivery</h3>
                <p className="text-[#607d9e] text-sm">
                  Quick and secure delivery nationwide with professional installation services available.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default About;