'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Calendar, Sliders, BookOpen, Home, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhyPahadiBasera = () => {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: 0,
      num: '01',
      shortTitle: 'Remote Collections',
      title: 'Curated "Remote & Off-Beat" Stays',
      description: 'Discover handpicked, authentic homestays tucked away in pristine valleys, forest-edge hamlets, and high-altitude villages that mainstream booking platforms completely miss.',
      icon: Compass,
      iconBg: 'bg-emerald-50 text-[#10b981] ring-emerald-100',
      badge: 'Exclusive Stays',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 1,
      num: '02',
      shortTitle: 'Package Tours',
      title: 'Complete Package Tours & Itineraries',
      description: 'Experience hassle-free travel with end-to-end bundled plans. Your lodging, delicious authentic organic meals, local sightseeing guides, and reliable hill transfers are unified in a single booking.',
      icon: Calendar,
      iconBg: 'bg-orange-50 text-orange-600 ring-orange-100',
      badge: 'All-Inclusive',
      img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      num: '03',
      shortTitle: 'Customization',
      title: 'Transparent, Itemised Customization',
      description: 'Enjoy absolute control over your budget. Flexibly view, select, or remove individual add-ons like kitchen access, local native cooks, bonfire setups, or trekking guides with zero hidden fees.',
      icon: Sliders,
      iconBg: 'bg-blue-50 text-blue-600 ring-blue-100',
      badge: 'Zero Hidden Fees',
      img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      num: '04',
      shortTitle: 'Community Blogs',
      title: 'Travel Community & Featured Blogs',
      description: 'Draw planning inspiration directly from the home screen. Read verified high-quality travel diaries, trek logs, and secret destination reports authored by seasonal Himalayan bloggers.',
      icon: BookOpen,
      iconBg: 'bg-purple-50 text-purple-600 ring-purple-100',
      badge: 'Inspiration Hub',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 4,
      num: '05',
      shortTitle: 'Become a Host',
      title: 'Host Empowerment & Opportunities',
      description: 'Support community-first tourism. Local homeowners keep more of their hard-earned income with our highly competitive nominal commissions (8–10%) and dedicated 24/7 hospitality training support.',
      icon: Home,
      iconBg: 'bg-rose-50 text-rose-600 ring-rose-100',
      badge: '8-10% Commission',
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
      isHostCard: true,
    },
  ];

  const activePillar = pillars[activeTab];
  const ActiveIcon = activePillar.icon;

  return (
    <section id="experiences" className="w-full py-16 px-4 bg-zinc-50 relative overflow-hidden font-sans border-t border-gray-100/60 z-10">
      
      {/* --- Ambient Lighting & SVG Background Designs --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Glowing Orbs for Depth */}
        <div className="absolute -top-[10%] right-[10%] w-[600px] h-[600px] bg-emerald-400/10 blur-[140px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full mix-blend-multiply" />
        
        {/* Abstract Mountain Contour SVGs */}
        <svg className="absolute w-full h-[120%] top-0 left-0 opacity-[0.03] text-gray-900" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400C240 400 480 200 720 200C960 200 1200 600 1440 600" stroke="currentColor" strokeWidth="2" />
          <path d="M0 450C240 450 480 250 720 250C960 250 1200 650 1440 650" stroke="currentColor" strokeWidth="2" />
          <path d="M0 500C240 500 480 300 720 300C960 300 1200 700 1440 700" stroke="currentColor" strokeWidth="2" />
          <path d="M0 550C240 550 480 350 720 350C960 350 1200 750 1440 750" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      
      <div className="max-w-[1250px] mx-auto relative z-10">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20 relative">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#10b981] text-[10px] font-bold tracking-[0.2em] uppercase">
              The Basera Standard
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight leading-tight">
            Our Mountain <span className="font-normal italic text-[#10b981] relative">
              Pillars
              <svg className="absolute w-full h-3 -bottom-1.5 left-0 text-[#10b981]/30" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-base font-light text-gray-500 leading-relaxed mt-6 max-w-xl mx-auto">
            We designed our homestay platform around transparency, native host empowerment, and the quiet magic of off-beat Uttarakhand hamlets.
          </p>
        </div>

        {/* Dynamic Desktop/Tablet Showcase (Sidebar Tabs + Content Board) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Interactive Tab Triggers */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-6 lg:pb-0 scrollbar-none relative">
            
            {/* Connecting vertical line (Desktop only) */}
            <div className="hidden lg:block absolute left-[30px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-gray-200 via-gray-200/50 to-transparent z-0" />

            {pillars.map((pillar, idx) => (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(idx)}
                onMouseEnter={() => setActiveTab(idx)}
                className={`relative z-10 flex-shrink-0 text-left px-5 py-4 rounded-[1.25rem] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center gap-4 cursor-pointer w-[280px] lg:w-full border outline-none ${
                  activeTab === idx
                    ? 'bg-white border-white ring-1 ring-gray-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] lg:translate-x-4 lg:scale-[1.02]'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-gray-800 hover:bg-white/40'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-[11px] font-bold tracking-wider transition-colors duration-300 shadow-sm ${
                  activeTab === idx ? 'bg-[#10b981] text-white' : 'bg-white border border-gray-200 text-gray-400'
                }`}>
                  {pillar.num}
                </div>
                <span className={`text-sm font-medium tracking-wide transition-colors duration-300 ${activeTab === idx ? 'text-gray-900' : 'text-gray-500'}`}>
                  {pillar.shortTitle}
                </span>

                {/* Active Indicator Chevron */}
                {activeTab === idx && (
                  <ArrowUpRight className="w-4 h-4 ml-auto text-[#10b981] opacity-50" />
                )}
              </button>
            ))}
          </div>

          {/* Right Column: Dynamic Showcase Board */}
          <div className="lg:col-span-8 relative">
            {/* Main Glass Board */}
            <div className="relative overflow-hidden bg-white/85 backdrop-blur-2xl ring-1 ring-white rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500">
              
              {/* React Key creates a remount for animation triggering */}
              <div 
                key={activeTab} 
                className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[340px] w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                
                {/* Board Text & Action */}
                <div className="md:col-span-6 flex flex-col justify-between h-full order-2 md:order-1">
                  <div>
                    {/* Header line with badge and mini icon */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-inset shadow-sm ${activePillar.iconBg}`}>
                        <ActiveIcon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <span className={`text-[10px] font-bold tracking-widest uppercase rounded-full px-3 py-1.5 border backdrop-blur-sm ${
                        activePillar.isHostCard 
                          ? 'bg-rose-50/80 text-rose-600 border-rose-100/60'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {activePillar.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-tight mb-4">
                      {activePillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm font-light text-gray-600 leading-relaxed mb-8">
                      {activePillar.description}
                    </p>
                  </div>

                  {/* Contextual CTAs */}
                  <div className="mt-auto">
                    {activePillar.isHostCard ? (
                      <Button
                        asChild
                        className="rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white px-7 py-6 text-[11px] tracking-widest uppercase font-bold shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-0.5 active:scale-95 border-0 group/btn"
                      >
                        <Link href="#become-host" className="flex items-center gap-2">
                          Become a Host
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Link 
                        href="#booking"
                        className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold text-gray-900 hover:text-[#10b981] transition-all duration-300 group/link bg-gray-50 hover:bg-emerald-50 px-5 py-3 rounded-full border border-gray-100 hover:border-emerald-100"
                      >
                        Explore Service
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </div>
                      </Link>
                    )}
                  </div>

                </div>

                {/* Cinematic Board Image Showcase */}
                <div className="md:col-span-6 w-full h-[260px] md:h-[340px] rounded-[2rem] overflow-hidden shadow-lg relative group/showcase order-1 md:order-2 border border-gray-100">
                  <img 
                    src={activePillar.img} 
                    alt={activePillar.title}
                    className="w-full h-full object-cover transform-gpu transition-transform duration-[10000ms] ease-out scale-100 group-hover/showcase:scale-110"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
                  
                  {/* Floating Depth Element (Overlay Badge) */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-end pointer-events-none">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-2.5 flex items-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                      <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                      <div className="pr-2">
                        <p className="text-[9px] font-bold tracking-widest uppercase text-white/90">Verified Standard</p>
                        <p className="text-xs font-medium text-white">Quality Assured</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyPahadiBasera;