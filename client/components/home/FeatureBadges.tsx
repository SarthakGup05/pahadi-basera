'use client';

import React from 'react';
import { ShieldCheck, Utensils, Car, ArrowUpRight } from 'lucide-react';

const FeaturesBadges = () => {
  const features = [
    {
      id: 'verified',
      num: '01',
      tag: 'SAFE HAVENS',
      title: 'Verified Mountain Homestays',
      description: 'Authentic stone chalets and wooden cottages vetted strictly for safety, hygiene, and high-altitude warmth.',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 ring-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)]',
      // Custom radial bloom for hover state
      hoverGlow: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-emerald-50/5 to-transparent',
    },
    {
      id: 'kitchen',
      num: '02',
      tag: 'LOCAL SOUL',
      title: 'Traditional Pahadi Kitchens',
      description: 'Taste original, organic recipes prepared fresh by local hosts over traditional firewood and earthen hearths.',
      icon: Utensils,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50 ring-orange-100 shadow-[0_0_20px_rgba(249,115,22,0.15)] group-hover:shadow-[0_8px_25px_rgba(249,115,22,0.3)]',
      hoverGlow: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-orange-50/5 to-transparent',
    },
    {
      id: 'taxi',
      num: '03',
      tag: 'SEAMLESS HIGHLANDS',
      title: 'Hill Transits & Escapes',
      description: 'Hassle-free transfers across winding mountain roads with certified local drivers and customized trail maps.',
      icon: Car,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 ring-blue-100 shadow-[0_0_20px_rgba(37,99,235,0.15)] group-hover:shadow-[0_8px_25px_rgba(37,99,235,0.3)]',
      hoverGlow: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-blue-50/5 to-transparent',
    },
  ];

  return (
    <section className="w-full bg-zinc-50 relative py-16 px-4 sm:px-6 z-20 overflow-hidden">
      
      {/* --- Ambient Background Designs & Gradients --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle Architectural Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        
        {/* Volumetric Glowing Orbs (Matched to icon colors) */}
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-emerald-400/10 blur-[120px] rounded-full mix-blend-multiply animate-pulse duration-[8000ms]" />
        <div className="absolute top-[20%] left-[40%] w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-orange-400/10 blur-[120px] rounded-full mix-blend-multiply animate-pulse duration-[10000ms]" />
        
        {/* Soft white fade at the top/bottom edges to blend into adjacent sections */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-50 to-transparent" />
      </div>

      <div className="max-w-[1250px] mx-auto relative z-10">
        
        {/* Unified Elevated Glass Wrapper */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-4 sm:p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
          
          {/* Inner Shimmer / Glint on the board */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 relative">
            
            {/* Elegant Gradient Dividers (Desktop Only) */}
            <div className="hidden md:block absolute left-1/3 top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-gray-200/80 to-transparent z-0" />
            <div className="hidden md:block absolute left-2/3 top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-gray-200/80 to-transparent z-0" />

            {features.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.id} 
                  className={`group relative flex flex-col justify-between p-6 md:p-8 rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer z-10 hover:z-20 bg-transparent hover:bg-white/90 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-white/50`}
                >
                  {/* Radial Color Bloom on Hover */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${item.hoverGlow}`} />

                  <div className="relative z-10">
                    {/* Top line with serial number and minimal icon */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[11px] tracking-[0.25em] font-bold text-gray-400 group-hover:text-gray-800 transition-colors duration-300 flex items-center gap-2">
                        <span className="text-[#10b981]">[{item.num}]</span>
                        {item.tag}
                      </span>
                      
                      {/* 3D Icon Container */}
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ring-1 ring-inset backdrop-blur-sm ${item.iconBg}`}>
                        <IconComponent className={`w-4.5 h-4.5 ${item.iconColor} transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110`} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    {/* Typography details */}
                    <h4 className="text-xl md:text-2xl font-medium text-gray-900 tracking-tight mb-3 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-sm font-light text-gray-500 leading-relaxed max-w-[320px] transition-colors duration-300 group-hover:text-gray-700">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Interactive bottom arrow trigger */}
                  <div className="mt-10 flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold text-gray-400 group-hover:text-gray-900 transition-all duration-300 relative z-10">
                    <span className="relative overflow-hidden h-[18px]">
                      <span className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-[18px]">
                        <span className="h-[18px] leading-[18px]">Explore</span>
                        <span className="h-[18px] leading-[18px] text-[#10b981]">Explore</span>
                      </span>
                    </span>
                    <div className="w-7 h-7 rounded-full border border-gray-200 group-hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:bg-[#10b981] group-hover:text-white">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-12" />
                    </div>
                  </div>

                </div>
              );
            })}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBadges;