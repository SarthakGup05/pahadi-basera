'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAdminTheme } from '@/hooks/useAdminTheme';
import { 
  Bell, 
  Calendar, 
  Home, 
  Compass, 
  ShieldCheck, 
  Check, 
  CheckCheck,
  Search,
  SlidersHorizontal,
  Info,
  ChevronRight,
  Sun,
  Moon,
  X,
  CalendarDays,
  Mountain,
  CornerDownLeft
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  pathname: string;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  type: 'booking' | 'stay' | 'package' | 'kyc' | 'system';
  unread: boolean;
  createdAt: string;
}

export default function AdminHeader({ pathname }: AdminHeaderProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useAdminTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'bookings'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchData, setSearchData] = useState<{
    properties: Array<{ id: string; title: string; location: string; type?: string }>;
    packages: Array<{ id: string; title: string; location: string; region?: string }>;
  }>({ properties: [], packages: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const loadSearchData = async () => {
    if (searchData.properties.length > 0) return;
    setIsSearching(true);
    try {
      const [propsRes, pkgsRes] = await Promise.allSettled([
        api.get('/api/properties'),
        api.get('/api/packages')
      ]);
      const properties = propsRes.status === 'fulfilled' ? propsRes.value.data || [] : [];
      const packages = pkgsRes.status === 'fulfilled' ? pkgsRes.value.data || [] : [];
      setSearchData({ properties, packages });
    } catch {
      // Fallback gracefully
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('pb_admin_token');
      if (!token) return;

      const { data } = await api.get('/api/notifications');
      setNotifications(data);
    } catch (err: any) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        window.dispatchEvent(new CustomEvent('pb:unauthorized'));
      }
      console.error('Error fetching notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications and search dropdown on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cmd+K / Ctrl+K global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
        loadSearchData();
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

    try {
      await api.put('/api/notifications/mark-read');
    } catch (err: any) {
      console.error('Failed to mark all read in database:', err.message);
      fetchNotifications();
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || !notif.unread) return;

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

    try {
      await api.put(`/api/notifications/${id}/mark-read`);
    } catch (err: any) {
      console.error('Failed to mark single read in database:', err.message);
      fetchNotifications();
    }
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recently';
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case 'stay':
        return (
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
            <Home className="w-4 h-4" />
          </div>
        );
      case 'package':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <Compass className="w-4 h-4" />
          </div>
        );
      case 'kyc':
        return (
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  const getSectionTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.includes('properties')) return 'Stays Moderation';
    if (pathname.includes('packages')) return 'Package Ledger';
    if (pathname.includes('bookings')) return 'Booking Ledger';
    return 'Console';
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return n.unread;
    if (activeTab === 'bookings') return n.type === 'booking';
    return true;
  });

  // Global search filtering
  const queryLower = searchQuery.toLowerCase().trim();

  const NAV_SHORTCUTS = [
    { name: 'Stays Moderation', href: '/admin/properties', icon: Home },
    { name: 'Booking Ledger', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Package Ledger', href: '/admin/packages', icon: Compass },
    { name: 'Himalayan Creators', href: '/admin/creators', icon: Mountain },
    { name: 'Executive Dashboard', href: '/admin', icon: SlidersHorizontal },
  ];

  const matchedNav = NAV_SHORTCUTS.filter(n => 
    !queryLower || n.name.toLowerCase().includes(queryLower)
  );

  const matchedProperties = searchData.properties.filter(p => 
    queryLower && (p.title?.toLowerCase().includes(queryLower) || p.location?.toLowerCase().includes(queryLower))
  ).slice(0, 4);

  const matchedPackages = searchData.packages.filter(pkg => 
    queryLower && (pkg.title?.toLowerCase().includes(queryLower) || pkg.location?.toLowerCase().includes(queryLower))
  ).slice(0, 4);

  const handleSelectNav = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(href);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/admin/properties?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-[#262626] px-8 flex items-center justify-between shrink-0 font-sans z-20 transition-colors duration-200">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-stone-400 dark:text-stone-500">Pahadi Basera</span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600" />
        <span className="text-sm font-bold text-stone-900 dark:text-stone-100 tracking-tight">{getSectionTitle()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Supabase Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 dark:bg-[#161616] border border-stone-200/70 dark:border-[#262626] text-[11px] font-medium text-stone-600 dark:text-stone-300 select-none shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>Supabase Live</span>
        </div>

        {/* Global Interactive Search Input & Command Palette */}
        <div className="relative hidden md:block" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100/80 dark:bg-[#161616] text-stone-700 dark:text-neutral-200 text-xs border border-stone-200/80 dark:border-[#262626] focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 w-64 lg:w-72 transition-all shadow-2xs">
              <Search className="w-3.5 h-3.5 shrink-0 text-stone-400 dark:text-neutral-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!isSearchOpen) setIsSearchOpen(true);
                  loadSearchData();
                }}
                onFocus={() => {
                  setIsSearchOpen(true);
                  loadSearchData();
                }}
                placeholder="Search stays, packages, ledgers..."
                className="w-full bg-transparent border-0 outline-none text-xs text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-neutral-500"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-stone-600 dark:text-neutral-500 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <kbd className="pointer-events-none inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-stone-300 dark:border-[#2a2a2a] bg-white dark:bg-[#202020] px-1.5 font-mono text-[9px] font-bold text-stone-500 dark:text-neutral-400">
                  ⌘K
                </kbd>
              )}
            </div>
          </form>

          {/* Quick Search Dropdown Palette */}
          {isSearchOpen && (
            <div className="absolute left-0 top-11 w-80 lg:w-96 bg-white/98 dark:bg-[#121212]/98 backdrop-blur-xl border border-stone-200/90 dark:border-[#262626] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-left text-stone-900 dark:text-stone-100 max-h-[420px] flex flex-col">
              
              <div className="p-3 border-b border-stone-100 dark:border-[#262626] flex items-center justify-between text-[11px] text-stone-400 dark:text-neutral-400 bg-stone-50/50 dark:bg-[#161616]/60">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Quick Jump & Search</span>
                <span className="font-mono text-[10px]">Press Enter to search</span>
              </div>

              <div className="overflow-y-auto p-2 space-y-3">
                {/* Navigation Shortcuts */}
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">
                    Portals & Ledgers
                  </div>
                  <div className="space-y-0.5">
                    {matchedNav.map((nav) => {
                      const Icon = nav.icon;
                      return (
                        <button
                          key={nav.href}
                          type="button"
                          onClick={() => handleSelectNav(nav.href)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-stone-700 dark:text-neutral-200 hover:bg-stone-100 dark:hover:bg-[#1e1e1e] hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-[#202020] text-stone-600 dark:text-neutral-400 flex items-center justify-center shrink-0 group-hover:text-emerald-500 transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="flex-1 truncate">{nav.name}</span>
                          <span className="text-[10px] text-stone-400 dark:text-neutral-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">Go →</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Properties Matches */}
                {matchedProperties.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">
                      Stays & Dwellings ({matchedProperties.length})
                    </div>
                    <div className="space-y-0.5">
                      {matchedProperties.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectNav(`/admin/properties?q=${encodeURIComponent(p.title)}`)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-stone-700 dark:text-neutral-200 hover:bg-stone-100 dark:hover:bg-[#1e1e1e] hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Home className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold">{p.title}</p>
                            <p className="text-[10px] text-stone-400 dark:text-neutral-500 truncate">{p.location}</p>
                          </div>
                          <span className="text-[10px] text-emerald-500 font-mono shrink-0">Inspect →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Packages Matches */}
                {matchedPackages.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">
                      Expeditions & Treks ({matchedPackages.length})
                    </div>
                    <div className="space-y-0.5">
                      {matchedPackages.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => handleSelectNav(`/admin/packages?q=${encodeURIComponent(pkg.title)}`)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium text-stone-700 dark:text-neutral-200 hover:bg-stone-100 dark:hover:bg-[#1e1e1e] hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <Compass className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold">{pkg.title}</p>
                            <p className="text-[10px] text-stone-400 dark:text-neutral-500 truncate">{pkg.location}</p>
                          </div>
                          <span className="text-[10px] text-purple-400 font-mono shrink-0">Inspect →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action search for query */}
                {queryLower && (
                  <div className="pt-2 border-t border-stone-100 dark:border-[#262626] space-y-1">
                    <button
                      type="button"
                      onClick={() => handleSelectNav(`/admin/properties?q=${encodeURIComponent(searchQuery)}`)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span className="truncate">Search Stays for &ldquo;{searchQuery}&rdquo;</span>
                      <CornerDownLeft className="w-3 h-3 ml-auto opacity-70" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectNav(`/admin/bookings?q=${encodeURIComponent(searchQuery)}`)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                    >
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span className="truncate">Search Bookings for &ldquo;{searchQuery}&rdquo;</span>
                      <CornerDownLeft className="w-3 h-3 ml-auto opacity-70" />
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}
        </div>

                {/* Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl border border-stone-200/80 dark:border-[#262626] bg-white dark:bg-[#161616] flex items-center justify-center text-stone-600 dark:text-amber-400 hover:text-stone-900 dark:hover:text-amber-300 hover:bg-stone-50 dark:hover:bg-[#222222] transition-all active:scale-95 cursor-pointer shadow-2xs"
          title={isDark ? "Switch to Light Mode" : "Switch to Luxury Dark Mode"}
          aria-label="Toggle color theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-stone-600 animate-in spin-in-90 duration-200" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl border border-stone-200/80 dark:border-[#262626] bg-white dark:bg-[#161616] flex items-center justify-center text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#222222] hover:border-stone-300 dark:hover:border-[#333333] transition-all active:scale-95 cursor-pointer relative shadow-2xs"
            title="System Notifications"
            aria-label="Toggle notifications"
          >
            <Bell className="w-4 h-4 text-stone-700 dark:text-neutral-200 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 ring-2 ring-white dark:ring-[#161616] shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-92 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border border-stone-200/90 dark:border-[#262626] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right text-stone-900 dark:text-stone-100">
              
              {/* Dropdown Header */}
              <div className="px-5 pt-4 pb-3 border-b border-stone-100 dark:border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-900/50">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* Segmented Filter Tabs */}
              <div className="flex items-center gap-1 p-1.5 bg-stone-50/80 dark:bg-[#161616]/80 border-b border-stone-100 dark:border-[#262626] text-[11px] font-medium">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
                    activeTab === 'all' 
                      ? 'bg-white dark:bg-[#202020] text-stone-900 dark:text-stone-100 font-semibold shadow-xs' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
                    activeTab === 'unread' 
                      ? 'bg-white dark:bg-[#202020] text-stone-900 dark:text-stone-100 font-semibold shadow-xs' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
                    activeTab === 'bookings' 
                      ? 'bg-white dark:bg-[#202020] text-stone-900 dark:text-stone-100 font-semibold shadow-xs' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  Bookings
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-[#262626]">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-[#202020] text-stone-300 dark:text-stone-600 flex items-center justify-center mb-2">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">All clear</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">No notifications match this filter.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleMarkSingleRead(notif.id)}
                      className={`p-4 flex gap-3 hover:bg-stone-50/70 dark:hover:bg-[#222222]/60 transition-colors cursor-pointer relative ${
                        notif.unread ? 'bg-stone-50/40 dark:bg-[#161616]/40' : ''
                      }`}
                    >
                      {getNotifIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${notif.unread ? 'font-bold text-stone-900 dark:text-stone-100' : 'font-medium text-stone-700 dark:text-stone-300'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-stone-400 whitespace-nowrap shrink-0">
                            {getRelativeTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                      {notif.unread && (
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] self-center shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2.5 bg-stone-50/70 dark:bg-[#161616]/70 border-t border-stone-100 dark:border-[#262626] text-center">
                <span className="text-[10px] text-stone-400 font-medium">Himalayan Ledger Network • Realtime</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
