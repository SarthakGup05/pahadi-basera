'use client';

import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    
    // Mouse coordinate refs for smooth requestAnimationFrame animation
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        // Only run on desktop screens with pointer capabilities
        if (typeof window === 'undefined') return;
        
        const mediaQuery = window.matchMedia('(min-width: 1024px) and (hover: hover)');
        if (!mediaQuery.matches) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
            
            // Instantly move the inner precise dot using Hardware Acceleration (GPU)
            // Use standard chained translations to avoid browser-specific calc() parsing bugs
            dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            
            // Make the custom cursor visible only on the first mouse movement to prevent top-left stuck icons
            if (!dot.classList.contains('is-visible')) {
                dot.classList.add('is-visible');
            }
            if (!ring.classList.contains('is-visible')) {
                ring.classList.add('is-visible');
            }
        };

        const handleMouseDown = () => {
            dot.classList.add('is-clicked');
            ring.classList.add('is-clicked');
        };
        
        const handleMouseUp = () => {
            dot.classList.remove('is-clicked');
            ring.classList.remove('is-clicked');
        };

        // Handle mouse leaving and entering browser window
        const handleMouseLeave = () => {
            dot.classList.remove('is-visible');
            ring.classList.remove('is-visible');
        };

        const handleMouseEnter = () => {
            dot.classList.add('is-visible');
            ring.classList.add('is-visible');
        };

        // Track hovering on clickable elements using direct DOM manipulation for 0-latency hover responsiveness
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const isClickable = 
                target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.closest('a') || 
                target.closest('button') || 
                target.closest('.cursor-pointer') ||
                window.getComputedStyle(target).cursor === 'pointer';

            if (isClickable) {
                dot.classList.add('is-hovered');
                ring.classList.add('is-hovered');
            } else {
                dot.classList.remove('is-hovered');
                ring.classList.remove('is-hovered');
            }
        };

        // Smooth trailing loop using linear interpolation (lerp)
        const updateRingPosition = () => {
            // Trailing ring velocity factor
            const speed = 0.15; 
            
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * speed;
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * speed;
            
            // Apply hardware-accelerated transform to the trailing ring
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
            }
            
            animationFrameId.current = requestAnimationFrame(updateRingPosition);
        };

        // Add robust event listeners
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        
        // Hide default native cursor
        document.body.classList.add('custom-cursor-active');

        // Start requestAnimationFrame trailing loop
        updateRingPosition();

        // Cleanup resources on unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.body.classList.remove('custom-cursor-active');
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <>
            {/* Global style override and high-performance CSS animations */}
            <style dangerouslySetInnerHTML={{__html: `
                /* By default, hide custom cursor elements on mobile and touch devices */
                .cursor-dot,
                .cursor-ring {
                    display: none !important;
                }

                @media (min-width: 1024px) and (hover: hover) {
                    .custom-cursor-active,
                    .custom-cursor-active * {
                        cursor: none !important;
                    }
                    
                    .cursor-dot,
                    .cursor-ring {
                        display: block !important;
                    }
                }
                
                /* Base transitions for custom cursor physical dimensions and colors */
                .cursor-dot {
                    z-index: 100000000 !important;
                }
                .cursor-ring {
                    z-index: 99999999 !important;
                }
                .cursor-dot, .cursor-ring {
                    opacity: 0; /* Keep hidden initially until first mouse movement */
                    pointer-events: none !important;
                    transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1), 
                                height 0.3s cubic-bezier(0.23, 1, 0.32, 1), 
                                background-color 0.3s ease, 
                                border-color 0.3s ease, 
                                opacity 0.2s ease,
                                backdrop-filter 0.3s ease;
                    will-change: transform, width, height;
                }

                /* Reveal custom cursor elements upon active movement inside document viewport */
                .cursor-dot.is-visible,
                .cursor-ring.is-visible {
                    opacity: 1;
                }

                /* Hover States (Depth & Glassmorphism) */
                .cursor-dot.is-hovered {
                    opacity: 0;
                    transform: scale(0.5);
                }
                
                .cursor-ring.is-hovered {
                    width: 56px !important;
                    height: 56px !important;
                    background-color: rgba(16, 185, 129, 0.08) !important;
                    border-color: rgba(16, 185, 129, 0.35) !important;
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.4);
                }

                /* Click States (Tactile Feedback) */
                .cursor-dot.is-clicked {
                    width: 12px !important;
                    height: 12px !important;
                    background-color: rgba(16, 185, 129, 0.85) !important;
                }
                
                .cursor-ring.is-clicked {
                    width: 24px !important;
                    height: 24px !important;
                    border-width: 2px !important;
                    border-color: rgba(16, 185, 129, 0.85) !important;
                    background-color: rgba(16, 185, 129, 0.12) !important;
                }
            `}} />

            {/* Premium Custom Cursor Elements */}
            
            {/* 1. Outer Smooth Trailing Glass Ring */}
            <div
                ref={ringRef}
                className="cursor-ring fixed top-0 left-0 w-9 h-9 rounded-full border-[1.5px] border-[#10b981]/50 bg-[#10b981]/5 pointer-events-none"
            />

            {/* 2. Inner Precise Dot (Rendered on top) */}
            <div
                ref={dotRef}
                className="cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-[#10b981] pointer-events-none"
            />
        </>
    );
};

export default CustomCursor;