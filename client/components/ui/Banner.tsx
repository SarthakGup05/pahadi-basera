'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  bgImage?: string;
  height?: 'sm' | 'md' | 'lg';
  overlayOpacity?: 'light' | 'medium' | 'dark';
  breadcrumbItems: BreadcrumbItemData[];
  children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  badge,
  bgImage,
  height = 'md',
  overlayOpacity = 'medium',
  breadcrumbItems,
  children
}) => {
  // Height Presets (Elevated vertical rhythm using min-h to allow content auto-sizing)
  const heightStyles = {
    sm: 'min-h-[250px] sm:min-h-[300px]',
    md: 'min-h-[360px] sm:min-h-[440px] lg:min-h-[500px]',
    lg: 'min-h-[450px] sm:min-h-[580px] lg:min-h-[680px]'
  };

  // Overlay Opacity Presets (Tuned for contrast and depth)
  const opacityStyles = {
    light: 'bg-black/20',
    medium: 'bg-black/40',
    dark: 'bg-black/60'
  };

  return (
    <div className={`relative w-full ${heightStyles[height]} overflow-hidden flex flex-col justify-end text-white font-sans group/banner`}>
      
      {/* Background Layer */}
      {bgImage ? (
        <>
          {/* Main Cinematic Backdrop */}
          <div className="absolute inset-0 bg-zinc-950">
            <img 
              src={bgImage} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-[15000ms] ease-out scale-100 group-hover/banner:scale-110 opacity-90"
            />
          </div>

          {/* Complex Multi-layered Vignette for Extreme Depth */}
          {/* 1. Base Darkener */}
          <div className={`absolute inset-0 z-10 transition-colors duration-700 ${opacityStyles[overlayOpacity]} mix-blend-multiply`} />
          {/* 2. Radial Center Focus */}
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
          {/* 3. Heavy Bottom Gradient for Text Legibility */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
          {/* 4. Film Grain / Micro Scanline Texture */}
          <div className="absolute inset-0 z-10 bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(0,0,0,0.05)_2px,rgba(0,0,0,0.05)_4px)] opacity-50 pointer-events-none" />
        </>
      ) : (
        // Premium HSL Forest/Alpine Gradient fallback
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#020617] overflow-hidden">
          {/* Organic Ambient Light Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
          
          {/* Fine Grid Texture Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-[1250px] mx-auto px-6 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 flex flex-col justify-end">
        
        {/* Deep Frosted Glass Breadcrumb Capsule */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className="w-fit mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Breadcrumb className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-full px-5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-white/15 hover:border-white/25 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] group/bread">
              <BreadcrumbList className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-stone-300">
                {breadcrumbItems.map((item, idx) => {
                  const isLast = idx === breadcrumbItems.length - 1;
                  
                  return (
                    <React.Fragment key={idx}>
                      <BreadcrumbItem className="flex items-center">
                        {isLast || !item.href ? (
                          <BreadcrumbPage className="text-white font-bold drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] animate-pulse" />
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link 
                              href={item.href}
                              className="text-stone-400 hover:text-emerald-400 transition-colors duration-300"
                            >
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator className="text-stone-600">
                          <ChevronRight className="w-3.5 h-3.5 group-hover/bread:text-emerald-400 transition-colors" strokeWidth={3} />
                        </BreadcrumbSeparator>
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        <div className="flex flex-col relative pl-6 border-l-2 border-[#10b981]/50">
          
          {/* Decorative Badge Tag */}
          {badge && (
            <div className="inline-flex items-center gap-2 w-fit mb-5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-md shadow-sm animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              <span className="text-emerald-300 text-[9px] font-bold tracking-[0.3em] uppercase drop-shadow-md">
                {badge}
              </span>
            </div>
          )}

          {/* Main Title Headers */}
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-light tracking-tight text-white leading-[1.05] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-stone-300 font-light text-sm sm:text-base md:text-lg leading-relaxed tracking-wide mt-5 drop-shadow-lg max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                {subtitle}
              </p>
            )}
          </div>

        </div>

        {/* Custom Slot (e.g. action buttons, mini forms) */}
        {children && (
          <div className="mt-8 sm:mt-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 relative z-30">
            {children}
          </div>
        )}

      </div>

      {/* Ground Shroud */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-30" />
    </div>
  );
};

export default Banner;