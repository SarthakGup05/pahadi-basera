'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Users, 
  Bed, 
  Bath, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  Home, 
  Trees, 
  Mountain, 
  Coffee,
  Compass,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { propertiesList, PropertyItem } from '@/lib/propertiesData';

const CATEGORIES = [
  { id: 'ALL', name: 'All Baseras', icon: Sparkles },
  { id: 'RESORT', name: 'Alpine Chalets', icon: Home },
  { id: 'COTTAGE', name: 'Pine Cottages', icon: Trees },
  { id: 'VILLAS', name: 'Valley Villas', icon: Compass },
  { id: 'HOMESAYS', name: 'Native Homestays', icon: Coffee },
  { id: 'APARTMENT', name: 'Glamping & Pods', icon: Mountain },
];

const FeaturedProperties = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [properties, setProperties] = useState<PropertyItem[]>(() => {
    return propertiesList.filter((p) => p.isFeatured && p.isActive);
  });

  // Try fetching live properties from Supabase backend with fallback
  useEffect(() => {
    const fetchLiveProperties = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/properties/get-all-properties');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Map live DB properties to expected item structure if needed
            const mapped = data.map((p: any) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              location: p.location || 'Himalayan Ridge',
              pricePerNight: p.basePrice || 6500,
              rating: '4.9',
              reviewsCount: p.reviews?.length || 24,
              badge: p.isFeatured ? 'Guest Favourite' : null,
              image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
              altitude: p.altitude || 2100,
              maxGuests: p.maxGuests || 4,
              bedrooms: p.bedrooms || 2,
              bathrooms: p.bathrooms || 2,
              type: p.type || 'COTTAGE',
              isActive: p.isActive,
              isFeatured: p.isFeatured,
            }));
            setProperties(mapped as any);
          }
        }
      } catch (e) {
        // Fall back gracefully to static mock catalog
      }
    };
    fetchLiveProperties();
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredProperties = properties.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.type === selectedCategory;
  });

  return (
    <section className="py-20 w-full max-w-[1400px] mx-auto px-4 md:px-8 font-sans" id="properties">
      
      {/* Header with Title and "Explore All" button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#10b981]">
              Curated Sanctuaries
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight">
            Featured <span className="font-serif italic font-normal text-[#10b981]">Baseras</span>
          </h2>
          <p className="text-sm text-stone-500 font-normal mt-1">
            Handpicked mountain homes with authentic local hospitality, roaring hearths, and panoramic valley views.
          </p>
        </div>

        <Button 
          asChild
          variant="outline"
          className="rounded-full border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold px-5 py-2.5 self-start md:self-auto cursor-pointer"
        >
          <Link href="/properties" className="flex items-center gap-1.5">
            Explore All 12 Stays <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </Button>
      </div>

      {/* Airbnb-style Horizontal Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-stone-200/70 select-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap text-xs font-medium ${
                isSelected 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#10b981]' : 'text-stone-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Luxury Property Cards Grid (Airbnb Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {filteredProperties.slice(0, 8).map((property) => {
          const isLiked = favorites[property.id];
          return (
            <Link 
              key={property.id} 
              href={`/properties/${property.id}`}
              className="group flex flex-col cursor-pointer transition-all duration-300"
            >
              {/* Image Container */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-stone-100 shadow-sm border border-stone-200/50">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Floating Guest Favourite Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-stone-800 text-[11px] font-bold rounded-full shadow-xs border border-white/60">
                    {property.badge || 'Guest Favourite'}
                  </span>
                </div>

                {/* Floating Wishlist Heart */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(e, property.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer border border-white/20"
                  aria-label="Save to wishlist"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      isLiked ? 'fill-[#10b981] text-[#10b981]' : 'text-white fill-black/20'
                    }`} 
                  />
                </button>

                {/* Elevation Badge */}
                {property.altitude > 100 && (
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-stone-900/70 backdrop-blur-sm text-stone-200 text-[10px] font-medium rounded-md border border-white/10">
                    🏔️ {property.altitude.toLocaleString()}m
                  </span>
                )}
              </div>

              {/* Property Details */}
              <div className="mt-3 flex flex-col space-y-1">
                {/* Location & Star Rating */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900 truncate">
                    {property.location}
                  </span>
                  <div className="flex items-center gap-1 shrink-0 font-medium text-stone-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{property.rating || '4.9'}</span>
                    <span className="text-stone-400 font-normal">({property.reviewsCount || 24})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-normal text-stone-600 truncate group-hover:text-stone-900 transition-colors">
                  {property.title}
                </h3>

                {/* Specs Pill */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                  <span>{property.maxGuests || 4} Guests</span>
                  <span>•</span>
                  <span>{property.bedrooms || 2} Beds</span>
                  <span>•</span>
                  <span>Mountain View</span>
                </div>

                {/* Price Display */}
                <div className="pt-1 flex items-baseline gap-1 text-stone-900">
                  <span className="font-bold text-sm tracking-tight">
                    ₹{property.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-500 font-normal">night</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200/80">
          <p className="text-sm font-semibold text-stone-700">No properties in this category currently.</p>
          <p className="text-xs text-stone-400 mt-1">Try selecting &apos;All Baseras&apos; to view all available mountain stays.</p>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Show All Stays
          </button>
        </div>
      )}

    </section>
  );
};

export default FeaturedProperties;