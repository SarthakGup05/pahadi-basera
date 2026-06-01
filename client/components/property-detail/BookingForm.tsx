'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Shield, User, Mail, Phone, Users, MessageSquare,
  ChevronRight, Lock, Star, CheckCircle2, Loader2,
  ChevronDown, Plus, Minus, Baby, PawPrint,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PropertyItem } from '@/lib/propertiesData';

/* ─── Types ─── */
interface BookingFormProps {
  property: PropertyItem;
  totalAmount: number;
  nights: number;
  onSubmit?: (data: BookingFormData) => void;
  onClose?: () => void;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

/* ─── Stepper sub-component ─── */
interface GuestRowProps {
  icon: React.ReactNode;
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function GuestRow({ icon, label, sub, value, min, max, onChange }: GuestRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100/80 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-[#10b981] flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-[12px] font-bold text-gray-800 leading-tight">{label}</p>
          <p className="text-[10px] text-gray-400 leading-tight">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-emerald-400 hover:text-[#10b981] hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-3 h-3" strokeWidth={2.5} />
        </button>
        <span className="w-5 text-center text-sm font-bold text-gray-800 select-none tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-emerald-400 hover:text-[#10b981] hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-3 h-3" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Shared input classes ─── */
const baseInput =
  'w-full h-11 bg-gray-50/60 border border-gray-200 rounded-xl px-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:border-emerald-400 transition-all duration-200 outline-none';

/* ─── Helper: summarise guest counts ─── */
function guestSummary(g: GuestCounts): string {
  const parts: string[] = [];
  const people = g.adults + g.children;
  if (people > 0) parts.push(`${people} guest${people !== 1 ? 's' : ''}`);
  if (g.infants > 0) parts.push(`${g.infants} infant${g.infants !== 1 ? 's' : ''}`);
  if (g.pets > 0) parts.push(`${g.pets} pet${g.pets !== 1 ? 's' : ''}`);
  return parts.length ? parts.join(', ') : 'Add guests';
}

/* ─── Main component ─── */
export default function BookingForm({
  property,
  totalAmount,
  nights,
  onSubmit,
  onClose,
}: BookingFormProps) {
  /* Text fields */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  /* Guest counters */
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  /* Dropdown state */
  const [guestOpen, setGuestOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setGuestOpen(false);
      }
    }
    if (guestOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [guestOpen]);

  const totalPeople = guests.adults + guests.children;
  const maxPeople = property.maxGuests;
  const petsAllowed = property.petsAllowed;

  const setGuest = (key: keyof GuestCounts) => (value: number) => {
    setGuests((prev) => ({ ...prev, [key]: value }));
  };

  /* Form state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof formData & { guests: string }>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Valid email required';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10)
      e.phone = 'Valid phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    setIsSuccess(true);
    onSubmit?.({ ...formData, ...guests });
  };

  /* ── Success State ── */
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-1 shadow-inner">
          <CheckCircle2 className="w-8 h-8 text-[#10b981]" strokeWidth={1.8} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Reservation Requested! 🏔️
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
          We've received your booking request for{' '}
          <span className="font-semibold text-gray-700">{property.title}</span>. Our team will
          confirm within 2 hours via email.
        </p>
        <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-100 rounded-xl px-4 py-2.5 mt-2">
          <Shield className="w-4 h-4 text-[#10b981] flex-shrink-0" />
          <span className="text-[11px] font-semibold text-emerald-700">
            No payment taken yet — only charged after confirmation.
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-2 text-xs font-bold text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Back to property details
          </button>
        )}
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0" noValidate>
      {/* Header */}
      <div className="mb-5">
        <span className="block text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1">
          Complete Your Booking
        </span>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">
          Guest <span className="font-normal italic text-[#10b981]">Information</span>
        </h3>
      </div>

      {/* ★ You won't be charged banner ★ */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-2xl px-4 py-3 mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="w-8 h-8 rounded-full bg-white border border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-[#10b981]" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-emerald-700 leading-tight">
            You won't be charged yet
          </p>
          <p className="text-[10px] text-emerald-600/70 leading-tight mt-0.5">
            Payment is only collected after host confirmation
          </p>
        </div>
        {property.rating && (
          <div className="flex items-center gap-1 flex-shrink-0 bg-white/70 rounded-lg px-2 py-1 border border-emerald-100/60">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-bold text-gray-600">{property.rating}</span>
          </div>
        )}
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="booking-firstName"
            className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"
          >
            <User className="w-3 h-3" /> First Name
          </Label>
          <div className="relative">
            <Input
              id="booking-firstName"
              type="text"
              placeholder="Arjun"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`${baseInput} ${errors.firstName ? 'border-red-300 focus-visible:border-red-400 bg-red-50/20' : ''}`}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <span className="absolute -bottom-4 left-0 text-[10px] text-red-500 font-medium">
                {errors.firstName}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="booking-lastName"
            className="text-[10px] font-bold text-gray-500 uppercase tracking-wider"
          >
            Last Name
          </Label>
          <div className="relative">
            <Input
              id="booking-lastName"
              type="text"
              placeholder="Sharma"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={`${baseInput} ${errors.lastName ? 'border-red-300 focus-visible:border-red-400 bg-red-50/20' : ''}`}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <span className="absolute -bottom-4 left-0 text-[10px] text-red-500 font-medium">
                {errors.lastName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Guests Dropdown ── */}
      <div className="flex flex-col gap-1.5 mb-5" ref={dropdownRef}>
        <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Users className="w-3 h-3" /> Guests
        </Label>

        {/* Trigger */}
        <button
          type="button"
          id="booking-guests-trigger"
          onClick={() => setGuestOpen((o) => !o)}
          className={`w-full h-11 bg-gray-50/60 border rounded-xl px-4 flex items-center justify-between text-sm font-medium transition-all duration-200 cursor-pointer ${
            guestOpen
              ? 'border-emerald-400 ring-2 ring-emerald-400/30'
              : 'border-gray-200 hover:border-emerald-300'
          }`}
        >
          <span className={totalPeople === 0 ? 'text-gray-400' : 'text-gray-800'}>
            {guestSummary(guests)}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${guestOpen ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </button>

        {/* Dropdown panel */}
        <div
          className={`overflow-hidden transition-all duration-250 ease-in-out ${
            guestOpen ? 'max-h-[340px] opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-4 py-1">

            {/* Adults */}
            <GuestRow
              icon={<User className="w-4 h-4" />}
              label="Adults"
              sub="Ages 13 or above"
              value={guests.adults}
              min={1}
              max={maxPeople - guests.children}
              onChange={setGuest('adults')}
            />

            {/* Children */}
            <GuestRow
              icon={<Users className="w-4 h-4" />}
              label="Children"
              sub="Ages 2–12"
              value={guests.children}
              min={0}
              max={maxPeople - guests.adults}
              onChange={setGuest('children')}
            />

            {/* Infants */}
            <GuestRow
              icon={<Baby className="w-4 h-4" />}
              label="Infants"
              sub="Under 2 years"
              value={guests.infants}
              min={0}
              max={5}
              onChange={setGuest('infants')}
            />

            {/* Pets */}
            <GuestRow
              icon={<PawPrint className="w-4 h-4" />}
              label="Pets"
              sub={petsAllowed ? 'Welcome here!' : 'Not allowed at this property'}
              value={guests.pets}
              min={0}
              max={petsAllowed ? 3 : 0}
              onChange={setGuest('pets')}
            />

            {/* Capacity note */}
            <div className="flex items-center justify-between py-2.5 mt-0.5">
              <span className="text-[10px] text-gray-400 leading-snug">
                Max {maxPeople} guests · Infants & pets don't count toward limit
              </span>
              <button
                type="button"
                onClick={() => setGuestOpen(false)}
                className="text-[11px] font-bold text-[#10b981] hover:text-emerald-600 underline underline-offset-2 transition-colors cursor-pointer flex-shrink-0 ml-3"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5 mb-5">
        <Label
          htmlFor="booking-email"
          className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"
        >
          <Mail className="w-3 h-3" /> Email Address
        </Label>
        <div className="relative">
          <Input
            id="booking-email"
            type="email"
            placeholder="arjun@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`${baseInput} ${errors.email ? 'border-red-300 focus-visible:border-red-400 bg-red-50/20' : ''}`}
            autoComplete="email"
          />
          {errors.email && (
            <span className="absolute -bottom-4 left-0 text-[10px] text-red-500 font-medium">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      {/* Phone — full width */}
      <div className="flex flex-col gap-1.5 mb-5">
        <Label
          htmlFor="booking-phone"
          className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"
        >
          <Phone className="w-3 h-3" /> Phone Number
        </Label>
        <div className="relative">
          <Input
            id="booking-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`${baseInput} ${errors.phone ? 'border-red-300 focus-visible:border-red-400 bg-red-50/20' : ''}`}
            autoComplete="tel"
          />
          {errors.phone && (
            <span className="absolute -bottom-4 left-0 text-[10px] text-red-500 font-medium">
              {errors.phone}
            </span>
          )}
        </div>
      </div>

      {/* Special requests */}
      <div className="flex flex-col gap-1.5 mb-6">
        <Label
          htmlFor="booking-requests"
          className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"
        >
          <MessageSquare className="w-3 h-3" /> Special Requests{' '}
          <span className="text-gray-300 normal-case font-normal tracking-normal">(optional)</span>
        </Label>
        <Textarea
          id="booking-requests"
          placeholder="Dietary preferences, early check-in, accessibility needs, celebration arrangements..."
          value={formData.specialRequests}
          onChange={(e) => handleChange('specialRequests', e.target.value)}
          className="w-full min-h-[72px] bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:border-emerald-400 transition-all duration-200 outline-none resize-none"
          rows={3}
        />
      </div>

      <Separator className="mb-5 bg-gray-100" />

      {/* Price mini summary */}
      <div className="flex items-center justify-between mb-4 px-0.5">
        <div>
          <span className="text-xs font-bold text-gray-700">
            ₹{property.pricePerNight.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 font-normal"> / night</span>
          {nights > 0 && (
            <span className="text-xs text-gray-400 font-normal"> × {nights} nights</span>
          )}
        </div>
        <span className="text-base font-extrabold text-[#10b981]">
          ₹{totalAmount.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Submit CTA */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-13 rounded-2xl bg-zinc-900 hover:bg-[#10b981] text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all duration-500 border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Securing your stay...
          </>
        ) : (
          <>
            Request Reservation
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </>
        )}
      </Button>

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
          <Shield className="w-3 h-3 text-emerald-400" />
          Secure &amp; Encrypted
        </div>
        <div className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Free cancellation available
        </div>
      </div>
    </form>
  );
}
