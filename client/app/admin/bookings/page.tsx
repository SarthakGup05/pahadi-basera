'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  User, 
  MapPin,
  RefreshCw,
  Search,
  Loader2,
  FileSpreadsheet,
  Receipt,
  UserCheck,
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/api';

interface BookingService {
  id: string;
  priceAtTime: number;
  quantity: number;
  service: {
    serviceType: string;
    label: string;
  };
}

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  baseStayCost: number;
  servicesCost: number;
  securityDeposit: number;
  totalCost: number;
  status: string;
  createdAt: string;
  guest: { email: string; phoneNumber: string };
  property: { title: string; location: string };
  selectedServices: BookingService[];
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Selected booking for detailed invoice dialog
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/api/admin/bookings');
      setBookings(data);
    } catch (err: any) {
      toast.error(err.message || 'Error loading bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/admin/bookings/${id}/status`, { status: newStatus });

      // Update state locally
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getNights = (checkIn: string, checkOut: string) => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">BOOKINGS LEDGER</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Control transaction states & invoices ledger</p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search property, guest email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-gray-200/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-9 text-xs transition-all font-sans"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          <Button 
            variant="outline" 
            onClick={fetchBookings}
            className="rounded-xl border-gray-200 bg-[#fcfbf9] hover:bg-gray-50 text-gray-600 gap-1.5 font-bold text-xs uppercase tracking-wider py-4 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Ledger Table Card */}
      <Card className="bg-white border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Loading Ledger Data...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-24 text-center">
              <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-1">No bookings recorded</h3>
              <p className="text-gray-400 text-[10px]">No reservation parameters match this search query.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider pl-6 py-4">Dwelling Stay</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Guest Info</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Stay Dates</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Grand Total</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Invoice</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider py-4">Status State</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase text-gray-400 tracking-wider pr-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((b) => (
                  <TableRow key={b.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                    {/* Stay details */}
                    <TableCell className="pl-6 py-4 font-bold text-gray-900 text-xs">
                      <div>{b.property.title}</div>
                      <div className="flex items-center gap-1 text-[9px] font-medium text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{b.property.location}</span>
                      </div>
                    </TableCell>

                    {/* Guest info */}
                    <TableCell className="py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5 font-mono font-medium">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{b.guest.email}</span>
                      </div>
                      <div className="text-[9px] text-gray-400 mt-1 font-sans">{b.guest.phoneNumber}</div>
                    </TableCell>

                    {/* Dates */}
                    <TableCell className="py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{formatDate(b.checkIn)} - {formatDate(b.checkOut)}</span>
                      </div>
                      <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                        {getNights(b.checkIn, b.checkOut)} Nights stay
                      </div>
                    </TableCell>

                    {/* Total cost */}
                    <TableCell className="py-4 text-xs">
                      <div className="font-extrabold text-gray-900">{formatCurrency(b.totalCost)}</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">including GST and deposit</div>
                    </TableCell>

                    {/* Receipt Details Toggle */}
                    <TableCell className="py-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedBooking(b);
                          setIsInvoiceOpen(true);
                        }}
                        className="rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider gap-1 h-8 px-2 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" /> Invoice
                      </Button>
                    </TableCell>

                    {/* Status badge */}
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center border rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase select-none ${getStatusClass(b.status)}`}>
                        {b.status}
                      </span>
                    </TableCell>

                    {/* Quick status actions */}
                    <TableCell className="pr-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Confirm Button */}
                        {b.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === b.id}
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                            title="Confirm Booking"
                          >
                            {updatingId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                        )}
                        
                        {/* Complete Button */}
                        {b.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === b.id}
                            onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                            title="Mark Stay Completed"
                          >
                            {updatingId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                        )}

                        {/* Cancel Button */}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === b.id}
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-100 rounded-lg p-1.5 h-8 w-8 cursor-pointer"
                            title="Cancel Booking"
                          >
                            {updatingId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          </Button>
                        )}

                        {/* Fully Processed indicator */}
                        {(b.status === 'COMPLETED' || b.status === 'CANCELLED') && (
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mr-2 select-none">Archived</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details Dialog Modal */}
      {selectedBooking && (
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
          <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 font-sans">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <DialogTitle className="text-base font-extrabold tracking-wider text-gray-900 uppercase flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" /> STAY INVOICE SUMMARY
              </DialogTitle>
              <DialogDescription className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Booking ID: {selectedBooking.id}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-gray-800 text-xs">
              {/* Core Information */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                <div>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400 block">Dwelling</span>
                  <span className="font-bold text-gray-900">{selectedBooking.property.title}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400 block">Guest Profile</span>
                  <span className="font-medium truncate block">{selectedBooking.guest.email}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400 block mt-2">Nights booked</span>
                  <span className="font-extrabold text-emerald-700">{getNights(selectedBooking.checkIn, selectedBooking.checkOut)} Nights</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400 block mt-2">Registration Status</span>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-900 block">{selectedBooking.status}</span>
                </div>
              </div>

              {/* Financial Breakdowns */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400">Line Items breakdown</h4>
                
                {/* Base Stay */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500">Base Stay Cost ({getNights(selectedBooking.checkIn, selectedBooking.checkOut)} nights)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(selectedBooking.baseStayCost)}</span>
                </div>

                {/* Selected Addons */}
                {selectedBooking.selectedServices && selectedBooking.selectedServices.length > 0 ? (
                  selectedBooking.selectedServices.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-1 border-t border-gray-100/50">
                      <span className="text-gray-500 pl-2">↳ {item.service.label || item.service.serviceType} (qty: {item.quantity})</span>
                      <span className="font-medium text-gray-700">{formatCurrency(item.priceAtTime * item.quantity)}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center py-1 text-gray-400 italic">
                    <span>No service add-ons selected</span>
                    <span>—</span>
                  </div>
                )}

                {/* Refundable Security Deposit */}
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-500">Refundable Damage Deposit</span>
                  <span className="font-bold text-gray-900">{formatCurrency(selectedBooking.securityDeposit)}</span>
                </div>

                {/* Subtotals & Taxes */}
                <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4 mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-emerald-800">
                    <span>Taxable Value (Stay + Services):</span>
                    <span className="font-bold">{formatCurrency(selectedBooking.baseStayCost + selectedBooking.servicesCost)}</span>
                  </div>
                  
                  {/* GST (5% of stay + services) */}
                  <div className="flex justify-between text-xs text-emerald-800">
                    <span>5% Tourist VAT / GST:</span>
                    <span className="font-bold">{formatCurrency((selectedBooking.baseStayCost + selectedBooking.servicesCost) * 0.05)}</span>
                  </div>

                  <div className="flex justify-between text-xs text-emerald-800">
                    <span>Refundable Deposit (Tax Exempt):</span>
                    <span className="font-bold">{formatCurrency(selectedBooking.securityDeposit)}</span>
                  </div>

                  {/* Grand total */}
                  <div className="flex justify-between text-sm font-black text-emerald-950 pt-2 border-t border-emerald-200/50">
                    <span className="uppercase tracking-wide">Grand Total:</span>
                    <span>{formatCurrency(selectedBooking.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Close */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <Button 
                onClick={() => setIsInvoiceOpen(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest px-6 rounded-xl cursor-pointer"
              >
                Close Receipt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
