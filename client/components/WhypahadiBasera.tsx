'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Calendar, Sliders, BookOpen, Home, Star, ArrowUpRight } from 'lucide-react';
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
      iconBg: 'bg-emerald-50 text-[#10b981]',
      badge: 'Exclusive Stays',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 1,
      num: '02',
      shortTitle: 'Package Tours',
      title: 'Complete Package Tours & Itineraries',
      description: 'Experience hassle-free travel with end-to-end bundled plans. Your lodging, delicious authentic organic meals, local sightseeing guides, and reliable hill transfers are unified in a single booking.',
      icon: Calendar,
      iconBg: 'bg-orange-50 text-orange-600',
      badge: 'All-Inclusive',
      img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 2,
      num: '03',
      shortTitle: 'Customization',
      title: 'Transparent, Itemised Customization',
      description: 'Enjoy absolute control over your budget. Flexibly view, select, or remove individual add-ons like kitchen access, local native cooks, bonfire setups, or trekking guides with zero hidden fees.',
      icon: Sliders,
      iconBg: 'bg-blue-50 text-blue-600',
      badge: 'Zero Hidden Fees',
      img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 3,
      num: '04',
      shortTitle: 'Community Blogs',
      title: 'Travel Community & Featured Blogs',
      description: 'Draw planning inspiration directly from the home screen. Read verified high-quality travel diaries, trek logs, and secret destination reports authored by seasonal Himalayan bloggers.',
      icon: BookOpen,
      iconBg: 'bg-purple-50 text-purple-600',
      badge: 'Inspiration Hub',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 4,
      num: '05',
      shortTitle: 'Become a Host',
      title: 'Host Empowerment & Opportunities',
      description: 'Support community-first tourism. Local homeowners keep more of their hard-earned income with our highly competitive nominal commissions (8–10%) and dedicated 24/7 hospitality training support.',
      icon: Home,
      iconBg: 'bg-rose-50 text-rose-600',
      badge: '8-10% Commission',
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop',
      isHostCard: true,
    },
  ];

  const activePillar = pillars[activeTab];
  const ActiveIcon = activePillar.icon;

  return (
    <section id="experiences" className="w-full py-24 px-4 bg-zinc-50 relative overflow-hidden font-sans border-t border-gray-100/60">
      {/* Subtle backdrop decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-[1250px] mx-auto relative z-10">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#10b981] text-xs font-light tracking-[0.25em] uppercase mb-4 block">
            The Basera Standard
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight leading-tight">
            Our Mountain <span className="font-normal italic text-[#10b981]">Pillars</span>
          </h2>
          <p className="text-sm font-light text-gray-500 leading-relaxed mt-4">
            We designed our homestay platform around transparency, native host empowerment, and the quiet magic of off-beat Uttarakhand hamlets.
          </p>
        </div>

        {/* Dynamic Desktop/Tablet Showcase (Sidebar Tabs + Content Board) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Tab Triggers */}
          <div className="lg:col-span-5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 scrollbar-none">
            {pillars.map((pillar, idx) => (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(idx)}
                onMouseEnter={() => setActiveTab(idx)}
                className={`flex-shrink-0 text-left px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 cursor-pointer w-auto lg:w-full border ${
                  activeTab === idx
                    ? 'bg-white border-gray-200/80 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.05)] text-[#10b981] lg:translate-x-2'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-gray-800'
                }`}
              >
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  activeTab === idx ? 'bg-emerald-50 text-[#10b981]' : 'bg-gray-100 text-gray-400'
                }`}>
                  {pillar.num}
                </span>
                <span className="text-sm font-light tracking-wide whitespace-nowrap lg:whitespace-normal">
                  {pillar.shortTitle}
                </span>
              </button>
            ))}
          </div>

          {/* Right Column: Dynamic Showcase Board */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden bg-white border border-gray-100/80 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)] transition-all duration-500">
              
              <div 
                key={activeTab} 
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[300px] w-full animate-in fade-in-50 slide-in-from-bottom-3 duration-500 ease-out"
              >
                
                {/* Board Text & Action */}
                <div className="md:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    {/* Header line with badge and mini icon */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className={`text-[10px] font-medium rounded-full px-2.5 py-0.5 border ${
                        activePillar.isHostCard 
                          ? 'bg-rose-50/50 text-rose-600 border-rose-100/60'
                          : 'bg-emerald-50/50 text-[#10b981] border-emerald-100/60'
                      }`}>
                        {activePillar.badge}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activePillar.iconBg}`}>
                        <ActiveIcon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-light text-gray-900 tracking-tight mb-4">
                      {activePillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-sm font-light text-gray-500 leading-relaxed mb-6">
                      {activePillar.description}
                    </p>
                  </div>

                  {/* Contextual CTAs */}
                  <div className="mt-auto">
                    {activePillar.isHostCard ? (
                      <Button
                        asChild
                        className="rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white px-6 py-5 text-xs tracking-widest uppercase font-light shadow-md transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-0.5 active:scale-95 border-0 h-9 group/btn"
                      >
                        <Link href="#become-host" className="flex items-center gap-1.5">
                          Become a Host
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Link 
                        href="#booking"
                        className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase font-semibold text-gray-400 hover:text-[#10b981] transition-all duration-300 group/link"
                      >
                        Explore Service
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>

                </div>

                {/* Board Image Showcase */}
                <div className="md:col-span-5 w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm relative group/showcase">
                  <img 
                    src={activePillar.img} 
                    alt={activePillar.title}
                    className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover/showcase:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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