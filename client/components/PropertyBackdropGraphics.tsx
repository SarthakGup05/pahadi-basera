'use client';

import React from 'react';

export default function PropertyBackdropGraphics() {
  return (
    <>
      {/* Keyframe animations specifically tuned for slow mountain graphics */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes driftOrbA {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.4; }
          50% { transform: translate(30px, -40px) scale(1.1); opacity: 0.55; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.4; }
        }
        @keyframes driftOrbB {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
          50% { transform: translate(-40px, 30px) scale(0.95); opacity: 0.45; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
        }
        @keyframes slowDrawTopo {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .animate-drift-a {
          animation: driftOrbA 20s infinite ease-in-out;
        }
        .animate-drift-b {
          animation: driftOrbB 24s infinite ease-in-out;
        }
        .animate-draw-topo {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: slowDrawTopo 15s infinite alternate ease-in-out;
        }
        .film-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}} />

      {/* Main Graphics Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        
        {/* 1. Base Topographic Radial Grid & Film Grain */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.35] pointer-events-none" />
        <div className="absolute inset-0 film-grain opacity-[0.025] mix-blend-overlay fixed pointer-events-none" />

        {/* 2. Slow Pulsing Ambient Light Orbs */}
        <div className="absolute top-[15%] -left-[10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] rounded-full mix-blend-multiply animate-drift-a pointer-events-none" />
        <div className="absolute bottom-[20%] -right-[15%] w-[550px] h-[550px] bg-sky-500/8 blur-[120px] rounded-full mix-blend-multiply animate-drift-b pointer-events-none" />
        <div className="absolute top-[50%] left-[25%] w-[350px] h-[350px] bg-amber-500/3 blur-[90px] rounded-full mix-blend-screen pointer-events-none" />

        {/* 3. Mountain Ridge Contour Lines (Self-Drawing SVGs) */}
        <svg className="absolute w-full h-[140%] bottom-[-10%] left-0 opacity-[0.035] text-stone-900 pointer-events-none" viewBox="0 0 1440 1000" fill="none" preserveAspectRatio="none">
          <path d="M-100 800 C350 450 650 900 1500 250" stroke="currentColor" strokeWidth="2" className="animate-draw-topo" />
          <path d="M-100 880 C350 530 650 980 1500 330" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 7" className="animate-draw-topo" style={{ animationDelay: '-4s' }} />
          <path d="M-100 720 C300 370 600 820 1400 170" stroke="currentColor" strokeWidth="0.8" className="animate-draw-topo" style={{ animationDelay: '-8s' }} />
        </svg>

        {/* 4. Astrolabe / High-Altitude Stargazing Ring Graphics */}
        <div className="absolute top-[35%] right-[-80px] opacity-[0.025] hover:opacity-[0.06] text-emerald-600 transition-all duration-700 pointer-events-auto hidden lg:block">
          <svg className="w-[200px] h-[200px] animate-pulse" style={{ animationDuration: '6s' }} viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" />
            <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.8" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="100,40 106,100 100,160 94,100" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

      </div>
    </>
  );
}
