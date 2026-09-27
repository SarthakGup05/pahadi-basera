'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight, Car, Users, BookOpen } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
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

  if (pathname?.startsWith('/admin')) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Baseras', href: '/properties' },
    { name: 'Packages', href: '/packages' },
    { name: 'Explore Regions', href: '/regions' },
  ];

  const servicesDropdown = [
    { name: 'Taxi & Car Rental', href: '/#taxi', icon: Car },
    { name: 'Travelers Community', href: '/community', icon: Users },
    { name: 'Expedition Blogs', href: '/blog', icon: BookOpen },
  ];

  const aboutDropdown = [
    { name: 'About the company', href: '/our-story' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isLightPage = pathname?.startsWith('/community');
  const isNavSolid = isScrolled || isLightPage;
  const hasDarkText = isNavSolid || mobileMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isNavSolid
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)]'
            : 'bg-transparent py-5 border-b border-white/10'
        }`}
      >
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo - Pinned to Left */}
          <Link href="/" className="flex items-center gap-2 group relative z-50 flex-shrink-0 w-auto md:w-[200px]">
            <span 
              className={`text-xl font-light tracking-[0.2em] uppercase transition-colors duration-500 whitespace-nowrap ${
                hasDarkText ? 'text-gray-900' : 'text-white'
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
                  hasDarkText ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
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
                  hasDarkText ? 'text-gray-600 group-hover/services:text-gray-900' : 'text-white/80 group-hover/services:text-white'
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
                  hasDarkText ? 'text-gray-600 group-hover/dropdown:text-gray-900' : 'text-white/80 group-hover/dropdown:text-white'
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

          {/* Right Mobile Menu Toggle & Desktop Action */}
          <div className="flex items-center justify-end relative z-50 flex-shrink-0 w-auto md:w-[220px] gap-3">
            {/* Desktop Join Community Button */}
            <Link
              href="/community/join"
              className={`hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all duration-300 shadow-sm ${
                hasDarkText
                  ? 'bg-[#10b981] hover:bg-[#0e9f6e] text-white shadow-emerald-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Join Community
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 -mr-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                hasDarkText ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
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

          {/* Mobile Join Community Button */}
          <div 
            className={`mt-4 pt-3 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${mobileMenuOpen ? (navLinks.length + 2) * 50 : 0}ms` }}
          >
            <Link
              href="/community/join"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 bg-[#10b981] hover:bg-[#0e9f6e] text-white rounded-xl text-xs uppercase tracking-wider font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              Join Community
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;