'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Users, ChevronDown, Plus, Minus } from 'lucide-react';

const SearchBox = () => {
    // Search State
    const [activeTab, setActiveTab] = useState('All Accommodation');
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    
    // UI Interaction State
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const tabs = ['All Accommodation', 'Home Stay', 'Villa', 'Apartment', 'Hotel', 'Cottage'];

    // Dummy Search Handler
    const handleSearch = () => {
        alert(
            `🚀 Searching for properties:\n\n` +
            `Type: ${activeTab}\n` +
            `Location: ${location || 'Anywhere'}\n` +
            `Check In: ${checkIn || 'Any time'}\n` +
            `Check Out: ${checkOut || 'Any time'}\n` +
            `Guests: ${guests}`
        );
    };

    return (
        <div className="w-full max-w-[950px] mx-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] px-4 relative z-20">

            {/* Premium Glassmorphic Tabs (Tablet & Desktop) */}
            <div className="hidden sm:flex flex-wrap items-center gap-2 mb-4 w-full justify-center px-4 lg:px-0">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative text-[11px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer px-4 py-2 rounded-full flex-shrink-0 ${
                            activeTab === tab
                                ? 'text-[#10b981] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] scale-105'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Sleek Integrated Form Container */}
            <div className="relative grid grid-cols-2 lg:flex lg:flex-row bg-white/95 backdrop-blur-xl rounded-[2rem] lg:rounded-full p-4 lg:p-2 lg:pl-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] border border-white/60 gap-3 lg:gap-0 transition-all duration-500">
                
                {/* Location Pill */}
                <div 
                  className={`relative z-10 col-span-2 lg:flex-[1.2] flex items-center justify-between rounded-2xl lg:rounded-full px-5 lg:px-6 py-3 lg:py-2 cursor-text transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                    focusedInput === 'location' 
                      ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] scale-[1.02] lg:scale-105 ring-1 ring-gray-100' 
                      : `hover:bg-gray-50/80 ${focusedInput && focusedInput !== 'location' ? 'opacity-60 grayscale-[20%]' : 'opacity-100'}`
                  }`}
                  onFocus={() => setFocusedInput('location')}
                  onBlur={() => setFocusedInput(null)}
                >
                    <div className="flex flex-col flex-1">
                        <label className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 transition-colors duration-300 ${focusedInput === 'location' ? 'text-[#10b981]' : 'text-gray-500'}`}>
                            <MapPin className={`w-3.5 h-3.5 hidden sm:inline transition-colors duration-300 ${focusedInput === 'location' ? 'text-[#10b981]' : 'text-gray-400 group-hover:text-[#10b981]/70'}`} />
                            Location
                        </label>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Where to?"
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-gray-400 font-semibold text-gray-900 truncate"
                        />
                    </div>
                </div>

                {/* Smart Divider */}
                <div className={`hidden lg:block w-[1px] h-10 bg-gray-200 my-auto transition-opacity duration-300 ${focusedInput === 'location' || focusedInput === 'checkin' ? 'opacity-0' : 'opacity-100'}`} />

                {/* Accommodation Type Pill (Mobile Only - Replaced by tabs on sm/lg) */}
                <div className="relative col-span-2 flex sm:hidden flex-col">
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between border border-gray-100 rounded-2xl px-5 py-3 bg-gray-50/30 transition-all duration-300 cursor-pointer hover:bg-gray-50/60"
                    >
                        <div className="flex flex-col flex-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 cursor-pointer">
                                Accommodation Type
                            </label>
                            <span className="text-sm font-semibold text-gray-900 truncate">
                                {activeTab}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Smooth Collapsible Dropdown Menu Options */}
                    <div 
                        className={`w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                            isDropdownOpen 
                                ? 'max-h-[300px] opacity-100 mt-2' 
                                : 'max-h-0 opacity-0 mt-0 pointer-events-none'
                        }`}
                    >
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-2 flex flex-col gap-1 shadow-inner">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                                        activeTab === tab
                                            ? 'text-[#10b981] bg-emerald-50/50 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-200/50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Check In */}
                <div 
                  className={`relative z-10 col-span-1 lg:flex-1 flex items-center justify-between rounded-2xl lg:rounded-full px-5 lg:px-6 py-3 lg:py-2 cursor-text transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                    focusedInput === 'checkin' 
                      ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] scale-[1.02] lg:scale-105 ring-1 ring-gray-100' 
                      : `hover:bg-gray-50/80 ${focusedInput && focusedInput !== 'checkin' ? 'opacity-60 grayscale-[20%]' : 'opacity-100'}`
                  }`}
                  onFocus={() => setFocusedInput('checkin')}
                  onBlur={() => setFocusedInput(null)}
                >
                    <div className="flex flex-col flex-1">
                        <label className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 transition-colors duration-300 ${focusedInput === 'checkin' ? 'text-[#10b981]' : 'text-gray-500'}`}>
                            <Calendar className={`w-3.5 h-3.5 hidden sm:inline transition-colors duration-300 ${focusedInput === 'checkin' ? 'text-[#10b981]' : 'text-gray-400 group-hover:text-[#10b981]/70'}`} />
                            Check In
                        </label>
                        <Input
                            type="text"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            placeholder="Add dates"
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-gray-400 font-semibold text-gray-900 truncate"
                        />
                    </div>
                </div>

                {/* Smart Divider */}
                <div className={`hidden lg:block w-[1px] h-10 bg-gray-200 my-auto transition-opacity duration-300 ${focusedInput === 'checkin' || focusedInput === 'checkout' ? 'opacity-0' : 'opacity-100'}`} />

                {/* Check Out */}
                <div 
                  className={`relative z-10 col-span-1 lg:flex-1 flex items-center justify-between rounded-2xl lg:rounded-full px-5 lg:px-6 py-3 lg:py-2 cursor-text transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                    focusedInput === 'checkout' 
                      ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] scale-[1.02] lg:scale-105 ring-1 ring-gray-100' 
                      : `hover:bg-gray-50/80 ${focusedInput && focusedInput !== 'checkout' ? 'opacity-60 grayscale-[20%]' : 'opacity-100'}`
                  }`}
                  onFocus={() => setFocusedInput('checkout')}
                  onBlur={() => setFocusedInput(null)}
                >
                    <div className="flex flex-col flex-1">
                        <label className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5 transition-colors duration-300 ${focusedInput === 'checkout' ? 'text-[#10b981]' : 'text-gray-500'}`}>
                            <Calendar className={`w-3.5 h-3.5 hidden sm:inline transition-colors duration-300 ${focusedInput === 'checkout' ? 'text-[#10b981]' : 'text-gray-400 group-hover:text-[#10b981]/70'}`} />
                            Check Out
                        </label>
                        <Input
                            type="text"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            placeholder="Add dates"
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-gray-400 font-semibold text-gray-900 truncate"
                        />
                    </div>
                </div>

                {/* Smart Divider */}
                <div className={`hidden lg:block w-[1px] h-10 bg-gray-200 my-auto transition-opacity duration-300 ${focusedInput === 'checkout' || focusedInput === 'participant' ? 'opacity-0' : 'opacity-100'}`} />

                {/* Inline Guests Counter Pill */}
                <div 
                  className={`relative z-10 col-span-1 lg:flex-[1.1] flex items-center justify-between rounded-2xl lg:rounded-full px-5 lg:px-4 py-3 lg:py-1.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                    focusedInput === 'participant' 
                      ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] scale-[1.02] lg:scale-105 ring-1 ring-gray-100' 
                      : `hover:bg-gray-50/80 ${focusedInput && focusedInput !== 'participant' ? 'opacity-60 grayscale-[20%]' : 'opacity-100'}`
                  }`}
                  onMouseEnter={() => setFocusedInput('participant')}
                  onMouseLeave={() => setFocusedInput(null)}
                >
                    <div className="flex flex-col flex-1 select-none">
                        <label className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 transition-colors duration-300 ${focusedInput === 'participant' ? 'text-[#10b981]' : 'text-gray-500'}`}>
                            <Users className={`w-3.5 h-3.5 hidden sm:inline transition-colors duration-300 ${focusedInput === 'participant' ? 'text-[#10b981]' : 'text-gray-400 group-hover:text-[#10b981]/70'}`} />
                            Guests
                        </label>
                        
                        {/* Inline Counter Controls */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={(e) => { e.preventDefault(); setGuests(Math.max(1, guests - 1)); }}
                                disabled={guests <= 1}
                                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#10b981] hover:text-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-gray-500 transition-all duration-200"
                            >
                                <Minus className="w-3 h-3" strokeWidth={3} />
                            </button>
                            
                            <span className="w-4 text-center text-sm font-bold text-gray-900 tabular-nums">
                                {guests}
                            </span>
                            
                            <button 
                                onClick={(e) => { e.preventDefault(); setGuests(guests + 1); }}
                                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#10b981] hover:text-white hover:shadow-sm transition-all duration-200"
                            >
                                <Plus className="w-3 h-3" strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Unified Premium Action Button */}
                <div className="p-1 col-span-1 lg:col-span-none lg:mt-0">
                  <button
                      onClick={handleSearch}
                      className="relative z-20 w-full lg:w-[60px] h-14 lg:h-[60px] rounded-[1.25rem] lg:rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white flex items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.6)] lg:hover:scale-[1.15] lg:hover:-rotate-3 active:scale-95 cursor-pointer flex-shrink-0 border-0 group/btn overflow-hidden"
                  >
                      {/* Button highlight glint effect */}
                      <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover/btn:translate-y-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
                      
                      <Search className="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-500 group-hover/btn:scale-110" strokeWidth={2.5} />
                      <span className="lg:hidden tracking-widest font-bold text-sm uppercase">Search</span>
                  </button>
                </div>

            </div>
        </div>
    );
};

export default SearchBox;