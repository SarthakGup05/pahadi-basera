import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OurStory = () => {
  return (
    <section id="our-story" className="w-full py-28 bg-white overflow-hidden relative">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Overlapping Image Collage */}
          <div className="lg:col-span-6 relative h-[500px] sm:h-[550px] w-full">
            {/* Background absolute graphic element */}
            <div className="absolute top-8 left-8 w-4/5 h-[85%] border border-[#10b981]/15 rounded-[2.5rem] pointer-events-none z-0" />
            
            {/* Main Image */}
            <div className="absolute top-0 left-0 w-11/12 h-[80%] rounded-[2rem] overflow-hidden shadow-[0_15px_45px_-20px_rgba(0,0,0,0.1)] group/main z-10 transition-transform duration-700 hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop" 
                alt="Pahadi lifestyle and pine mountains"
                className="w-full h-full object-cover transition-transform duration-[8000ms] group-hover/main:scale-105"
              />
            </div>
            
            {/* Overlapping Floating Image Card */}
            <div className="absolute bottom-4 right-0 w-3/5 h-[50%] rounded-[1.8rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(16,185,129,0.12)] border-4 border-white group/float z-20 transition-all duration-500 hover:scale-[1.04] hover:-translate-y-1">
              <img 
                src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop" 
                alt="Rustic mountain cozy cottage"
                className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover/float:scale-105"
              />
            </div>

            {/* Floating Glass Badge */}
            <div className="absolute top-12 right-[8%] z-30 bg-white/70 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:bg-white/80 transition-colors duration-300">
              <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#10b981] mb-0.5">Est. 2020</span>
              <span className="block text-xs font-light text-gray-800 tracking-tight">Born in the Himalayas</span>
            </div>
          </div>

          {/* Right Side: Editorial Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Category Meta Tag */}
            <span className="text-[#10b981] text-xs font-light tracking-[0.25em] uppercase mb-4 block">
              Our Origins
            </span>
            
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 leading-[1.15] tracking-tight mb-8">
              Reconnecting with the <br /> 
              <span className="font-normal italic text-[#10b981]">Rhythm of the Hills</span>
            </h2>
            
            {/* Description Paragraphs */}
            <div className="flex flex-col gap-6 text-sm font-light text-gray-500 leading-relaxed mb-10 max-w-xl">
              <p>
                Pahadi Basera was born from a simple promise: to capture the slow, sacred essence of Himalayan life and curate it for the modern wanderer. We went deep into valleys, climbed forgotten ridges, and partnered with local families to restore local, slate-roofed homestays.
              </p>
              <p>
                Every Basera is a bridge between generations. We blend the rustic charm of stone architecture and wood carvings with the quiet luxury of premium linens, hot baths, and local organic kitchens. Here, hospitality isn’t a service — it’s a warm invitation to gather round the fireplace.
              </p>
            </div>

            {/* Premium Stat Divider Grid */}
            <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-100 mb-10 max-w-xl">
              <div>
                <span className="block text-2xl font-light text-gray-900 mb-1">12+</span>
                <span className="block text-[10px] tracking-wider uppercase text-gray-400 font-light">Scenic Regions</span>
              </div>
              <div className="border-l border-gray-100 pl-6">
                <span className="block text-2xl font-light text-gray-900 mb-1">150+</span>
                <span className="block text-[10px] tracking-wider uppercase text-gray-400 font-light">Baseras Listed</span>
              </div>
              <div className="border-l border-gray-100 pl-6">
                <span className="block text-2xl font-light text-[#10b981] mb-1">4.95★</span>
                <span className="block text-[10px] tracking-wider uppercase text-gray-400 font-light">Guest Reviews</span>
              </div>
            </div>

            {/* Read More Call-to-action Button */}
            <div className="flex">
              <Button
                asChild
                className="rounded-full bg-gray-950 hover:bg-[#10b981] text-white px-7 py-5 text-xs tracking-widest uppercase font-light shadow-md transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] active:scale-95 border-0 h-10 group"
              >
                <Link href="#properties" className="flex items-center gap-2">
                  Explore Baseras
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
