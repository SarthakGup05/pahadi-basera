'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PropertyItem } from '@/lib/propertiesData';

interface AmenitiesSectionProps {
  property: PropertyItem;
}

export default function AmenitiesSection({ property }: AmenitiesSectionProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-left">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 tracking-wide">
        High-Altitude Amenities
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {property.amenities.map((amenity, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-3 text-sm text-gray-600 font-medium bg-gray-50/60 hover:bg-emerald-50/30 border border-gray-100 hover:border-emerald-100/50 rounded-xl px-4 py-3 transition-colors duration-300"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" strokeWidth={2.5} />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
