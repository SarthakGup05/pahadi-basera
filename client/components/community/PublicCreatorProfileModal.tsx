'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  ShieldCheck, 
  Check, 
  MapPin, 
  Mountain, 
  Heart, 
  Share2, 
  Copy, 
  CheckCheck, 
  ArrowUpRight, 
  Calendar,
  Sparkles,
  Compass,
  MessageCircle,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogItem } from '@/lib/blogData';
import { propertiesList } from '@/lib/propertiesData';
import { toast } from 'sonner';

export interface CreatorProfileData {
  name: string;
  handle: string;
  avatar: string;
  role: string;
  bio?: string;
  specialty?: string;
  referralCode?: string;
  altitudeRecord?: string;
  storiesCount?: number;
  valleysExplored?: string[];
  bannerImage?: string;
}

interface PublicCreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfileData | null;
  creatorStories: BlogItem[];
  onSelectStory?: (story: BlogItem) => void;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
}

export default function PublicCreatorProfileModal({
  isOpen,
  onClose,
  creator,
  creatorStories,
  onSelectStory,
  isFollowing = false,
  onToggleFollow
}: PublicCreatorProfileModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'stories' | 'stays' | 'about'>('stories');

  if (!isOpen || !creator) return null;

  const refCode = creator.referralCode || 'HIMALAYA8';

  const copyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopiedCode(true);
    toast.success(`Creator code ${refCode} copied to clipboard! (5% Guest Discount)`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success(`Link to ${creator.name}'s profile copied!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        {/* Mountain Cover Banner */}
        <div className="relative h-36 sm:h-44 bg-gradient-to-r from-emerald-900 to-stone-900 overflow-hidden shrink-0">
          <img
            src={creator.bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'}
            alt={creator.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            aria-label="Close profile"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Share profile button */}
          <button
            onClick={shareProfile}
            className="absolute top-3 right-13 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Header Information */}
        <div className="px-5 sm:px-7 pt-0 pb-4 relative shrink-0 border-b border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            
            {/* Avatar with Verified Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-stone-100 shrink-0">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 self-start sm:self-end">
              {onToggleFollow && (
                <Button
                  onClick={onToggleFollow}
                  className={`rounded-full text-xs font-semibold px-5 h-9 transition-all cursor-pointer ${
                    isFollowing 
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      : 'bg-[#10b981] hover:bg-[#0e9f6e] text-white shadow-sm'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow Creator'}
                </Button>
              )}

              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold transition-all cursor-pointer"
                title="Copy Creator Discount Code"
              >
                {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-700" /> : <Tag className="w-3.5 h-3.5 text-emerald-700" />}
                <span>5% OFF: <strong className="font-mono">{refCode}</strong></span>
              </button>
            </div>
          </div>

          {/* Name & Handle */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                {creator.name}
              </h2>
              <span className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0" title="DigiLocker Verified Creator">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <p className="text-xs text-stone-400 font-mono mt-0.5">
              @{creator.handle} &bull; <span className="text-stone-600 font-sans">{creator.role}</span>
            </p>

            <p className="text-xs sm:text-sm text-stone-600 font-light mt-2.5 leading-relaxed">
              {creator.bio || 'High-altitude slow traveler and contributor documenting authentic homestays and mountain lifestyle across the Himalayas.'}
            </p>
          </div>

          {/* Quick Creator Statistics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-center">
            <div className="bg-stone-50/80 rounded-xl p-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Stories</span>
              <span className="text-sm font-extrabold text-stone-900">{creatorStories.length} dispatches</span>
            </div>
            <div className="bg-stone-50/80 rounded-xl p-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Elevation</span>
              <span className="text-sm font-extrabold text-emerald-700">{creator.altitudeRecord || '3,680m'}</span>
            </div>
            <div className="bg-stone-50/80 rounded-xl p-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Trust Status</span>
              <span className="text-sm font-extrabold text-stone-900 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Verified
              </span>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-4 mt-4 text-xs font-semibold border-b border-stone-100">
            <button
              onClick={() => setActiveTab('stories')}
              className={`pb-2.5 transition-colors cursor-pointer relative ${
                activeTab === 'stories' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Field Notes ({creatorStories.length})
              {activeTab === 'stories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('stays')}
              className={`pb-2.5 transition-colors cursor-pointer relative ${
                activeTab === 'stays' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Recommended Stays
              {activeTab === 'stays' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          
          {/* TAB 1: Stories */}
          {activeTab === 'stories' && (
            <div className="space-y-4">
              {creatorStories.length > 0 ? (
                creatorStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => onSelectStory && onSelectStory(story)}
                    className="p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-200 bg-[#fafaf7] hover:bg-emerald-50/10 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                          {story.altitude} &bull; {story.duration}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                          {story.title}
                        </h4>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 font-light leading-relaxed">
                      {story.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mt-3 pt-2 border-t border-stone-200/60 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> {story.likesCount || 42}
                      </span>
                      <span>Season: {story.bestSeason}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No public field notes published yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Recommended Homestays */}
          {activeTab === 'stays' && (
            <div className="space-y-3">
              {propertiesList.slice(0, 3).map((prop) => (
                <div key={prop.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={prop.bgImage || prop.image} alt={prop.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-stone-900 truncate">{prop.title}</h5>
                      <p className="text-[11px] text-stone-500 truncate">{prop.location} &bull; ₹{prop.pricePerNight?.toLocaleString('en-IN')}/night</p>
                    </div>
                  </div>
                  <Link
                    href={`/properties/${prop.id}?ref=${refCode}`}
                    className="text-xs font-bold text-[#10b981] hover:underline flex items-center gap-1 shrink-0"
                  >
                    5% OFF <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
