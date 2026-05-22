'use client';

import React, { useEffect, useState, useRef } from 'react';

const Loader = () => {
    const [isFadeOut, setIsFadeOut] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        // Prevent body scrolling while loading
        document.body.classList.add('loader-active');
        
        const duration = 2200; // 2.2 seconds for a deliberate, luxurious pace
        const startTime = performance.now();
        let animationFrameId: number;

        const updateProgress = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const t = Math.min(elapsed / duration, 1);
            
            // Cubic ease-out calculation for the progress number and bar
            const easeOutProgress = 1 - Math.pow(1 - t, 3);
            const currentPercent = easeOutProgress * 100;

            // Direct DOM manipulation to avoid high-frequency React state re-renders (ensuring solid 60fps/120fps)
            if (progressBarRef.current) {
                progressBarRef.current.style.width = `${currentPercent}%`;
            }
            if (progressTextRef.current) {
                progressTextRef.current.textContent = Math.floor(currentPercent).toString().padStart(2, '0');
            }

            if (t < 1) {
                animationFrameId = requestAnimationFrame(updateProgress);
            } else {
                // 1. Trigger Loader Fade Out and Page Reveal simultaneously
                setTimeout(() => {
                    setIsFadeOut(true);
                    document.body.classList.remove('loader-active');
                    document.body.classList.add('loader-complete');
                    
                    // 2. Unmount the loader from DOM once cinematic exit transition completes
                    setTimeout(() => {
                        setIsHidden(true);
                    }, 1000); // Wait for the 1s cinematic exit animation
                }, 400); // Cozy hold duration at 100%
            }
        };

        animationFrameId = requestAnimationFrame(updateProgress);

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.body.classList.remove('loader-active');
        };
    }, []);

    if (isHidden) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                /* Lock scroll during loading */
                .loader-active {
                    overflow: hidden !important;
                    height: 100vh !important;
                }

                /* Keyframe for elegant SVG line drawing */
                @keyframes drawPathPremium {
                    0% { stroke-dashoffset: 400; opacity: 0; }
                    20% { opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 1; }
                }

                /* Deep Volumetric Pulse */
                @keyframes glowPulsePremium {
                    0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.05; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.12; }
                }

                /* Letter Spacing & Fade-in for Logo */
                @keyframes spacingRevealPremium {
                    0% {
                        letter-spacing: 0.1;
                        opacity: 0;
                        filter: blur(8px);
                        transform: translateY(15px) scale(0.95);
                    }
                    100% {
                        letter-spacing: 0.35em;
                        opacity: 1;
                        filter: blur(0px);
                        transform: translateY(0) scale(1);
                    }
                }

                /* Delicate Fade-in with Delay */
                @keyframes subtleFadeInPremium {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                /* SVG Classes */
                .path-main {
                    stroke-dasharray: 400;
                    stroke-dashoffset: 400;
                    animation: drawPathPremium 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .path-detail {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: drawPathPremium 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    animation-delay: 0.2s;
                }
                .path-sun {
                    stroke-dasharray: 300;
                    stroke-dashoffset: 300;
                    animation: drawPathPremium 3s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    animation-delay: 0.3s;
                }

                .loader-title {
                    animation: spacingRevealPremium 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .loader-subtitle {
                    opacity: 0;
                    animation: subtleFadeInPremium 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    animation-delay: 0.6s;
                }
                .loader-progress {
                    opacity: 0;
                    animation: subtleFadeInPremium 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    animation-delay: 1s;
                }

                /* Before loader finishes, keep website content hidden and shifted */
                body.loader-active main,
                body.loader-active header,
                body.loader-active footer {
                    opacity: 0 !important;
                    transform: translateY(30px) scale(0.98);
                    filter: blur(10px);
                }

                /* Transition on main website content when loader finishes */
                body.loader-complete main,
                body.loader-complete header,
                body.loader-complete footer {
                    animation: pageReveal 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }

                @keyframes pageReveal {
                    0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(10px); }
                    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
                }
            `}} />

            {/* Main Fullscreen Overlay */}
            <div 
                className={`fixed inset-0 bg-[#fcfbf9] flex flex-col items-center justify-center z-[99999] pointer-events-auto transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] overflow-hidden ${
                    isFadeOut ? 'opacity-0 scale-105 -translate-y-8 blur-md pointer-events-none' : 'opacity-100 scale-100 translate-y-0 blur-0'
                }`}
            >
                {/* 1. Deep Ambient Vignette Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f5f2eb_100%)] z-0 pointer-events-none opacity-90" />
                
                {/* 2. Deep Forest Ambient Radial Glow */}
                <div 
                    className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0"
                    style={{ animation: 'glowPulsePremium 8s ease-in-out infinite' }}
                />

                {/* 3. Content Center Container */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
                    
                    {/* Minimalist Fine-Line Mountains & Sun SVG */}
                    <svg 
                        width="120" 
                        height="80" 
                        viewBox="0 0 120 80" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-[0_4px_12px_rgba(16,185,129,0.12)] mb-2"
                    >
                        {/* Back Sun */}
                        <circle cx="75" cy="35" r="16" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="2 4" className="path-sun" />
                        {/* Secondary Peak */}
                        <path d="M55 65 L82 35 L108 65" stroke="#047857" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="path-detail" />
                        {/* Main Peak */}
                        <path d="M15 65 L52 20 L88 65" stroke="#10b981" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="path-main" />
                        {/* Fine Ridge line Detail */}
                        <path d="M52 20 L56 36 L50 50 L55 65" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" className="path-detail" />
                        {/* Base Line */}
                        <line x1="5" y1="65" x2="115" y2="65" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" strokeLinecap="round" />
                    </svg>

                    {/* Logo Typography */}
                    <h1 className="loader-title text-2xl sm:text-3xl font-light tracking-[0.35em] text-stone-900 mt-6 uppercase whitespace-nowrap drop-shadow-sm">
                        Pahadi <span className="font-semibold text-[#10b981] drop-shadow-[0_2px_8px_rgba(16,185,129,0.15)]">Basera</span>
                    </h1>

                    {/* Tagline */}
                    <p className="loader-subtitle text-[9px] sm:text-[10px] tracking-[0.3em] text-stone-500 font-semibold uppercase mt-4">
                        Bespoke Himalayan Retreats
                    </p>

                    {/* 4. Ultra-Premium Progress Indicator */}
                    <div className="loader-progress flex flex-col items-center mt-12 w-48">
                        {/* Animated Counter */}
                        <div className="text-[10px] font-mono tracking-widest text-[#10b981] mb-3 flex items-center gap-2">
                            <span ref={progressTextRef} className="w-8 text-right">00</span>
                            <span className="text-stone-400">%</span>
                        </div>
                        
                        {/* Hairline Progress Bar */}
                        <div className="w-full h-[1px] bg-stone-200/80 rounded-full relative overflow-visible">
                            <div 
                                ref={progressBarRef}
                                className="absolute top-1/2 -translate-y-1/2 left-0 h-[1px] bg-gradient-to-r from-emerald-600 to-[#10b981] rounded-full"
                                style={{ width: '0%' }}
                            >
                                {/* Glowing leading tip */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#10b981] rounded-full blur-[2px] shadow-[0_0_10px_#10b981]" />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default Loader;