'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PropertyItem } from '@/lib/propertiesData';
import BookingForm from './BookingForm';

interface BillingSectionProps {
  property: PropertyItem;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedServices: Map<string, boolean>;
  onToggleService: (id: string) => void;
  quotation: any;
  isLoading: boolean;
}

export default function BillingSection({
  property,
  dateRange,
  setDateRange,
  selectedServices,
  onToggleService,
  quotation,
  isLoading,
}: BillingSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="lg:col-span-5 sticky top-28 bg-white border border-gray-100 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] hover:border-emerald-100/50 transition-all duration-500 text-left overflow-hidden">

      {/* ── Sliding panel wrapper ── */}
      <div className="relative overflow-hidden">

        {/* Quotation panel */}
        <div
          className={`transition-all duration-300 ease-in-out p-6 sm:p-8 ${
            showForm ? 'opacity-0 pointer-events-none -translate-x-6 absolute inset-0' : 'opacity-100 translate-x-0'
          }`}
        >
          <span className="block text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1">
            Interactive Billing
          </span>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
            Experiential <span className="font-normal italic text-[#10b981]">Quotation</span>
          </h3>

          {/* Airbnb Style Popover Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="grid grid-cols-2 gap-0 border border-gray-200/80 rounded-2xl mb-6 overflow-hidden cursor-pointer hover:border-emerald-400 focus-within:border-emerald-400 transition-all bg-gray-50/30 shadow-sm divide-x divide-gray-200/70">
                <div className="flex flex-col px-4 py-3 text-left">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.15em] mb-1">
                    Check In
                  </span>
                  <span className="text-xs font-extrabold text-gray-800 tracking-wide">
                    {dateRange?.from ? format(dateRange.from, 'MMM dd, yyyy') : 'Select Date'}
                  </span>
                </div>
                <div className="flex flex-col px-4 py-3 text-left">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.15em] mb-1">
                    Check Out
                  </span>
                  <span className="text-xs font-extrabold text-gray-800 tracking-wide">
                    {dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : 'Select Date'}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-4 bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] z-[1000] overflow-hidden"
              align="end"
            >
              <ShadcnCalendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
                className="rounded-xl border-0 p-0"
              />
            </PopoverContent>
          </Popover>

          {/* Selected Services */}
          <div className="flex flex-col gap-3 mb-6">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Select Experiential Services
            </label>
            {property.services.map((service) => (
              <div
                key={service.id}
                onClick={() => onToggleService(service.id)}
                className={`flex items-center justify-between border rounded-xl p-3.5 cursor-pointer transition-all duration-300 ${
                  selectedServices.get(service.id) === true
                    ? 'border-[#10b981] bg-emerald-50/20 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      selectedServices.get(service.id) === true
                        ? 'bg-[#10b981] border-[#10b981] scale-105 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                        : 'bg-white border-gray-300 hover:border-emerald-400'
                    }`}
                  >
                    <svg
                      viewBox="0 0 12 10"
                      className={`w-3 h-3 transition-all duration-300 ${
                        selectedServices.get(service.id) === true
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-50'
                      }`}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="1.5,5.5 4.5,8.5 10.5,1.5" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-800">{service.label}</span>
                </div>
                <span className="text-xs font-extrabold text-gray-900">
                  ₹{service.pricePerUnit}
                </span>
              </div>
            ))}
          </div>

          {/* Calculation Breakdowns */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 border-t border-gray-100 pt-6">
              <div className="w-6 h-6 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Recalculating quote...
              </span>
            </div>
          ) : quotation ? (
            <div className="flex flex-col border-t border-gray-100 pt-6">
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
                <span>Est. GST / Tax (5%)</span>
                <span className="font-bold">₹{quotation.taxAmount}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider mb-2">
                <span>Subtotal without Taxes</span>
                <span className="font-medium">₹{quotation.totalWithoutTaxes}</span>
              </div>

              <div className="flex items-end justify-between mb-5">
                <div>
                  <span className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Total Booking Price
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Includes refundable deposit
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#10b981] leading-none">
                  ₹{quotation.totalWithTaxes}
                </span>
              </div>

              {/* "You won't be charged" inline note */}
              <div className="flex items-start gap-2 bg-emerald-50/60 border border-emerald-100/80 rounded-xl px-3.5 py-2.5 mb-4">
                <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 5.2v3.4M8 10.8h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <p className="text-[10px] leading-snug text-gray-500">
                  <span className="font-bold text-gray-700">You won't be charged yet.</span>{' '}
                  Payment is only collected after host confirms your reservation.
                </p>
              </div>

              {/* CTA to open booking form */}
              <Button
                onClick={() => setShowForm(true)}
                className="w-full rounded-2xl bg-zinc-900 hover:bg-[#10b981] text-white py-6 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all duration-500 border-0 h-13 cursor-pointer"
              >
                Continue to Book →
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center border-t border-gray-100 pt-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                Select stay dates in calendar above
                <br />
                to compile experiential quotation.
              </span>
            </div>
          )}
        </div>

        {/* Booking Form panel */}
        <div
          className={`transition-all duration-300 ease-in-out p-6 sm:p-8 ${
            showForm ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none translate-x-6 absolute inset-0'
          }`}
        >
          {/* Back button */}
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-700 uppercase tracking-widest mb-5 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Quotation
          </button>

          <BookingForm
            property={property}
            totalAmount={quotation?.totalWithTaxes ?? 0}
            nights={quotation?.nights ?? 0}
            onClose={() => setShowForm(false)}
          />
        </div>
      </div>
    </div>
  );
}
