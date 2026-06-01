'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, Car, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Baseras', href: '/properties' },
    { name: 'Packages', href: '/packages' },
    { name: 'Explore Regions', href: '/regions' },
    { name: 'Our Agents', href: '/#agents' },
  ];

  const servicesDropdown = [
    { name: 'Taxi & Car Rental', href: '#taxi', icon: Car },
    { name: 'Travel Community & Blogs', href: '#community', icon: Users },
  ];

  const aboutDropdown = [
    { name: 'About the company', href: '/our-story' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]'
            : 'bg-transparent py-5 border-b border-white/10'
        }`}
      >
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo - Pinned to Left */}
          <Link href="/" className="flex items-center gap-2 group relative z-50 flex-shrink-0 w-auto md:w-[200px]">
            <span 
              className={`text-xl font-light tracking-[0.2em] uppercase transition-colors duration-500 whitespace-nowrap ${
                isScrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'
              }`}
            >
              Pahadi <span className="font-semibold text-[#10b981] group-hover:text-[#0e9f6e] transition-colors">Basera</span>
            </span>
          </Link>

          {/* Desktop Navigation Links - Centered & Flexible */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-7 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap transition-colors duration-300 py-1 group/link ${
                  isScrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
                {/* Animated Underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#10b981] transition-all duration-300 ease-out group-hover/link:w-full rounded-full" />
              </Link>
            ))}

            {/* Desktop Dropdown: Services */}
            <div className="relative group/services">
              <button 
                className={`flex items-center gap-1.5 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap transition-colors duration-300 py-4 -my-4 ${
                  isScrolled ? 'text-gray-500 group-hover/services:text-gray-900' : 'text-white/80 group-hover/services:text-white'
                }`}
              >
                Services
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/services:rotate-180" />
              </button>

              {/* Services Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[260px] opacity-0 invisible translate-y-4 group-hover/services:opacity-100 group-hover/services:visible group-hover/services:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                {/* Invisible bridge so mouse doesn't fall off */}
                <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />
                
                <div className="bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] p-2 flex flex-col gap-1 relative overflow-hidden">
                  {servicesDropdown.map((subLink) => {
                    const Icon = subLink.icon;
                    return (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        className="group/sub flex items-center justify-between px-4 py-3.5 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap text-gray-500 hover:text-[#10b981] hover:bg-emerald-50/50 rounded-xl transition-all duration-300"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 opacity-50 group-hover/sub:opacity-100 transition-opacity" />
                          {subLink.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover/sub:opacity-100 group-hover/sub:translate-x-0" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Desktop Dropdown: About */}
            <div className="relative group/dropdown">
              <button 
                className={`flex items-center gap-1.5 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap transition-colors duration-300 py-4 -my-4 ${
                  isScrolled ? 'text-gray-500 group-hover/dropdown:text-gray-900' : 'text-white/80 group-hover/dropdown:text-white'
                }`}
              >
                About
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/dropdown:rotate-180" />
              </button>

              {/* About Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 opacity-0 invisible translate-y-4 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                {/* Invisible bridge */}
                <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />
                
                <div className="bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] p-2 flex flex-col gap-1 relative overflow-hidden">
                  {aboutDropdown.map((subLink) => (
                    <Link
                      key={subLink.name}
                      href={subLink.href}
                      className="group/sub flex items-center justify-between px-4 py-3 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap text-gray-500 hover:text-[#10b981] hover:bg-emerald-50/50 rounded-xl transition-all duration-300"
                    >
                      {subLink.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover/sub:opacity-100 group-hover/sub:translate-x-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* CTA & Mobile Menu Toggle - Pinned to Right */}
          <div className="flex items-center justify-end gap-4 lg:gap-5 relative z-50 flex-shrink-0 w-auto md:w-[280px]">
            <Link
              href="#become-host"
              className={`hidden xl:inline-block text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap transition-colors duration-300 hover:text-[#10b981] ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Become a Host
            </Link>
            
            <span className={`hidden xl:inline-block w-[1px] h-4 transition-colors duration-500 ${isScrolled ? 'bg-gray-200' : 'bg-white/20'}`} />
            
            <Link
              href="#login"
              className={`hidden md:inline-block text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap transition-colors duration-300 hover:text-[#10b981] ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Login
            </Link>
            
            <Button
              asChild
              className={`hidden sm:inline-flex rounded-full px-5 lg:px-7 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap h-9 lg:h-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-[#10b981] hover:bg-[#0e9f6e] text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 active:scale-95 border-0`}
            >
              <Link href="#signup">Sign Up</Link>
            </Button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 -mr-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                isScrolled || mobileMenuOpen ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu className={`absolute w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-50 -rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
                <X className={`absolute w-6 h-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Fullscreen Slideout */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl flex flex-col pt-28 pb-8 px-6 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-2 overflow-y-auto hide-scrollbar pb-6">
          
          {/* Map Standard Links */}
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ transitionDelay: `${mobileMenuOpen ? i * 50 : 0}ms` }}
              className={`text-sm tracking-[0.2em] uppercase font-bold text-gray-900 hover:text-[#10b981] py-4 transition-all duration-500 border-b border-gray-100 ${
                mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Accordion: Services */}
          <div 
            className={`border-b border-gray-100 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${mobileMenuOpen ? navLinks.length * 50 : 0}ms` }}
          >
            <button 
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex items-center justify-between w-full py-4 text-sm tracking-[0.2em] uppercase font-bold text-gray-900 hover:text-[#10b981] transition-colors"
            >
              Services
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${mobileServicesOpen ? 'rotate-180 text-[#10b981]' : 'text-gray-400'}`} />
            </button>
            
            {/* Services Accordion Content */}
            <div 
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                mobileServicesOpen ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="flex flex-col gap-1 pl-4 pb-2 border-l-2 border-[#10b981]/20 ml-2">
                {servicesDropdown.map((subLink) => (
                  <Link
                    key={subLink.name}
                    href={subLink.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 text-[11px] tracking-widest uppercase font-bold text-gray-500 hover:text-[#10b981] transition-colors"
                  >
                    {subLink.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Accordion: About */}
          <div 
            className={`border-b border-gray-100 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${mobileMenuOpen ? (navLinks.length + 1) * 50 : 0}ms` }}
          >
            <button 
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="flex items-center justify-between w-full py-4 text-sm tracking-[0.2em] uppercase font-bold text-gray-900 hover:text-[#10b981] transition-colors"
            >
              About
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${mobileAboutOpen ? 'rotate-180 text-[#10b981]' : 'text-gray-400'}`} />
            </button>
            
            {/* About Accordion Content */}
            <div 
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                mobileAboutOpen ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="flex flex-col gap-1 pl-4 pb-2 border-l-2 border-[#10b981]/20 ml-2">
                {aboutDropdown.map((subLink) => (
                  <Link
                    key={subLink.name}
                    href={subLink.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 text-[11px] tracking-widest uppercase font-bold text-gray-500 hover:text-[#10b981] transition-colors"
                  >
                    {subLink.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Become a Host (Mobile) */}
          <Link
            href="#become-host"
            onClick={() => setMobileMenuOpen(false)}
            style={{ transitionDelay: `${mobileMenuOpen ? (navLinks.length + 2) * 50 : 0}ms` }}
            className={`text-sm tracking-[0.2em] uppercase font-bold text-gray-900 hover:text-[#10b981] py-4 transition-all duration-500 border-b border-gray-100 ${
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Become a Host
          </Link>
        </nav>
        
        {/* Mobile Bottom Actions */}
        <div 
          className={`flex flex-col gap-3 mt-auto w-full transition-all duration-500 delay-300 ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            asChild
            variant="outline"
            className="rounded-full border-gray-200 text-gray-900 py-6 text-xs tracking-widest uppercase font-bold hover:bg-gray-50 h-12"
          >
            <Link href="#login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white py-6 text-xs tracking-widest uppercase font-bold shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] h-12 border-0"
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