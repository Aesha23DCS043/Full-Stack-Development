import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, ChevronDown, Sun, Moon, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import '../pages/Login';
import '../pages/Brands/Hindware';
import '../pages/Brands/Jaquar';
import '../pages/Brands/Kidlen';
import '../pages/Brands/Kohler';
import '../pages/About'; 


const Navbar = () => {
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandsRef = useRef(null);
  const categoriesRef = useRef(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandsOpen && brandsRef.current && !brandsRef.current.contains(e.target)) {
        setBrandsOpen(false);
      }
      if (categoriesOpen && categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setBrandsOpen(false);
        setCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [brandsOpen, categoriesOpen]);

  return (
    <nav className="w-full bg-[#faf7f0] dark:bg-gray-900 shadow-sm border-b border-gray-200/60 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-md border border-gray-300 dark:border-gray-700" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <Link to="/" className="text-2xl font-serif tracking-wide text-[#2d3b54] dark:text-gray-100">LuxBath</Link>
        </div>

        {/* Center: Nav links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/" className="lux-link">Home</Link>
          <div
            className="relative"
            ref={brandsRef}
            onMouseEnter={() => { setBrandsOpen(true); setCategoriesOpen(false); }}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <button className="lux-link flex items-center" aria-haspopup="true" aria-expanded={brandsOpen}>Brands <ChevronDown size={16} className="ml-1" /></button>
            {brandsOpen && (
              <div className="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl py-2 w-44 z-20 border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                <Link to="/brands/hindware" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Hindware</Link>
                <Link to="/brands/jaquar" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Jaquar</Link>
                <Link to="/brands/kidlen" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Kidlen</Link>
                <Link to="/brands/kohler" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Kohler</Link>
              </div>
            )}
          </div>
          <div
            className="relative"
            ref={categoriesRef}
            onMouseEnter={() => { setCategoriesOpen(true); setBrandsOpen(false); }}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="lux-link flex items-center" aria-haspopup="true" aria-expanded={categoriesOpen}>Categories <ChevronDown size={16} className="ml-1" /></button>
            {categoriesOpen && (
              <div className="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl py-2 w-44 z-20 border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                <Link to="/categories/taps" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Taps</Link>
                <Link to="/categories/sinks" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Sinks</Link>
                <Link to="/categories/showers" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Showers</Link>
              </div>
            )}
          </div>
          <Link to="/about" className="lux-link">About Us</Link>
          <Link to="/contact" className="lux-link">Contact</Link>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {/* Theme icon */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-full p-2 border border-gray-300 dark:border-gray-700 hover:shadow-sm transition"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center bg-[#2d3b54] text-white px-3 py-1.5 rounded-lg hover:bg-[#3b4f72] transition">
            <ShoppingCart size={18} className="mr-1.5" />
            <span className="font-medium hidden sm:inline">Cart</span>
            <span className="absolute -top-2 -right-2 bg-[#bfa76f] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{itemCount}</span>
          </Link>

          {/* Auth */}
          {user ? (
            <Link to="/profile" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#2d3b54] text-white flex items-center justify-center uppercase shadow">
                {user.name?.[0] || 'U'}
              </div>
              <span className="hidden sm:inline text-[#2d3b54] dark:text-gray-200 font-medium max-w-[140px] truncate">{user.name}</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="px-4 py-1.5 rounded-full border border-[#2d3b54] text-[#2d3b54] hover:bg-[#2d3b54] hover:text-white transition">Login</Link>
              <Link to="/signup" className="px-4 py-1.5 rounded-full bg-[#bfa76f] text-white hover:brightness-95 transition">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-serif">LuxBath</span>
              <button className="p-2 rounded-md border" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button>
            </div>
            <nav className="space-y-2">
              <Link to="/" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Home</Link>
              <div>
                <div className="px-3 py-2 text-sm uppercase text-gray-500">Brands</div>
                <Link to="/brands/hindware" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Hindware</Link>
                <Link to="/brands/jaquar" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Jaquar</Link>
                <Link to="/brands/kidlen" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Kidlen</Link>
                <Link to="/brands/kohler" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Kohler</Link>
              </div>
              <div>
                <div className="px-3 py-2 text-sm uppercase text-gray-500">Categories</div>
                <Link to="/categories/taps" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Taps</Link>
                <Link to="/categories/sinks" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Sinks</Link>
                <Link to="/categories/showers" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">Showers</Link>
              </div>
              <Link to="/about" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">About Us</Link>
              <Link to="/contact" onClick={()=>setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Contact</Link>

              {!user && (
                <div className="pt-4 flex gap-2">
                  <Link to="/login" onClick={()=>setMobileOpen(false)} className="flex-1 px-4 py-2 rounded-full border border-[#2d3b54] text-[#2d3b54] hover:bg-[#2d3b54] hover:text-white transition">Login</Link>
                  <Link to="/signup" onClick={()=>setMobileOpen(false)} className="flex-1 px-4 py-2 rounded-full bg-[#bfa76f] text-white hover:brightness-95 transition">Sign Up</Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;