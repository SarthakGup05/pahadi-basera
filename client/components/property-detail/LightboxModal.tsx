'use client';

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyItem } from '@/lib/propertiesData';

interface LightboxModalProps {
  property: PropertyItem;
  galleryImages: string[];
  activePhotoIdx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onThumbnailClick: (idx: number) => void;
}

export default function LightboxModal({
  property,
  galleryImages,
  activePhotoIdx,
  onClose,
  onPrev,
  onNext,
  onThumbnailClick,
}: LightboxModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-lg flex flex-col justify-between p-6 select-none text-white font-sans"
      style={{
        animation: 'modalBackdropReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
      onClick={onClose}
    >
      {/* Inject local premium styles for the slideshow crossfade and depth animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalBackdropReveal {
            0% { opacity: 0; backdrop-filter: blur(0px); background-color: rgba(0, 0, 0, 0); }
            100% { opacity: 1; backdrop-filter: blur(16px); background-color: rgba(0, 0, 0, 0.96); }
        }
        @keyframes modalFrameReveal {
            0% { opacity: 0; transform: scale(0.93) translate3d(0, 15px, 0); }
            100% { opacity: 1; transform: scale(1) translate3d(0, 0, 0); }
        }
        @keyframes imageReveal {
            0% { opacity: 0; transform: scale(0.975); filter: blur(6px); }
            100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        .animate-image-reveal {
            animation: imageReveal 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-frame-reveal {
            animation: modalFrameReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Lightbox Header */}
      <div className="flex items-center justify-between w-full max-w-[1250px] mx-auto z-20 pointer-events-auto">
        <span className="text-xs font-bold tracking-widest uppercase text-white/60">
          {property.title} &bull; Photo {activePhotoIdx + 1} of {galleryImages.length}
        </span>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slideshow viewport */}
      <div className="flex items-center justify-between w-full max-w-[1250px] mx-auto flex-1 gap-4 z-20 pointer-events-auto">
        
        {/* Prev Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Viewport Frame with elegant reveal */}
        <div 
          className="relative max-w-[90%] max-h-[72vh] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-900 flex items-center justify-center animate-frame-reveal"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            key={activePhotoIdx}
            src={galleryImages[activePhotoIdx]} 
            alt={`${property.title} Space Large`}
            className="max-w-full max-h-[68vh] object-contain animate-image-reveal"
          />
        </div>

        {/* Next Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* Bottom Thumbnails strip */}
      <div 
        className="flex items-center justify-center gap-3 overflow-x-auto pb-4 max-w-[1250px] mx-auto w-full z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {galleryImages.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => onThumbnailClick(idx)}
            className={`w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 shrink-0 ${
              activePhotoIdx === idx ? 'border-emerald-500 scale-108 shadow-[0_0_15px_rgba(16,185,129,0.35)]' : 'border-white/10 opacity-55 hover:opacity-100'
            }`}
          >
            <img src={img} alt="Thumb" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

    </div>
  );
}
