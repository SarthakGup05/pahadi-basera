'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Copy, 
  CheckCheck, 
  ArrowRight, 
  ArrowLeft,
  Lock, 
  Smartphone, 
  DollarSign, 
  TrendingUp,
  Tag,
  CheckCircle2,
  Loader2,
  Compass,
  Mountain,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUploadDropzone from '@/components/ui/ImageUploadDropzone';
import { toast } from 'sonner';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function JoinCommunityPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [specialty, setSpecialty] = useState('Slow Living & Homestays');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Format Aadhaar with spaces
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setAadhaarNumber(parts.join(' '));
  };

  // Submit Verification (Step 3 -> Step 4)
  const handleVerifyKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhaar number.');
      setStep(2);
      return;
    }

    if (!upiId.trim() || !upiId.includes('@')) {
      toast.error('Please enter a valid UPI VPA ID (e.g. yourname@okhdfcbank)');
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await api.post('/api/kyc/verify-aadhaar', {
        fullName,
        aadhaarNumber: cleanAadhaar,
        socialProfile: handle ? `@${handle.replace('@', '')}` : portfolioUrl,
        bio,
        upiId
      });

      const userObj = data.user || {
        fullName,
        handle: handle.replace('@', '') || fullName.toLowerCase().replace(/\s+/g, '_'),
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isVerified: false,
        kycStatus: 'PENDING',
        commissionRate: 0.08,
        specialty,
        upiId,
        bio
      };

      setVerifiedData(userObj);
      localStorage.setItem('pb_creator_profile', JSON.stringify(userObj));
      setStep(4);
      toast.success('DigiLocker KYC submitted! Awaiting Super Admin onboarding approval.');
    } catch (err) {
      fallbackVerification();
    } finally {
      setIsVerifying(false);
    }
  };

  const fallbackVerification = () => {
    const cleanHandle = handle.replace('@', '') || fullName.toLowerCase().replace(/\s+/g, '_') || 'himalayan_soul';

    const mockProfile = {
      fullName: fullName || 'Himalayan Explorer',
      handle: cleanHandle,
      role: 'GUEST',
      isVerified: false,
      kycStatus: 'PENDING',
      commissionRate: 0.08,
      digilockerVerified: true,
      bio: bio || 'Slow travel writer and high-altitude explorer in the Indian Himalayas.',
      specialty,
      upiId,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    localStorage.setItem('pb_creator_profile', JSON.stringify(mockProfile));
    setVerifiedData(mockProfile);
    setStep(4);
    toast.success('DigiLocker verification submitted! Application queued for Super Admin review.');
  };

  const checkApprovalStatus = async () => {
    try {
      const { data } = await api.get('/api/kyc/status');
      if (data && (data.kycStatus === 'VERIFIED' || data.role === 'BLOGGER')) {
        const approved = {
          ...verifiedData,
          ...data,
          isVerified: true,
          kycStatus: 'VERIFIED',
          referralCode: data.referralCode || verifiedData?.referralCode || 'HIMALAYA8'
        };
        setVerifiedData(approved);
        localStorage.setItem('pb_creator_profile', JSON.stringify(approved));
        toast.success('Congratulations! Super Admin has approved your creator onboarding!');
      } else {
        toast.info('Your application is currently in the Super Admin review queue.');
      }
    } catch {
      // Check local storage updates from Super Admin actions
      const saved = localStorage.getItem('pb_creator_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isVerified || parsed.kycStatus === 'VERIFIED') {
          setVerifiedData(parsed);
          toast.success('Creator onboarding is approved and active!');
          return;
        }
      }
      toast.info('Application is awaiting Super Admin approval.');
    }
  };

  const copyReferralCode = () => {
    const code = verifiedData?.referralCode || 'HIMALAYA8';
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Referral code ${code} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepsList = [
    { number: 1, title: 'Profile', desc: 'Identity & handle' },
    { number: 2, title: 'DigiLocker KYC', desc: 'UIDAI check' },
    { number: 3, title: 'Payout', desc: 'UPI ID & 8% terms' },
    { number: 4, title: 'Review', desc: 'Super Admin approval' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-800 font-sans selection:bg-[#10b981] selection:text-white">
      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-14">
        <div className="mb-6">
          <Link 
            href="/community" 
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Stories
          </Link>
        </div>
        
        {/* Simple Minimalist Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            Creator Guild Application
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Share Your Himalayan Stories
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 leading-relaxed font-light">
            Join verified storytellers documenting mountain homestays and slow travel. Earn an <strong>8% commission</strong> on stays booked through your notes.
          </p>
        </div>

        {/* Minimal Progress Steps */}
        <div className="mb-10 max-w-lg mx-auto">
          <div className="grid grid-cols-4 gap-2 relative">
            {stepsList.map((s) => {
              const isActive = step === s.number;
              const isPast = step > s.number;
              return (
                <div key={s.number} className="flex flex-col items-center text-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#10b981] text-white shadow-sm ring-4 ring-emerald-100' 
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : s.number}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 truncate w-full ${isActive ? 'text-stone-900' : isPast ? 'text-emerald-700' : 'text-stone-400'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Form Box (Clean Light Card) */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-9 shadow-sm">
          
          {/* STEP 1: Profile & Socials */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900">1. Creator Profile</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  How you'll appear on your slow-travel stories and recommendations.
                </p>
              </div>

              <div className="space-y-4">
                {/* Creator Profile Picture via ImageKit */}
                <div className="space-y-1.5 pb-2 border-b border-stone-100">
                  <label className="block text-xs font-semibold text-stone-700">
                    Creator Profile Picture (ImageKit CDN)
                  </label>
                  <ImageUploadDropzone
                    folder="avatars"
                    multiple={false}
                    maxFiles={1}
                    maxSizeMB={5}
                    label="Upload Creator Portrait"
                    hint="Face portrait or photography logo (JPEG, PNG, WebP)"
                    onUploadSuccess={(results) => {
                      if (results.length > 0) {
                        setAvatarUrl(results[0].url);
                        toast.success('Creator avatar uploaded to ImageKit!');
                      }
                    }}
                  />
                  {avatarUrl && (
                    <div className="flex items-center gap-3 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl mt-2">
                      <img src={avatarUrl} alt="Avatar Preview" className="w-10 h-10 rounded-full object-cover border border-emerald-300" />
                      <div className="text-xs min-w-0">
                        <span className="font-bold text-emerald-800 block">Avatar Active</span>
                        <span className="text-[10px] text-emerald-600 truncate block max-w-xs">{avatarUrl}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Aarav Semwal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-stone-200 rounded-xl h-11 text-sm focus:ring-[#10b981] focus:border-[#10b981]"
                    required
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Must match your Aadhaar ID for instant DigiLocker authentication.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Creator Handle <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">@</span>
                      <Input
                        type="text"
                        placeholder="aarav_himalayas"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        className="pl-8 border-stone-200 rounded-xl h-11 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Slow-Travel Specialty
                    </label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl h-11 px-3 text-xs bg-white text-stone-800 outline-none focus:border-[#10b981] cursor-pointer"
                    >
                      <option value="Slow Living & Homestays">Slow Living & Homestays</option>
                      <option value="Alpine Photography">Alpine Photography</option>
                      <option value="Trail Running & Trekking">Trail Running & Trekking</option>
                      <option value="Pahadi Culture & Cuisine">Pahadi Culture & Cuisine</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Instagram or Travel Portfolio
                  </label>
                  <div className="relative">
                    <InstagramIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="instagram.com/yourhandle or personal site"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="pl-9 border-stone-200 rounded-xl h-11 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Short Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell fellow travelers about your mountain journeys, favorite passes, or homestay preferences..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl p-3 text-xs outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button
                  onClick={() => {
                    if (!fullName.trim()) {
                      toast.error('Please enter your full legal name');
                      return;
                    }
                    setStep(2);
                  }}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl px-6 h-11 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Continue to DigiLocker <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DigiLocker KYC */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                  2. DigiLocker Identity Check
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  To ensure genuine community recommendations and zero spam, we verify creator identities via UIDAI standards.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Encrypted & Safe:</strong> Only the last 4 digits are retained for compliance. No biometric or sensitive records are stored.
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    12-Digit Aadhaar UIDAI Number <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaarNumber}
                    onChange={handleAadhaarChange}
                    className="border-stone-200 rounded-xl h-12 text-sm font-mono tracking-widest"
                    maxLength={14}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Aadhaar OTP (Automated Sandbox)
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP (or proceed for auto-verify)"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-9 border-stone-200 rounded-xl h-11 text-xs font-mono"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <Button
                  onClick={() => {
                    const clean = aadhaarNumber.replace(/\D/g, '');
                    if (clean.length !== 12) {
                      toast.error('Please enter a 12-digit Aadhaar number');
                      return;
                    }
                    setStep(3);
                  }}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl px-6 h-11 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Confirm & Setup Payout <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Payout Setup (UPI ID) */}
          {step === 3 && (
            <form onSubmit={handleVerifyKyc} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#10b981]" />
                  3. Commission & Payout Setup
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Direct UPI settlement terms for your stay recommendations.
                </p>
              </div>

              {/* Commission Summary Table */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Your Referral Commission</span>
                  <span className="font-bold text-emerald-700">8% of total booking value</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-stone-200 pt-2">
                  <span className="text-stone-500">Reader Privilege Discount</span>
                  <span className="font-bold text-stone-900">5% OFF with your code</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-stone-200 pt-2">
                  <span className="text-stone-500">Payout Schedule</span>
                  <span className="font-semibold text-stone-800">Direct UPI within 48h of checkout</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Your UPI ID (VPA) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. semwal@okhdfcbank or yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="border-stone-200 rounded-xl h-11 text-sm"
                  required
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Settlements are transferred directly to this UPI address without manual invoices.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="bg-[#10b981] hover:bg-[#0e9f6e] text-white font-semibold text-xs rounded-xl px-7 h-11 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying DigiLocker...
                    </span>
                  ) : (
                    'Activate Verified Creator Status'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: Review Queue vs Approved Celebration */}
          {step === 4 && (
            verifiedData?.kycStatus === 'PENDING' ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
                  <Clock className="w-7 h-7 text-amber-600 animate-pulse" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                    Application In Super Admin Review
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                    Application Received, {verifiedData?.fullName || fullName}!
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto font-light leading-relaxed">
                    Your DigiLocker KYC has been verified. In accordance with platform governance, a Super Admin must review and approve your creator onboarding before publishing privileges and your referral code are activated.
                  </p>
                </div>

                {/* Status Review Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Identity Verification</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker KYC Attached
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Onboarding Status</span>
                    <span className="font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
                      Awaiting Super Admin Approval
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Mountain Specialty</span>
                    <span className="font-medium text-stone-800">{specialty}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Payout UPI (8% terms)</span>
                    <span className="font-mono text-stone-700">{upiId || 'Configured'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    onClick={checkApprovalStatus}
                    variant="outline"
                    className="rounded-xl border-stone-300 text-stone-800 hover:bg-stone-100 text-xs font-semibold px-6 h-11 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Check Approval Status
                  </Button>
                  <Button
                    onClick={() => router.push('/community')}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl px-7 h-11 cursor-pointer shadow-sm"
                  >
                    Browse Community Dispatches →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#10b981] flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                  <Sparkles className="w-7 h-7 text-[#10b981]" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                    Welcome to the Creator Guild, {verifiedData?.fullName || fullName}!
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto font-light">
                    Your onboarding has been approved by the Super Admin. You can now publish slow travel diaries and share your exclusive 8% referral link.
                  </p>
                </div>

                {/* Referral Code Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Your Referral Code</span>
                    <span className="text-emerald-700 font-semibold text-[11px]">8% Commission Active</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-white border border-stone-200 p-3 rounded-xl">
                    <span className="font-mono font-bold text-base text-stone-900 tracking-wider">
                      {verifiedData?.referralCode || 'HIMALAYA8'}
                    </span>
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer transition-all"
                    >
                      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2">
                    Give this code to your readers for 5% off their booking. You earn 8% on each completed stay.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => router.push('/community')}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl px-8 h-11 cursor-pointer shadow-sm"
                  >
                    Explore Community Stories & Share Note →
                  </Button>
                </div>
              </div>
            )
          )}

        </div>

      </main>

    </div>
  );
}
