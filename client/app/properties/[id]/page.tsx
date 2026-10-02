'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Banner from '@/components/ui/Banner';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';

import { PropertyItem } from '@/lib/propertiesData';
import api from '@/lib/api';

// Import modular page-specific subcomponents
import PropertyGallery from '@/components/property-detail/PropertyGallery';
import LightboxModal from '@/components/property-detail/LightboxModal';
import PropertyDetailsCard from '@/components/property-detail/PropertyDetailsCard';
import AmenitiesSection from '@/components/property-detail/AmenitiesSection';
import GuidelinesSection from '@/components/property-detail/GuidelinesSection';
import ReviewsSection from '@/components/property-detail/ReviewsSection';
import BillingSection from '@/components/property-detail/BillingSection';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [property, setProperty] = useState<PropertyItem | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Quotation States initialized to dynamic future dates
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = new Date();
    from.setDate(from.getDate() + 7);
    const to = new Date();
    to.setDate(to.getDate() + 11);
    return { from, to };
  });
  const [checkIn, setCheckIn] = useState<string>(() => {
    const from = new Date();
    from.setDate(from.getDate() + 7);
    return format(from, 'yyyy-MM-dd');
  });
  const [checkOut, setCheckOut] = useState<string>(() => {
    const to = new Date();
    to.setDate(to.getDate() + 11);
    return format(to, 'yyyy-MM-dd');
  });
  const [selectedServices, setSelectedServices] = useState<Map<string, boolean>>(new Map());
  const [quotation, setQuotation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch property dynamically from backend
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setPageLoading(true);
      try {
        const { data } = await api.get(`/api/properties/get-property/${id}`);
        if (data) {
          const rawImages: string[] = Array.isArray(data.images)
            ? data.images.map((img: any) => (typeof img === 'string' ? img : img.url)).filter(Boolean)
            : [];

          const defaultImg = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop';
          const primaryImg = rawImages[0] || data.bgImage || defaultImg;

          const mappedProperty: PropertyItem = {
            id: data.id,
            title: data.title || 'Himalayan Retreat',
            location: data.location || 'Uttarakhand, India',
            tag: data.tag || 'Handcrafted Retreat',
            tagVariant: data.tagVariant || 'green',
            pricePerNight: Number(data.pricePerNight || data.basePrice || 4500),
            rating: Number(data.rating) || 4.9,
            reviewsCount: Array.isArray(data.reviews) ? data.reviews.length : Number(data.reviewsCount) || 0,
            maxGuests: Number(data.maxGuests || data.guests) || 4,
            guests: Number(data.guests) || 2,
            bedrooms: Number(data.bedrooms) || 1,
            bathrooms: Number(data.bathrooms) || 1,
            images: rawImages.length > 0 ? rawImages : [primaryImg],
            bgImage: primaryImg,
            about: data.about || data.description?.slice(0, 150) || 'Scenic sanctuary nestled in the serene high Himalayas.',
            description: data.description || '',
            shortDescription: data.shortDescription || data.description?.slice(0, 120) || '',
            hostName: data.hostName || 'Local Host',
            hostBio: data.hostBio || 'Native Himalayan resident welcoming mindful travellers.',
            hostPhone: data.hostPhone || '+91 98765 43210',
            hostEmail: data.hostEmail || 'host@pahadibasera.com',
            hostAvatar: data.hostAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            hostResponseTime: data.hostResponseTime || 'Within 2 hours',
            checkInTime: data.checkInTime || data.checkIn || '02:00 PM',
            checkOutTime: data.checkOutTime || data.checkOut || '11:00 AM',
            checkIn: data.checkInTime || data.checkIn || '02:00 PM',
            checkOut: data.checkOutTime || data.checkOut || '11:00 AM',
            selfCheckIn: data.selfCheckIn || 'Self check-in available',
            petsAllowed: data.petsAllowed || false,
            smokingPolicy: data.smokingPolicy || 'Designated outdoor zones only',
            cancellationPolicy: data.cancellationPolicy || 'Flexible 48-hour cancellation policy',
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            altitude: Number(data.altitude) || 2200,
            type: data.type || 'COTTAGE',
            services: Array.isArray(data.services) ? data.services : []
          };
          setProperty(mappedProperty);

          // Map real DB reviews if present
          if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews.map((r: any, idx: number) => ({
              id: r.id || idx + 1,
              author: r.user?.fullName || r.userName || 'Verified Explorer',
              role: 'Mountain Traveler',
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
              rating: Number(r.rating) || 5,
              avatar: r.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              comment: r.comment || r.content || 'Exceptional experience in the lap of nature.'
            })));
          } else {
            setReviews([]);
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        setNotFound(true);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

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

  // Call dynamic backend quotation API
  const calculateQuote = async () => {
    if (!property || !dateRange?.from || !dateRange?.to) {
      setQuotation(null);
      return;
    }
    setIsLoading(true);
    try {
      const servicesPayload = Array.from(selectedServices.keys())
        .filter(key => selectedServices.get(key) === true)
        .map(key => ({
          serviceId: key,
          quantity: 1
        }));

      const { data } = await api.post('/api/properties/calculate-quotation', {
        propertyId: id,
        checkIn,
        checkOut,
        selectedServices: servicesPayload
      });

      setQuotation(data);
    } catch (err: any) {
      // Local fallback calculation based on fetched property details
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const nights = Math.max(1, Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)));
      
      const baseStayCost = (property.pricePerNight || 4500) * nights;
      let servicesCost = 0;
      const servicesBreakdown: any[] = [];
      
      (property.services || []).forEach((s: any) => {
        if (selectedServices.get(s.id) === true) {
          const unitPrice = Number(s.pricePerUnit) || 0;
          servicesCost += unitPrice;
          servicesBreakdown.push({
            serviceType: s.serviceType || 'Service',
            subtotal: unitPrice
          });
        }
      });

      const securityDeposit = property.securityDeposit || 0;
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
    if (property) {
      calculateQuote();
    }
  }, [checkIn, checkOut, selectedServices, property]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const next = new Map(prev);
      next.set(serviceId, !prev.get(serviceId));
      return next;
    });
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider uppercase text-gray-500">Loading Sanctuary...</p>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Homestay Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          The property you requested does not exist or may have been unlisted.
        </p>
        <Button asChild className="rounded-full bg-zinc-900 hover:bg-emerald-600 text-white px-6">
          <Link href="/properties">Return to Properties</Link>
        </Button>
      </div>
    );
  }

  // Dynamic Breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '/properties' },
    { label: property.location.split(',')[0], href: '/properties' },
    { label: property.title, isCurrent: true }
  ];

  const galleryImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.bgImage || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop'];

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

            {/* Property Reviews Component */}
            <ReviewsSection property={property} reviews={reviews} />

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
