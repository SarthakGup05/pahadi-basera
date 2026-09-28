'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
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
  ChevronRight
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
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'bookings'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close notifications dropdown on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-8 flex items-center justify-between shrink-0 font-sans z-20">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-stone-400">Pahadi Basera</span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-sm font-bold text-stone-900 tracking-tight">{getSectionTitle()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Supabase Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/70 text-[11px] font-medium text-stone-600 select-none shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>Supabase Live</span>
        </div>

        {/* Global Search Shortcut Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100/70 text-stone-400 text-xs border border-stone-200/60 w-64 select-none hover:bg-stone-100 hover:text-stone-600 transition-colors cursor-pointer">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Search ledgers, guests...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-4.5 select-none items-center gap-1 rounded border border-stone-300 bg-white px-1.5 font-mono text-[10px] font-medium text-stone-500">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl border border-stone-200/80 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 hover:border-stone-300 transition-all active:scale-95 cursor-pointer relative"
            title="System Notifications"
            aria-label="Toggle notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-92 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              
              {/* Dropdown Header */}
              <div className="px-5 pt-4 pb-3 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold border border-stone-200">
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
              <div className="flex items-center gap-1 p-1.5 bg-stone-50/80 border-b border-stone-100 text-[11px] font-medium">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
                    activeTab === 'all' 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
                    activeTab === 'unread' 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 py-1 text-center rounded-lg transition-all cursor-pointer ${
                    activeTab === 'bookings' 
                      ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Bookings
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-stone-50 text-stone-300 flex items-center justify-center mb-2">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-stone-700">All clear</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">No notifications match this filter.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleMarkSingleRead(notif.id)}
                      className={`p-4 flex gap-3 hover:bg-stone-50/70 transition-colors cursor-pointer relative ${
                        notif.unread ? 'bg-stone-50/40' : ''
                      }`}
                    >
                      {getNotifIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${notif.unread ? 'font-bold text-stone-900' : 'font-medium text-stone-700'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-stone-400 whitespace-nowrap shrink-0">
                            {getRelativeTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                      {notif.unread && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 self-center shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2.5 bg-stone-50/70 border-t border-stone-100 text-center">
                <span className="text-[10px] text-stone-400 font-medium">Himalayan Ledger Network • Realtime</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
