'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Baseras', href: '#properties' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Explore Regions', href: '#regions' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100/50 py-3 shadow-[0_2px_15px_-10px_rgba(0,0,0,0.05)]'
            : 'bg-transparent py-6 border-b border-white/5'
        }`}
      >
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span 
              className={`text-xl font-light tracking-[0.2em] uppercase transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Pahadi <span className="font-semibold text-[#10b981]">Basera</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-xs tracking-widest uppercase font-light transition-colors duration-300 py-1 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#10b981] before:transition-all before:duration-300 hover:before:w-full ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              href="#become-host"
              className={`hidden md:inline-block text-[10px] lg:text-xs tracking-widest uppercase font-light transition-colors duration-300 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}
            >
              Become a Host
            </Link>
            <span className={`hidden md:inline-block w-[1px] h-3 ${isScrolled ? 'bg-gray-200/60' : 'bg-white/10'}`} />
            <Link
              href="#login"
              className={`hidden md:inline-block text-[10px] lg:text-xs tracking-widest uppercase font-light transition-colors duration-300 ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}
            >
              Login
            </Link>
            <Button
              asChild
              className={`hidden sm:inline-flex rounded-full px-5 lg:px-6 text-[10px] lg:text-xs tracking-widest uppercase font-light h-9 transition-all duration-500 ease-out bg-[#10b981] hover:bg-[#0e9f6e] text-white shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 border-0`}
            >
              <Link href="#signup">Sign Up</Link>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Slideout */}
      <div
        className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-xl flex flex-col pt-24 pb-8 px-6 transition-all duration-500 md:hidden ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base tracking-widest uppercase font-light text-gray-800 hover:text-[#10b981] py-2 transition-colors border-b border-gray-100"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#become-host"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base tracking-widest uppercase font-light text-gray-800 hover:text-[#10b981] py-2 transition-colors border-b border-gray-100"
          >
            Become a Host
          </Link>
        </nav>
        
        <div className="flex flex-col gap-3 mt-auto w-full">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-gray-200 text-gray-700 py-5 text-xs tracking-widest uppercase font-light hover:bg-gray-50 h-10"
          >
            <Link href="#login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white py-5 text-xs tracking-widest uppercase font-light shadow-sm h-10 border-0"
          >
            <Link href="#signup" onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
