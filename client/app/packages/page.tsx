'use client';

import React, { useState, useEffect } from 'react';
import Banner from '@/components/ui/Banner';
import PackageFilter from '@/components/packages/PackageFilter';
import PackageGrid from '@/components/packages/PackageGrid';
import { Compass, Sparkles, FilterX } from 'lucide-react';

export default function PackagesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Packages', isCurrent: true }
  ];

  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('Any');
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');
  
  // UX State: Simulate a loading/filtering transition state
  const [isFiltering, setIsFiltering] = useState(false);

  // Trigger brief visual feedback when filters change
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 400);
    return () => clearTimeout(timer);
  }, [selectedRegion, selectedDuration, selectedGuests, selectedDifficulty, selectedVibe]);

  const handleResetFilters = () => {
    setSelectedRegion('All');
    setSelectedDuration('Any');
    setSelectedGuests(1);
    setSelectedDifficulty('All');
    setSelectedVibe('All');
  };

  const hasActiveFilters = selectedRegion !== 'All' || selectedDuration !== 'Any' || selectedDifficulty !== 'All' || selectedVibe !== 'All' || selectedGuests > 1;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-stone-850 selection:bg-[#10b981]/20 selection:text-[#0e9f6e] relative overflow-hidden">
      
      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatOrb {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.4; }
          33% { transform: translate(40px, -60px) scale(1.15); opacity: 0.6; }
          66% { transform: translate(-30px, 30px) scale(0.9); opacity: 0.35; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.4; }
        }
        @keyframes floatOrbReverse {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
          50% { transform: translate(-50px, 50px) scale(1.1); opacity: 0.55; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 1200; }
          to { stroke-dashoffset: 0; }
        }
        .animate-float-orb {
          animation: floatOrb 25s infinite ease-in-out;
        }
        .animate-float-orb-reverse {
          animation: floatOrbReverse 30s infinite ease-in-out;
        }
        .animate-rotate-slow {
          animation: rotateSlow 80s infinite linear;
        }
        .animate-draw {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawLine 12s infinite alternate ease-in-out;
        }
        /* Cinematic Film Grain Overlay */
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}} />

      {/* 1. Volumetric Ambient Lighting & Kinematic Backdrops */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Base Grid Pattern & Noise */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:48px_48px] opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay fixed" />
        
        {/* Floating Atmospheric Light Spheres */}
        <div className="absolute top-[20%] left-[-10%] w-[650px] h-[650px] bg-emerald-500/10 blur-[130px] rounded-full mix-blend-multiply animate-float-orb" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-sky-500/8 blur-[120px] rounded-full mix-blend-multiply animate-float-orb-reverse" />
        <div className="absolute top-[60%] left-[30%] w-[400px] h-[400px] bg-amber-500/4 blur-[100px] rounded-full mix-blend-screen animate-float-orb" />

        {/* Cinematic Self-Drawing Topographic Curves */}
        <svg className="absolute w-full h-[150%] bottom-0 left-0 opacity-[0.03] text-stone-900 pointer-events-none" viewBox="0 0 1440 1200" fill="none" preserveAspectRatio="none">
          <path d="M-100 1000 C300 600 700 1100 1600 400" stroke="currentColor" strokeWidth="2.5" className="animate-draw" />
          <path d="M-100 1080 C300 680 700 1180 1600 480" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" className="animate-draw" style={{ animationDelay: '-3s' }} />
          <path d="M-100 920 C250 520 650 1020 1500 320" stroke="currentColor" strokeWidth="1" className="animate-draw" style={{ animationDelay: '-6s' }} />
        </svg>

        {/* LEFT MARGIN INTERACTIVE FLOATING COMPASS */}
        <div className="absolute top-[45%] left-[-60px] xl:left-[2%] opacity-[0.03] hover:opacity-[0.08] hover:scale-110 text-stone-900 transition-all duration-700 pointer-events-auto hidden lg:block">
          <svg className="w-[180px] h-[180px] animate-rotate-slow" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="5" fill="currentColor" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1" />
            <polygon points="100,30 110,100 100,170 90,100" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="30,100 100,90 170,100 100,110" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* RIGHT MARGIN MOUNTAIN CELESTIAL RIDGE */}
        <div className="absolute top-[70%] right-[-70px] xl:right-[3%] opacity-[0.03] hover:opacity-[0.08] hover:scale-105 hover:rotate-3 text-[#10b981] transition-all duration-700 pointer-events-auto hidden lg:block">
          <svg className="w-[220px] h-[220px]" viewBox="0 0 200 200" fill="none">
            <path d="M10 180 L50 90 L80 130 L130 50 L190 180 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 90 L70 180" stroke="currentColor" strokeWidth="1" />
            <path d="M130 50 L145 180" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="80" r="45" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" className="animate-rotate-slow" />
            <circle cx="100" cy="35" r="2" fill="currentColor" className="animate-pulse" />
            <circle cx="65" cy="55" r="1.5" fill="currentColor" />
            <circle cx="145" cy="65" r="1" fill="currentColor" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* 2. Banner Header */}
      <div className="relative z-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)]">
        <Banner
          title="Experiential Journeys"
          subtitle="Hassle-free premium mountain explorations. We bundle ancestral wood-fire homestays, all organic meals, dedicated native guides, and private hill chauffeur transfers."
          badge="Alpine Expeditions"
          bgImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop"
          height="md"
          overlayOpacity="medium"
          breadcrumbItems={breadcrumbs}
        />
      </div>

      {/* 3. Glassmorphic Filter Controls Block */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-30 -mt-8 sm:-mt-12">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-2 sm:p-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white">
          <PackageFilter
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedVibe={selectedVibe}
            setSelectedVibe={setSelectedVibe}
          />
        </div>
      </div>

      {/* 4. Packages Display Section */}
      <div className="max-w-[1250px] mx-auto relative z-20 pt-20 sm:pt-28 px-4 sm:px-6">
        
        {/* Cinematic Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-[#10b981] rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase">All-Inclusive Retreats</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-light text-stone-900 tracking-tight leading-tight mb-4">
            Curated <span className="relative inline-block font-normal italic bg-clip-text text-transparent bg-gradient-to-r from-[#10b981] to-teal-600 after:content-[''] after:absolute after:-bottom-1 sm:after:-bottom-2 after:left-0 after:w-full after:h-[2px] sm:after:h-[3px] after:bg-gradient-to-r after:from-[#10b981] after:to-teal-600 after:rounded-full">Himalayan Odysseys</span>
          </h2>
          
          <p className="text-sm sm:text-base font-light text-stone-500 leading-relaxed max-w-xl mx-auto mt-6">
            Handpicked itineraries matching the absolute best local stewards, organic gastronomy kitchens, and architectural sanctuaries of the high hills.
          </p>

          {/* Contextual Active Filters Summary */}
          <div className={`mt-8 flex flex-wrap justify-center items-center gap-2 transition-all duration-500 ${hasActiveFilters ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
             <button 
                onClick={handleResetFilters}
                className="group flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-full hover:bg-rose-50 cursor-pointer"
             >
                <FilterX className="w-3.5 h-3.5" />
                Clear Filters
             </button>
          </div>
        </div>

        {/* Dynamic Package Cards Grid with simulated loading transition */}
        <div className={`transition-all duration-500 ease-out ${isFiltering ? 'opacity-40 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0'}`}>
          <PackageGrid
            region={selectedRegion}
            duration={selectedDuration}
            guests={selectedGuests}
            difficulty={selectedDifficulty}
            vibe={selectedVibe}
            onReset={handleResetFilters}
          />
        </div>

      </div>
    </div>
  );
}