'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OurStory = () => {
  return (
    <section id="our-story" className="w-full py-16 bg-zinc-50 overflow-hidden relative z-10">
      
      {/* Ambient Lighting & SVG Background Designs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        
        {/* Glowing Ambient Backdrop */}
        <div className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply" />
        
        {/* Abstract Topographic Wave SVG */}
        <svg className="absolute w-[150%] h-auto top-1/4 -right-1/4 opacity-[0.03] text-gray-900 rotate-12" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 300C240 100 480 500 720 300C960 100 1200 500 1440 300" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 350C240 150 480 550 720 350C960 150 1200 550 1440 350" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <path d="M0 400C240 200 480 600 720 400C960 200 1200 600 1440 400" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          
          {/* Left Side: Overlapping Image Collage */}
          <div className="lg:col-span-6 relative h-[500px] sm:h-[600px] w-full group/collage perspective-1000">
            
            {/* Background absolute graphic element */}
            <div className="absolute top-10 -left-6 w-4/5 h-[80%] border-2 border-[#10b981]/20 rounded-[3rem] pointer-events-none z-0 transition-transform duration-700 ease-out group-hover/collage:translate-x-2 group-hover/collage:translate-y-2" />
            
            {/* Main Image (Back) */}
            <div className="absolute top-0 left-0 w-11/12 h-[80%] rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/collage:rotate-[-2deg] group-hover/collage:scale-[0.98]">
              <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none transition-opacity duration-500 group-hover/collage:opacity-20" />
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop" 
                alt="Pahadi lifestyle and pine mountains"
                className="w-full h-full object-cover transform-gpu transition-transform duration-[10000ms] group-hover/collage:scale-110"
              />
            </div>
            
            {/* Overlapping Floating Image Card (Front) */}
            <div className="absolute bottom-4 right-0 w-[65%] h-[55%] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(16,185,129,0.25)] border-[6px] border-zinc-50 z-20 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/collage:translate-x-4 group-hover/collage:-translate-y-6 group-hover/collage:rotate-[3deg]">
              <img 
                src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop" 
                alt="Rustic mountain cozy cottage"
                className="w-full h-full object-cover transform-gpu transition-transform duration-[8000ms] group-hover/collage:scale-110"
              />
            </div>

            {/* Floating Glass Badge */}
            <div className="absolute top-16 right-[2%] z-30 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/collage:-translate-y-4 group-hover/collage:-translate-x-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#10b981] mb-0.5">Est. 2020</span>
                  <span className="block text-xs font-semibold text-gray-800 tracking-tight">Born in the Himalayas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Editorial Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Category Meta Tag */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-emerald-50 w-fit border border-emerald-100 shadow-sm">
              <span className="text-[#10b981] text-[10px] font-bold tracking-[0.2em] uppercase">
                Our Origins
              </span>
            </div>
            
            {/* Title with Organic SVG Underline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 leading-[1.1] tracking-tight mb-8">
              Reconnecting with the <br className="hidden sm:block" /> 
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="font-normal italic text-[#10b981]">Rhythm</span>
                {/* Organic Swoosh Underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#10b981]/40" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M0,10 Q30,15 70,5 T100,10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </span> of the Hills.
            </h2>
            
            {/* Description Paragraphs */}
            <div className="flex flex-col gap-6 text-[15px] font-light text-gray-500 leading-relaxed mb-10 max-w-xl">
              <p>
                <span className="text-gray-900 font-medium">Pahadi Basera</span> was born from a simple promise: to capture the slow, sacred essence of Himalayan life and curate it for the modern wanderer. We went deep into valleys, climbed forgotten ridges, and partnered with local families to restore local, slate-roofed homestays.
              </p>
              <p>
                Every Basera is a bridge between generations. We blend the rustic charm of stone architecture and wood carvings with the quiet luxury of premium linens, hot baths, and local organic kitchens. Here, hospitality isn’t a service — it’s a warm invitation to gather round the fireplace.
              </p>
            </div>

            {/* Premium Stat Divider Grid */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-200/60 mb-10 max-w-xl bg-gradient-to-r from-transparent via-white/40 to-transparent">
              <div>
                <span className="block text-3xl font-light text-gray-900 mb-1">12+</span>
                <span className="block text-[10px] tracking-[0.15em] uppercase text-gray-400 font-bold">Scenic Regions</span>
              </div>
              <div className="border-l border-gray-200/60 pl-4 sm:pl-6">
                <span className="block text-3xl font-light text-gray-900 mb-1">150+</span>
                <span className="block text-[10px] tracking-[0.15em] uppercase text-gray-400 font-bold">Baseras Listed</span>
              </div>
              <div className="border-l border-gray-200/60 pl-4 sm:pl-6">
                <span className="block text-3xl font-light text-[#10b981] mb-1 drop-shadow-sm">4.95</span>
                <span className="block text-[10px] tracking-[0.15em] uppercase text-gray-400 font-bold flex items-center gap-1">
                  Guest Reviews <span className="text-yellow-400 text-sm">★</span>
                </span>
              </div>
            </div>

            {/* Read More Call-to-action Button */}
            <div className="flex">
              <Button
                asChild
                className="relative rounded-full bg-gray-900 hover:bg-[#10b981] text-white px-8 py-6 text-[11px] tracking-widest uppercase font-bold shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] active:scale-95 border-0 h-12 group/btn overflow-hidden"
              >
                <Link href="#properties" className="flex items-center gap-2 relative z-10">
                  Explore Baseras
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

export default OurStory;