'use client';

import React from 'react';
import { Users, Bed, Bath } from 'lucide-react';
import { PropertyItem } from '@/lib/propertiesData';

interface PropertyDetailsCardProps {
  property: PropertyItem;
}

export default function PropertyDetailsCard({ property }: PropertyDetailsCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-left">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 tracking-wide">
        The Basera Philosophy
      </h2>
      <p className="text-gray-600 font-light leading-relaxed mb-6">
        {property.about}
      </p>
      
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3">Living Spaces</h3>
      <p className="text-gray-500 font-light leading-relaxed mb-6 text-xs sm:text-sm">
        {property.space}
      </p>

      {/* Specs Grid */}
      <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
        <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
          <Users className="w-5 h-5 text-[#10b981] mb-2" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Max Guests</span>
          <span className="text-sm font-bold text-gray-800 mt-1">{property.maxGuests} guests</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
          <Bed className="w-5 h-5 text-[#10b981] mb-2" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Bedrooms</span>
          <span className="text-sm font-bold text-gray-800 mt-1">{property.bedrooms} beds</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
          <Bath className="w-5 h-5 text-[#10b981] mb-2" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Bathrooms</span>
          <span className="text-sm font-bold text-gray-800 mt-1">{property.bathrooms} baths</span>
        </div>
      </div>
    </div>
  );
}
