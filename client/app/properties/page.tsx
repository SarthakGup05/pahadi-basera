'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Star, 
  ArrowRight, 
  SlidersHorizontal, 
  X, 
  Compass, 
  TrendingUp, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Banner from '@/components/ui/Banner';
import { propertiesList, PropertyItem } from '@/lib/propertiesData';
import PropertyBackdropGraphics from '@/components/PropertyBackdropGraphics';

export default function PropertiesGridPage() {
  // --- States ---
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isApiFetched, setIsApiFetched] = useState(false);

  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceTier, setPriceTier] = useState<string>('all');
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('recommended');

  // --- Fetch Properties (API with Static Fallback) ---
  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/properties/get-all-properties');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mappedData: PropertyItem[] = data.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description || '',
              location: item.location || (item.latitude ? `${item.type} at ${item.altitude}m` : 'Himalayas'),
              pricePerNight: item.basePrice,
              rating: item.rating || '4.8',
              reviewsCount: item.reviewsCount || 12,
              badge: item.isFeatured ? 'Featured' : item.isPopular ? 'Popular' : null,
              bgImage: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
              image: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
              about: item.about || item.description || '',
              space: item.space || '',
              maxGuests: item.maxGuests || 4,
              bedrooms: item.bedrooms || 2,
              bathrooms: item.bathrooms || 2,
              securityDeposit: item.securityDeposit || 0,
              checkInTime: item.checkInTime || '2:00 PM',
              checkOutTime: item.checkOutTime || '11:00 AM',
              selfCheckIn: item.selfCheckIn || 'Self check-in',
              petsAllowed: item.petsAllowed || false,
              smokingPolicy: item.smokingPolicy || 'Designated zones only',
              cancellationPolicy: item.cancellationPolicy || 'Standard policy',
              amenities: item.amenities || [],
              altitude: item.altitude || 1000,
              type: item.type,
              services: item.services || [],
              isActive: item.isActive,
              isFeatured: item.isFeatured,
              isPopular: item.isPopular
            }));
            setProperties(mappedData);
            setIsApiFetched(true);
            return;
          }
        }
        throw new Error('Failed to load from server');
      } catch (err) {
        setProperties(propertiesList);
        setIsApiFetched(false);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // --- Dynamic Stats Extraction ---
  const allAvailableStays = isApiFetched ? properties : propertiesList;
  
  const regions = Array.from(new Set(allAvailableStays.map(p => p.location.split(',')[0].trim())));
  const stayTypes = Array.from(new Set(allAvailableStays.map(p => p.type)));

  const getRegionCount = (region: string) => {
    return allAvailableStays.filter(p => p.location.toLowerCase().includes(region.toLowerCase())).length;
  };

  const getTypeCount = (type: string) => {
    return allAvailableStays.filter(p => p.type === type).length;
  };

  // --- Filtering Logic ---
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());

    const propertyRegion = property.location.split(',')[0].trim();
    const matchesRegion = 
      selectedRegions.length === 0 || 
      selectedRegions.some(reg => propertyRegion.toLowerCase() === reg.toLowerCase());

    const matchesType = 
      selectedTypes.length === 0 || 
      selectedTypes.includes(property.type);

    let matchesPrice = true;
    if (priceTier === 'budget') matchesPrice = property.pricePerNight < 3000;
    else if (priceTier === 'mid') matchesPrice = property.pricePerNight >= 3000 && property.pricePerNight <= 7000;
    else if (priceTier === 'premium') matchesPrice = property.pricePerNight > 7000 && property.pricePerNight <= 10000;
    else if (priceTier === 'luxury') matchesPrice = property.pricePerNight > 10000;

    const matchesGuests = property.maxGuests >= guestsCount;

    return matchesSearch && matchesRegion && matchesType && matchesPrice && matchesGuests;
  });

  // --- Sorting Logic ---
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price-low') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price-high') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
    if (sortBy === 'altitude') return b.altitude - a.altitude;
    
    const featuredA = a.isFeatured ? 1 : 0;
    const featuredB = b.isFeatured ? 1 : 0;
    return featuredB - featuredA;
  });

  // --- Toggle Filter Utilities ---
  const handleToggleRegion = (region: string) => {
    setSelectedRegions(prev => prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]);
  };

  const handleToggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegions([]);
    setSelectedTypes([]);
    setPriceTier('all');
    setGuestsCount(1);
    setSortBy('recommended');
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    selectedRegions.length + 
    selectedTypes.length + 
    (priceTier !== 'all' ? 1 : 0) + 
    (guestsCount > 1 ? 1 : 0);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Baseras', isCurrent: true }
  ];

  return (
    <div className="bg-zinc-50 min-h-screen pb-24 font-sans text-gray-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Clean Global Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .premium-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .premium-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .premium-scroll:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />

      <Banner
        title="Our Sacred Baseras"
        subtitle="Handpicked high-altitude sanctuaries, stone-carved heritage stays, and slow-travel retreats across the offbeat valleys of the majestic Himalayas."
        bgImage="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1920&auto=format&fit=crop"
        height="md"
        overlayOpacity="medium"
        breadcrumbItems={breadcrumbs}
      />

      <div className="max-w-[1550px] mx-auto px-2 sm:px-4 lg:px-6 mt-10 lg:mt-12 relative">
        {/* Cinematic Backdrop Graphics */}
        <PropertyBackdropGraphics />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ============================================================== */}
          {/* DESKTOP SIDEBAR FILTER */}
          {/* ============================================================== */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white border border-gray-200/60 rounded-3xl p-4 shadow-sm max-h-[85vh] overflow-y-auto premium-scroll transition-shadow duration-300 hover:shadow-md">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Filters</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-600 font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Search</label>
              <div className="relative group">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                <Input
                  type="text"
                  placeholder="Manali, pool, cabin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Regions */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Region</label>
              <div className="flex flex-col gap-2">
                {regions.map((region) => {
                  const isChecked = selectedRegions.includes(region);
                  return (
                    <label 
                      key={region} 
                      className={`flex items-center justify-between text-sm cursor-pointer px-3 py-2 rounded-xl transition-colors ${
                        isChecked 
                          ? 'bg-emerald-50/50 text-emerald-900 font-medium border border-emerald-100' 
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRegion(region)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 shrink-0 ${
                            isChecked 
                              ? 'bg-emerald-500 border-emerald-500 text-white scale-105 shadow-sm shadow-emerald-100' 
                              : 'bg-white border-gray-300 text-transparent hover:border-emerald-400'
                          }`}
                        >
                          <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-[3] transition-all duration-300" viewBox="0 0 24 24" style={{ transform: isChecked ? 'scale(1)' : 'scale(0)' }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span>{region}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isChecked ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getRegionCount(region)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Architecture Types */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Property Type</label>
              <div className="flex flex-col gap-2">
                {stayTypes.map((type) => {
                  const isChecked = selectedTypes.includes(type);
                  const displayType = type.toLowerCase().replace('_', ' ');
                  return (
                    <label 
                      key={type} 
                      className={`flex items-center justify-between text-sm cursor-pointer px-3 py-2 rounded-xl transition-colors ${
                        isChecked 
                          ? 'bg-emerald-50/50 text-emerald-900 font-medium border border-emerald-100' 
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleType(type)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 shrink-0 ${
                            isChecked 
                              ? 'bg-emerald-500 border-emerald-500 text-white scale-105 shadow-sm shadow-emerald-100' 
                              : 'bg-white border-gray-300 text-transparent hover:border-emerald-400'
                          }`}
                        >
                          <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-[3] transition-all duration-300" viewBox="0 0 24 24" style={{ transform: isChecked ? 'scale(1)' : 'scale(0)' }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="capitalize">{displayType}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isChecked ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getTypeCount(type)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Tier */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Price Per Night</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Stays' },
                  { id: 'budget', label: 'Under ₹3k' },
                  { id: 'mid', label: '₹3k - ₹7k' },
                  { id: 'premium', label: '₹7k - ₹10k' },
                  { id: 'luxury', label: 'Above ₹10k' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setPriceTier(tier.id)}
                    className={`text-xs font-medium py-2.5 px-3 rounded-xl border transition-all ${
                      priceTier === tier.id
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guests Capacity */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Guests</label>
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-2 h-14">
                <span className="text-sm font-medium text-gray-700 pl-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" /> {guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setGuestsCount(prev => Math.max(1, prev - 1))}
                    disabled={guestsCount <= 1}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-600 border border-transparent hover:bg-white hover:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setGuestsCount(prev => Math.min(10, prev + 1))}
                    disabled={guestsCount >= 10}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-600 border border-transparent hover:bg-white hover:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

          </aside>

          {/* ============================================================== */}
          {/* MAIN PROPERTY LISTINGS */}
          {/* ============================================================== */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 flex-wrap bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm">
              <div className="text-sm text-gray-600">
                Found <span className="font-semibold text-gray-900">{sortedProperties.length}</span> stays
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl px-3 h-11 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-3 hidden sm:inline">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-0 outline-0 p-0 text-sm font-medium text-gray-800 cursor-pointer focus:ring-0"
                  >
                    <option value="recommended">Featured Stays</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Guest Rating</option>
                    <option value="altitude">Highest Altitude 🏔️</option>
                  </select>
                </div>

                {/* Mobile Filter Trigger */}
                <Button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white h-11 px-5 text-sm font-medium shadow-md transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" /> 
                  Filters {activeFiltersCount > 0 && <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-md">{activeFiltersCount}</span>}
                </Button>
              </div>
            </div>

            {/* Active Filters Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
                {searchQuery && (
                  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full py-1.5 pl-4 pr-2 text-xs font-medium text-gray-700 shadow-sm">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedRegions.map((region) => (
                  <span key={region} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full py-1.5 pl-4 pr-2 text-xs font-medium text-gray-700 shadow-sm">
                    {region}
                    <button onClick={() => handleToggleRegion(region)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {selectedTypes.map((type) => (
                  <span key={type} className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full py-1.5 pl-4 pr-2 text-xs font-medium text-gray-700 shadow-sm capitalize">
                    {type.toLowerCase().replace('_', ' ')}
                    <button onClick={() => handleToggleType(type)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {priceTier !== 'all' && (
                  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full py-1.5 pl-4 pr-2 text-xs font-medium text-gray-700 shadow-sm">
                    {priceTier === 'budget' ? 'Under ₹3k' : priceTier === 'mid' ? '₹3k - ₹7k' : priceTier === 'premium' ? '₹7k - ₹10k' : 'Above ₹10k'}
                    <button onClick={() => setPriceTier('all')} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button 
                  onClick={handleResetFilters}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold px-4 py-1.5 rounded-full hover:bg-emerald-50 transition-colors ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm animate-pulse">
                    <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 mb-4" />
                    <div className="px-3 pb-3 space-y-3">
                      <div className="h-4 w-1/3 bg-gray-200 rounded" />
                      <div className="h-5 w-3/4 bg-gray-200 rounded" />
                      <div className="h-10 w-full bg-gray-200 rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {sortedProperties.map((property) => (
                  <Link 
                    key={property.id} 
                    href={`/properties/${property.id}`}
                    className="group flex flex-col bg-white rounded-3xl border border-gray-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                  >
                    {/* Image Wrapper */}
                    <div className="w-full h-52 sm:h-56 shrink-0 relative p-3 pb-0">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-2 z-20">
                          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-semibold capitalize rounded-xl shadow-sm">
                            {property.type.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                        {property.badge && (
                          <span className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-500/95 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase rounded-xl shadow-sm">
                            {property.badge}
                          </span>
                        )}

                        {/* Altitude Overlay */}
                        {property.altitude > 100 && (
                          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/10">
                            <Compass className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{property.altitude.toLocaleString()}m</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 pt-4 flex flex-col flex-1">
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5 truncate pr-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 
                          <span className="truncate">{property.location}</span>
                        </span>
                        {property.rating && (
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-gray-700">{property.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-gray-900 font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {property.title}
                      </h4>

                      {/* Description */}
                      <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-4 leading-relaxed">
                        {property.description}
                      </p>

                      <div className="flex-1" />

                      {/* Amenities Icons */}
                      <div className="flex items-center gap-3 text-xs font-medium text-gray-600 mb-5">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{property.maxGuests}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Bath className="w-4 h-4 text-gray-400" />
                          <span>{property.bathrooms}</span>
                        </div>
                      </div>

                      {/* Footer Area */}
                      <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">From</p>
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold text-xl text-gray-900">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-500 font-medium">/night</span>
                          </div>
                        </div>

                        <div className="h-10 px-4 rounded-xl bg-gray-900 group-hover:bg-emerald-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors duration-300">
                          <span>View</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="bg-white border border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-8 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                  <Compass className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Sanctuaries Found</h3>
                <p className="text-gray-500 text-base mb-8 max-w-md">
                  We couldn't find any stays matching your precise filters. Try adjusting your dates, location, or price range to discover hidden gems.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="rounded-xl bg-gray-900 hover:bg-emerald-500 text-white px-8 h-12 text-sm font-semibold shadow-md transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Clear All Filters
                </Button>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE DRAWER FILTER */}
      {/* ============================================================== */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileFilterOpen(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-3xl p-6 shadow-2xl overflow-y-auto pb-safe flex flex-col gap-8 transition-transform duration-500 ease-out ${
            isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 sticky top-0 bg-white z-10 pt-2 -mt-2">
            <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8 pb-20">
            {/* Search */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-3">Location or Keyword</label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Manali, fireplace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-14 border-gray-200 rounded-xl text-base bg-gray-50/50"
                />
              </div>
            </div>

            {/* Regions */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-3">Regions</label>
              <div className="flex flex-wrap gap-2.5">
                {regions.map((region) => {
                  const isChecked = selectedRegions.includes(region);
                  return (
                    <button
                      key={region}
                      onClick={() => handleToggleRegion(region)}
                      className={`text-sm font-medium py-2.5 px-4 rounded-full border transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stay Types */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-3">Property Type</label>
              <div className="flex flex-wrap gap-2.5">
                {stayTypes.map((type) => {
                  const isChecked = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => handleToggleType(type)}
                      className={`text-sm font-medium py-2.5 px-4 rounded-full border capitalize transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {type.toLowerCase().replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-3">Price Per Night</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'all', label: 'All Stays' },
                  { id: 'budget', label: 'Under ₹3k' },
                  { id: 'mid', label: '₹3k - ₹7k' },
                  { id: 'premium', label: '₹7k - ₹10k' },
                  { id: 'luxury', label: 'Above ₹10k' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setPriceTier(tier.id)}
                    className={`text-sm font-medium py-3 rounded-xl border transition-colors ${
                      priceTier === tier.id
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-3">Capacity</label>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3">
                <span className="text-base font-medium text-gray-800 pl-2">
                  Guests
                </span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setGuestsCount(p => Math.max(1, p - 1))}
                    disabled={guestsCount <= 1}
                    className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center text-xl shadow-sm disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-semibold text-lg">{guestsCount}</span>
                  <button 
                    onClick={() => setGuestsCount(p => Math.min(10, p + 1))}
                    disabled={guestsCount >= 10}
                    className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center text-xl shadow-sm disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1 rounded-xl border-gray-200 text-gray-700 font-semibold h-14"
            >
              Reset
            </Button>
            <Button
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-[2] rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-14 shadow-md"
            >
              Show {sortedProperties.length} Stays
            </Button>
          </div>

        </div>
      </div>

    </div>
  );
}