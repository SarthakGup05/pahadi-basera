'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Bed, 
  Bath, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  ChefHat, 
  MapPin,
  Flame,
  Coffee,
  Sparkles,
  ArrowRight,
  Compass,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Banner from '@/components/ui/Banner';

// Mock data matching the properties and seeded items
const propertiesCatalog = {
  '1': {
    title: "Oakwood Premium Chalet",
    location: "Manali, Himachal Pradesh",
    pricePerNight: 8500,
    rating: "4.9",
    reviewsCount: 124,
    badge: "Best Seller",
    bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
    about: "Perched on a quiet cedar ridge in Manali, Uttarakhand. Features floor-to-ceiling wilderness views, a native stone fireplace, stargazing decks, and private slow gastronomy chef service.",
    space: "Experience glass-walled bedrooms looking straight onto snow-capped peaks, bohemian decor styled with handwoven local rugs, private balconies, and dedicated high-altitude heating systems.",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    securityDeposit: 3000,
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    selfCheckIn: "Self check-in with private secure lockbox",
    petsAllowed: true,
    smokingPolicy: "Balcony only, no indoor smoking",
    cancellationPolicy: "Super flexible - 100% refund up to 72 hours before check-in",
    amenities: [
      "High-speed Wi-Fi", 
      "Fireplace", 
      "Central Heating", 
      "Balcony w/ Mountain View", 
      "Local organic tea bar", 
      "Private stargazing telescope",
      "Organic toiletries",
      "Hair dryer",
      "Washing machine"
    ],
    services: [
      { id: 'chef', serviceType: 'LOCAL_CHEF', pricePerUnit: 2500, label: 'Private Gastronomy Chef (Per Day)' },
      { id: 'sauna', serviceType: 'FOREST_SAUNA', pricePerUnit: 1500, label: 'Forest Pine Sauna Session (Per Session)' },
      { id: 'guide', serviceType: 'NATIVE_GUIDE', pricePerUnit: 3500, label: 'Certified Alpine Trekking Guide (Per Day)' }
    ]
  }
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Resolve property or default to Oakwood (ID 1)
  const property = propertiesCatalog[id as keyof typeof propertiesCatalog] || propertiesCatalog['1'];

  // Quotation States
  const [checkIn, setCheckIn] = useState('2026-06-01');
  const [checkOut, setCheckOut] = useState('2026-06-05');
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>({});
  const [quotation, setQuotation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '#destinations' },
    { label: property.location.split(',')[0], href: '#location' },
    { label: property.title, isCurrent: true }
  ];

  // Call dynamic backend quotation API
  const calculateQuote = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Compile selected services array
      const servicesPayload = Object.keys(selectedServices)
        .filter(key => selectedServices[key])
        .map(key => ({
          serviceId: key,
          quantity: 1
        }));

      // Call Express backend endpoint
      const res = await fetch('http://localhost:5000/api/properties/calculate-quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId: id || '1',
          checkIn,
          checkOut,
          selectedServices: servicesPayload
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to compute price');
      }

      const data = await res.json();
      setQuotation(data);
    } catch (err: any) {
      // Fallback local calculations if backend is not running to ensure zero visual breakages
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const nights = Math.max(1, Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)));
      
      const baseStayCost = property.pricePerNight * nights;
      let servicesCost = 0;
      const servicesBreakdown: any[] = [];
      
      property.services.forEach(s => {
        if (selectedServices[s.id]) {
          servicesCost += s.pricePerUnit;
          servicesBreakdown.push({
            serviceType: s.serviceType,
            subtotal: s.pricePerUnit
          });
        }
      });

      const securityDeposit = property.securityDeposit;
      const taxableAmount = baseStayCost + servicesCost;
      const taxAmount = parseFloat((taxableAmount * 0.05).toFixed(2));
      const totalWithoutTaxes = taxableAmount + securityDeposit;
      const totalWithTaxes = totalWithoutTaxes + taxAmount;

      setQuotation({
        nights,
        baseStayCost,
        servicesCost,
        securityDeposit,
        taxAmount,
        totalWithoutTaxes,
        totalWithTaxes,
        servicesBreakdown
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateQuote();
  }, [checkIn, checkOut, selectedServices]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  return (
    <div className="bg-zinc-50 min-h-screen pb-20 font-sans text-gray-800">
      
      {/* Cinematic Top Header utilizing Style 1 */}
      <Banner
        title={property.title}
        subtitle={property.about}
        badge={property.badge}
        bgImage={property.bgImage}
        height="lg"
        overlayOpacity="medium"
        breadcrumbItems={breadcrumbs}
      >
        <Button 
          asChild 
          variant="outline" 
          className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-6 gap-2 transition-all duration-300 h-10 text-xs font-bold uppercase tracking-widest pointer-events-auto"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" /> Return to catalog
          </Link>
        </Button>
      </Banner>

      <div className="max-w-[1250px] mx-auto px-6 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Details & Features */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Stay Description Card */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#10b981]" /> The Basera Philosophy
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                {property.about}
              </p>
              
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3">Living Spaces</h3>
              <p className="text-gray-500 font-light leading-relaxed mb-6 text-xs sm:text-sm">
                {property.space}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
                  <Users className="w-5 h-5 text-[#10b981] mb-2" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Max Guests</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">{property.maxGuests} guests</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
                  <Bed className="w-5 h-5 text-[#10b981] mb-2" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Bedrooms</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">{property.bedrooms} beds</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
                  <Bath className="w-5 h-5 text-[#10b981] mb-2" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Bathrooms</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">{property.bathrooms} baths</span>
                </div>
              </div>
            </div>

            {/* Premium Custom Amenities */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 tracking-wide flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#10b981]" /> High-Altitude Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-medium bg-gray-50/60 hover:bg-emerald-50/30 border border-gray-100 hover:border-emerald-100/50 rounded-xl px-4 py-3 transition-colors duration-300">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" strokeWidth={2.5} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines & Policies */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#10b981]" /> House Guidelines & Policies
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
                  <div className="bg-emerald-50 border border-emerald-100 text-[#10b981] rounded-xl p-2.5 flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Check-In / Out Times</h4>
                    <p className="text-xs font-light text-gray-500 leading-relaxed">
                      Check-in is active after **{property.checkInTime}**. Standard checkout must conclude before **{property.checkOutTime}**.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
                  <div className="bg-emerald-50 border border-emerald-100 text-[#10b981] rounded-xl p-2.5 flex-shrink-0">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Self Check-In</h4>
                    <p className="text-xs font-light text-gray-500 leading-relaxed">{property.selfCheckIn}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
                  <div className="bg-emerald-50 border border-emerald-100 text-[#10b981] rounded-xl p-2.5 flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Pets & Smoking Policy</h4>
                    <p className="text-xs font-light text-gray-500 leading-relaxed font-semibold text-stone-600">
                      {property.petsAllowed ? "💚 Pets are warmly welcomed." : "🚫 Pets are not permitted."} | {property.smokingPolicy}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="bg-emerald-50 border border-emerald-100 text-[#10b981] rounded-xl p-2.5 flex-shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 tracking-wide">Cancellation & Refund Tier</h4>
                    <p className="text-xs font-light text-gray-500 leading-relaxed">{property.cancellationPolicy}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Quotation & Booking Calculator Card */}
          <div className="lg:col-span-5 sticky top-28 bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] hover:border-emerald-100/50 transition-all duration-500">
            <span className="block text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1">Interactive Billing</span>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
              Experiential <span className="font-normal italic text-[#10b981]">Quotation</span>
            </h3>

            {/* Inputs: Check In & Out */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col border border-gray-100 rounded-xl px-3 py-2 bg-gray-50/50">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check In</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent border-0 outline-0 p-0 text-xs font-bold text-gray-800"
                />
              </div>
              <div className="flex flex-col border border-gray-100 rounded-xl px-3 py-2 bg-gray-50/50">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check Out</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent border-0 outline-0 p-0 text-xs font-bold text-gray-800"
                />
              </div>
            </div>

            {/* Selected Services Counter */}
            <div className="flex flex-col gap-3 mb-6">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Experiential Services</label>
              {property.services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => handleToggleService(service.id)}
                  className={`flex items-center justify-between border rounded-xl p-3.5 cursor-pointer transition-all duration-300 ${
                    selectedServices[service.id]
                      ? 'border-[#10b981] bg-emerald-50/20 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      selectedServices[service.id] ? 'bg-[#10b981] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {service.id === 'chef' ? <ChefHat className="w-4 h-4" /> : service.id === 'sauna' ? <Flame className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-800">{service.label}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900">₹{service.pricePerUnit}</span>
                </div>
              ))}
            </div>

            {/* Calculation Breakdowns */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 border-t border-gray-100 pt-6">
                <div className="w-6 h-6 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recalculating quote...</span>
              </div>
            ) : quotation ? (
              <div className="flex flex-col border-t border-gray-100 pt-6 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-3">
                  <span>Base Stay ({quotation.nights} nights)</span>
                  <span className="font-bold text-gray-900">₹{quotation.baseStayCost}</span>
                </div>

                {quotation.servicesCost > 0 && (
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-3">
                    <span>Experiential Services Subtotal</span>
                    <span className="font-bold text-gray-900">₹{quotation.servicesCost}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-3">
                  <span>Refundable Damage Deposit</span>
                  <span className="font-bold text-gray-900">₹{quotation.securityDeposit}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-[#10b981] mb-5 pb-5 border-b border-gray-100">
                  <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Est. GST/Tax (5%)</span>
                  <span className="font-bold">₹{quotation.taxAmount}</span>
                </div>

                {/* Subtotal without taxes */}
                <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider mb-2">
                  <span>Subtotal without Taxes</span>
                  <span className="font-medium">₹{quotation.totalWithoutTaxes}</span>
                </div>

                {/* Total with taxes */}
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Total Booking Price</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Includes refundable deposit</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#10b981] leading-none">
                    ₹{quotation.totalWithTaxes}
                  </span>
                </div>

                {/* Proceed Checkout Trigger */}
                <Button 
                  onClick={() => alert(`🏔️ Proceeding to reservation checkout!\nGrand Total: ₹${quotation.totalWithTaxes}\nRefundable damage protection is secured.`)}
                  className="w-full rounded-2xl bg-zinc-900 hover:bg-[#10b981] text-white py-6 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all duration-500 border-0 h-13"
                >
                  Confirm Stay Reservation <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : null}

          </div>

        </div>
      </div>
    </div>
  );
}
