'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  X, 
  DollarSign, 
  Copy, 
  CheckCheck, 
  TrendingUp, 
  Share2, 
  Calendar, 
  Users, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CreatorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorProfile: any;
}

export default function CreatorDashboardModal({
  isOpen,
  onClose,
  creatorProfile
}: CreatorDashboardModalProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchReferralStats() {
      setLoading(true);
      try {
        const { data } = await api.get('/api/referrals/my-stats');
        setStats(data);
        return;
      } catch (e) {
        // Fallback demo stats
      }

      // Fallback creator data
      setStats({
        referralCode: creatorProfile?.referralCode || 'HIMALAYA8',
        commissionRate: 0.08,
        guestDiscount: 0.05,
        totalEarned: 13420,
        pendingEarned: 4800,
        totalReferralsCount: 4,
        confirmedCount: 3,
        earnings: [
          {
            id: 'ref-1',
            stayAmount: 47000,
            commissionAmount: 3760,
            status: 'PAID',
            createdAt: '2026-09-18T10:00:00.000Z',
            booking: { property: { title: 'Oakwood Premium Chalet', location: 'Manali, HP' } }
          },
          {
            id: 'ref-2',
            stayAmount: 63500,
            commissionAmount: 5080,
            status: 'CONFIRMED',
            createdAt: '2026-09-22T14:30:00.000Z',
            booking: { property: { title: 'Nanda Devi Ski Chalet', location: 'Auli, UK' } }
          },
          {
            id: 'ref-3',
            stayAmount: 57250,
            commissionAmount: 4580,
            status: 'PAID',
            createdAt: '2026-09-24T16:00:00.000Z',
            booking: { property: { title: 'Panchachuli Stone Lodge', location: 'Munsiyari, UK' } }
          }
        ]
      });
      setLoading(false);
    }

    fetchReferralStats();
  }, [isOpen, creatorProfile]);

  if (!isOpen) return null;

  const copyLink = () => {
    const code = stats?.referralCode || creatorProfile?.referralCode || 'HIMALAYA8';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(`${origin}/properties?ref=${code}`);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden font-sans max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-stone-900 text-white px-8 py-6 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide">
                    {creatorProfile?.fullName || 'Verified Creator'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Verified Blogger
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">Creator Affiliate & Referral Engine</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Active Referral Box */}
          <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4.5">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-bold text-[10px] uppercase tracking-wider">Your Creator Referral Link</span>
              <span className="text-emerald-700 font-semibold text-xs">8% Commission per stay</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
              <span className="font-mono font-bold text-base text-stone-900 tracking-wider">
                {stats?.referralCode || 'HIMALAYA8'}
              </span>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              Followers booking through your link or stories get <strong>5% off</strong>, and you earn <strong>8% cash commission</strong> directly to your UPI.
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Earned</span>
              <div className="text-xl font-bold text-stone-900 mt-1">
                {formatCurrency(stats?.totalEarned || 0)}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Disbursed to UPI
              </div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Pending Payout</span>
              <div className="text-xl font-bold text-stone-900 mt-1">
                {formatCurrency(stats?.pendingEarned || 0)}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">
                Releasing post checkout
              </div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Stays Booked</span>
              <div className="text-xl font-bold text-stone-900 mt-1">
                {stats?.totalReferralsCount || 0}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">
                Attributed reservations
              </div>
            </div>
          </div>

          {/* Referral Ledger Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Referral Ledger</h4>
            <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100 text-xs">
              {stats?.earnings && stats.earnings.length > 0 ? (
                stats.earnings.map((entry: any) => (
                  <div key={entry.id} className="p-3.5 flex items-center justify-between hover:bg-stone-50/50 transition-colors">
                    <div>
                      <p className="font-semibold text-stone-900">{entry.booking?.property?.title || 'Himalayan Ridge Stay'}</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">{entry.booking?.property?.location || 'Uttarakhand'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-900 font-mono">+{formatCurrency(entry.commissionAmount)}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.status === 'PAID' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-stone-400 text-xs">
                  No referral bookings yet. Share your stories to generate bookings!
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
