'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Globe,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  pathname: string;
  handleLogout: () => void;
  navItems: NavItem[];
}

export default function AdminSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  pathname,
  handleLogout,
  navItems
}: AdminSidebarProps) {
  // Navigation sections
  const coreWorkspaceItems = navItems.filter(item => item.href === '/admin' || item.href.includes('properties'));
  const creatorItems = navItems.filter(item => item.href.includes('creators'));
  const ledgerItems = navItems.filter(item => item.href.includes('bookings') || item.href.includes('packages'));

  return (
    <aside 
      className={`bg-[#FAFAF9] text-stone-800 flex flex-col transition-all duration-300 relative border-r border-stone-200/80 shadow-[1px_0_12px_rgba(0,0,0,0.015)] select-none shrink-0 z-30 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } font-sans`}
    >
      {/* Collapse / Expand Toggle Button */}
      <button 
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-white text-stone-500 flex items-center justify-center shadow-sm border border-stone-200 hover:bg-stone-50 hover:text-stone-900 active:scale-95 transition-all z-40 cursor-pointer"
        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        aria-label="Toggle navigation bar"
      >
        {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand & Studio Title */}
      <div className={`h-20 px-5 border-b border-stone-200/70 flex items-center shrink-0 ${
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Minimalist Mountain Crest Vector */}
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shrink-0 shadow-sm">
            <svg 
              className="w-5 h-5 text-emerald-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              <path d="M4.14 15h15.72" opacity="0.4" />
            </svg>
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold tracking-widest text-stone-900 uppercase">Pahadi Basera</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-400">Concierge Studio</span>
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        
        {/* Core Workspace Section */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Workspace</span>
            </div>
          )}
          <nav className="space-y-1">
            {coreWorkspaceItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer ${
                    isActive 
                      ? 'bg-white text-stone-900 font-semibold border border-stone-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)]' 
                      : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-700' : 'text-stone-400 group-hover:text-stone-700'}`} />
                  {!sidebarCollapsed && (
                    <span className="text-xs tracking-normal font-medium">{item.name}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Creator Guild Section */}
        {creatorItems.length > 0 && (
          <div>
            {!sidebarCollapsed && (
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Creator Guild</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Super Admin</span>
              </div>
            )}
            <nav className="space-y-1">
              {creatorItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer ${
                      isActive 
                        ? 'bg-white text-stone-900 font-semibold border border-stone-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)]' 
                        : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-700' : 'text-stone-400 group-hover:text-stone-700'}`} />
                    {!sidebarCollapsed && (
                      <span className="text-xs tracking-normal font-medium">{item.name}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Ledgers Section */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Ledgers</span>
            </div>
          )}
          <nav className="space-y-1">
            {ledgerItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer ${
                    isActive 
                      ? 'bg-white text-stone-900 font-semibold border border-stone-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)]' 
                      : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-700' : 'text-stone-400 group-hover:text-stone-700'}`} />
                  {!sidebarCollapsed && (
                    <span className="text-xs tracking-normal font-medium">{item.name}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Links & Quick Portal */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Portal</span>
            </div>
          )}
          <nav className="space-y-1">
            <Link
              href="/"
              target="_blank"
              title={sidebarCollapsed ? "Public Website" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group cursor-pointer text-stone-600 hover:bg-stone-200/40 hover:text-stone-900 ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <Globe className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-stone-700" />
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs tracking-normal font-medium">Public Site</span>
                  <ExternalLink className="w-3 h-3 text-stone-300 group-hover:text-stone-500" />
                </div>
              )}
            </Link>
          </nav>
        </div>

      </div>

      {/* Admin User Footer Card */}
      <div className="p-3 border-t border-stone-200/70 shrink-0 bg-[#FAFAF9]">
        <div className={`flex items-center gap-2.5 p-2 rounded-xl border border-stone-200/60 bg-white/70 shadow-sm ${
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Monogram Badge */}
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center text-xs font-bold shrink-0 tracking-tight">
              PB
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-stone-900 truncate">Super Admin</span>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">Root Privileges</span>
                </div>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <div className="mt-2 flex justify-center">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
