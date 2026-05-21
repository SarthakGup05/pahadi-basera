'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';

const SearchBox = () => {
    const [activeTab, setActiveTab] = useState('All Accommodation');
    const tabs = ['All Accommodation', 'Villa', 'Hotel', 'Apartment', 'Home Stay'];
    
    // Track focused input to apply a subtle highlight background to that specific section
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    return (
        <div className="w-full max-w-[850px] mx-auto transition-all duration-300 px-4">

            {/* Premium Minimalist Tabs floating above (Desktop Only) */}
            <div className="hidden md:flex items-center gap-5 mb-3 w-full justify-center px-4 md:px-0">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer pb-1.5 border-b-2 flex-shrink-0 ${
                            activeTab === tab
                                ? 'text-white border-[#10b981]'
                                : 'text-white/60 hover:text-white border-transparent'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Sleek Integrated App-Style Form container */}
            <div className="flex flex-col md:flex-row bg-white rounded-[2rem] md:rounded-full p-5 md:p-2 pl-5 md:pl-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-gray-100 md:border-white/20 gap-4 md:gap-0 cursor-text">
                
                {/* Location Pill */}
                <div 
                  className={`w-full md:flex-1 flex items-center justify-between border md:border-0 border-gray-200/80 rounded-full md:rounded-none px-5 md:px-4 py-2.5 md:py-1.5 transition-all duration-300 ${
                    focusedInput === 'location' ? 'bg-gray-50/80 border-[#10b981]' : 'bg-gray-50/20 md:bg-transparent hover:bg-gray-50/40'
                  }`}
                  onFocus={() => setFocusedInput('location')}
                  onBlur={() => setFocusedInput(null)}
                >
                    <div className="flex flex-col flex-1">
                        <label className="text-[9px] font-bold text-gray-400 md:text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#10b981] hidden md:inline" />
                            Location
                        </label>
                        <Input
                            placeholder="All Locations"
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-gray-400 font-semibold text-gray-800"
                        />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 md:hidden ml-2" />
                </div>

                {/* Accommodation Type Pill (Mobile Only) */}
                <div 
                  className="w-full flex md:hidden items-center justify-between border border-gray-200/80 rounded-full px-5 py-2.5 bg-gray-50/20 transition-all duration-300"
                >
                    <div className="flex flex-col flex-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                            Accommodation Type
                        </label>
                        <Input
                            value={activeTab}
                            readOnly
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm font-semibold text-gray-800"
                        />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>

                {/* Symmetrical Check-In & Check-Out Double Pill */}
                <div className="w-full md:flex-[2] flex flex-row border md:border-0 border-gray-200/80 rounded-full md:rounded-none divide-x divide-gray-200/80 bg-gray-50/20 md:bg-transparent py-0">
                    
                    {/* Check In */}
                    <div 
                      className={`flex-1 flex items-center justify-between px-5 md:px-4 py-2.5 md:py-1.5 md:border-l md:border-gray-200/60 transition-all duration-300 ${
                        focusedInput === 'checkin' ? 'bg-gray-50/80' : 'hover:bg-gray-50/40 md:hover:bg-transparent'
                      }`}
                      onFocus={() => setFocusedInput('checkin')}
                      onBlur={() => setFocusedInput(null)}
                    >
                        <div className="flex flex-col flex-1">
                            <label className="text-[9px] font-bold text-gray-400 md:text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#10b981] hidden md:inline" />
                                Check In
                            </label>
                            <Input
                                placeholder="Add dates"
                                className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-gray-400 font-semibold text-gray-800"
                            />
                        </div>
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 md:hidden ml-2" />
                    </div>

                    {/* Check Out */}
                    <div 
                      className={`flex-1 flex items-center justify-between px-5 md:px-4 py-2.5 md:py-1.5 md:border-l md:border-gray-200/60 transition-all duration-300 ${
                        focusedInput === 'checkout' ? 'bg-gray-50/80' : 'hover:bg-gray-50/40 md:hover:bg-transparent'
                      }`}
                      onFocus={() => setFocusedInput('checkout')}
                      onBlur={() => setFocusedInput(null)}
                    >
                        <div className="flex flex-col flex-1">
                            <label className="text-[9px] font-bold text-gray-400 md:text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#10b981] hidden md:inline" />
                                Check Out
                            </label>
                            <Input
                                placeholder="Add dates"
                                className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-gray-400 font-semibold text-gray-800"
                            />
                        </div>
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 md:hidden ml-2" />
                    </div>

                </div>

                {/* Guests Pill */}
                <div 
                  className={`w-full md:flex-1 flex items-center justify-between border md:border-0 border-gray-200/80 rounded-full md:rounded-none px-5 md:px-4 py-2.5 md:py-1.5 md:border-l md:border-gray-200/60 transition-all duration-300 ${
                    focusedInput === 'participant' ? 'bg-gray-50/80 border-[#10b981]' : 'bg-gray-50/20 md:bg-transparent hover:bg-gray-50/40'
                  }`}
                  onFocus={() => setFocusedInput('participant')}
                  onBlur={() => setFocusedInput(null)}
                >
                    <div className="flex flex-col flex-1">
                        <label className="text-[9px] font-bold text-gray-400 md:text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#10b981] hidden md:inline" />
                            Add Guests
                        </label>
                        <Input
                            placeholder="1 Guest"
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-gray-400 font-semibold text-gray-800"
                        />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 md:hidden ml-2" />
                </div>

                {/* Unified Premium Action Button */}
                <button
                    className="w-full md:w-12 h-12 rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white flex items-center justify-center gap-2 transition-all duration-500 ease-out shadow-md hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.5)] hover:scale-105 md:hover:scale-110 hover:-translate-y-0.5 md:hover:rotate-12 active:scale-95 cursor-pointer flex-shrink-0 py-3.5 md:py-0 border-0"
                >
                    <Search className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="md:hidden tracking-wider font-semibold text-sm">Search</span>
                </button>

            </div>
        </div>
    );
};

export default SearchBox;
