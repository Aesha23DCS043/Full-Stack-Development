import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, ChevronDown, Award, Users, ShieldCheck, Truck, MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#e8ecef] text-[#607d9e] p-6 animate-fade-in">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <h1 className="text-5xl font-bold text-[#607d9e] mb-2">Contact LuxBath</h1>
        <p className="text-[#84a4bc] mb-8">
          Get in touch with us for support, inquiries, or to discuss your bathroom project. We're here to assist you!
        </p>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Send Us a Message</h2>
          <form>
            <div className="mb-4">
              <label className="block text-[#607d9e] mb-2">Full Name</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <User size={18} className="text-[#84a4bc] mr-2" />
                <input
                  type="text"
                  className="w-full outline-none text-[#607d9e]"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[#607d9e] mb-2">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <Mail size={18} className="text-[#84a4bc] mr-2" />
                <input
                  type="email"
                  className="w-full outline-none text-[#607d9e]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[#607d9e] mb-2">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 outline-none text-[#607d9e] h-24 resize-none"
                placeholder="Type your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#607d9e] text-white py-2 rounded-lg flex items-center justify-center hover:bg-[#84a4bc] transition"
            >
              <Send size={18} className="mr-2" /> Send Message
            </button>
          </form>
        </div>

        {/* Company Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#84a4bc]" />
              <p className="text-[#607d9e]">
                LuxBath Headquarters, 123 Luxury Lane, Gurgaon, Haryana, India - 122001
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-[#84a4bc]" />
              <p className="text-[#607d9e]">+91 123 456 7890</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-[#84a4bc]" />
              <p className="text-[#607d9e]">support@luxbath.com</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-medium text-[#607d9e] mb-2">Business Hours</h3>
            <p className="text-[#607d9e]">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
            <p className="text-[#607d9e]">Saturday: 10:00 AM - 2:00 PM IST</p>
            <p className="text-[#607d9e]">Sunday: Closed</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-4xl mx-auto mt-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-2xl font-semibold text-[#607d9e] mb-4">Our Location</h2>
        <div className="w-full h-64 rounded-lg overflow-hidden shadow-sm border border-[#d8e0e6]">
          <iframe
            title="LuxBath Headquarters Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent('LuxBath Headquarters, 123 Luxury Lane, Gurgaon, Haryana, India - 122001')}&output=embed`}
          />
        </div>
      </div>

      {/* Why Contact Us Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-3xl font-semibold text-[#607d9e] mb-6">Why Contact LuxBath?</h2>
        <p className="text-[#84a4bc] mb-8">
          We're committed to providing exceptional support and tailored solutions for your bathroom needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition animate-fade-in-up" style={{ animationDelay: '260ms' }}>
            <Award size={24} className="text-[#84a4bc] mb-2 inline-block" />
            <h3 className="text-[#607d9e] font-medium mb-2">Expert Advice</h3>
            <p className="text-[#607d9e] text-sm">
              Get personalized recommendations from our design experts.
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <Users size={24} className="text-[#84a4bc] mb-2 inline-block" />
            <h3 className="text-[#607d9e] font-medium mb-2">Dedicated Support</h3>
            <p className="text-[#607d9e] text-sm">
              Our team is available to assist you with any inquiries.
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <ShieldCheck size={24} className="text-[#84a4bc] mb-2 inline-block" />
            <h3 className="text-[#607d9e] font-medium mb-2">Warranty Assistance</h3>
            <p className="text-[#607d9e] text-sm">
              Support for all warranty-related queries and claims.
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <Truck size={24} className="text-[#84a4bc] mb-2 inline-block" />
            <h3 className="text-[#607d9e] font-medium mb-2">Delivery Updates</h3>
            <p className="text-[#607d9e] text-sm">
              Track your order or schedule delivery with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;