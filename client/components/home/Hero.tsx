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
    duration: 35, // Smooth sliding duration
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
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

    return () => {
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full min-h-[680px] md:h-screen relative overflow-hidden">
      {/* Background and Text Container */}
      <div className="relative w-full min-h-[680px] md:h-full flex flex-col items-center justify-center px-4 shadow-lg group pt-28 pb-12 md:py-0">
        
        {/* Embla Slider Viewport */}
        <div className="absolute inset-0 w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full w-full">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative">
                <img
                  src={slide}
                  alt={`Pahadi Basera Mountain Peak Slide ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out scale-100 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Subtle dark overlay for extreme readability */}
        <div className="absolute inset-0 bg-black/25 z-10 pointer-events-none" />

        {/* Hero Typography */}
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto flex flex-col items-center pointer-events-none px-4">
          <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] leading-[1.05] font-light mb-6 tracking-tight drop-shadow-sm animate-fade-in duration-1000">
            Find your favorite <br/> place here!
          </h1>
          <p className="text-sm sm:text-base md:text-xl font-light drop-shadow-md animate-fade-in duration-1000 delay-200">
            The best prices for over 2 million properties worldwide
          </p>
        </div>

        {/* Left & Right Sliders Controls (Visible on hover) */}
        <button 
          onClick={scrollPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-[#10b981] hover:border-[#10b981] active:scale-90 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-md hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.5)] hover:scale-110 hover:-translate-y-[calc(50%+4px)] border border-white/10 cursor-pointer group/arrow-left"
        >
          <ChevronLeft className="w-6 h-6 transition-transform duration-300 group-hover/arrow-left:-translate-x-0.5" />
        </button>
        <button 
          onClick={scrollNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-[#10b981] hover:border-[#10b981] active:scale-90 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-md hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.5)] hover:scale-110 hover:-translate-y-[calc(50%+4px)] border border-white/10 cursor-pointer group/arrow-right"
        >
          <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover/arrow-right:translate-x-0.5" />
        </button>

        {/* SearchBox Container (responsive: relative stacked on mobile, absolute floating on desktop) */}
        <div className="relative w-full max-w-[1250px] px-4 z-20 mt-10 md:mt-0 md:absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2">
          <SearchBox />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;