'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mountain, 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Tag, 
  Users, 
  FileText, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Award, 
  DollarSign, 
  Search, 
  AlertCircle,
  Copy,
  CheckCheck,
  CheckCircle2,
  Ban,
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { toast } from 'sonner';

interface PendingCreator {
  id: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  socialProfile?: string;
  aadhaarNumber?: string;
  digilockerVerified?: boolean;
  kycStatus: string;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
}

interface OnboardedCreator {
  id: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  socialProfile?: string;
  role: string;
  kycStatus: string;
  kycVerifiedAt?: string;
  referralCode?: string;
  commissionRate: number;
  upiId?: string;
  totalEarnings: number;
  pendingBalance: number;
  createdAt: string;
  _count?: {
    blogPosts: number;
    referralEarnings: number;
  };
}

interface CreatorDispatch {
  id: string;
  title: string;
  excerpt: string;
  altitude: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorId?: string;
  isVerifiedCreator: boolean;
  likesCount: number;
  taggedPropertyId?: string;
  createdAt: string;
  images: string[];
  tags: string[];
  authorUser?: {
    id: string;
    fullName?: string;
    email: string;
    referralCode?: string;
    role: string;
  };
}

export default function AdminCreatorsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'onboarded' | 'content'>('pending');
  const [pendingList, setPendingList] = useState<PendingCreator[]>([]);
  const [onboardedList, setOnboardedList] = useState<OnboardedCreator[]>([]);
  const [contentList, setContentList] = useState<CreatorDispatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load all creator data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pendingRes, onboardedRes, contentRes] = await Promise.allSettled([
        api.get('/api/admin/creators/pending'),
        api.get('/api/admin/creators/onboarded'),
        api.get('/api/admin/creators/content')
      ]);

      if (pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value.data)) {
        setPendingList(pendingRes.value.data);
      }
      if (onboardedRes.status === 'fulfilled' && Array.isArray(onboardedRes.value.data)) {
        setOnboardedList(onboardedRes.value.data);
      }
      if (contentRes.status === 'fulfilled' && Array.isArray(contentRes.value.data)) {
        setContentList(contentRes.value.data);
      }
    } catch (err: any) {
      console.error('Failed to load creator data:', err);
      toast.error('Failed to refresh creator records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Super Admin: Approve Onboarding
  const handleApprove = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      const { data } = await api.post(`/api/admin/creators/${id}/approve`);
      toast.success(data.message || `Approved ${name} for creator onboarding!`);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to approve creator');
    } finally {
      setProcessingId(null);
    }
  };

  // Super Admin: Reject Application
  const handleReject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to reject ${name}'s creator onboarding application?`)) return;
    setProcessingId(id);
    try {
      const { data } = await api.post(`/api/admin/creators/${id}/reject`, { reason: 'Eligibility criteria not met' });
      toast.success(data.message || `Application for ${name} rejected.`);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  // Super Admin: Revoke / Toggle Role
  const handleToggleRole = async (id: string, currentRole: string, name: string) => {
    const nextRole = currentRole === 'BLOGGER' ? 'GUEST' : 'BLOGGER';
    const actionLabel = nextRole === 'BLOGGER' ? 'reinstate creator privileges for' : 'revoke creator privileges from';
    if (!confirm(`Are you sure you want to ${actionLabel} ${name}?`)) return;

    setProcessingId(id);
    try {
      const { data } = await api.put(`/api/admin/creators/${id}/role`, { role: nextRole });
      toast.success(data.message || `Creator status updated for ${name}`);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update creator role');
    } finally {
      setProcessingId(null);
    }
  };

  // Super Admin: Delete Dispatch
  const handleDeleteDispatch = async (id: string, title: string) => {
    if (!confirm(`Delete dispatch "${title}" from the Himalayan Journal?`)) return;
    setProcessingId(id);
    try {
      await api.delete(`/api/admin/creators/content/${id}`);
      toast.success('Dispatch removed from journal.');
      setContentList(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete dispatch');
    } finally {
      setProcessingId(null);
    }
  };

  // Super Admin: Toggle Verified/Featured on dispatch
  const handleToggleVerifiedDispatch = async (id: string) => {
    setProcessingId(id);
    try {
      const { data } = await api.put(`/api/admin/creators/content/${id}/toggle-verified`);
      toast.success(data.message);
      setContentList(prev => prev.map(c => c.id === id ? { ...c, isVerifiedCreator: data.post?.isVerifiedCreator } : c));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update dispatch status');
    } finally {
      setProcessingId(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Referral code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered views
  const filteredPending = pendingList.filter(p => 
    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.socialProfile?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOnboarded = onboardedList.filter(c => 
    c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.referralCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContent = contentList.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 rounded-3xl border border-stone-200/90 dark:border-[#262626] shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
              Super Admin Authority
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2.5">
            <Mountain className="w-6 h-6 text-emerald-600" />
            Himalayan Creators & Content Studio
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light mt-1">
            Manage creator onboarding applications, approve DigiLocker credentials, and moderate field notes & dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={loadData}
            variant="outline"
            disabled={isLoading}
            className="rounded-full border-stone-200 dark:border-[#262626] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222222] text-xs font-semibold px-4 h-9 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Records
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Pending Queue Tile */}
        <div 
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 ring-2 ring-amber-400/30 shadow-xs'
              : 'bg-white dark:bg-[#121212] border-stone-200/90 dark:border-[#262626] hover:border-amber-200 dark:hover:border-amber-900/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Approvals
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
              Needs Review
            </span>
          </div>
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-3">
            {pendingList.length}
          </p>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-light block mt-1">
            Awaiting Super Admin onboarding approval
          </span>
        </div>

        {/* Onboarded Creators Tile */}
        <div 
          onClick={() => setActiveTab('onboarded')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'onboarded'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 ring-2 ring-emerald-400/30 shadow-xs'
              : 'bg-white dark:bg-[#121212] border-stone-200/90 dark:border-[#262626] hover:border-emerald-200 dark:hover:border-emerald-900/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Active Creators
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900">
              Verified
            </span>
          </div>
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-3">
            {onboardedList.length}
          </p>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-light block mt-1">
            Mountain Guild Chroniclers with active referral codes
          </span>
        </div>

        {/* Content Moderation Tile */}
        <div 
          onClick={() => setActiveTab('content')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-stone-100 dark:bg-[#202020]/80 border-stone-400 dark:border-stone-600 ring-2 ring-stone-400/20 shadow-xs'
              : 'bg-white dark:bg-[#121212] border-stone-200/90 dark:border-[#262626] hover:border-stone-300 dark:hover:border-stone-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-stone-600" />
              Dispatches & Notes
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-200 text-stone-800">
              Live Feed
            </span>
          </div>
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-3">
            {contentList.length}
          </p>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-light block mt-1">
            Himalayan slow-travel dispatches published
          </span>
        </div>

      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl border border-stone-200/90 dark:border-[#262626] p-5 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-[#262626] pb-4">
          
          {/* Tab Selector */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#222222]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Applications ({pendingList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('onboarded')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'onboarded'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#222222]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Onboarded Creators ({onboardedList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'content'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#222222]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Content Moderation ({contentList.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by name, handle, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 h-9 border-stone-200 dark:border-[#262626] rounded-xl bg-stone-50/50 dark:bg-[#161616]/80 text-stone-900 dark:text-stone-100"
            />
          </div>

        </div>

        {/* TAB 1: Pending Applications Approval Queue */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span>Super Admin approval is required before creators can publish or access their referral code.</span>
              <span>{filteredPending.length} application(s)</span>
            </div>

            {filteredPending.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-stone-200 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-stone-900">Application Queue Clean</h4>
                <p className="text-xs text-stone-500 font-light mt-1">
                  All creator onboarding submissions have been reviewed and resolved.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredPending.map((applicant) => (
                  <div 
                    key={applicant.id}
                    className="p-5 bg-[#fafaf7] dark:bg-[#0a0a0a]/70 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all hover:border-amber-300 dark:hover:border-amber-700/60"
                  >
                    {/* Applicant Information */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-sm shrink-0">
                        {applicant.fullName ? applicant.fullName.slice(0, 2).toUpperCase() : 'AP'}
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                            {applicant.fullName}
                          </h4>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            Awaiting Super Admin Approval
                          </span>
                          {applicant.digilockerVerified && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#10b981]" /> DigiLocker Verified
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-300">
                          <span>📧 {applicant.email}</span>
                          {applicant.phoneNumber && <span>📞 {applicant.phoneNumber}</span>}
                          {applicant.socialProfile && (
                            <span className="font-mono text-emerald-700 font-semibold">
                              📱 {applicant.socialProfile}
                            </span>
                          )}
                          {applicant.aadhaarNumber && (
                            <span className="font-mono text-stone-500">
                              🆔 {applicant.aadhaarNumber}
                            </span>
                          )}
                        </div>

                        {applicant.bio && (
                          <p className="text-xs text-stone-600 dark:text-stone-300 font-light line-clamp-2 pt-1">
                            &ldquo;{applicant.bio}&rdquo;
                          </p>
                        )}

                        {applicant.upiId && (
                          <div className="text-[11px] text-stone-500 pt-0.5">
                            Payout VPA: <strong className="font-mono text-stone-700">{applicant.upiId}</strong> (8% commission terms)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Super Admin Action Controls */}
                    <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-200">
                      <Button
                        onClick={() => handleReject(applicant.id, applicant.fullName)}
                        disabled={processingId === applicant.id}
                        variant="outline"
                        className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold px-4 h-10 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>

                      <Button
                        onClick={() => handleApprove(applicant.id, applicant.fullName)}
                        disabled={processingId === applicant.id}
                        className="rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white text-xs font-bold px-6 h-10 shadow-sm cursor-pointer transition-all"
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5 stroke-[3]" />
                        {processingId === applicant.id ? 'Approving...' : 'Approve Onboarding'}
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Onboarded Creators Directory */}
        {activeTab === 'onboarded' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span>Verified Creators authorized to post dispatches and earn 8% referral rewards.</span>
              <span>{filteredOnboarded.length} active creator(s)</span>
            </div>

            {filteredOnboarded.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-stone-200 rounded-2xl">
                <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-stone-900">No active creators found</h4>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Approve applicants in the pending queue to onboard them into the Mountain Guild.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-[#262626]">
                <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
                  <thead className="bg-[#fafaf7] dark:bg-[#161616]/80 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200 dark:border-[#262626]">
                    <tr>
                      <th className="py-3.5 px-4">Creator Identity</th>
                      <th className="py-3.5 px-4">Referral Code</th>
                      <th className="py-3.5 px-4">Role & Guild Tier</th>
                      <th className="py-3.5 px-4">Dispatches</th>
                      <th className="py-3.5 px-4">Commission</th>
                      <th className="py-3.5 px-4">Payout UPI</th>
                      <th className="py-3.5 px-4 text-right">Super Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-[#262626]/60 bg-white dark:bg-[#0a0a0a]">
                    {filteredOnboarded.map((creator) => {
                      const cleanSlug = (creator.fullName || 'creator').toLowerCase().replace(/\s+/g, '-');
                      return (
                        <tr key={creator.id} className="hover:bg-stone-50/70 dark:hover:bg-[#222222]/40 transition-colors">
                          
                          {/* Name & Contact */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0">
                                {creator.fullName ? creator.fullName.slice(0, 2).toUpperCase() : 'CR'}
                              </div>
                              <div>
                                <span className="font-bold text-stone-900 dark:text-stone-100 block">{creator.fullName}</span>
                                <span className="text-[11px] text-stone-400">{creator.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Referral Code */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => copyCode(creator.referralCode || 'HIMALAYA8')}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                              title="Copy Referral Code"
                            >
                              <span>{creator.referralCode || 'HIMALAYA8'}</span>
                              {copiedCode === creator.referralCode ? (
                                <CheckCheck className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Copy className="w-3 h-3 text-emerald-600" />
                              )}
                            </button>
                          </td>

                          {/* Guild Role */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                              <ShieldCheck className="w-3 h-3 text-[#10b981]" />
                              {creator.role === 'BLOGGER' ? 'Verified Chronicler' : creator.role}
                            </span>
                          </td>

                          {/* Dispatches count */}
                          <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                            {creator._count?.blogPosts ?? 0} notes
                          </td>

                          {/* Commission Rate */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-emerald-700">8%</span>
                            <span className="text-[10px] text-stone-400 block">per homestay</span>
                          </td>

                          {/* UPI ID */}
                          <td className="py-3.5 px-4 font-mono text-stone-600">
                            {creator.upiId || '—'}
                          </td>

                          {/* Super Admin Controls */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/community/creator/${cleanSlug}`}
                                target="_blank"
                                className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-[#262626] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-[#222222] font-semibold inline-flex items-center gap-1 transition-all"
                                title="View Public Profile"
                              >
                                <span>Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>

                              <Button
                                onClick={() => handleToggleRole(creator.id, creator.role, creator.fullName)}
                                disabled={processingId === creator.id}
                                variant="outline"
                                className={`text-[11px] h-7 px-2.5 rounded-lg font-semibold cursor-pointer ${
                                  creator.role === 'BLOGGER'
                                    ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {creator.role === 'BLOGGER' ? 'Revoke' : 'Reinstate'}
                              </Button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Content Moderation & Review */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span>Review, feature, or remove community field notes and dispatches.</span>
              <span>{filteredContent.length} dispatch(es)</span>
            </div>

            {filteredContent.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-stone-200 rounded-2xl">
                <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-stone-900">No Dispatches Found</h4>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Travel stories and slow-living notes will appear here once published by verified creators.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredContent.map((dispatch) => (
                  <div
                    key={dispatch.id}
                    className="p-5 bg-white dark:bg-[#0a0a0a] border border-stone-200 dark:border-[#262626] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-stone-300 dark:hover:border-stone-700 transition-all shadow-2xs"
                  >
                    {/* Dispatch Preview */}
                    <div className="flex items-start gap-4 min-w-0">
                      {dispatch.images && dispatch.images.length > 0 && (
                        <img
                          src={dispatch.images[0]}
                          alt={dispatch.title}
                          className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {dispatch.altitude || '2,400m'}
                          </span>
                          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate max-w-md">
                            {dispatch.title}
                          </h4>
                          {dispatch.isVerifiedCreator && (
                            <span className="text-[10px] bg-gradient-to-r from-amber-50 to-emerald-50 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" /> Featured Guild Dispatch
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 font-light">
                          {dispatch.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-400 pt-1">
                          <span>By <strong>{dispatch.authorName}</strong></span>
                          <span>❤️ {dispatch.likesCount || 0} likes</span>
                          <span>📅 {new Date(dispatch.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Moderation Controls */}
                    <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-[#262626]">
                      <Link
                        href={`/blog/${dispatch.id}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#262626] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222222] font-semibold text-xs inline-flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>

                      <Button
                        onClick={() => handleToggleVerifiedDispatch(dispatch.id)}
                        disabled={processingId === dispatch.id}
                        variant="outline"
                        className={`text-xs h-8 px-3 rounded-lg font-semibold cursor-pointer ${
                          dispatch.isVerifiedCreator
                            ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                            : 'border-stone-200 dark:border-[#262626] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#222222]'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        {dispatch.isVerifiedCreator ? 'Featured' : 'Feature'}
                      </Button>

                      <Button
                        onClick={() => handleDeleteDispatch(dispatch.id, dispatch.title)}
                        disabled={processingId === dispatch.id}
                        variant="outline"
                        className="h-8 px-3 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                        title="Delete Dispatch"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
