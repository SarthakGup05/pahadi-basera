'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  MapPin, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Coffee, 
  Tent, 
  Compass as GuideIcon, 
  Car, 
  UtensilsCrossed,
  Info,
  Calendar,
  Users,
  Check,
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { packagesList, PackageItem } from '@/lib/packagesData';

// Dynamic icon mapping helper
const getIconComponent = (name: string) => {
  switch (name) {
    case 'Car': return Car;
    case 'UtensilsCrossed': return UtensilsCrossed;
    case 'Tent': return Tent;
    case 'Guide': return GuideIcon;
    case 'Sparkles': return Sparkles;
    case 'Coffee': return Coffee;
    default: return GuideIcon;
  }
};


interface PackageGridProps {
  region: string;
  duration: string;
  guests: number;
  difficulty: string;
  vibe: string;
  onReset: () => void;
}

export default function PackageGrid({
  region,
  duration,
  guests,
  difficulty,
  vibe,
  onReset
}: PackageGridProps) {
  // Booking Dialog states
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [travelers, setTravelers] = useState<number>(Math.max(1, guests));
  const [startDate, setStartDate] = useState<string>('2026-06-15');
  
  // Premium Extras Checklist
  const [extraTransit, setExtraTransit] = useState(false);
  const [extraChef, setExtraChef] = useState(false);
  const [extraSpa, setExtraSpa] = useState(false);
  
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Dynamic Filtering Logic
  const filteredPackages = packagesList.filter(pkg => {
    // 1. Region match
    if (region !== 'All' && pkg.region !== region) return false;

    // 2. Duration match
    if (duration !== 'Any') {
      const days = pkg.durationDays;
      if (duration === 'Short' && days > 4) return false;
      if (duration === 'Medium' && (days < 5 || days > 6)) return false;
      if (duration === 'Long' && days < 7) return false;
    }

    // 3. Guests capacity limit
    if (guests > pkg.maxGuests) return false;

    // 4. Difficulty level match
    if (difficulty !== 'All' && pkg.difficulty !== difficulty) return false;

    // 5. Vibe match
    if (vibe !== 'All' && pkg.vibe !== vibe) return false;

    return true;
  });

  const openBookingModal = (pkg: PackageItem) => {
    setSelectedPkg(pkg);
    setTravelers(Math.max(guests, 1));
    setExtraTransit(false);
    setExtraChef(false);
    setExtraSpa(false);
    setBookingSuccess(false);
  };

  // Quotation Math - Synchronized with the backend architecture!
  const calculateQuotation = () => {
    if (!selectedPkg) return { base: 0, services: 0, subtotal: 0, tax: 0, deposit: 0, grandTotal: 0 };
    
    // Multiplied base package cost based on travelers
    const baseCost = selectedPkg.price * travelers;
    
    // Add extra optional services subtotals
    let servicesCost = 0;
    if (extraTransit) servicesCost += 2500 * selectedPkg.durationDays; // ₹2,500/day
    if (extraChef) servicesCost += 1500 * selectedPkg.durationDays; // ₹1,500/day
    if (extraSpa) servicesCost += 3000 * travelers; // ₹3,000 per person flat
    
    const subtotal = baseCost + servicesCost;
    
    // 5% VAT / GST only on taxable items (base stay + services)
    const tax = Math.round(subtotal * 0.05);
    
    // Refundable Security Deposit remains strictly tax-exempt!
    const securityDeposit = 5000; 
    
    const grandTotal = subtotal + tax + securityDeposit;
    
    return {
      base: baseCost,
      services: servicesCost,
      subtotal,
      tax,
      deposit: securityDeposit,
      grandTotal
    };
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const quote = calculateQuotation();

  return (
    <div className="w-full relative z-20 font-sans mt-12">
      {/* 1. Showing results count or custom fallback */}
      <div className="max-w-[1250px] mx-auto px-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm font-light text-stone-500">
          Showing <span className="font-bold text-stone-900">{filteredPackages.length}</span> signature mountain expeditions
        </p>
        
        {(region !== 'All' || duration !== 'Any' || difficulty !== 'All' || vibe !== 'All' || guests > 1) && (
          <button
            onClick={onReset}
            className="text-[10px] font-bold tracking-widest uppercase text-[#10b981] hover:text-[#0e9f6e] border border-[#10b981]/30 hover:border-[#10b981] bg-emerald-50/10 px-4 py-1.5 rounded-full transition-all cursor-pointer self-start sm:self-auto"
          >
            Clear Active Filters
          </button>
        )}
      </div>

      {/* 2. Grid items */}
      {filteredPackages.length > 0 ? (
        <div className="max-w-[1250px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <Link 
              key={pkg.id}
              href={`/packages/${pkg.id}`}
              className="group flex flex-col bg-white rounded-[2rem] border border-stone-200/50 overflow-hidden shadow-[0_8px_30px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.12)] hover:-translate-y-2 hover:border-emerald-100/60 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer relative"
            >
              {/* Card Top Image & badging */}
              <div className="relative aspect-[16/10] p-2.5 pb-0">
                <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden shadow-sm">
                  
                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
                  
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transform-gpu transition-transform duration-[8000ms] ease-out group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-[#10b981] text-[8px] font-bold tracking-widest uppercase rounded-lg shadow-sm border border-white/20 transition-transform duration-500 group-hover:scale-105">
                      {pkg.badge}
                    </span>
                    <span className="text-[8px] font-bold tracking-widest text-white/70 bg-black/30 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                      {pkg.num}
                    </span>
                  </div>

                  {/* Frosted Glass location block */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 bg-white/12 backdrop-blur-md border border-white/25 rounded-xl p-2.5 transform-gpu transition-transform duration-500">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-white text-[10px] font-semibold tracking-wide drop-shadow-md">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {pkg.location}
                      </span>
                      {pkg.altitude && (
                        <span className="text-[8px] font-bold text-emerald-300 uppercase tracking-widest">
                          {pkg.altitude} Alt
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Content Card detail */}
              <div className="p-4 sm:p-4.5 flex flex-col flex-1 bg-gradient-to-b from-white to-stone-50/30">
                {/* Duration & Difficulty */}
                <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider text-stone-400 mb-2.5 border-b border-stone-100 pb-2">
                  <span className="flex items-center gap-1 text-stone-500">
                    <Clock className="w-3 h-3 text-[#10b981]" />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600 group-hover:bg-[#10b981]/10 group-hover:text-[#0e9f6e] transition-colors duration-300">
                    <Flame className="w-3 h-3" />
                    {pkg.difficulty}
                  </span>
                </div>

                {/* Vibe and Title */}
                <span className="text-[8px] font-bold tracking-widest text-[#10b981] uppercase mb-1 block">
                  {pkg.vibe} EXPEDITION
                </span>
                <h3 className="text-stone-900 group-hover:text-[#10b981] transition-colors duration-300 font-semibold text-base sm:text-lg leading-snug mb-1.5 line-clamp-2">
                  {pkg.title}
                </h3>

                <p className="text-[11px] font-light text-stone-500 leading-relaxed mb-3 line-clamp-3">
                  {pkg.description}
                </p>

                {/* Inclusions capsules */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {pkg.includes.map((inc, i) => {
                    const IncIcon = getIconComponent(inc.iconName);
                    return (
                      <div 
                        key={i} 
                        className="flex items-center gap-1 bg-stone-50 border border-stone-150/60 rounded-md px-1.5 py-0.5 group-hover:border-emerald-100 group-hover:bg-emerald-50/20 transition-colors duration-300"
                      >
                        <IncIcon className="w-2.5 h-2.5 text-[#10b981]" />
                        <span className="text-[7.5px] font-bold text-stone-600 uppercase tracking-widest">{inc.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Amenities checklists */}
                <div className="flex flex-col gap-1.5 mb-4 border-t border-stone-100 pt-3">
                  {pkg.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-medium text-stone-600">
                      <CheckCircle2 className="w-3 h-3 text-[#10b981] flex-shrink-0" strokeWidth={2.5} />
                      <span className="group-hover:text-stone-900 transition-colors duration-300">{amenity}</span>
                    </div>
                  ))}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Card footer details */}
                <div className="flex items-center justify-between pt-3.5 border-t border-stone-100 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-stone-400 uppercase tracking-widest font-bold mb-0.5 animate-pulse">Starting at</span>
                    <div className="text-stone-900 flex items-baseline gap-0.5">
                      <span className="font-bold text-lg sm:text-xl leading-none">₹{pkg.price.toLocaleString('en-IN')}</span>
                      <span className="text-[8px] text-stone-500 font-bold uppercase tracking-widest">/pp</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="group/btn relative overflow-hidden bg-stone-950 hover:bg-[#10b981] text-white rounded-xl px-4 h-9 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-md hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition-all duration-500 hover:-translate-y-0.5 border-0 cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      Reserve 
                      <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty filtration screen */
        <div className="max-w-[550px] mx-auto px-6 py-20 text-center bg-white/60 border border-stone-200/50 rounded-[3rem] shadow-sm backdrop-blur-md">
          <div className="w-16 h-16 rounded-full border border-dashed border-[#10b981] text-[#10b981] flex items-center justify-center mx-auto mb-6 bg-emerald-50/30">
            <Info className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-light text-stone-900 tracking-tight mb-2">No Expedition Matches</h3>
          <p className="text-xs font-light text-stone-500 leading-relaxed mb-6 max-w-sm mx-auto">
            We couldn't find any experiential packages matching your selected region, duration, or guest criteria. Let's try broadening your search parameters!
          </p>
          <Button
            onClick={onReset}
            className="rounded-full bg-stone-900 hover:bg-[#10b981] text-white px-8 h-12 text-[10px] font-bold tracking-widest uppercase border-0 cursor-pointer shadow-md hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)] transition-all"
          >
            Reset All Filters
          </Button>
        </div>
      )}

      {/* 3. Global Premium Booking Dialog */}
      <Dialog open={selectedPkg !== null} onOpenChange={() => setSelectedPkg(null)}>
        <DialogContent className="max-w-[95%] sm:max-w-[520px] rounded-[2.5rem] border border-stone-150 p-6 sm:p-8 bg-white/98 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.18)] text-stone-800 font-sans z-[999] overflow-y-auto max-h-[90vh]">
          {bookingSuccess ? (
            /* Thank you page block inside modal */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#10b981] flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-inner">
                <Check className="w-8 h-8" strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-light tracking-tight text-stone-900 mb-2">Reservation Initiated!</h3>
              <p className="text-xs font-light text-stone-500 leading-relaxed mb-6 max-w-sm mx-auto">
                Excellent! A booking request for <span className="font-bold text-stone-900">"{selectedPkg?.title}"</span> on <span className="font-bold text-stone-900">{startDate}</span> for <span className="font-bold text-stone-900">{travelers} {travelers === 1 ? 'guest' : 'guests'}</span> has been registered. Our pricing engine calculated a quotation of <span className="font-bold text-[#10b981]">₹{quote.grandTotal.toLocaleString('en-IN')}</span>.
              </p>
              
              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 text-left max-w-xs mx-auto mb-8">
                <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#10b981]" /> Next Steps
                </span>
                <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
                  Our native host in <span className="font-semibold text-stone-800">{selectedPkg?.location}</span> will verify cottage availability and coordinate with the local transit operator. You will receive an SMS and email notification with your booking receipt.
                </p>
              </div>

              <Button
                onClick={() => setSelectedPkg(null)}
                className="rounded-xl bg-stone-900 hover:bg-[#10b981] text-white px-8 h-11 text-[10px] font-bold tracking-widest uppercase border-0 cursor-pointer w-full"
              >
                Close Window
              </Button>
            </div>
          ) : (
            /* Main Quotation Builder Form */
            <>
              <DialogHeader className="text-left border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-[#10b981] text-[8px] font-bold uppercase tracking-widest rounded-md border border-emerald-500/20">
                    {selectedPkg?.badge}
                  </span>
                  <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">
                    {selectedPkg?.region} Expedition
                  </span>
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-light text-stone-900 tracking-tight leading-tight">
                  Reserve {selectedPkg?.title}
                </DialogTitle>
                <DialogDescription className="text-xs font-light text-stone-500 leading-normal mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
                  {selectedPkg?.location} &bull; {selectedPkg?.duration}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleBookSubmit} className="space-y-5 mt-5">
                {/* 1. Guest and Date Form Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Select Date
                    </label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-850 bg-stone-50 focus:border-[#10b981] outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Travelers
                    </label>
                    <div className="flex items-center justify-between border border-stone-200 bg-stone-50 rounded-xl px-3 h-[38px] select-none">
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        disabled={travelers <= 1}
                        className="text-stone-500 hover:text-[#10b981] disabled:opacity-30 border-0 bg-transparent p-0 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-stone-900 tabular-nums">{travelers}</span>
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.min(selectedPkg?.maxGuests || 6, travelers + 1))}
                        disabled={travelers >= (selectedPkg?.maxGuests || 6)}
                        className="text-stone-500 hover:text-[#10b981] disabled:opacity-30 border-0 bg-transparent p-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Maximum capacity alert */}
                {selectedPkg && travelers >= selectedPkg.maxGuests && (
                  <p className="text-[9px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-2 leading-relaxed">
                    Note: Maximum local lodge capacity is {selectedPkg.maxGuests} travelers.
                  </p>
                )}

                {/* 2. Premium Services Checklist Additions */}
                <div className="bg-stone-50 border border-stone-150/60 rounded-2xl p-4">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#10b981]" /> Add Premium Services
                  </span>
                  
                  <div className="space-y-2.5">
                    {/* Native Chauffeur */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={extraTransit}
                        onChange={() => setExtraTransit(!extraTransit)}
                        className="mt-0.5 accent-[#10b981] rounded cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-stone-800">Private 4x4 Chauffeur Transit</span>
                        <span className="block text-[9px] text-stone-400">Premium door-to-door mountain travel &bull; ₹2,500/day</span>
                      </div>
                    </label>

                    {/* Local chef gastronomy */}
                    <label className="flex items-start gap-3 cursor-pointer select-none border-t border-stone-200/50 pt-2.5">
                      <input 
                        type="checkbox" 
                        checked={extraChef}
                        onChange={() => setExtraChef(!extraChef)}
                        className="mt-0.5 accent-[#10b981] rounded cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-stone-800">Local Chef Gastronomy Homestead</span>
                        <span className="block text-[9px] text-stone-400">Exclusive traditional wood-fire dining experiences &bull; ₹1,500/day</span>
                      </div>
                    </label>

                    {/* Sauna / Spa wellness */}
                    <label className="flex items-start gap-3 cursor-pointer select-none border-t border-stone-200/50 pt-2.5">
                      <input 
                        type="checkbox" 
                        checked={extraSpa}
                        onChange={() => setExtraSpa(!extraSpa)}
                        className="mt-0.5 accent-[#10b981] rounded cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-stone-800">Mountain Wellness Spa & Sauna</span>
                        <span className="block text-[9px] text-stone-400">Traditional Himalayan herbal hot pools & massage session &bull; ₹3,000/person</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 3. Interactive Pricing Quotation Receipt */}
                <div className="border-t border-stone-150 pt-4 space-y-2">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-2">Quotation Receipt Breakdown</span>
                  
                  <div className="flex justify-between text-xs font-light text-stone-500">
                    <span>Base package stay (₹{selectedPkg?.price.toLocaleString('en-IN')} x {travelers})</span>
                    <span className="font-semibold text-stone-800">₹{quote.base.toLocaleString('en-IN')}</span>
                  </div>

                  {quote.services > 0 && (
                    <div className="flex justify-between text-xs font-light text-stone-500">
                      <span>Premium custom services</span>
                      <span className="font-semibold text-stone-800">₹{quote.services.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-light text-stone-500">
                    <span className="flex items-center gap-1">
                      5% VAT/GST Tax
                      <span className="group relative cursor-pointer text-stone-400 hover:text-stone-900 transition-colors">
                        <Info className="w-3.5 h-3.5" />
                        <span className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-48 bg-stone-900 text-white rounded-lg p-2 text-[9px] leading-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none mb-1 shadow-md">
                          Government mandated tourist service tax applied to taxable services.
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
                        <span className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-48 bg-stone-900 text-white rounded-lg p-2 text-[9px] leading-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none mb-1 shadow-md">
                          Fully refunded to the traveler post-checkout, tax-exempt!
                        </span>
                      </span>
                    </span>
                    <span className="font-semibold text-stone-800">₹{quote.deposit.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-sm font-bold text-stone-900">Total Price Summary</span>
                    <div className="text-right flex flex-col">
                      <span className="text-xl sm:text-2xl font-bold text-[#10b981]">₹{quote.grandTotal.toLocaleString('en-IN')}</span>
                      <span className="text-[8px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">including GST + deposit</span>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-3 flex sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedPkg(null)}
                    className="rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50 h-11 text-[10px] font-bold tracking-widest uppercase flex-1 border cursor-pointer"
                  >
                    Cancel Selection
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-[#10b981] hover:bg-[#0e9f6e] text-white h-11 text-[10px] font-bold tracking-widest uppercase flex-1 border-0 cursor-pointer shadow-md hover:shadow-[0_8px_20px_rgba(16,185,129,0.39)]"
                  >
                    Confirm Reservation
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
