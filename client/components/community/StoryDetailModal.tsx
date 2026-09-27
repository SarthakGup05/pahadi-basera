'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Heart, 
  Share2, 
  Bookmark, 
  MapPin, 
  Mountain, 
  Calendar, 
  Tag, 
  Check, 
  ArrowUpRight, 
  MessageCircle,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogItem } from '@/lib/blogData';
import { propertiesList } from '@/lib/propertiesData';
import { toast } from 'sonner';

interface StoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: BlogItem | null;
  onOpenCreatorProfile?: (authorName: string) => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
  likeCount?: number;
}

export default function StoryDetailModal({
  isOpen,
  onClose,
  story,
  onOpenCreatorProfile,
  isLiked = false,
  onToggleLike,
  likeCount = 42
}: StoryDetailModalProps) {
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [comments, setComments] = useState<Array<{ name: string; text: string; time: string }>>([
    { name: 'Kavita Joshi', text: 'This route near the ridge is breathtaking in the autumn mornings. Did you encounter any frost on the staves?', time: 'Yesterday' },
    { name: 'Rohan Sharma', text: 'Thanks for tagging the homestay! Booked 2 nights with your referral discount.', time: '2 days ago' }
  ]);

  if (!isOpen || !story) return null;

  const taggedStay = propertiesList.find(p => p.id === story.taggedPropertyId) || propertiesList[0];
  const refCode = story.authorReferralCode || 'HIMALAYA8';

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      name: guestName.trim() || 'Mountain Traveler',
      text: commentText.trim(),
      time: 'Just now'
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    toast.success('Your comment has been posted!');
  };

  const shareStory = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Story link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
        
        {/* Sticky Header with Author and Close */}
        <div className="px-5 sm:px-7 py-3.5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md">
          <div 
            onClick={() => onOpenCreatorProfile && onOpenCreatorProfile(story.author.name)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={story.author.avatar}
              alt={story.author.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-200"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  {story.author.name}
                </span>
                <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0" title="Verified Creator">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>
              <span className="text-[11px] text-stone-400 font-light block">
                {story.author.role} &bull; Click to view full profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shareStory}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Share Story"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Story Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* Elevation and Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5 text-[#10b981]" /> Altitude: {story.altitude}
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
              {story.duration}
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
              Season: {story.bestSeason}
            </span>
          </div>

          {/* Story Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            {story.title}
          </h1>

          {/* Featured Image */}
          {story.images && story.images.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-stone-200/80 max-h-[420px]">
              <img
                src={story.images[0]}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Full Narrative Text */}
          <div className="text-sm sm:text-base text-stone-700 leading-relaxed font-light space-y-4">
            {story.content ? (
              <div 
                className="prose prose-stone max-w-none text-stone-700 font-light leading-relaxed"
                dangerouslySetInnerHTML={{ __html: story.content }} 
              />
            ) : (
              <p className="whitespace-pre-line">{story.excerpt}</p>
            )}
          </div>

          {/* Tagged Homestay Card */}
          {taggedStay && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={taggedStay.bgImage || taggedStay.image}
                  alt={taggedStay.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                    Tagged Himalayan Homestay
                  </span>
                  <h4 className="text-sm font-bold text-stone-900">
                    {taggedStay.title}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {taggedStay.location} &bull; ₹{taggedStay.pricePerNight?.toLocaleString('en-IN')}/night
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                  5% OFF with code: <strong>{refCode}</strong>
                </span>
                <Link
                  href={`/properties/${taggedStay.id}?ref=${refCode}`}
                  className="text-xs font-bold text-stone-900 hover:text-emerald-700 flex items-center gap-1 mt-1"
                >
                  Book Stay Now <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Likes & Feedback Bar */}
          <div className="flex items-center justify-between py-3 border-t border-b border-stone-100">
            <button
              onClick={onToggleLike}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
                isLiked ? 'bg-rose-50 text-rose-600' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likeCount} Appreciations</span>
            </button>

            <span className="text-xs text-stone-400">
              {comments.length} Reader Comments
            </span>
          </div>

          {/* Reader Comments & Discussion */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-stone-900">
              Reader Discussion
            </h3>

            {/* Post a Comment Form (Open to everyone, no account required) */}
            <form onSubmit={handleAddComment} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="text-xs h-9 bg-white border-stone-200 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask a question about trails, weather, or homestay..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="text-xs h-9 bg-white border-stone-200 rounded-xl flex-1"
                  required
                />
                <Button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs px-4 h-9 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Post
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-stone-150 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">{c.name}</span>
                    <span className="text-[11px] text-stone-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
