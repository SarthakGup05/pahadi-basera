'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Car, 
  Users, 
  BookOpen, 
  User, 
  LogOut, 
  Shield, 
  CalendarDays,
  Compass
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

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

  const isLightPage = pathname?.startsWith('/community') || pathname?.startsWith('/properties/');
  const isNavSolid = isScrolled || isLightPage;
  const hasDarkText = isNavSolid || mobileMenuOpen;

  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

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
                className={`flex items-center gap-1 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold transition-colors duration-300 py-1 ${
                  hasDarkText ? 'text-gray-600 group-hover/services:text-gray-900' : 'text-white/80 group-hover/services:text-white'
                }`}
              >
                Services
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/services:rotate-180 text-gray-400 group-hover/services:text-[#10b981]" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 opacity-0 translate-y-2 pointer-events-none group-hover/services:opacity-100 group-hover/services:translate-y-0 group-hover/services:pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />
                
                <div className="bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] p-2 flex flex-col gap-1 relative overflow-hidden">
                  {servicesDropdown.map((subLink) => {
                    const Icon = subLink.icon;
                    return (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        className="group/sub flex items-center justify-between px-3.5 py-2.5 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold whitespace-nowrap text-gray-500 hover:text-[#10b981] hover:bg-emerald-50/50 rounded-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-gray-400 group-hover/sub:text-[#10b981] transition-colors" />
                          <span>{subLink.name}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover/sub:opacity-100 group-hover/sub:translate-x-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop Dropdown: About */}
            <div className="relative group/about">
              <button 
                className={`flex items-center gap-1 text-[10px] xl:text-[11px] tracking-wider uppercase font-bold transition-colors duration-300 py-1 ${
                  hasDarkText ? 'text-gray-600 group-hover/about:text-gray-900' : 'text-white/80 group-hover/about:text-white'
                }`}
              >
                About
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/about:rotate-180 text-gray-400 group-hover/about:text-[#10b981]" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48 opacity-0 translate-y-2 pointer-events-none group-hover/about:opacity-100 group-hover/about:translate-y-0 group-hover/about:pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
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

          {/* Right Mobile Menu Toggle & Desktop Actions */}
          <div className="flex items-center justify-end relative z-50 flex-shrink-0 w-auto md:w-[280px] gap-2.5">
            
            {/* Guest Authentication Button or Profile Dropdown */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden lg:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-850 text-xs font-semibold transition-all cursor-pointer shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-[#10b981] text-white flex items-center justify-center text-[10px] font-bold">
                      {userInitial}
                    </div>
                    <span className="max-w-[100px] truncate text-[11px]">
                      {user.fullName || user.email.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/95 backdrop-blur-2xl shadow-xl border-stone-100">
                  <DropdownMenuLabel className="font-normal px-2 py-1.5">
                    <p className="text-xs font-bold text-stone-900 truncate">{user.fullName || 'Explorer'}</p>
                    <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#10b981] text-[9px] font-bold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-stone-100" />
                  <DropdownMenuItem asChild>
                    <Link href="/community" className="flex items-center gap-2 text-xs text-stone-700 py-2 cursor-pointer rounded-xl">
                      <Compass className="w-3.5 h-3.5 text-[#10b981]" /> Mountain Community
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 text-xs text-stone-700 py-2 cursor-pointer rounded-xl font-semibold">
                        <Shield className="w-3.5 h-3.5 text-indigo-500" /> Admin Console
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-1 bg-stone-100" />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="flex items-center gap-2 text-xs text-rose-600 hover:text-rose-700 py-2 cursor-pointer rounded-xl focus:bg-rose-50 focus:text-rose-600"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className={`hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all duration-300 shadow-sm cursor-pointer ${
                  hasDarkText
                    ? 'bg-stone-900 hover:bg-[#10b981] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md'
                }`}
              >
                <User className="w-3 h-3" />
                Sign In
              </button>
            )}

            {/* Desktop Join Community Button */}
            <Link
              href="/community/join"
              className={`hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all duration-300 shadow-sm ${
                hasDarkText
                  ? 'bg-[#10b981] hover:bg-[#0e9f6e] text-white shadow-emerald-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md'
              }`}
            >
              <Users className="w-3 h-3" />
              Community
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
          
          {/* User status in mobile */}
          {isAuthenticated && user && (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 mb-2 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-stone-900">{user.fullName || user.email}</span>
                <span className="block text-[10px] text-stone-500">{user.role}</span>
              </div>
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest"
              >
                Log Out
              </button>
            </div>
          )}

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
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                mobileServicesOpen ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="flex flex-col gap-2 pl-4 py-2">
                {servicesDropdown.map((subLink) => {
                  const Icon = subLink.icon;
                  return (
                    <Link
                      key={subLink.name}
                      href={subLink.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-2 text-xs tracking-wider uppercase font-semibold text-gray-600 hover:text-[#10b981] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-[#10b981]" />
                      {subLink.name}
                    </Link>
                  );
                })}
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
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                mobileAboutOpen ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="flex flex-col gap-2 pl-4 py-2">
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

          {/* Mobile Auth Button */}
          {!isAuthenticated ? (
            <div className="mt-4">
              <button
                onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 bg-stone-900 hover:bg-[#10b981] text-white rounded-xl text-xs uppercase tracking-wider font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </button>
            </div>
          ) : null}

          {/* Mobile Join Community Button */}
          <div className="mt-2">
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

      {/* Global Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Navbar;