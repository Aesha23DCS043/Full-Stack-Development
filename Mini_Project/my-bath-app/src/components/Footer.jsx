import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#b8b1a9']">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-shimmer">LuxBath</h3>
            <p className="text-evening-dove-foreground/80 leading-relaxed">
              Transform your bathroom into a luxurious spa experience with our premium 
              collection of bathroom accessories from world-renowned brands.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-evening-dove-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-evening-dove-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-evening-dove-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-evening-dove-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                Home
              </Link>
              <Link to="/about" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                About Us
              </Link>
              <Link to="/contact" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                Contact
              </Link>
              <Link to="/cart" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                Shopping Cart
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold">Categories</h4>
            <nav className="flex flex-col space-y-3">
              <Link to="/category/taps" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                Taps
              </Link>
              <Link to="/category/sinks" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                Sinks
              </Link>
              <Link to="/category/showers" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                Showers
              </Link>
              <Link to="/category/accessories" className="text-evening-dove-foreground/80 hover:text-accent transition-colors duration-300">
                Accessories
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <p className="text-evening-dove-foreground/80">
                  123 Luxury Street,<br />
                  Premium District,<br />
                  City 12345
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-evening-dove-foreground/80">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-evening-dove-foreground/80">info@luxbath.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-evening-dove-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-evening-dove-foreground/60 text-sm">
              © 2024 LuxBath. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-evening-dove-foreground/60 hover:text-accent transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-evening-dove-foreground/60 hover:text-accent transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-evening-dove-foreground/60 hover:text-accent transition-colors duration-300">
                Shipping Info
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;