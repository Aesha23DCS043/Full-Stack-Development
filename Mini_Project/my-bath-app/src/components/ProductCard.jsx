import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { ArrowRight, Droplets, Waves, ShowerHead, Wrench } from 'lucide-react';

const ProductCard = () => {
  const categories = [
    {
      name: 'Taps',
      description: 'Premium kitchen and bathroom taps with cutting-edge design',
      icon: Droplets,
      count: '150+ Products',
      color: 'bg-blue-500',
      gradient: 'from-blue-500/20 to-blue-600/20'
    },
    {
      name: 'Sinks',
      description: 'Elegant basins and sinks for modern bathroom aesthetics',
      icon: Waves,
      count: '120+ Products',
      color: 'bg-teal-500',
      gradient: 'from-teal-500/20 to-teal-600/20'
    },
    {
      name: 'Showers',
      description: 'Luxury shower systems for the ultimate bathing experience',
      icon: ShowerHead,
      count: '80+ Products',
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500/20 to-indigo-600/20'
    },
    {
      name: 'Accessories',
      description: 'Complete your bathroom with premium fixtures and fittings',
      icon: Wrench,
      count: '200+ Products',
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500/20 to-emerald-600/20'
    }
  ];

  return (
    <section className="py-20 bg-#778e9b w-full animate-fade-in">
      <div className="container mx-auto px-6 w-full">
       <div className="text-center mb-16 bg-[#778e9b] py-10 rounded-xl text-white animate-fade-in-up">
  <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-3">
    <Wrench className="w-4 h-4 text-white mr-2" />
    <span className="font-medium">Product Categories</span>
  </div>
  <h2 className="text-4xl md:text-5xl font-bold mb-6">
    Everything for Your <span className="text-blue-800">Dream Bathroom</span>
  </h2>
  <p className="text-xl max-w-3xl mx-auto">
    From sleek taps to luxurious shower systems, discover our comprehensive range 
    of bathroom essentials designed to transform your space.
  </p>
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Reveal key={category.name}>
              <Link to={`/categories/${category.name.toLowerCase()}`} className="block" style={{ transitionDelay: `${index * 90}ms` }}>
              <div className="card-premium group cursor-pointer relative overflow-hidden transform transition-transform duration-200 hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 p-6">
                  <div className="mb-6">
                    <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                    
                    <Link 
                      to={`/categories/${category.name.toLowerCase()}`}
                      className="w-full inline-flex items-center justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-left px-4 py-2 bg-transparent border border-gray-300 rounded hover:border-primary"
                    >
                      Shop {category.name}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 inline-block ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
              </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16 bg-[#778e9b] card rounded-2xl p-8 md:p-12 shadow-elegant animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font text-black mb-6">
  Need Help Choosing?
</h3>

              <p className="text-lg text-muted-foreground mb-6">
                Our expert team is here to help you find the perfect bathroom accessories 
                that match your style and budget. Get personalized recommendations today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-premium bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
                  Get Free Consultation
                </button>
                <button className="btn-elegant bg-transparent border border-gray-300 text-foreground px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Download Catalog
                </button>
              </div>
            </div>
            <div className="lg:text-right">
              <div className="inline-flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground font-bold">1</span>
                  </div>
                  <span className="text-foreground font text-black">Browse our categories</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground font-bold">2</span>
                  </div>
                  <span className="text-foreground font text-black">Compare products</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground font-bold">3</span>
                  </div>
                  <span className="text-foreground font text-black">Make your selection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;