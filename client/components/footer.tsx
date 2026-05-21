'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0d1412] text-zinc-400 border-t border-emerald-950/20 pt-20 pb-10 px-4 md:px-6 relative overflow-hidden">
      {/* Decorative mountain background shape */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-t from-emerald-950/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
        
        {/* Brand & Description */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-light tracking-[0.2em] uppercase text-white">
              Pahadi <span className="font-semibold text-[#10b981]">Basera</span>
            </span>
          </Link>
          <p className="text-sm font-light text-zinc-500 leading-relaxed">
            Curating premium mountain homestays that combine rustic Himalayan heritage with absolute modern luxury. Experience the soul of the hills.
          </p>
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#10b981] flex items-center justify-center hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#10b981] flex items-center justify-center hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-white">
            Quick Navigation
          </h4>
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-light hover:text-white transition-colors">Home</Link>
            <Link href="#properties" className="text-sm font-light hover:text-white transition-colors">Featured Baseras</Link>
            <Link href="#regions" className="text-sm font-light hover:text-white transition-colors">Explore Regions</Link>
            <Link href="#experiences" className="text-sm font-light hover:text-white transition-colors">Pahadi Experience</Link>
          </nav>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-white">
            Get In Touch
          </h4>
          <div className="flex flex-col gap-4 text-sm font-light">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#10b981] mt-1 flex-shrink-0" />
              <span>Mukteshwar, Nainital District, Uttarakhand — 263138</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#10b981] flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#10b981] flex-shrink-0" />
              <span>hospitality@pahadibasera.com</span>
            </div>
          </div>
        </div>

        {/* Become a Host Column */}
        <div className="flex flex-col gap-6">
          <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-white">
            Share Your Basera
          </h4>
          <p className="text-sm font-light text-zinc-500 leading-relaxed">
            Earn extra income and share the mountain lifestyle by listing your authentic Himalayan home with our premium community.
          </p>
          <div className="flex flex-col items-start gap-3">
            <Button
              asChild
              className="rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white px-6 py-5 text-xs tracking-widest uppercase font-light shadow-md transition-all duration-300 flex items-center gap-2 group border-0 h-10"
            >
              <Link href="#become-host">
                Become a Host
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </div>

      </div>

      {/* Copyright & Subfooter */}
      <div className="max-w-[1250px] mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 text-xs text-zinc-600 font-light">
        <p>© {currentYear} Pahadi Basera Hospitality Group. All rights reserved.</p>
        <p className="flex items-center gap-2">
          Designed with ❤️ for the Himalayas
        </p>
      </div>
    </footer>
  );
};

export default Footer;