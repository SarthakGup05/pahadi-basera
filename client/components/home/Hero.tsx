'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBox from './Searchbox';

const slides = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
];

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    duration: 40, // Slightly slower, silkier slide transition
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000); // Auto slide every 6 seconds

    return () => clearInterval(interval);
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full min-h-[100svh] relative overflow-hidden bg-zinc-900">
      
      {/* Background and Content Container */}
      <div className="relative w-full h-full min-h-[100svh] flex flex-col items-center justify-center pt-28 pb-12 lg:py-0 group">
        
        {/* Embla Slider Viewport */}
        <div className="absolute inset-0 w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full w-full">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative">
                <img
                  src={slide}
                  alt={`Mountain Peak Slide ${index + 1}`}
                  // The active slide gets a slow, continuous "Ken Burns" zoom effect
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
                    selectedIndex === index ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic Multi-Layered Overlays for Depth */}
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10 pointer-events-none" />

        {/* Hero Typography Container */}
        <div className="relative z-20 text-center text-white max-w-5xl mx-auto flex flex-col items-center pointer-events-none px-4 lg:-mt-20">
          
          {/* Subtle Glassmorphic Badge */}
          <div className="mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
              Elevate Your Stay
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-[6.5rem] leading-[1.05] font-light mb-6 tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fade-in duration-1000">
            Find your favorite <br/>
            <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 relative">
              place
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-[#10b981]/60" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span> here.
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl font-medium text-white/80 drop-shadow-md max-w-2xl animate-fade-in duration-1000 delay-200">
            Discover curated sanctuaries and exclusive prices for over 2 million handpicked properties worldwide.
          </p>
        </div>

        {/* Slide Indicators (Dots) - Hidden on desktop, visible on mobile */}
        <div className="relative z-20 mt-6 mb-2 flex md:hidden items-center justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-500 ease-out rounded-full cursor-pointer border border-white/30 backdrop-blur-sm ${
                selectedIndex === index 
                  ? 'w-10 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Left & Right Slider Controls (Hidden on mobile for swipe UX, visible on hover on desktop) */}
        <button 
          onClick={scrollPrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/20 hover:bg-[#10b981] active:scale-90 text-white items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] border border-white/20 cursor-pointer group/arrow-left hover:scale-110"
        >
          <ChevronLeft className="w-7 h-7 transition-transform duration-300 group-hover/arrow-left:-translate-x-0.5" />
        </button>
        <button 
          onClick={scrollNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/20 hover:bg-[#10b981] active:scale-90 text-white items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] border border-white/20 cursor-pointer group/arrow-right hover:scale-110"
        >
          <ChevronRight className="w-7 h-7 transition-transform duration-300 group-hover/arrow-right:translate-x-0.5" />
        </button>

        {/* SearchBox Container */}
        <div className="relative lg:absolute lg:bottom-8 lg:left-0 lg:right-0 w-full px-4 z-30 mt-6 lg:mt-0">
          <div className="max-w-[1250px] mx-auto animate-fade-in duration-1000 delay-300">
            <SearchBox />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;