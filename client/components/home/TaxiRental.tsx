'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Car, 
  ShieldCheck, 
  Compass, 
  Star, 
  ArrowUpRight,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TaxiRental = () => {
  const features = [
    { icon: Compass, title: 'Native Chauffeurs', desc: 'Driven by locals who know every hidden curve and weather pattern.' },
    { icon: ShieldCheck, title: 'Mountain-Spec AWD', desc: 'Strictly maintained 4x4 fleet equipped for severe snow, mud, and high altitudes.' },
    { icon: Car, title: 'Zero Hidden Fees', desc: 'Transparent per-km billing with no surprise driver allowances or toll hikes.' }
  ];

  return (
    <section id="transit-preview" className="w-full py-16 px-4 bg-zinc-50 relative overflow-hidden border-t border-gray-100/60 z-10 font-sans">
      
      {/* Ambient Volumetric Lights & Graphics */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/5 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[140px] rounded-full mix-blend-multiply" />
        
        {/* Soft dot grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="max-w-[1250px] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Cinematic Visual Showcase */}
          <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] w-full group/visual perspective-1000">
            
            {/* Main Image Base */}
            <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-white z-10 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/visual:scale-[0.98]">
              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 opacity-60 group-hover/visual:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQla-RHEFpY9FIJDPipN19C0-U0_ef26l0wg5KXBlh4AId_ICpLOh13nz9gDj2syuWfsN4oFUOojSNz6KMlGPPQpqefip9GS3ha2r0Zivli&s=10" 
                alt="Premium Mountain 4x4 Transit"
                className="w-full h-full object-cover transform-gpu transition-transform duration-[10000ms] ease-out group-hover/visual:scale-110"
              />

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                <div>
                  <span className="flex items-center gap-1.5 text-white/90 text-[11px] font-bold tracking-widest uppercase mb-1 drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> High-Altitude Ready
                  </span>
                  <h3 className="text-white text-2xl font-medium tracking-tight drop-shadow-lg">Mahindra Thar 4x4</h3>
                </div>
              </div>
            </div>

            {/* Floating Glass Badge 1: Rating */}
            <div className="absolute top-8 left-8 z-30 bg-white/90 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/40 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/visual:-translate-y-2 group-hover/visual:-translate-x-2">
              <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-gray-900 text-lg leading-none">4.95</span>
              </div>
              <span className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-1">Fleet Rating</span>
            </div>

            {/* Floating Glass Badge 2: Local Driver */}
            <div className="absolute top-1/2 -right-6 z-30 bg-white/90 backdrop-blur-xl rounded-2xl p-3 border border-white/40 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] flex items-center gap-3 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/visual:-translate-y-4 group-hover/visual:translate-x-2 hidden sm:flex">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 border-2 border-white shadow-sm">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Native Driver" className="w-full h-full object-cover" />
              </div>
              <div className="pr-3">
                <span className="block text-[9px] uppercase tracking-widest font-bold text-[#10b981] mb-0.5">Certified Expert</span>
                <span className="block text-xs font-bold text-gray-900">Native Chauffeurs</span>
              </div>
            </div>

          </div>

          {/* Right Side: Editorial Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Category Meta Tag */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-emerald-50 w-fit border border-emerald-100 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[#10b981] text-[10px] font-bold tracking-[0.2em] uppercase">
                Transit Services
              </span>
            </div>
            
            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-light text-gray-900 leading-[1.1] tracking-tight mb-8">
              Seamless Hill <br className="hidden sm:block" /> 
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="font-normal italic text-[#10b981]">Navigation</span>
                {/* Organic Swoosh Underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#10b981]/30" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-[15px] font-light text-gray-500 leading-relaxed mb-10 max-w-lg">
              Don't let serpentine mountain roads dictate your itinerary. Reserve professional AWD/4x4 vehicles driven by certified natives who treat your safety as a religion.
            </p>

            {/* Premium Feature List */}
            <div className="flex flex-col gap-6 mb-10 max-w-lg">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex gap-4 group/feat">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/feat:bg-emerald-50 group-hover/feat:text-[#10b981] group-hover/feat:border-emerald-100 group-hover/feat:scale-110">
                      <Icon className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">{feature.title}</h4>
                      <p className="text-xs font-light text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Read More Call-to-action Button */}
            <div className="flex">
              <Button
                asChild
                className="relative rounded-full bg-zinc-900 hover:bg-[#10b981] text-white px-8 py-6 text-[11px] tracking-widest uppercase font-bold shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] active:scale-95 border-0 h-12 group/btn overflow-hidden"
              >
                <Link href="#transit" className="flex items-center gap-2 relative z-10">
                  Explore Our Fleet
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </Button>
            </div>
            
          </div>

        </div>
      </div>
    </section>
  );
};

export default TaxiRental;