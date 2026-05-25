'use client';

import React from 'react';
import { Home, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const ExploreRegion = () => {
  const regions = [
    {
      id: 'munsiyari',
      num: '01',
      title: 'Munsiyari',
      subtitle: 'Sunset over Panchachuli peaks.',
      properties: 24,
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop'    
    },
    {
      id: 'chopta',
      num: '02',
      title: 'Chopta',
      subtitle: "India's serene mini Switzerland.",
      properties: 18,
      image: 'https://images.unsplash.com/photo-1589136777351-fd6e473e09a5?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'auli',
      num: '03',
      title: 'Auli',
      subtitle: 'Pristine, snow-draped ski slopes.',
      properties: 15,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'kausani',
      num: '04',
      title: 'Kausani',
      subtitle: '300km panoramic peak views.',
      properties: 12,
      image: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=800&auto=format&fit=crop',
    }
  ];

  return (
    <section id="regions" className="w-full py-16 px-4 bg-zinc-50 relative overflow-hidden border-t border-gray-100/60 z-0">
      
      {/* Ambient Depth Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col justify-end">
        {/* Volumetric Background Lights */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply" />

        {/* Abstract Himalayan Mountain Vectors - INCREASED OPACITY */}
        <svg 
          className="w-full h-auto min-h-[65vh] opacity-[0.12] text-gray-800 transform translate-y-10" 
          viewBox="0 0 1440 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="none"
        >
          {/* Deep Background Peak */}
          <path d="M-100 600 L350 150 L650 400 L1100 50 L1540 600" stroke="currentColor" strokeWidth="1.5" />
          <path d="M350 150 L350 600" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M1100 50 L1100 600" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          
          {/* Midground Peaks */}
          <path d="M-50 600 L200 300 L500 500 L850 200 L1250 450 L1500 600" stroke="currentColor" strokeWidth="2.5" />
          <path d="M200 300 L200 600" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M850 200 L850 600" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />

          {/* Foreground Peaks */}
          <path d="M-20 600 L150 450 L400 600 M350 600 L600 350 L950 600 M900 600 L1150 400 L1450 600" stroke="currentColor" strokeWidth="4" />
          
          {/* Altitude / Contour Lines for Tech/Expedition Vibe */}
          <path d="M280 230 L420 350" stroke="currentColor" strokeWidth="1" />
          <path d="M1020 120 L1180 270" stroke="currentColor" strokeWidth="1" />
          <path d="M780 270 L920 400" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Bottom fade to ensure it blends smoothly */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 to-transparent" />
      </div>

      <div className="max-w-[1250px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 relative">
          <span className="inline-block text-[#10b981] text-xs font-bold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 bg-[#10b981]/10 rounded-full shadow-sm">
            Himalayan Getaways
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight leading-tight mt-2">
            Explore by <span className="font-medium italic text-[#10b981] relative">
              Region
              {/* Subtle underline accent */}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#10b981]/20" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-base font-light text-gray-500 max-w-xl mx-auto mt-6 leading-relaxed">
            Discover handpicked sanctuaries tucked away in Uttarakhand's most pristine alpine valleys and mountain ridges.
          </p>
        </div>

        {/* Symmetrical Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {regions.map((region) => (
            <Link 
              key={region.id}
              href={`/regions/${region.id}`}
              className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer aspect-[3/4.5] bg-zinc-900 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] transform-gpu hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] block"
            >
              {/* Background Image with Cinematic Zoom */}
              <img 
                src={region.image} 
                alt={region.title}
                className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-[2000ms] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />

              {/* Rich Multi-layered Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Subtle Emerald Tint on Hover for Mood */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10b981]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

              {/* Glassmorphic Inner Ring for 3D Edge */}
              <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/20 group-hover:ring-[#10b981]/40 transition-all duration-500 pointer-events-none z-30" />

              {/* Top Details (Curation Index & Basera Counts) */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 transform-gpu transition-transform duration-500 group-hover:translate-y-1">
                <span className="text-[12px] font-bold tracking-widest text-white/60 group-hover:text-[#10b981] transition-colors duration-300">
                  {region.num} <span className="opacity-50">/</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <Home className="w-3.5 h-3.5 text-[#10b981]" />
                  {region.properties} Baseras
                </span>
              </div>

              {/* Bottom Editorial Content */}
              <div className="absolute bottom-6 left-6 right-6 z-20 transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-2">
                <div className="flex justify-between items-end gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight leading-none mb-3 drop-shadow-lg">
                      {region.title}
                    </h3>
                    <p className="text-white/70 text-sm font-light leading-relaxed line-clamp-2 transform-gpu transition-all duration-500 group-hover:text-white/90">
                      {region.subtitle}
                    </p>
                  </div>
                  
                  {/* Floating Action Trigger */}
                  <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-[#10b981] flex items-center justify-center text-white border border-white/20 group-hover:border-[#10b981] transition-all duration-500 transform-gpu group-hover:rotate-45 flex-shrink-0 shadow-lg group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExploreRegion;