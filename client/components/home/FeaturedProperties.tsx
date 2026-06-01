'use client';

import React from 'react';
import { Star, Users, Bed, Bath, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { propertiesList } from '@/lib/propertiesData';

const FeaturedProperties = () => {
  // Grab the first 4 active featured properties
  const properties = propertiesList
    .filter((p) => p.isFeatured && p.isActive)
    .slice(0, 4);

  return (
    <section className="py-16 w-full max-w-[1400px] mx-auto px-4 md:px-8 font-sans" id="properties">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1a1a1a] tracking-tight mb-2">
            Featured Baseras
          </h2>
          <p className="text-gray-500 font-medium">Discover our most exclusive stays in off beat Himalayas</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {properties.map((property) => (
          <Link 
            key={property.id} 
            href={`/properties/${property.id}`}
            className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
          >
            {/* Image Section */}
            <div className="w-full h-48 sm:h-52 shrink-0 relative p-3 pb-0">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">
                
                {/* Subtle Image Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                />
                
                {/* Glassmorphic Badge */}
                {property.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md text-[#10b981] text-xs font-bold rounded-lg shadow-sm z-20 border border-white/20 transition-transform duration-300 group-hover:scale-105">
                    {property.badge}
                  </span>
                )}

                {/* Elevation Badge */}
                {property.altitude > 100 && (
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded z-20 border border-white/10">
                    🏔️ {property.altitude.toLocaleString()}m
                  </span>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50/50">
              
              {/* Location & Rating */}
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                <span>{property.location}</span>
                {property.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-600">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{property.rating}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-gray-900 group-hover:text-[#10b981] transition-colors duration-300 font-semibold text-base leading-snug mb-4 line-clamp-2 min-h-[2.5rem]">
                {property.title}
              </h3>

              {/* Spacing to push bottom content down */}
              <div className="flex-1"></div>

              {/* Capacity Specs */}
              <div className="flex items-center gap-2 text-[13px] font-medium text-gray-700 mb-5 flex-wrap">
                <div className="flex items-center gap-1.5 bg-gray-100/80 px-2 py-1 rounded-md group-hover:bg-[#10b981]/10 group-hover:text-[#0e9f6e] transition-colors duration-300">
                  <Users className="w-4 h-4 opacity-70" />
                  <span>{property.maxGuests} Guests</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-100/80 px-2 py-1 rounded-md group-hover:bg-[#10b981]/10 group-hover:text-[#0e9f6e] transition-colors duration-300">
                  <Bed className="w-4 h-4 opacity-70" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-100/80 px-2 py-1 rounded-md group-hover:bg-[#10b981]/10 group-hover:text-[#0e9f6e] transition-colors duration-300">
                  <Bath className="w-4 h-4 opacity-70" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </div>

              {/* Footer / Price */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Starting at</span>
                  <div className="text-gray-900">
                    <span className="font-bold text-base">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-500 font-medium">/night</span>
                  </div>
                </div>
                
                <Button 
                  className="group/btn relative overflow-hidden bg-[#10b981] hover:bg-[#0e9f6e] text-white rounded-xl px-4 h-9 text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] transition-all duration-300 ease-out hover:-translate-y-0.5 border-0"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Details 
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </span>
                </Button>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 cursor-not-allowed border border-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-full bg-[#10b981] hover:bg-[#0e9f6e] active:scale-95 transition-all duration-300 ease-out flex items-center justify-center text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] cursor-pointer hover:-translate-y-0.5">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Explore Button */}
        <Link href="/properties">
          <Button 
            variant="secondary" 
            className="group/explore bg-white hover:bg-gray-50 text-gray-800 rounded-full px-6 h-12 font-semibold text-sm flex items-center gap-2 transition-all duration-300 ease-out shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            Explore all properties 
            <ArrowRight className="w-4 h-4 text-[#10b981] transition-transform duration-300 group-hover/explore:translate-x-1" />
          </Button>
        </Link>
      </div>

    </section>
  );
};

export default FeaturedProperties;