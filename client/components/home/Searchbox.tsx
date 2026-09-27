'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Users, ChevronDown, Plus, Minus, Sparkles } from 'lucide-react';

const SUGGESTED_REGIONS = [
  { name: 'Manali', state: 'Himachal Pradesh' },
  { name: 'Chopta', state: 'Uttarakhand' },
  { name: 'Munsiyari', state: 'Uttarakhand' },
  { name: 'Auli', state: 'Uttarakhand' },
  { name: 'Dharamshala', state: 'Himachal Pradesh' },
];

const SearchBox = () => {
  const router = useRouter();

  // Search State
  const [activeTab, setActiveTab] = useState('All Stays');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  
  // UI Interaction State
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const tabs = ['All Stays', 'Chalet', 'Villa', 'Cottage', 'Homestay', 'Glamping'];

  // Real Search Router
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', guests.toString());
    
    const typeMap: Record<string, string> = {
      'Chalet': 'RESORT',
      'Villa': 'VILLAS',
      'Cottage': 'COTTAGE',
      'Homestay': 'HOMESAYS',
      'Glamping': 'APARTMENT',
    };
    if (typeMap[activeTab]) {
      params.set('type', typeMap[activeTab]);
    }

    const query = params.toString();
    router.push(query ? `/properties?${query}` : '/properties');
  };

  return (
    <div className="w-full max-w-[980px] mx-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] px-4 relative z-30">

      {/* Premium Glassmorphic Category Tabs (Tablet & Desktop) */}
      <div className="hidden sm:flex flex-wrap items-center gap-2 mb-4 w-full justify-center px-4 lg:px-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative text-[11px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer px-4 py-2 rounded-full flex-shrink-0 ${
              activeTab === tab
                ? 'text-[#10b981] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] scale-105'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sleek Integrated Airbnb-Style Search Console */}
      <div className="relative grid grid-cols-2 lg:flex lg:flex-row bg-white/95 backdrop-blur-2xl rounded-[2rem] lg:rounded-full p-3 lg:p-2 lg:pl-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-white/80 gap-2 lg:gap-0 transition-all duration-300">
        
        {/* Destination / Where */}
        <div 
          className={`relative z-10 col-span-2 lg:flex-[1.3] flex flex-col justify-center rounded-2xl lg:rounded-full px-5 lg:px-6 py-2.5 cursor-text transition-all duration-300 group ${
            focusedInput === 'location' 
              ? 'bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] ring-1 ring-stone-200' 
              : 'hover:bg-stone-50/80'
          }`}
          onClick={() => setFocusedInput('location')}
        >
          <label className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 transition-colors ${
            focusedInput === 'location' ? 'text-[#10b981]' : 'text-stone-500'
          }`}>
            <MapPin className="w-3.5 h-3.5 text-[#10b981]" />
            Where
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setFocusedInput('location')}
            onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
            placeholder="Search Himalayan valleys..."
            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-stone-400 font-semibold text-stone-900 truncate"
          />

          {/* Quick Region Autocomplete Suggestions */}
          {focusedInput === 'location' && (
            <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl p-3 border border-stone-200 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-1.5 px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                <Sparkles className="w-3 h-3 text-[#10b981]" /> Popular Valleys
              </div>
              <div className="mt-1 divide-y divide-stone-50">
                {SUGGESTED_REGIONS.map((r) => (
                  <button
                    key={r.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLocation(r.name);
                      setFocusedInput('checkin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-between text-xs cursor-pointer group/reg"
                  >
                    <span className="font-semibold text-stone-800 group-hover/reg:text-[#10b981] transition-colors">{r.name}</span>
                    <span className="text-[10px] text-stone-400 font-medium">{r.state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-8 bg-stone-200 my-auto" />

        {/* Check In */}
        <div 
          className={`relative z-10 col-span-1 lg:flex-1 flex flex-col justify-center rounded-2xl lg:rounded-full px-5 py-2.5 cursor-text transition-all duration-300 group ${
            focusedInput === 'checkin' 
              ? 'bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] ring-1 ring-stone-200' 
              : 'hover:bg-stone-50/80'
          }`}
          onClick={() => setFocusedInput('checkin')}
        >
          <label className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 transition-colors ${
            focusedInput === 'checkin' ? 'text-[#10b981]' : 'text-stone-500'
          }`}>
            <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
            Check In
          </label>
          <Input
            type="text"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            onFocus={() => setFocusedInput('checkin')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Add dates"
            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-stone-400 font-semibold text-stone-900 truncate"
          />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-8 bg-stone-200 my-auto" />

        {/* Check Out */}
        <div 
          className={`relative z-10 col-span-1 lg:flex-1 flex flex-col justify-center rounded-2xl lg:rounded-full px-5 py-2.5 cursor-text transition-all duration-300 group ${
            focusedInput === 'checkout' 
              ? 'bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] ring-1 ring-stone-200' 
              : 'hover:bg-stone-50/80'
          }`}
          onClick={() => setFocusedInput('checkout')}
        >
          <label className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 transition-colors ${
            focusedInput === 'checkout' ? 'text-[#10b981]' : 'text-stone-500'
          }`}>
            <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
            Check Out
          </label>
          <Input
            type="text"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            onFocus={() => setFocusedInput('checkout')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Add dates"
            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-stone-400 font-semibold text-stone-900 truncate"
          />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-8 bg-stone-200 my-auto" />

        {/* Guests Counter Pill */}
        <div 
          className="relative z-10 col-span-2 sm:col-span-1 lg:flex-[1.1] flex items-center justify-between rounded-2xl lg:rounded-full px-5 py-2.5 hover:bg-stone-50/80 transition-all select-none"
        >
          <div className="flex flex-col flex-1">
            <label className="text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 text-stone-500">
              <Users className="w-3.5 h-3.5 text-[#10b981]" />
              Guests
            </label>
            <span className="text-sm font-semibold text-stone-900">
              {guests} {guests === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>
          
          {/* Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setGuests(Math.max(1, guests - 1)); }}
              disabled={guests <= 1}
              className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-[#10b981] hover:text-white disabled:opacity-30 transition-all cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setGuests(guests + 1); }}
              className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-[#10b981] hover:text-white transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Airbnb-style Search Button */}
        <div className="p-1 col-span-2 sm:col-span-1 lg:col-span-none flex items-center justify-center">
          <button
            onClick={handleSearch}
            className="w-full lg:w-13 h-12 lg:h-13 rounded-2xl lg:rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all cursor-pointer border-0"
            title="Search Himalayan Baseras"
            aria-label="Search"
          >
            <Search className="w-5 h-5" strokeWidth={2.5} />
            <span className="lg:hidden text-xs font-bold uppercase tracking-wider">Search Stays</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SearchBox;