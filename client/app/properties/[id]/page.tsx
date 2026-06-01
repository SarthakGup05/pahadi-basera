'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Banner from '@/components/ui/Banner';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

import { propertiesCatalog, PropertyItem } from '@/lib/propertiesData';

// Import our highly modular page-specific subcomponents
import PropertyGallery from '@/components/property-detail/PropertyGallery';
import LightboxModal from '@/components/property-detail/LightboxModal';
import PropertyDetailsCard from '@/components/property-detail/PropertyDetailsCard';
import AmenitiesSection from '@/components/property-detail/AmenitiesSection';
import GuidelinesSection from '@/components/property-detail/GuidelinesSection';
import ReviewsSection from '@/components/property-detail/ReviewsSection';
import BillingSection from '@/components/property-detail/BillingSection';

// Create a safe lookup Map from propertiesCatalog to mitigate security findings
const propertiesMap = new Map<string, PropertyItem>(
  Object.entries(propertiesCatalog)
);

// Detailed photo sets mapping per property ID to offer hyper-realistic visual fidelity and local context
const propertyGalleryMaps: Record<string, string[]> = {
  '1': [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop', // Oakwood front facade
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop', // Cozy chalet suite
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop', // Pine stone fireplace
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop', // Cozy deodar wood bedroom
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', // Luxurious slate bathroom
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop', // Mountain breakfast patio
    'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=800&auto=format&fit=crop'  // Forest stargazing deck
  ],
  '2': [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1920&auto=format&fit=crop', // Boho studio front
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop', // Bright boho living room
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', // Cozy tropical bedroom
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop', // Palm-fringed balcony
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=800&auto=format&fit=crop', // Minimalist design kitchen
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop', // Sunny shared pool
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'  // Sunlit reading nook
  ],
  '3': [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop', // Resort facade
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop', // Elite resort lobby
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop', // Panoramic glass lounge
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop', // Volumetric indoor pool
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop', // Premium massage spa
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop', // Fine dining restaurant
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop'  // Royal master suite
  ],
  '4': [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop', // Cabin facade
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop', // Pinewood double-height A-frame
    'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=800&auto=format&fit=crop', // Stone fireplace lounge
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop', // Rustic wood dining
    'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=800&auto=format&fit=crop', // Forest view loft bed
    'https://images.unsplash.com/photo-1526494770280-14fd43d7f6b3?q=80&w=800&auto=format&fit=crop', // Evening bonfire setting
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop'  // Sunrise balcony deck
  ],
  '5': [
    'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1920&auto=format&fit=crop', // Castle exterior
    'https://images.unsplash.com/photo-1590059132669-7f67aa64b8c6?q=80&w=800&auto=format&fit=crop', // Antique wooden courtyard
    'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=800&auto=format&fit=crop', // Royal carved wood door
    'https://images.unsplash.com/photo-1585983224974-084a8e065e76?q=80&w=800&auto=format&fit=crop', // Vintage corridor
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop', // Heritage bedroom suite
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop', // Stone carving details
    'https://images.unsplash.com/photo-1546412414-e1885261b952?q=80&w=800&auto=format&fit=crop'  // Historic fort exterior
  ],
  '6': [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1920&auto=format&fit=crop', // Orchard home
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop', // Blooming apple orchard
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=800&auto=format&fit=crop', // Mountain farm house porch
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop', // Warm family dining hall
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop', // Traditional attic bed
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop', // Wood fired clay oven
    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop'  // Rural deodar walking trail
  ],
  '7': [
    'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1920&auto=format&fit=crop', // Cottage riverside
    'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=800&auto=format&fit=crop', // Dreamy A-frame loft
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop', // Rushing river balcony
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop', // Outdoor hammock under pines
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', // Glass ceiling stargazing
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=800&auto=format&fit=crop', // Wood-scented micro kitchen
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop'  // Cozy rain view terrace
  ],
  '8': [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920&auto=format&fit=crop', // Guest house exterior
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop', // Sunlit clean bedroom
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop', // Shared rooftop café terrace
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop', // Simple mountain-view balcony
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', // Tidy modern bathroom
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop', // Tea & coffee counter
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'  // Green valley surroundings
  ],
  'tungnath-eco-glamp': [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1920&auto=format&fit=crop', // Glamping exterior
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop', // Geodesic dome interior
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop', // Snow peak sunset terrace
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop', // Warm indoor fireplace heater
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', // High-powered telescope setup
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', // Warm traditional dining pod
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop'  // Pristine meadow camp deck
  ],
  'panchachuli-stone-lodge': [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop', // Stone lodge
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', // Hand-crafted Kumaoni stone facade
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop', // Cozy stone fireplace room
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop', // Panoramic observatory glass deck
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop', // Traditional hand-woven blankets bedding
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop', // Organic herbal tea library lounge
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'  // Epic snow ridge mountain view
  ],
  'nanda-devi-ski-chalet': [
    'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1920&auto=format&fit=crop', // Ski chalet
    'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800&auto=format&fit=crop', // Snowbound wooden ski chalet
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', // Indoor warm cedar dry sauna
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop', // Volumetric alpine hot tub
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop', // Luxury bedroom under snow peaks
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop', // Hot cocoa fireplace lounge
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop'  // Spectacular ski slope view
  ],
  'trishul-heritage-homestead': [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1920&auto=format&fit=crop', // Heritage home front
    'https://images.unsplash.com/photo-1590059132669-7f67aa64b8c6?q=80&w=800&auto=format&fit=crop', // 80-year ancestral slate courtyard
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop', // Hand-carved deodar doors bedroom
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop', // Traditional clay stove kitchen
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop', // Mountain panorama yoga deck
    'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=800&auto=format&fit=crop', // Kumaoni organic tea gardens
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop'  // Warm local family welcome hall
  ]
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Resolve property or default to Oakwood (ID 1)
  const property = propertiesMap.get(id) || propertiesCatalog['1'];

  // Quotation States
  const [checkIn, setCheckIn] = useState('2026-06-01');
  const [checkOut, setCheckOut] = useState('2026-06-05');
  const [selectedServices, setSelectedServices] = useState<Map<string, boolean>>(new Map());
  const [quotation, setQuotation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Date Range Picker State initialized with default dates
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date('2026-06-01'),
    to: new Date('2026-06-05')
  });

  // Keep string checkIn/checkOut synchronized with dateRange picker selection
  useEffect(() => {
    if (dateRange?.from) {
      setCheckIn(format(dateRange.from, 'yyyy-MM-dd'));
    }
    if (dateRange?.to) {
      setCheckOut(format(dateRange.to, 'yyyy-MM-dd'));
    }
  }, [dateRange]);

  // Gallery Interactive State
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '/properties' },
    { label: property.location.split(',')[0], href: '/properties' },
    { label: property.title, isCurrent: true }
  ];

  // Resolve dynamic, property-specific photo gallery or fallback to Oakwood chalet gallery
  const resolvedImages = propertyGalleryMaps[property.id] || propertyGalleryMaps['1'];
  
  // Guarantee the first photo in the gallery is always the property's specific background cover image
  const galleryImages = [
    property.bgImage,
    ...resolvedImages.slice(1)
  ];

  // Mock Detailed Chronicles / Reviews from seasonal high-end mountain travelers
  const mockReviews = [
    {
      id: 1,
      author: 'Rohit Sharma',
      role: 'Alpinist & Writer',
      date: 'May 2026',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      comment: 'An absolute slice of heaven. The deodar wood fragrance inside the chalet, the cracking fireplace, and the colossal view of Nanda Devi peak at sunrise were spellbinding. The native chef prepared the most delicious traditional Kumaoni soybean soup.'
    },
    {
      id: 2,
      author: 'Anjali Verma',
      role: 'Slow Travel Enthusiast',
      date: 'April 2026',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      comment: 'Everything was immaculate. Self check-in was seamless, the heated mattresses made freezing alpine nights extremely cozy, and the telescope provided crystal clear ring views of Saturn under a zero-light pollution sky. Highly recommend the pine sauna!'
    },
    {
      id: 3,
      author: 'Kabir Mehta',
      role: 'Landscape Photographer',
      date: 'March 2026',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment: 'Stunning architecture. The blend of local slate stone-carving with modern panoramic glass windows is a masterpiece. The hospitality was incredibly warm. Rested perfectly on Day 1 to acclimate and enjoyed hiking along the organic tea trails.'
    }
  ];

  // Call dynamic backend quotation API
  const calculateQuote = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      setQuotation(null);
      return;
    }
    setIsLoading(true);
    try {
      // Compile selected services array
      const servicesPayload = Array.from(selectedServices.keys())
        .filter(key => selectedServices.get(key) === true)
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
        if (selectedServices.get(s.id) === true) {
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
    setSelectedServices(prev => {
      const next = new Map(prev);
      next.set(serviceId, !prev.get(serviceId));
      return next;
    });
  };

  return (
    <div className="bg-zinc-50 min-h-screen pb-24 font-sans text-gray-800 antialiased relative">
      
      {/* Cinematic Top Header */}
      <Banner
        title={property.title}
        subtitle={property.about}
        badge={property.badge || undefined}
        bgImage={property.bgImage}
        height="lg"
        overlayOpacity="medium"
        breadcrumbItems={breadcrumbs}
      >
        <Button 
          asChild 
          variant="outline" 
          className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-6 gap-2 transition-all duration-300 h-10 text-xs font-bold uppercase tracking-widest pointer-events-auto cursor-pointer"
        >
          <Link href="/properties">
            ← Return to catalog
          </Link>
        </Button>
      </Banner>

      {/* 2. PREMIUM SEAMLESS & RESPONSIVE GALLERY SECTION */}
      <PropertyGallery 
        property={property}
        galleryImages={galleryImages}
        onPhotoClick={setActivePhotoIdx}
      />

      {/* Main Container */}
      <div className="max-w-[1250px] mx-auto px-6 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Details & Features */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Stay Description Card */}
            <PropertyDetailsCard property={property} />

            {/* Premium Custom Amenities */}
            <AmenitiesSection property={property} />

            {/* Guidelines & Policies */}
            <GuidelinesSection property={property} />

            {/* delicate Property Reviews Component */}
            <ReviewsSection property={property} reviews={mockReviews} />

          </div>

          {/* Right Column: Dynamic Quotation & Booking Calculator Card */}
          <BillingSection 
            property={property}
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedServices={selectedServices}
            onToggleService={handleToggleService}
            quotation={quotation}
            isLoading={isLoading}
          />

        </div>
      </div>

      {/* 4. PREMIUM FULLSCREEN LIGHTBOX SLIDESHOW MODAL */}
      {activePhotoIdx !== null && (
        <LightboxModal 
          property={property}
          galleryImages={galleryImages}
          activePhotoIdx={activePhotoIdx}
          onClose={() => setActivePhotoIdx(null)}
          onPrev={() => setActivePhotoIdx(prev => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null))}
          onNext={() => setActivePhotoIdx(prev => (prev !== null ? (prev + 1) % galleryImages.length : null))}
          onThumbnailClick={setActivePhotoIdx}
        />
      )}

    </div>
  );
}
