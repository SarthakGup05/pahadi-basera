'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  SlidersHorizontal,
  Plus, 
  Minus,
  Check,
  X,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PackageFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  selectedGuests: number;
  setSelectedGuests: (guests: number) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedVibe: string;
  setSelectedVibe: (vibe: string) => void;
}

const regions = [
  { id: 'All', name: 'All Regions', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop', description: 'Explore the entire Himalayas' },
  { id: 'Uttarakhand', name: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1589136777351-fd6e473e09a5?q=80&w=300&auto=format&fit=crop', description: 'Land of Gods & high passes' },
  { id: 'Himachal', name: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=300&auto=format&fit=crop', description: 'Pine valleys & snow-capped peaks' },
  { id: 'Kashmir', name: 'Jammu & Kashmir', image: 'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?q=80&w=300&auto=format&fit=crop', description: 'Alpine meadows & mirror lakes' },
  { id: 'Sikkim', name: 'Sikkim', image: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?q=80&w=300&auto=format&fit=crop', description: 'Sacred monasteries & valleys' }
];

const durations = [
  { id: 'Any', name: 'Any Duration', desc: 'Flexible Dates' },
  { id: 'Short', name: '3-4 Days', desc: 'Weekend Retreats' },
  { id: 'Medium', name: '5-6 Days', desc: 'Classic Escapes' },
  { id: 'Long', name: '7+ Days', desc: 'Deep Expeditions' }
];

const vibes = [
  { id: 'All', name: 'All Vibes' },
  { id: 'Adventure', name: 'Adventure' },
  { id: 'Wellness', name: 'Wellness & Yoga' },
  { id: 'Celestial', name: 'Stargazing' },
  { id: 'Heritage', name: 'Culture' }
];

const difficulties = [
  { id: 'All', name: 'All Levels' },
  { id: 'Easy', name: 'Easy' },
  { id: 'Moderate', name: 'Moderate' },
  { id: 'Hard', name: 'Challenging' }
];

export default function PackageFilter({
  selectedRegion,
  setSelectedRegion,
  selectedDuration,
  setSelectedDuration,
  selectedGuests,
  setSelectedGuests,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedVibe,
  setSelectedVibe
}: PackageFilterProps) {
  const [activeDropdown, setActiveDropdown] = useState<'region' | 'duration' | 'guests' | 'more' | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [adults, setAdults] = useState(Math.max(1, selectedGuests));
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setSelectedGuests(adults + childrenCount);
  }, [adults, childrenCount, setSelectedGuests]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile modal is open to ensure absolute premium backdrop UX
  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileModalOpen]);

  const handleDropdownToggle = (dropdown: 'region' | 'duration' | 'guests' | 'more') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const clearAllFilters = () => {
    setSelectedRegion('All');
    setSelectedDuration('Any');
    setSelectedDifficulty('All');
    setSelectedVibe('All');
    setAdults(1);
    setChildrenCount(0);
    setSelectedGuests(1);
    setActiveDropdown(null);
  };

  const getRegionName = (id: string) => regions.find(r => r.id === id)?.name || 'Destination';
  const getDurationName = (id: string) => durations.find(d => d.id === id)?.name || 'Duration';
  const hasActiveFilters = selectedRegion !== 'All' || selectedDuration !== 'Any' || selectedDifficulty !== 'All' || selectedVibe !== 'All' || selectedGuests > 1;

  const GuestsCounter = () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-sm font-semibold text-stone-850">Adults</span>
          <span className="block text-[11px] text-stone-400">Ages 13 or above</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdults(Math.max(1, adults - 1))}
            disabled={adults <= 1}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:border-[#10b981] hover:text-[#10b981] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-xs font-bold text-stone-800 tabular-nums">{adults}</span>
          <button
            type="button"
            onClick={() => setAdults(adults + 1)}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:border-[#10b981] hover:text-[#10b981] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-stone-100 pt-3.5">
        <div>
          <span className="block text-sm font-semibold text-stone-850">Children</span>
          <span className="block text-[11px] text-stone-400">Ages 2 – 12</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
            disabled={childrenCount <= 0}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:border-[#10b981] hover:text-[#10b981] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-xs font-bold text-stone-800 tabular-nums">{childrenCount}</span>
          <button
            type="button"
            onClick={() => setChildrenCount(childrenCount + 1)}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:border-[#10b981] hover:text-[#10b981] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Separate rendered Mobile Modal using React Portals
  const renderMobileModal = () => {
    if (!isMobileModalOpen || !mounted) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-[99999] bg-stone-50 md:hidden flex flex-col animate-in slide-in-from-bottom duration-300 ease-out font-sans">
        
        {/* Header Capsule */}
        <div className="flex-none flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] bg-white border-b border-stone-200 shadow-sm relative z-20">
          <button 
            onClick={() => setIsMobileModalOpen(false)} 
            className="p-2 -ml-2 text-stone-900 bg-stone-100 rounded-full cursor-pointer hover:bg-stone-200 transition-colors border-0"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="font-bold text-sm tracking-widest uppercase text-stone-800">Filter Journeys</span>
          <button 
            onClick={clearAllFilters} 
            className="text-xs font-bold underline text-stone-500 cursor-pointer hover:text-[#10b981] border-0 bg-transparent"
          >
            Clear All
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 pb-12 flex flex-col gap-5">
          
          {/* Section 1: Where to? */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-sm text-left">
            <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">Step 1</span>
            <h3 className="text-base font-bold text-stone-850 mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#10b981]" /> Where to?
            </h3>
            
            <div className="flex overflow-x-auto gap-3.5 pb-2.5 no-scrollbar scroll-smooth">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`w-32 shrink-0 flex flex-col text-left rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white ${
                    selectedRegion === reg.id 
                      ? 'border-[#10b981] ring-2 ring-[#10b981]/25' 
                      : 'border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className="h-20 w-full relative overflow-hidden bg-stone-100">
                    {selectedRegion === reg.id && (
                      <div className="absolute inset-0 bg-[#10b981]/10 flex items-center justify-center z-15 backdrop-blur-[1px]">
                        <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                    <img 
                      src={reg.image} 
                      alt={reg.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <span className={`block text-[11px] font-bold leading-tight ${selectedRegion === reg.id ? 'text-[#10b981]' : 'text-stone-800'}`}>
                      {reg.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Stay Duration */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-sm text-left">
            <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">Step 2</span>
            <h3 className="text-base font-bold text-stone-850 mb-3.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#10b981]" /> How long?
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              {durations.map((dur) => (
                <button
                  key={dur.id}
                  onClick={() => setSelectedDuration(dur.id)}
                  className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedDuration === dur.id 
                      ? 'border-[#10b981] bg-emerald-50/20 text-[#10b981]' 
                      : 'border-stone-200/80 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${selectedDuration === dur.id ? 'text-[#10b981]' : 'text-stone-800'}`}>
                    {dur.name}
                  </span>
                  <span className="text-[9px] text-stone-400 mt-0.5">{dur.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Travelers Count */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-sm text-left">
            <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">Step 3</span>
            <h3 className="text-base font-bold text-stone-850 mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#10b981]" /> Who is coming?
            </h3>
            <GuestsCounter />
          </div>

          {/* Section 4: Advanced Vibe & Difficulty Filters */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-sm text-left space-y-4">
            <div className="flex flex-col gap-2">
              <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Adventure Vibe</span>
              <div className="flex flex-wrap gap-1.5">
                {vibes.map((vb) => (
                  <button
                    key={vb.id}
                    onClick={() => setSelectedVibe(vb.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      selectedVibe === vb.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-500 border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    {vb.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-stone-100" />

            <div className="flex flex-col gap-2">
              <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Difficulty Level</span>
              <div className="flex flex-wrap gap-1.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      selectedDifficulty === diff.id
                        ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm'
                        : 'bg-white text-stone-500 border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    {diff.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Fixed Footer Search Action */}
        <div className="flex-none p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-t border-stone-200 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] relative z-20">
          <Button
            onClick={() => setIsMobileModalOpen(false)}
            className="w-full h-12 bg-stone-950 hover:bg-[#10b981] text-white rounded-xl font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-1.5 border-0 shadow-lg hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
            Search Expeditions
          </Button>
        </div>

      </div>,
      document.body
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto z-40 relative font-sans px-4">
      
      {/* 1. MOBILE TRIGGER BUTTON (Visible only < md) */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMobileModalOpen(true)}
          className="w-full bg-white border border-stone-200/80 shadow-md rounded-full p-3.5 flex items-center gap-3 hover:bg-stone-50 transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">
            <Search className="w-4.5 h-4.5 text-[#10b981]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-left flex-1 overflow-hidden">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Where to?</span>
            <span className="text-xs font-semibold text-stone-900 truncate flex items-center gap-1.5">
              {selectedRegion === 'All' ? 'Himalayan Regions' : getRegionName(selectedRegion)}
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              {getDurationName(selectedDuration)}
            </span>
          </div>
          
          <div className="flex items-center shrink-0 gap-2 mr-1">
            <span className="text-[9px] font-bold tracking-widest text-stone-400 bg-stone-100 rounded-md px-2 py-1 uppercase">
              {selectedGuests} {selectedGuests === 1 ? 'Guest' : 'Guests'}
            </span>
            {hasActiveFilters && (
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            )}
          </div>
        </button>
      </div>

      {/* 2. DESKTOP SEARCH BAR (Visible only md+) */}
      <div ref={filterRef} className="hidden md:block relative">
        <div className="bg-white rounded-full border border-stone-200/80 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_45px_-10px_rgba(16,185,129,0.1)] p-2 pl-6 flex flex-row items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative z-20">
          
          {/* Column 1: Where */}
          <button 
            onClick={() => handleDropdownToggle('region')} 
            className={`flex-[1.2] text-left py-2 px-5 rounded-full transition-all hover:bg-stone-50 cursor-pointer ${
              activeDropdown === 'region' ? 'bg-stone-50 shadow-inner' : ''
            }`}
          >
            <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Where</span>
            <span className="block text-xs sm:text-sm font-semibold text-stone-900 truncate">
              {selectedRegion === 'All' ? 'Search Destinations' : getRegionName(selectedRegion)}
            </span>
          </button>

          <div className="w-px h-8 bg-stone-150 shrink-0" />

          {/* Column 2: When */}
          <button 
            onClick={() => handleDropdownToggle('duration')} 
            className={`flex-1 text-left py-2 px-5 rounded-full transition-all hover:bg-stone-50 cursor-pointer ${
              activeDropdown === 'duration' ? 'bg-stone-50 shadow-inner' : ''
            }`}
          >
            <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">When</span>
            <span className="block text-xs sm:text-sm font-semibold text-stone-900 truncate">
              {selectedDuration === 'Any' ? 'Flexible Dates' : getDurationName(selectedDuration)}
            </span>
          </button>

          <div className="w-px h-8 bg-stone-150 shrink-0" />

          {/* Column 3: Who */}
          <button 
            onClick={() => handleDropdownToggle('guests')} 
            className={`flex-1 text-left py-2 px-5 rounded-full transition-all hover:bg-stone-50 cursor-pointer ${
              activeDropdown === 'guests' ? 'bg-stone-50 shadow-inner' : ''
            }`}
          >
            <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Who</span>
            <span className="block text-xs sm:text-sm font-semibold text-stone-900 truncate">
              {selectedGuests} {selectedGuests === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </button>

          <div className="w-px h-8 bg-stone-150 shrink-0" />

          {/* Column 4: Vibe & Level */}
          <button 
            onClick={() => handleDropdownToggle('more')} 
            className={`flex-[1.1] text-left py-2 px-5 rounded-full transition-all hover:bg-stone-50 cursor-pointer ${
              activeDropdown === 'more' ? 'bg-stone-50 shadow-inner' : ''
            }`}
          >
            <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Vibe & Level</span>
            <span className="block text-xs sm:text-sm font-semibold text-stone-900 truncate">
              {selectedVibe !== 'All' || selectedDifficulty !== 'All' ? 'Active Filters' : 'Select Vibes/Difficulty'}
            </span>
          </button>

          <div className="flex items-center gap-2 pl-2">
            {hasActiveFilters && (
              <button 
                onClick={clearAllFilters} 
                className="p-2 text-stone-400 hover:text-stone-750 hover:bg-stone-100 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
                title="Clear all active filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setActiveDropdown(null)}
              className="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(16,185,129,0.3)] border-0 cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* --- DESKTOP POPOVERS --- */}
        {activeDropdown === 'region' && (
          <div className="absolute top-[110%] left-0 w-[600px] bg-white/98 backdrop-blur-2xl border border-stone-200/80 rounded-[2rem] p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#10b981]" /> Select Region
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => { setSelectedRegion(reg.id); setActiveDropdown('duration'); }}
                  className={`group flex flex-col text-left rounded-xl overflow-hidden border transition-all cursor-pointer bg-white ${
                    selectedRegion === reg.id ? 'border-[#10b981] ring-2 ring-[#10b981]/20 shadow-sm' : 'border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className="aspect-[4/3] w-full relative overflow-hidden bg-stone-100">
                    <img src={reg.image} alt={reg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-2.5 bg-white">
                    <span className={`block text-[10px] font-bold leading-tight ${selectedRegion === reg.id ? 'text-[#10b981]' : 'text-stone-800'}`}>{reg.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeDropdown === 'duration' && (
          <div className="absolute top-[110%] left-[20%] w-[330px] bg-white/98 backdrop-blur-2xl border border-stone-200/80 rounded-[2rem] p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#10b981]" /> Choose Duration
            </h3>
            <div className="flex flex-col gap-2">
              {durations.map((dur) => (
                <button
                  key={dur.id}
                  onClick={() => { setSelectedDuration(dur.id); setActiveDropdown('guests'); }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedDuration === dur.id 
                      ? 'border-[#10b981] bg-emerald-50/20 text-[#10b981]' 
                      : 'border-stone-100 hover:border-stone-200 bg-white text-stone-750'
                  }`}
                >
                  <div>
                    <span className={`block text-xs font-bold ${selectedDuration === dur.id ? 'text-[#10b981]' : 'text-stone-850'}`}>{dur.name}</span>
                    <span className="block text-[9px] text-stone-400 mt-0.5">{dur.desc}</span>
                  </div>
                  {selectedDuration === dur.id && <Check className="w-4 h-4 text-[#10b981]" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeDropdown === 'guests' && (
          <div className="absolute top-[110%] left-[45%] w-[330px] bg-white/98 backdrop-blur-2xl border border-stone-200/80 rounded-[2rem] p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#10b981]" /> Travelers Count
            </h3>
            <GuestsCounter />
          </div>
        )}

        {/* Unified Vibe & Difficulty Popover (Column 4) */}
        {activeDropdown === 'more' && (
          <div className="absolute top-[110%] right-0 w-[420px] bg-white/98 backdrop-blur-2xl border border-stone-200/80 rounded-[2rem] p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-2 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#10b981]" /> Advanced Filters
            </h3>
            
            <div className="flex flex-col gap-2">
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">Adventure Vibe</span>
              <div className="flex flex-wrap gap-1.5">
                {vibes.map((vb) => (
                  <button
                    key={vb.id}
                    onClick={() => setSelectedVibe(vb.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      selectedVibe === vb.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-500 border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    {vb.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-stone-100" />

            <div className="flex flex-col gap-2">
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">Difficulty Level</span>
              <div className="flex flex-wrap gap-1.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      selectedDifficulty === diff.id
                        ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm'
                        : 'bg-white text-stone-500 border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    {diff.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Render Portal Mobile Modal */}
      {renderMobileModal()}

      {/* Hide Scrollbars CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}