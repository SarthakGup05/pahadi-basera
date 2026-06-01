'use client';

import React from 'react';
import { PropertyItem } from '@/lib/propertiesData';

interface GuidelinesSectionProps {
  property: PropertyItem;
}

export default function GuidelinesSection({ property }: GuidelinesSectionProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-left">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 tracking-wide">
        House Guidelines &amp; Policies
      </h2>
      <div className="flex flex-col gap-4">

        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
          <div className="w-1 self-stretch rounded-full bg-[#10b981] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Check-In / Out Times</h4>
            <p className="text-xs font-light text-gray-500 leading-relaxed">
              Check-in is active after <strong className="font-semibold text-stone-600">{property.checkInTime}</strong>. Standard checkout must conclude before <strong className="font-semibold text-stone-600">{property.checkOutTime}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
          <div className="w-1 self-stretch rounded-full bg-[#10b981] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Self Check-In</h4>
            <p className="text-xs font-light text-gray-500 leading-relaxed">{property.selfCheckIn}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
          <div className="w-1 self-stretch rounded-full bg-[#10b981] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Pets &amp; Smoking Policy</h4>
            <p className="text-xs font-light text-gray-500 leading-relaxed">
              {property.petsAllowed ? '💚 Pets are warmly welcomed.' : '🚫 Pets are not permitted.'} | {property.smokingPolicy}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-1 self-stretch rounded-full bg-[#10b981] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Cancellation &amp; Refund Tier</h4>
            <p className="text-xs font-light text-gray-500 leading-relaxed">{property.cancellationPolicy}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
