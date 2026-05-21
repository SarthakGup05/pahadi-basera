'use client';

import React from 'react';
import { Star, Users, Bed, Bath, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      title: 'Sereno Pearl 3bhk Luxury Villa w/pool Assagaon',
      location: 'Assagao, Goa',
      rating: '5.0',
      guests: 10,
      bedrooms: 3,
      bathrooms: 4,
      price: '18,014',
      badge: 'Private Pool',
      image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Sereno Blooms 2bhk villa w/pool & patio Assagaon',
      location: 'Assagao, Goa',
      rating: '5.0',
      guests: 6,
      bedrooms: 2,
      bathrooms: 2,
      price: '9,775',
      badge: 'Private Pool',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Sereno Sky - 3bhk Penthouse w/pvt jacuzzi + rooftop',
      location: 'Nerul, Goa',
      rating: '4.7',
      guests: 10,
      bedrooms: 3,
      bathrooms: 3,
      price: '11,989',
      badge: 'Private Jacuzzi',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'Sereno Aurora - luxury 2bhk near Candolim & Panjim',
      location: 'Nerul, Goa',
      rating: null,
      guests: 6,
      bedrooms: 2,
      bathrooms: 2,
      price: '6,134',
      badge: null,
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop',
    },
  ];

  return (
    <section className="py-12 w-full max-w-[1400px] mx-auto px-4 md:px-6 font-sans">
      
      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-8 tracking-tight">
        Featured properties
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#10b981]/30 transition-all duration-300 cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] p-3 pb-0">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                
                {/* Optional Badge */}
                {property.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#10b981] text-white text-xs font-bold rounded-full shadow-sm z-10">
                    {property.badge}
                  </span>
                )}

                {/* Pagination Dots (Visual only) */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-100 transition-transform duration-300 group-hover:scale-125"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-1">
              
              {/* Title */}
              <h3 className="text-[#10b981] group-hover:text-[#0e9f6e] transition-colors duration-300 font-medium text-base leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                {property.title}
              </h3>

              {/* Location & Rating */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{property.location}</span>
                {property.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">{property.rating}</span>
                  </div>
                )}
              </div>

              {/* Spacing to push bottom content down */}
              <div className="flex-1"></div>

              {/* Capacity Specs */}
              <div className="flex items-center gap-3 text-[13px] font-semibold text-gray-800 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
                  <Users className="w-4 h-4 text-gray-500 group-hover:text-[#10b981] transition-colors duration-300" />
                  <span>{property.guests} Guests</span>
                </div>
                <div className="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
                  <Bed className="w-4 h-4 text-gray-500 group-hover:text-[#10b981] transition-colors duration-300" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
                  <Bath className="w-4 h-4 text-gray-500 group-hover:text-[#10b981] transition-colors duration-300" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              </div>

              {/* Footer / Price */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-500">
                  From <span className="text-[#10b981] font-bold text-base">₹{property.price}</span>/night
                </div>
                <Button 
                  className="group/btn bg-[#10b981] hover:bg-[#0e9f6e] text-white rounded-full px-5 h-9 text-xs font-semibold flex items-center gap-1 shadow-sm transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_8px_15px_-4px_rgba(16,185,129,0.4)] active:scale-95 border-0"
                >
                  Details 
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[#bdf0d9] flex items-center justify-center text-white cursor-not-allowed transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#10b981] hover:bg-[#0e9f6e] hover:scale-110 active:scale-90 transition-all duration-500 ease-out flex items-center justify-center text-white shadow-md hover:shadow-[0_8px_20px_-4px_rgba(16,185,129,0.5)] cursor-pointer hover:-translate-y-0.5">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Explore Button */}
        <Button 
          variant="secondary" 
          className="group/explore bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 rounded-full px-6 h-10 font-medium text-sm flex items-center gap-2 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-0.5 hover:scale-105 active:scale-95 border-0"
        >
          Explore all properties 
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/explore:translate-x-1" />
        </Button>
      </div>

    </section>
  );
};

export default FeaturedProperties;