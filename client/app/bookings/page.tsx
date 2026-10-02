'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  Compass, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Receipt, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import api from '@/lib/api';
import { toast } from 'sonner';

interface BookingItem {
  id: string;
  checkIn: string;
  checkOut: string;
  guestsCount?: number;
  baseStayCost: number;
  servicesCost: number;
  securityDeposit: number;
  totalCost: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  createdAt: string;
  property?: {
    title: string;
    basePrice: number;
    securityDeposit: number;
    location: string;
    images?: { url: string }[];
  } | null;
  package?: {
    title: string;
    price: number;
    duration: string;
    location: string;
    image: string;
  } | null;
  selectedServices?: {
    service: {
      name: string;
      serviceType: string;
    };
    quantity: number;
    priceAtTime: number;
  }[];
}

export default function GuestBookingsPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoadingBookings(true);
      const { data } = await api.get('/api/bookings/my-bookings');
      setBookings(data || []);
    } catch (err: any) {
      console.error('Failed to load bookings:', err.message);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setIsLoadingBookings(false);
    }
  }, [isAuthenticated]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you wish to cancel this reservation?')) return;

    setCancellingId(bookingId);
    try {
      await api.put(`/api/bookings/cancel-booking/${bookingId}`, {
        cancellationReason: 'Cancelled by guest from portal'
      });
      toast.success('Reservation cancelled successfully.');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1 font-semibold text-[11px] px-2.5 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 flex items-center gap-1 font-semibold text-[11px] px-2.5 py-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Payment Pending
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1 font-semibold text-[11px] px-2.5 py-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge className="bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 flex items-center gap-1 font-semibold text-[11px] px-2.5 py-1">
            <Sparkles className="w-3.5 h-3.5 text-stone-500" /> Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-[#10b981] animate-spin mb-3" />
          <p className="text-xs uppercase font-bold tracking-widest text-stone-500">Checking explorer session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-1">
              <Link href="/" className="hover:text-stone-700 transition">Pahadi Basera</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-700 font-bold">My Trips & Stays</span>
            </div>
            <h1 className="text-3xl font-light text-stone-900 tracking-tight">
              Himalayan <span className="font-semibold text-[#10b981]">Journeys</span>
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">
              Track your confirmed homestay stays, trekking expedition bookings, payment receipts, and stay instructions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-xl text-xs border-stone-300 hover:bg-stone-100 font-bold uppercase tracking-wider">
              <Link href="/properties">
                Explore Stays <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
            <Button asChild className="rounded-xl text-xs bg-[#10b981] hover:bg-[#0e9f6e] text-white font-bold uppercase tracking-wider shadow-sm">
              <Link href="/packages">
                Explore Packages <Compass className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Unauthenticated View */}
        {!isAuthenticated ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#10b981]">
              <Compass className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Sign in to view your bookings</h2>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Log in to your Pahadi Basera explorer account to view upcoming mountain reservations, download invoices, and access host contact details.
            </p>
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="mt-6 rounded-xl bg-stone-900 hover:bg-[#10b981] text-white text-xs uppercase tracking-widest font-bold px-8 py-5 transition-all shadow-md cursor-pointer"
            >
              Sign In to Explorer Account
            </Button>
          </div>
        ) : isLoadingBookings ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#10b981] animate-spin mb-3" />
            <p className="text-xs text-stone-400 font-medium">Retrieving your reservations from the ledger...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-stone-50 border border-stone-200 rounded-3xl flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">No Reservations Yet</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
              You haven&apos;t booked any Himalayan baseras or expeditions yet. Discover secluded mud-houses, walnut orchards, and alpine camps across Uttarakhand and Himachal.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild className="rounded-xl bg-[#10b981] hover:bg-[#0e9f6e] text-white text-xs font-bold uppercase tracking-wider">
                <Link href="/properties">Find a Homestay</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isPackage = Boolean(booking.package);
              const title = isPackage ? booking.package?.title : booking.property?.title;
              const location = isPackage ? booking.package?.location : booking.property?.location;
              const imageUrl = isPackage 
                ? booking.package?.image 
                : (booking.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800');
              const bookingCode = `PB-${booking.id.slice(-6).toUpperCase()}`;

              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
                >
                  {/* Left Column: Image & Details */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
                    <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden relative bg-stone-100 shrink-0">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={title || 'Stay'}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        {isPackage ? 'Expedition' : 'Homestay'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          #{bookingCode}
                        </span>
                        {getStatusBadge(booking.status)}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                        {title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#10b981]" /> {location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {new Date(booking.checkIn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' '}&rarr;{' '}
                          {new Date(booking.checkOut).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {booking.guestsCount && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-stone-400" /> {booking.guestsCount} {booking.guestsCount === 1 ? 'Guest' : 'Guests'}
                          </span>
                        )}
                      </div>

                      {/* Selected Addon Services */}
                      {booking.selectedServices && booking.selectedServices.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Services:</span>
                          {booking.selectedServices.map((s, idx) => (
                            <span key={idx} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                              {s.service.name} (x{s.quantity})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Pricing & Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 gap-3">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Total Investment</p>
                      <p className="text-xl font-bold text-stone-900 tracking-tight">
                        ₹{booking.totalCost.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-stone-400 font-light">Taxes & fees included</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'PENDING' && (
                        <Button 
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          variant="outline" 
                          size="sm"
                          className="rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </Button>
                      )}

                      <Button 
                        asChild
                        variant="secondary" 
                        size="sm"
                        className="rounded-xl text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold"
                      >
                        <Link href={isPackage ? `/packages` : `/properties`}>
                          <Receipt className="w-3.5 h-3.5 mr-1 text-stone-500" /> View Details
                        </Link>
                      </Button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
