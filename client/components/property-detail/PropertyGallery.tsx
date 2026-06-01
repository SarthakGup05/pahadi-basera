'use client';

import React from 'react';

import { PropertyItem } from '@/lib/propertiesData';

interface PropertyGalleryProps {
  property: PropertyItem;
  galleryImages: string[];
  onPhotoClick: (idx: number) => void;
}

export default function PropertyGallery({
  property,
  galleryImages,
  onPhotoClick,
}: PropertyGalleryProps) {
  return (
    <div className="max-w-[1250px] mx-auto px-6 mt-10 relative">
      {/* Desktop Mosaic Grid (Airbnb style) */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[420px] rounded-[2rem] overflow-hidden group/gallery relative">
        
        {/* Main Featured Photo (Left half) */}
        <div 
          onClick={() => onPhotoClick(0)}
          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
        >
          <img 
            src={galleryImages[0]} 
            alt={`${property.title} Facade`}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
        </div>

        {/* Secondary Photos (Right side) */}
        {galleryImages.slice(1, 5).map((img, idx) => (
          <div 
            key={idx}
            onClick={() => onPhotoClick(idx + 1)}
            className="relative overflow-hidden cursor-pointer group"
          >
            <img 
              src={img} 
              alt={`${property.title} Space ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
        ))}

        {/* Floating 'Show all photos' CTA button */}
        <button 
          onClick={() => onPhotoClick(0)}
          className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md border border-gray-200/80 text-gray-800 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-md hover:bg-white hover:scale-103 hover:shadow-lg active:scale-98 transition-all duration-300 cursor-pointer z-20"
        >
          View all photos
        </button>
      </div>

      {/* Mobile Swipeable Carousel (Visible only on mobile) */}
      <div className="flex md:hidden gap-3 overflow-x-auto snap-x snap-mandatory rounded-2xl h-[260px] scrollbar-none">
        {galleryImages.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => onPhotoClick(idx)}
            className="w-[88%] shrink-0 snap-center relative overflow-hidden rounded-2xl cursor-pointer"
          >
            <img 
              src={img} 
              alt={`${property.title} Space ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-white/10">
              {idx + 1} / {galleryImages.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
