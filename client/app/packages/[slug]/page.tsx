'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Calendar,
  Users,
  Check,
  ShieldCheck,
  Plus,
  Minus,
  Compass,
  Tent,
  Coffee,
  Car,
  UtensilsCrossed
} from 'lucide-react';
import Banner from '@/components/ui/Banner';
import { Button } from '@/components/ui/button';
import { packagesList, PackageItem } from '@/lib/packagesData';

// Dynamic icon mapping helper
const getIconComponent = (name: string) => {
  switch (name) {
    case 'Car': return Car;
    case 'UtensilsCrossed': return UtensilsCrossed;
    case 'Tent': return Tent;
    case 'Guide': return Compass;
    case 'Sparkles': return Sparkles;
    case 'Coffee': return Coffee;
    default: return Compass;
  }
};

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [mounted, setMounted] = useState(false);
  const [pkg, setPkg] = useState<PackageItem | null>(null);

  // Booking Flow States
  const [travelers, setTravelers] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('2026-06-15');
  const [extraTransit, setExtraTransit] = useState(false);
  const [extraChef, setExtraChef] = useState(false);
  const [extraSpa, setExtraSpa] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [todayStr, setTodayStr] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const foundPkg = packagesList.find(p => p.id === slug);
    if (foundPkg) {
      setPkg(foundPkg);
    }

    // Determine today's date string for min date boundary
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setTodayStr(`${yyyy}-${mm}-${dd}`);
  }, [slug]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-dashed border-[#10b981] animate-spin" />
      </div>
    );
  }

  // 404 Fallback if package slug is invalid
  if (!pkg) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full border border-dashed border-rose-400 text-rose-500 flex items-center justify-center mb-6 bg-rose-50/50">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-light text-stone-900 tracking-tight mb-2">Expedition Not Found</h2>
        <p className="text-sm font-light text-stone-500 leading-relaxed mb-8 max-w-sm">
          We couldn't locate the mountain package matching the slug <span className="font-bold text-stone-950">"{slug}"</span>. Let's return to the active catalog!
        </p>
        <Button asChild className="rounded-xl bg-stone-900 hover:bg-[#10b981] text-white px-8 h-12 text-xs font-bold tracking-widest uppercase border-0 cursor-pointer">
          <Link href="/packages" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </Button>
      </div>
    );
  }

  // Quotation Calculations
  const baseCost = pkg.price * travelers;
  let servicesCost = 0;
  if (extraTransit) servicesCost += 2500 * pkg.durationDays;
  if (extraChef) servicesCost += 1500 * pkg.durationDays;
  if (extraSpa) servicesCost += 3000 * travelers;

  const subtotal = baseCost + servicesCost;
  const tax = Math.round(subtotal * 0.05); // 5% VAT / GST
  const securityDeposit = 5000; // Refundable tax-exempt deposit
  const grandTotal = subtotal + tax + securityDeposit;

  const quote = {
    base: baseCost,
    services: servicesCost,
    subtotal,
    tax,
    deposit: securityDeposit,
    grandTotal
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Packages', href: '/packages' },
    { label: pkg.title, isCurrent: true }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-stone-850 selection:bg-[#10b981]/20 selection:text-[#0e9f6e] relative overflow-hidden">
      
      {/* Cinematic Ambient Vector Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:48px_48px] opacity-40" />
        <div className="absolute top-[25%] -left-[10%] w-[700px] h-[700px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] -right-[15%] w-[650px] h-[650px] bg-blue-500/5 blur-[130px] rounded-full mix-blend-multiply" />
      </div>

      {/* 1. Cinematic Header Banner */}
      <div className="relative z-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
        <Banner
          title={pkg.title}
          subtitle={pkg.description}
          badge={pkg.badge}
          bgImage={pkg.image}
          height="lg"
          overlayOpacity="dark"
          breadcrumbItems={breadcrumbs}
        >
          <Button
            asChild
            variant="outline"
            className="group/back relative overflow-hidden rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 px-8 h-12 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-500 ease-out pointer-events-auto"
          >
            <Link href="/packages" className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover/back:-translate-x-1">
                <ArrowLeft className="w-3 h-3" />
              </div>
              <span className="relative z-10">Back to Catalog</span>
            </Link>
          </Button>
        </Banner>
      </div>

      {/* 2. Asymmetric Two-Column Content Grid */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Editorial Narrative, Inclusions & Itinerary (7 Columns) */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Section: Overview */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/55 shadow-sm text-left">
            <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Alpine Odyssey</span>
            </div>
            
            <h2 className="text-3xl font-light text-stone-900 tracking-tight mb-5 leading-tight">
              Expedition <span className="font-normal italic text-[#10b981]">Overview</span>
            </h2>
            
            <p className="text-base font-light text-stone-600 leading-relaxed mb-6">
              {pkg.longDescription}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Elevation Altitude</span>
                <span className="text-lg font-bold text-stone-900">{pkg.altitude}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Best Season to Visit</span>
                <span className="text-lg font-bold text-[#10b981]">{pkg.bestTime}</span>
              </div>
            </div>
          </div>

          {/* Section: Inclusions & Amenities Checklist */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/55 shadow-sm text-left">
            <h2 className="text-2xl font-light text-stone-900 tracking-tight mb-6 leading-tight">
              Bespoke <span className="font-normal italic text-[#10b981]">Amenities & Inclusions</span>
            </h2>

            {/* Inclusions Row */}
            <div className="flex flex-wrap gap-2 mb-6">
              {pkg.includes.map((inc, i) => {
                const IncIcon = getIconComponent(inc.iconName);
                return (
                  <div key={i} className="flex items-center gap-2 bg-stone-50 border border-stone-150 rounded-xl px-3.5 py-2">
                    <IncIcon className="w-4 h-4 text-[#10b981]" />
                    <span className="text-[10px] font-bold text-stone-700 uppercase tracking-widest">{inc.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-6">
              {pkg.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-stone-650">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#10b981]" strokeWidth={3} />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Multi-Day Itinerary Timeline */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/55 shadow-sm text-left relative overflow-hidden">
            <h2 className="text-2xl font-light text-stone-900 tracking-tight mb-8 leading-tight">
              The Slow Travel <span className="font-normal italic text-[#10b981]">Itinerary</span>
            </h2>

            {/* Vertical Timeline Container */}
            <div className="relative pl-6 sm:pl-8 border-l border-stone-200/80 space-y-8 py-2 ml-4">
              {pkg.itinerary.map((item) => (
                <div key={item.day} className="relative group text-left">
                  
                  {/* Glowing Node Dot */}
                  <div className="absolute left-[-38px] sm:left-[-46px] top-1 w-6 h-6 rounded-full bg-white border border-stone-200/80 flex items-center justify-center shadow-sm z-10 transition-colors duration-500 group-hover:border-[#10b981]">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300 transition-colors duration-500 group-hover:bg-[#10b981] group-hover:scale-110" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-[0.2em] mb-1">
                      Day 0{item.day}
                    </span>
                    <h4 className="text-lg font-semibold text-stone-900 mb-2 leading-tight group-hover:text-[#10b981] transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-light text-stone-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Static Sticky Booking Card & Pricing engine (5 Columns) */}
        <div className="lg:col-span-5 lg:sticky lg:top-[90px]">
          
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-stone-250/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.08)] transition-shadow duration-500 text-left">
            
            {bookingSuccess ? (
              /* Booking success screen */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#10b981] flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-inner">
                  <Check className="w-8 h-8" strokeWidth={3} />
                </div>
                
                <h3 className="text-3xl font-light tracking-tight text-stone-900 mb-2">Order Initiated!</h3>
                <p className="text-xs font-light text-stone-500 leading-relaxed mb-6 max-w-sm mx-auto">
                  A booking request for <span className="font-semibold text-stone-900">"{pkg.title}"</span> on <span className="font-semibold text-stone-900">{startDate}</span> for <span className="font-semibold text-stone-900">{travelers} {travelers === 1 ? 'guest' : 'guests'}</span> has been successfully logged. Sourced native operators are preparing your chalet.
                </p>

                <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 text-left max-w-xs mx-auto mb-8">
                  <span className="block text-[8.5px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#10b981]" /> High Altitude Receipt
                  </span>
                  <div className="flex justify-between text-xs mb-1 text-stone-600">
                    <span>Base Fare ({travelers} pp):</span>
                    <span className="font-semibold text-stone-850">₹{quote.base.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1 text-stone-600">
                    <span>Accessory Additions:</span>
                    <span className="font-semibold text-stone-850">₹{quote.services.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1 text-stone-600 border-b border-stone-200/50 pb-2">
                    <span>GST Tourist Tax (5%):</span>
                    <span className="font-semibold text-stone-850">₹{quote.tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs font-bold text-stone-900">Paid Total:</span>
                    <span className="text-base font-bold text-[#10b981]">₹{quote.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="block text-[7.5px] text-stone-400 mt-1 text-center font-medium">*Includes ₹{quote.deposit.toLocaleString('en-IN')} Refundable Deposit</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => { setBookingSuccess(false); }}
                    className="rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold tracking-widest text-[10px] uppercase h-11 cursor-pointer w-full"
                  >
                    Adjust Booking
                  </Button>
                  
                  <Button
                    onClick={() => { router.push('/packages'); }}
                    className="rounded-xl bg-stone-900 hover:bg-[#10b981] text-white font-bold tracking-widest text-[10px] uppercase h-11 border-0 cursor-pointer w-full"
                  >
                    Explore Other Chalets
                  </Button>
                </div>
              </div>
            ) : (
              /* Quotation Calculator Form */
              <form onSubmit={(e) => { e.preventDefault(); setBookingSuccess(true); }} className="space-y-6">
                
                {/* Section Header */}
                <div>
                  <span className="text-[8.5px] text-stone-400 uppercase tracking-[0.2em] font-bold block mb-1">Instant Pricing</span>
                  <div className="flex justify-between items-baseline">
                    <div className="text-stone-900 flex items-baseline gap-0.5">
                      <span className="font-bold text-3xl leading-none">₹{pkg.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">/pp</span>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#10b981]" /> {pkg.duration}
                    </span>
                  </div>
                </div>

                {/* Form Elements */}
                <div className="space-y-4 border-t border-stone-100 pt-5">
                  
                  {/* Select Date */}
                  <div className="flex flex-col">
                    <label className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#10b981]" /> Target Check-in Date
                    </label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={todayStr}
                      required
                      className="border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-850 bg-stone-50 focus:border-[#10b981] outline-none transition w-full"
                    />
                  </div>

                  {/* Traveler incrementor */}
                  <div className="flex flex-col">
                    <label className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#10b981]" /> Number of Guests
                    </label>
                    <div className="flex items-center justify-between border border-stone-200 bg-stone-50 rounded-xl px-4 h-[38px] select-none">
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        disabled={travelers <= 1}
                        className="text-stone-500 hover:text-[#10b981] disabled:opacity-30 border-0 bg-transparent p-0 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                      </button>
                      <span className="text-xs font-bold text-stone-900 tabular-nums">{travelers}</span>
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.min(pkg.maxGuests, travelers + 1))}
                        disabled={travelers >= pkg.maxGuests}
                        className="text-stone-500 hover:text-[#10b981] disabled:opacity-30 border-0 bg-transparent p-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accessory Options Checklist */}
                <div className="bg-stone-50 border border-stone-150 rounded-2xl p-4">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#10b981]" /> Premium Upgrades
                  </span>
                  
                  <div className="space-y-3">
                    {/* Private Transit option */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={extraTransit}
                        onChange={() => setExtraTransit(!extraTransit)}
                        className="mt-0.5 accent-[#10b981] rounded cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-stone-800">4x4 Mountain Chauffeur</span>
                        <span className="block text-[8.5px] text-stone-400">Transit transfers &bull; ₹2,500/day</span>
                      </div>
                    </label>

                    {/* Local chef option */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none border-t border-stone-200/50 pt-2.5">
                      <input 
                        type="checkbox" 
                        checked={extraChef}
                        onChange={() => setExtraChef(!extraChef)}
                        className="mt-0.5 accent-[#10b981] rounded cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-stone-800">Traditional Chef slow food</span>
                        <span className="block text-[8.5px] text-stone-400">Gastronomy stove fires &bull; ₹1,500/day</span>
                      </div>
                    </label>

                    {/* Sauna / Spa wellness */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none border-t border-stone-200/50 pt-2.5">
                      <input 
                        type="checkbox" 
                        checked={extraSpa}
                        onChange={() => setExtraSpa(!extraSpa)}
                        className="mt-0.5 accent-[#10b981] rounded cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-stone-800">Himalayan Herbal Spa Session</span>
                        <span className="block text-[8.5px] text-stone-400">Therapeutic hot pool &bull; ₹3,000/person</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Quotation Receipt Invoice */}
                <div className="border-t border-stone-150 pt-4 space-y-2">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Quotation Invoice</span>
                  
                  <div className="flex justify-between text-xs font-light text-stone-500">
                    <span>Base package stay (x{travelers})</span>
                    <span className="font-semibold text-stone-800">₹{quote.base.toLocaleString('en-IN')}</span>
                  </div>

                  {quote.services > 0 && (
                    <div className="flex justify-between text-xs font-light text-stone-500">
                      <span>Accessory Services</span>
                      <span className="font-semibold text-stone-800">₹{quote.services.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-light text-stone-500">
                    <span className="flex items-center gap-1">
                      5% VAT/GST Tax
                      <span className="group relative cursor-pointer text-stone-400 hover:text-stone-900 transition-colors">
                        <Info className="w-3.5 h-3.5 animate-pulse" />
                        <span className="absolute bottom-[100%] right-[-10px] w-48 bg-stone-900 text-white rounded-lg p-2 text-[9px] leading-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none mb-1 shadow-md z-30">
                          Mandated tourist tax applied on taxable accommodations + custom accessories.
                        </span>
                      </span>
                    </span>
                    <span className="font-semibold text-stone-800">₹{quote.tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-xs font-light text-stone-500 border-b border-stone-150 pb-2.5">
                    <span className="flex items-center gap-1">
                      Refundable Security Deposit
                      <span className="group relative cursor-pointer text-stone-400 hover:text-stone-900 transition-colors">
                        <Info className="w-3.5 h-3.5" />
                        <span className="absolute bottom-[100%] right-[-10px] w-48 bg-stone-900 text-white rounded-lg p-2 text-[9px] leading-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none mb-1 shadow-md z-30">
                          100% refunded to you within 24 hours of check-out. Tax-exempt!
                        </span>
                      </span>
                    </span>
                    <span className="font-semibold text-stone-800">₹{quote.deposit.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3">
                    <span className="text-sm font-bold text-stone-900 font-sans">Paid Grand Total</span>
                    <div className="text-right flex flex-col">
                      <span className="text-2xl font-bold text-[#10b981]">₹{quote.grandTotal.toLocaleString('en-IN')}</span>
                      <span className="text-[8px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">Includes security deposit</span>
                    </div>
                  </div>
                </div>

                {/* Action Reserve Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-stone-950 hover:bg-[#10b981] text-white rounded-xl font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-1.5 border-0 shadow-lg hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  Reserve Chalet
                </Button>
              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
