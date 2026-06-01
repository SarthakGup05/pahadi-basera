'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Sun, 
  ThermometerSnowflake, 
  Car, 
  Coffee, 
  Sparkles, 
  Compass, 
  Check, 
  Home, 
  Info,
  Calendar,
  Users,
  Bed,
  Bath,
  ArrowRight,
  ShieldCheck,
  Flame,
  UtensilsCrossed
} from 'lucide-react';
import Banner from '@/components/ui/Banner';
import { Button } from '@/components/ui/button';
import { regionsList, regionalPropertiesList, RegionItem } from '@/lib/regionsData';
import { packagesList } from '@/lib/packagesData';

export default function RegionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [mounted, setMounted] = useState(false);
  const [region, setRegion] = useState<RegionItem | null>(null);

  useEffect(() => {
    setMounted(true);
    const foundRegion = regionsList.find(r => r.id === slug);
    if (foundRegion) {
      setRegion(foundRegion);
    }
  }, [slug]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-dashed border-[#10b981] animate-spin" />
      </div>
    );
  }

  // 404 Fallback if region is invalid
  if (!region) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full border border-dashed border-rose-400 text-rose-500 flex items-center justify-center mb-6 bg-rose-50/50">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-light text-stone-900 tracking-tight mb-2">Region Not Found</h2>
        <p className="text-sm font-light text-stone-500 leading-relaxed mb-8 max-w-sm">
          We couldn't locate the mountain region matching the slug <span className="font-bold text-stone-950">"{slug}"</span>. Let's return to the active catalog!
        </p>
        <Button asChild className="rounded-xl bg-stone-900 hover:bg-[#10b981] text-white px-8 h-12 text-xs font-bold tracking-widest uppercase border-0 cursor-pointer">
          <Link href="/regions" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Regions
          </Link>
        </Button>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Regions', href: '/regions' },
    { label: region.title, isCurrent: true }
  ];

  // Fetch stays & packages matching this region
  const matchingProperties = regionalPropertiesList.filter(p => region.featuredStayIds.includes(p.id));
  const matchingPackages = packagesList.filter(pkg => region.featuredPackageIds.includes(pkg.id));

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-stone-850 selection:bg-[#10b981]/20 selection:text-[#0e9f6e] relative overflow-hidden">
      
      {/* Cinematic Ambient Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:48px_48px] opacity-40" />
        <div className="absolute top-[25%] -left-[10%] w-[700px] h-[700px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] -right-[15%] w-[650px] h-[650px] bg-blue-500/5 blur-[130px] rounded-full mix-blend-multiply" />
      </div>

      {/* 1. Cinematic Header Banner */}
      <div className="relative z-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
        <Banner
          title={region.title}
          subtitle={region.subtitle}
          badge={`Valley Profile`}
          bgImage={region.bannerImage}
          height="lg"
          overlayOpacity="dark"
          breadcrumbItems={breadcrumbs}
        >
          <Button
            asChild
            variant="outline"
            className="group/back relative overflow-hidden rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 px-8 h-12 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-500 pointer-events-auto"
          >
            <Link href="/regions" className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover/back:-translate-x-1">
                <ArrowLeft className="w-3 h-3" />
              </div>
              <span className="relative z-10">Back to Regions</span>
            </Link>
          </Button>
        </Banner>
      </div>

      {/* 2. Asymmetric Column Profiles */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Narrative & Hidden Gems Timeline */}
        <div className="lg:col-span-7 space-y-12 text-left">
          
          {/* Section: Overview */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/55 shadow-sm">
            <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Alpine Odyssey</span>
            </div>
            
            <h2 className="text-3xl font-light text-stone-900 tracking-tight mb-5 leading-tight">
              About the <span className="font-normal italic text-[#10b981]">{region.title} Valley</span>
            </h2>
            
            <p className="text-base font-light text-stone-600 leading-relaxed mb-6">
              {region.longDescription}
            </p>
          </div>

          {/* Section: Hidden Gems Chronological Timeline */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/55 shadow-sm relative overflow-hidden">
            <h2 className="text-2xl font-light text-stone-900 tracking-tight mb-8 leading-tight">
              Hidden Gems & <span className="font-normal italic text-[#10b981]">Local Secrets</span>
            </h2>

            {/* Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l border-stone-200/85 space-y-8 py-2 ml-4">
              {region.hiddenGems.map((gem, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-[-38px] sm:left-[-46px] top-1 w-6 h-6 rounded-full bg-white border border-stone-200/80 flex items-center justify-center shadow-sm z-10 transition-colors duration-500 group-hover:border-[#10b981]">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300 transition-colors duration-500 group-hover:bg-[#10b981] group-hover:scale-110" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-[0.2em] mb-1">
                      Secret Spot 0{idx + 1}
                    </span>
                    <h4 className="text-lg font-semibold text-stone-900 mb-2 leading-tight group-hover:text-[#10b981] transition-colors duration-300">
                      {gem.name}
                    </h4>
                    <p className="text-xs sm:text-sm font-light text-stone-500 leading-relaxed">
                      {gem.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Local Delicacies */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/55 shadow-sm">
            <h2 className="text-2xl font-light text-stone-900 tracking-tight mb-6 leading-tight">
              Signature <span className="font-normal italic text-[#10b981]">Local Gastronomy</span>
            </h2>
            <p className="text-sm font-light text-stone-500 leading-relaxed mb-6">
              Savor slow-cooked cuisines native to this high-altitude region, crafted using wild wood-harvested spices and handloom millets:
            </p>

            <div className="flex flex-wrap gap-3">
              {region.localDelicacies.map((food, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-stone-50 border border-stone-200/60 rounded-xl px-4 py-2.5">
                  <Coffee className="w-4 h-4 text-[#10b981]" />
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-widest leading-none">{food}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Regional Advisories & Packing Guide */}
        <div className="lg:col-span-5 lg:sticky lg:top-[90px] text-left">
          
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-250/50 shadow-sm space-y-6">
            
            <div>
              <span className="text-[8.5px] text-stone-400 uppercase tracking-[0.2em] font-bold block mb-1">Elevation Advisory</span>
              <h3 className="text-2xl font-light tracking-tight text-stone-900 mb-3">
                Advisory <span className="font-semibold text-[#10b981]">& Transit</span>
              </h3>
            </div>

            {/* Quick stats grid */}
            <div className="space-y-4 border-t border-stone-100 pt-5 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-500">Altitude Profile:</span>
                <span className="font-semibold text-stone-900">{region.elevation}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-stone-100/50">
                <span className="text-stone-500">Ideal Check-in:</span>
                <span className="font-semibold text-[#10b981]">{region.bestTime}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-stone-100/50">
                <span className="text-stone-500">Summer Averages:</span>
                <span className="font-semibold text-stone-900">{region.temperature.summer}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-stone-100/50">
                <span className="text-stone-500">Winter Averages:</span>
                <span className="font-semibold text-sky-600">{region.temperature.winter}</span>
              </div>
            </div>

            {/* Transit Block */}
            <div className="bg-stone-50 border border-stone-150 rounded-2xl p-4">
              <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-[#10b981]" /> Driving directions
              </span>
              <div className="text-xs space-y-1">
                <span className="block font-bold text-stone-850">Closest Transit Center:</span>
                <span className="block text-stone-500 font-light leading-relaxed">{region.closestHub.name}</span>
                <span className="block text-[#10b981] font-semibold mt-1">&bull; {region.closestHub.distance}</span>
              </div>
            </div>

            {/* Travel advisories */}
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4">
              <span className="block text-[8px] font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-500" /> High-Altitude Safety
              </span>
              <ul className="space-y-1.5 text-[11px] font-light text-stone-600 list-disc pl-4">
                <li>Carry heavy down jacket layers, windproof shells, and stout trekking shoes.</li>
                <li>Rest on Day 1 of check-in to acclimate to higher oxygen limits.</li>
                <li>Pre-register restricted high-permit coordinates through your native guide.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Stays (Baseras) Section */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-24 relative z-10 text-left">
        <div className="mb-10">
          <span className="text-[9px] font-bold tracking-[0.25em] text-[#10b981] uppercase mb-1 block">Local Sanctuaries</span>
          <h2 className="text-3xl font-light tracking-tight text-stone-900 leading-none">
            Signature Baseras in <span className="font-normal italic text-[#10b981]">{region.title}</span>
          </h2>
          <p className="text-xs font-light text-stone-500 mt-2 max-w-lg">
            Stay in gorgeous mud-and-stone cottages facing colossal snow ridges. Fully bundled with fireplaces, warm tea boxes, and dedicated stewards.
          </p>
        </div>

        {matchingProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingProperties.map((stay) => (
              <Link
                key={stay.id}
                href={`/properties/${stay.id}`}
                className="group flex flex-col bg-white rounded-[2rem] border border-stone-200/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
              >
                <div className="w-full h-48 sm:h-52 shrink-0 relative p-2.5 pb-0">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
                    <img 
                      src={stay.image} 
                      alt={stay.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    {stay.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1.5 bg-white/95 backdrop-blur-md text-[#10b981] text-[9.5px] font-bold rounded-lg shadow-sm border border-white/20">
                        {stay.badge}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                    <span>{stay.location}</span>
                    <span className="text-[#10b981]">&bull; {stay.rating} Rating</span>
                  </div>
                  
                  <h3 className="text-stone-900 group-hover:text-[#10b981] transition-colors font-semibold text-base mb-3 leading-snug line-clamp-1">
                    {stay.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-stone-600 mb-4 flex-wrap">
                    <span className="px-2 py-1 rounded bg-stone-50 border border-stone-150">{stay.guests} Guests</span>
                    <span className="px-2 py-1 rounded bg-stone-50 border border-stone-150">{stay.bedrooms} Beds</span>
                    <span className="px-2 py-1 rounded bg-stone-50 border border-stone-150">{stay.bathrooms} Baths</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-stone-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">Starting at</span>
                      <span className="font-bold text-stone-900">₹{stay.pricePerNight.toLocaleString('en-IN')}<span className="text-[10px] text-stone-400 font-medium font-sans">/night</span></span>
                    </div>
                    
                    <Button className="group/btn relative overflow-hidden bg-stone-950 hover:bg-[#10b981] text-white rounded-xl px-4 h-8 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md border-0 cursor-pointer">
                      <span>Reserve <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" /></span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 bg-white rounded-3xl border border-stone-150 text-center max-w-md mx-auto">
            <span className="text-stone-400 text-xs font-light block">Ch chalets are being seeded for this specific region.</span>
          </div>
        )}
      </div>

      {/* 4. Experiences (Packages) Section */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-24 relative z-10 text-left">
        <div className="mb-10">
          <span className="text-[9px] font-bold tracking-[0.25em] text-[#10b981] uppercase mb-1 block">Regional Journeys</span>
          <h2 className="text-3xl font-light tracking-tight text-stone-900 leading-none">
            Curated Expeditions in <span className="font-normal italic text-[#10b981]">{region.title}</span>
          </h2>
          <p className="text-xs font-light text-stone-500 mt-2 max-w-lg">
            Immersive high-altitude packages including native guiding expertise, all organic valley meals, private 4x4 chauffeured cars, and inner line permits.
          </p>
        </div>

        {matchingPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingPackages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.id}`}
                className="group flex flex-col bg-white rounded-[2rem] border border-stone-200/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
              >
                <div className="w-full h-48 sm:h-52 shrink-0 relative p-2.5 pb-0">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1.5 bg-white/95 backdrop-blur-md text-[#10b981] text-[9.5px] font-bold rounded-lg shadow-sm border border-white/20">
                      {pkg.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                    <span>{pkg.duration}</span>
                    <span className="text-[#10b981]">{pkg.difficulty}</span>
                  </div>

                  <h3 className="text-stone-900 group-hover:text-[#10b981] transition-colors font-semibold text-base mb-3 leading-snug line-clamp-1">
                    {pkg.title}
                  </h3>

                  <p className="text-[11px] font-light text-stone-500 leading-relaxed mb-4 line-clamp-2 h-[36px]">
                    {pkg.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {pkg.includes.map((inc, idx) => (
                      <span key={idx} className="text-[7.5px] font-bold bg-stone-50 border border-stone-150 rounded px-1.5 py-0.5 text-stone-500 uppercase tracking-wider">
                        {inc.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-stone-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold">Price per person</span>
                      <span className="font-bold text-stone-900">₹{pkg.price.toLocaleString('en-IN')}<span className="text-[10px] text-stone-400 font-medium"> starting</span></span>
                    </div>

                    <Button className="group/btn relative overflow-hidden bg-stone-950 hover:bg-[#10b981] text-white rounded-xl px-4 h-8 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md border-0 cursor-pointer">
                      <span>Reserve <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" /></span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 bg-white rounded-3xl border border-stone-150 text-center max-w-md mx-auto">
            <span className="text-stone-400 text-xs font-light block">Curating exclusive expeditions for this specific region.</span>
          </div>
        )}
      </div>

    </div>
  );
}
