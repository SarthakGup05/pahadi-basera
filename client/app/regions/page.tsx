'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Banner from '@/components/ui/Banner';
import { regionsList, RegionItem } from '@/lib/regionsData';
import { MapPin, Compass, ArrowRight, Sun, ThermometerSnowflake, Mountain, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegionsHubPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Regions', isCurrent: true }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-stone-850 selection:bg-[#10b981]/20 selection:text-[#0e9f6e] relative overflow-hidden">
      
      {/* 1. Cinematic Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:48px_48px] opacity-40" />
        <div className="absolute top-[15%] -left-[10%] w-[700px] h-[700px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[20%] -right-[15%] w-[650px] h-[650px] bg-blue-500/5 blur-[130px] rounded-full mix-blend-multiply" />
      </div>

      {/* 2. Banner Header */}
      <div className="relative z-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
        <Banner
          title="Himalayan Regions"
          subtitle="Explore the untouched sanctuaries and mystical valleys of the high hills. Each region represents a unique ecosystem of ancient cultures, high ridges, and ancestral slow-travel retreats."
          badge="Alpine Exploration"
          bgImage="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1920&auto=format&fit=crop"
          height="md"
          overlayOpacity="dark"
          breadcrumbItems={breadcrumbs}
        >
          <Button
            asChild
            variant="outline"
            className="group/back relative overflow-hidden rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 px-8 h-10 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-500 pointer-events-auto"
          >
            <Link href="/" className="flex items-center gap-3">
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover/back:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </Banner>
      </div>

      {/* 3. Regions Catalog Grid */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-20 relative z-10">
        
        {/* Cinematic Subheader */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] rounded-full">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Alpine Sanctuaries</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight leading-tight">
            Our Active <span className="font-normal italic text-[#10b981]">High-Elevation Valleys</span>
          </h2>
          <p className="text-sm font-light text-stone-500 leading-relaxed mt-4">
            Discover offbeat valleys defined by ancient stone trails, sacred summits, organic micro-tea gardens, and deep cosmic dark sky stargazing pools.
          </p>
        </div>

        {/* Editorial Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {regionsList.map((region) => (
            <Link
              key={region.id}
              href={`/regions/${region.id}`}
              className="group flex flex-col bg-white rounded-[2.5rem] border border-stone-200/60 overflow-hidden shadow-[0_8px_30px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.12)] hover:-translate-y-1.5 hover:border-emerald-200/50 transition-all duration-500 cursor-pointer relative text-left"
            >
              {/* Top Banner Image with Zoom */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <img
                  src={region.bannerImage}
                  alt={region.title}
                  className="w-full h-full object-cover transform-gpu transition-transform duration-[4000ms] ease-out group-hover:scale-105"
                />
                
                {/* Floating Glass Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                  <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-[#10b981] text-[9px] font-bold tracking-widest uppercase rounded-xl shadow-sm border border-white/20">
                    {region.elevation} Altitude
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-white/80 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    {region.featuredStayIds.length} Baseras
                  </span>
                </div>

                {/* Regional Title overlaid on image */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <span className="text-[9px] font-bold tracking-[0.25em] text-emerald-400 uppercase mb-1 block">
                    Region {region.num}
                  </span>
                  <h3 className="text-white font-medium text-2xl sm:text-3xl leading-none drop-shadow-md">
                    {region.title}
                  </h3>
                </div>
              </div>

              {/* Card Contents */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-stone-50/20">
                <p className="text-stone-600 font-light text-sm leading-relaxed mb-6">
                  {region.description}
                </p>

                {/* Regional Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 border-y border-stone-150/60 py-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10b981] shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Best Season</span>
                      <span className="text-xs font-semibold text-stone-800 leading-tight">{region.bestTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10b981] shrink-0">
                      <ThermometerSnowflake className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Winter Climate</span>
                      <span className="text-xs font-semibold text-stone-800 leading-tight">{region.temperature.winter}</span>
                    </div>
                  </div>
                </div>

                {/* Gemstone Points */}
                <div className="space-y-2 mb-6">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-3">Hidden Sights Checklist</span>
                  {region.hiddenGems.slice(0, 2).map((gem, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-650">
                      <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                      <span>{gem.name}</span>
                    </div>
                  ))}
                </div>

                {/* Divider & Action Trigger */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                  <span className="text-[10px] font-bold tracking-widest text-[#10b981] uppercase flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5" /> Slow Tourism
                  </span>
                  
                  <Button className="group/btn relative overflow-hidden bg-stone-950 hover:bg-[#10b981] text-white rounded-xl px-5 h-9 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md transition-all duration-300 border-0">
                    <span className="relative z-10 flex items-center gap-1">
                      Explore Valley
                      <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
