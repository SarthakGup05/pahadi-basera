'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  UtensilsCrossed,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Banner from '@/components/ui/Banner';

export default function OurStoryPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Our Story', isCurrent: true }
  ];

  const pillars = [
    {
      icon: Leaf,
      num: '01',
      title: 'Ecological Restoration',
      desc: 'We painstakingly restore ancestral slate-roof and timber-framed homes rather than casting concrete, keeping ancient Kath-Khuni masonry alive and breathing.'
    },
    {
      icon: UtensilsCrossed,
      num: '02',
      title: 'Slow Organic Gastronomy',
      desc: 'Every Basera features local, home-churned ghee, hand-ground mountain herbs, and traditional wood-fire cooking, sourced directly from backyard family terraces.'
    },
    {
      icon: ShieldCheck,
      num: '03',
      title: 'Local Stewardship',
      desc: 'We employ 100% native guides, drivers, and chefs. All profits are shared back directly into local alpine village micro-economies, ensuring sustainable growth.'
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-16 md:pb-24 font-sans text-gray-800 selection:bg-[#10b981]/20 selection:text-[#0e9f6e] relative overflow-hidden">

      {/* 0. Volumetric Ambient Backdrops & Topographic SVGs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-50" />
        <div className="absolute top-[10%] -left-[20%] w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      {/* 1. Cinematic Header utilizing Reusable Banner */}
      <Banner
        title="Reconnecting with the hills"
        subtitle="Restoring ancestral architecture, supporting local gastonomy homesteads, and curating authentic Himalayan slow living."
        badge="Our Philosophy"
        bgImage="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1920&auto=format&fit=crop"
        height="md"
        overlayOpacity="medium"
        breadcrumbItems={breadcrumbs}
      >
        <Button
          asChild
          variant="outline"
          className="group/back relative overflow-hidden rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 px-8 h-12 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-500 ease-out pointer-events-auto"
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover/back:-translate-x-1">
              <ArrowLeft className="w-3 h-3" />
            </div>
            <span className="relative z-10">Return to Catalog</span>
          </Link>
        </Button>
      </Banner>

      {/* 2. Main Story Narrative */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-12 sm:mt-20 relative z-10">

        {/* Section 1: The Origins Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-24">
          
          {/* Left Text Block - Moved to left for better reading rhythm */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 max-w-lg mx-auto lg:mx-0 pt-8">
            
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 bg-emerald-50/50 border border-emerald-100/50 text-[#10b981] rounded-full w-fit shadow-sm backdrop-blur-sm">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase">Alpine Origins</span>
            </div>
            
            {/* True Drop Cap Heading - Refined for perfect alignment */}
            <h2 className="flex flex-col items-start mb-6 group/title">
              <div className="flex items-end mb-1">
                <span className="inline-block text-[6.5rem] sm:text-[8rem] md:text-[9rem] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#10b981] to-emerald-900 leading-[0.8] tracking-tighter pr-1 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/title:scale-105 group-hover/title:-rotate-2 group-hover/title:drop-shadow-[0_10px_20px_rgba(16,185,129,0.2)] origin-bottom-left">
                  B
                </span>
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-4xl sm:text-5xl lg:text-[4rem] tracking-tight leading-none pb-2">
                  <span className="font-semibold text-gray-900 tracking-tighter -ml-1 sm:-ml-1.5">orn</span>
                  <span className="font-light text-gray-400 text-3xl sm:text-4xl lg:text-[3.5rem] tracking-wide ml-1 sm:ml-2">
                    to capture
                  </span>
                </span>
              </div>
              
              <span className="text-4xl sm:text-5xl lg:text-[4rem] font-light tracking-tight leading-[1.1] ml-16 sm:ml-24 md:ml-32">
                <span className="font-serif italic text-gray-900 group-hover/title:text-[#10b981] transition-colors duration-700 relative inline-block">
                  slow mountain life.
                  <svg className="absolute w-[105%] h-3 sm:h-5 -bottom-1 sm:-bottom-2 -left-2 text-[#10b981]/30 transform origin-left transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] scale-x-0 opacity-0 group-hover/title:scale-x-100 group-hover/title:opacity-100" viewBox="0 0 100 15" preserveAspectRatio="none">
                    <path d="M0,12 Q30,15 100,5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h2>

            {/* Content Paragraphs */}
            <div className="flex flex-col gap-4 text-[15px] font-light text-gray-500 leading-relaxed ml-16 sm:ml-24 md:ml-32 relative before:absolute before:left-[-1.5rem] before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-[#10b981]/50 before:to-transparent">
              <p>
                <span className="text-gray-900 font-medium">Pahadi Basera</span> was established in 2020 on the ridge line of Almora. Witnessing the rapid decay of heritage timber houses and migration from highland communities, our pioneers partnered with village elders to restore rather than replace.
              </p>
              <p>
                Our philosophy is simple: high-altitude sanctuaries shouldn’t compromise their geographical soul. We restore ancestral homes using local slate, cedar, and river stones, combining these natural assets with warm glass rooms, central fireplaces, organic gastronomy, and premium comforts.
              </p>
            </div>

          </div>

          {/* Right Editorial Staggered Images - Order 2 on desktop */}
          <div className="lg:col-span-6 relative w-full h-[480px] sm:h-[580px] order-1 lg:order-2 group/stagger perspective-1000">
            {/* Primary Tall Image */}
            <div className="absolute top-0 right-0 w-[75%] h-[85%] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] z-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/stagger:-translate-y-4 group-hover/stagger:rotate-1">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop" 
                alt="Pine mountains"
                className="w-full h-full object-cover transform-gpu transition-transform duration-[10000ms] group-hover/stagger:scale-110"
              />
            </div>
            
            {/* Overlapping Square Image */}
            <div className="absolute bottom-0 left-0 w-[55%] aspect-square rounded-[1.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] border-4 border-[#fcfcfc] z-20 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/stagger:translate-x-4 group-hover/stagger:-translate-y-6 group-hover/stagger:-rotate-2">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop" 
                alt="Stone hut"
                className="w-full h-full object-cover transform-gpu transition-transform duration-[8000ms] group-hover/stagger:scale-110"
              />
            </div>

            {/* Floating Detail Badge */}
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/stagger:-translate-y-10 group-hover/stagger:-translate-x-4 hidden sm:block">
              <div className="w-12 h-12 rounded-full border border-dashed border-[#10b981] flex items-center justify-center text-[#10b981] mb-2">
                <Leaf className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="block text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">100% Native</span>
              <span className="block text-xs font-bold text-gray-900 mt-0.5">Sourced Materials</span>
            </div>
          </div>

        </div>

        {/* Section 2: Premium Interactive List (Replaces 3-Column Grid) */}
        <div className="mb-24 max-w-5xl mx-auto relative">
          
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
            <div>
              <span className="text-[#10b981] text-[10px] font-bold tracking-[0.25em] uppercase block mb-4">The Pillars of Basera</span>
              <h3 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight leading-[1.1]">
                Sustaining <br />
                <span className="font-normal italic text-[#10b981]">Highland Traditions</span>
              </h3>
            </div>
            <p className="text-gray-500 font-light text-sm leading-relaxed max-w-xs md:text-right">
              Every detail of a stay at Pahadi Basera supports deeply integrated ecological and socio-economic restoration systems.
            </p>
          </div>

          <div className="flex flex-col">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-200 transition-all duration-500 hover:border-[#10b981]/30 cursor-default overflow-hidden"
                >
                  {/* Subtle Hover Background Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] -z-10" />

                  {/* Giant Number */}
                  <div className="text-6xl md:text-7xl lg:text-[6rem] font-serif font-bold text-gray-100 group-hover:text-emerald-100 transition-colors duration-500 w-24 md:w-32 flex-shrink-0">
                    {pillar.num}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                    <div className="flex-1">
                      <h4 className="text-2xl md:text-3xl font-light text-gray-900 mb-3 tracking-tight group-hover:text-[#10b981] transition-colors duration-300">
                        {pillar.title}
                      </h4>
                      <p className="text-sm font-light text-gray-500 leading-relaxed max-w-xl group-hover:text-gray-700 transition-colors duration-300">
                        {pillar.desc}
                      </p>
                    </div>
                    
                    {/* Interactive Icon Button */}
                    <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 transition-all duration-500 group-hover:bg-[#10b981] group-hover:border-[#10b981] group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)] group-hover:-rotate-12 mt-4 md:mt-0">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Cinematic Metrics Monolith */}
        <div className="bg-zinc-950 rounded-[3rem] p-8 sm:p-14 relative overflow-hidden border border-white/5 shadow-2xl group/metrics">
          
          {/* Volumetric ambient background glows */}
          <div className="absolute -bottom-1/2 left-1/4 w-[800px] h-[800px] bg-[#10b981]/15 blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover/metrics:opacity-100 opacity-50 mix-blend-screen" />
          
          {/* Topographic Lines inside Dark Container */}
          <svg className="absolute w-full h-[150%] top-[-25%] left-0 opacity-[0.04] text-emerald-400 pointer-events-none" viewBox="0 0 1000 400" fill="none">
            <path d="M0 200 C300 100 600 300 1000 200" stroke="currentColor" strokeWidth="1" />
            <path d="M0 220 C300 120 600 320 1000 220" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
          </svg>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6">
            
            {/* Left Narrative inside Metrics */}
            <div className="max-w-md text-center lg:text-left">
              <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/5 border border-white/10 text-white rounded-full text-[9px] font-bold tracking-[0.25em] uppercase">
                <Sparkles className="w-3 h-3 text-[#10b981]" /> Impact Metrics
              </span>
              <h3 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-[1.2] mb-4">
                Redefining the footprint of <span className="font-medium italic text-[#10b981]">alpine exploration.</span>
              </h3>
              <Button asChild variant="link" className="text-white hover:text-[#10b981] p-0 h-auto font-bold tracking-widest text-[10px] uppercase group/btn">
                <Link href="#impact">
                  Read Our Impact Report <ArrowRight className="inline-block w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Right Stat Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              <div className="group/stat">
                <span className="block text-4xl sm:text-6xl font-light text-white mb-1 tracking-tighter group-hover/stat:text-[#10b981] transition-colors duration-500">12K+</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold group-hover/stat:text-white transition-colors duration-300">Active Travelers</span>
              </div>

              <div className="group/stat">
                <span className="block text-4xl sm:text-6xl font-light text-white mb-1 tracking-tighter group-hover/stat:text-[#10b981] transition-colors duration-500">150+</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold group-hover/stat:text-white transition-colors duration-300">Homestays Restored</span>
              </div>

              <div className="group/stat">
                <span className="block text-4xl sm:text-6xl font-light text-white mb-1 tracking-tighter group-hover/stat:text-[#10b981] transition-colors duration-500">18</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold group-hover/stat:text-white transition-colors duration-300">Protected Regions</span>
              </div>

              <div className="group/stat">
                <span className="block text-4xl sm:text-6xl font-light text-[#10b981] mb-1 tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">98%</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-bold group-hover/stat:text-white transition-colors duration-300">Carbon Offset</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}