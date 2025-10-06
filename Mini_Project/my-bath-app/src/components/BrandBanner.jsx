import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BrandBanner = () => {
  const [shine, setShine] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShine((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] text-white flex items-center justify-center overflow-hidden">

      {/* Proper video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover top-0 left-0"
      >
        <source src="src/assets/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div className="text-sm font-semibold flex items-center justify-center mb-2 text-white">
          <span className="text-yellow-400 mr-2">⭐</span>
          Premium Bath Accessories
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span
            className={`inline-block ${shine ? 'text-[#778e9b]' : 'text-gray-300'} transition-colors duration-500`}
            style={{
              textShadow: shine
                ? '0 0 10px rgba(82, 162, 228, 0.46), 0 0 20px rgba(255, 255, 255, 0.5)'
                : '0 0 5px rgba(128, 128, 128, 0.5)',
            }}
          >
            Transform Your
          </span>
          <br />
          <span
            className={`inline-block ${shine ? 'text-[#778e9b]' : 'text-gray-300'} transition-colors duration-500`}
            style={{
              textShadow: shine
                ? '0 0 10px rgba(255, 255, 255, 0.37), 0 0 20px rgba(255, 255, 255, 0.5)'
                : '0 0 5px #778e9b',
            }}
          >
            Bathroom Experience
          </span>
        </h1>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Discover luxury bathroom accessories from premium brands like Jaguar, Kohler, and Hindware. Elevate your space with sophisticated design and unmatched quality.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/brands" className="bg-[#778e9b] hover:bg-blue-300 text-white px-6 py-2 rounded-full transition-colors duration-300">
            Explore Collection <span>&rarr;</span>
          </Link>
          <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full transition-colors duration-300">
            Watch Video
          </button>
        </div>
        <div className="flex justify-center mt-6 space-x-8 text-sm text-gray-200">
          <span>500+ Premium Products</span>
          <span>15+ Luxury Brands</span>
          <span>10K+ Happy Customers</span>
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  );
};

export default BrandBanner;
