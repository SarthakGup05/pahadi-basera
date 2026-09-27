'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Mountain, 
  Image as ImageIcon, 
  Tag, 
  Check, 
  Loader2, 
  Sparkles,
  Link as LinkIcon,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { propertiesList } from '@/lib/propertiesData';
import { toast } from 'sonner';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorProfile: any;
  onPostCreated: (post: any) => void;
}

export default function CreateStoryModal({
  isOpen,
  onClose,
  creatorProfile,
  onPostCreated
}: CreateStoryModalProps) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [altitude, setAltitude] = useState('2,650m');
  const [duration, setDuration] = useState('4 Days Trek');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [bestSeason, setBestSeason] = useState('Autumn & Spring');
  const [imageUrl, setImageUrl] = useState('');
  const [taggedPropertyId, setTaggedPropertyId] = useState(propertiesList[0]?.id || '1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter a title and story content.');
      return;
    }

    setIsSubmitting(true);
    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop';
    const taggedProperty = propertiesList.find(p => p.id === taggedPropertyId);

    const postPayload = {
      title: title.trim(),
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      altitude,
      duration,
      difficulty,
      bestSeason,
      images: [finalImage],
      tags: ['Verified Creator', 'Himalayas', taggedProperty?.location?.split(',')[0] || 'Ridge'],
      taggedPropertyId,
      authorName: creatorProfile?.fullName || 'Verified Explorer',
      authorRole: 'Verified Himalayan Blogger',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isVerifiedCreator: true,
      referralCode: creatorProfile?.referralCode || 'HIMALAYA8'
    };

    try {
      const token = localStorage.getItem('pb_admin_token') || localStorage.getItem('pb_token');
      const res = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(postPayload)
      });

      if (res.ok) {
        const data = await res.json();
        onPostCreated(data.post || { ...postPayload, id: String(Date.now()), createdAt: new Date().toISOString() });
        toast.success('Your Himalayan Journal story is live!');
        onClose();
        return;
      }
    } catch (e) {
      // Local fallback in state
    }

    // Fallback append
    onPostCreated({
      ...postPayload,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: '1'
    });
    toast.success('Your story has been added to the Himalayan Journal!');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden font-sans max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-stone-900 text-white px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Creator Studio</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Publish a Himalayan Journal Story</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-5 flex-1">
          
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Story Title</label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Crossing the Silent Ridge: 4 Days in Hidden Chopta Pine Woodlands"
              className="rounded-xl border-stone-200 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Short Excerpt / Teaser</label>
            <Input 
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief 1-2 sentence hook summarizing your expedition..."
              className="rounded-xl border-stone-200 text-xs"
            />
          </div>

          {/* Grid: Altitude, Duration, Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Peak Altitude</label>
              <Input 
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                placeholder="e.g. 2,680m"
                className="rounded-xl border-stone-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Trek Duration</label>
              <Input 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 Days"
                className="rounded-xl border-stone-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Difficulty</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>
          </div>

          {/* Tagged Himalayan Stay / Property */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1.5">
              <Home className="w-4 h-4 text-emerald-600" />
              Tag a Basera Property (Enables Direct 8% Referral Commission)
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed mb-2.5">
              When readers click &quot;Book this Stay&quot; from your story, your referral code is automatically attached, granting them 5% off and you 8% commission.
            </p>
            <select
              value={taggedPropertyId}
              onChange={(e) => setTaggedPropertyId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-emerald-200 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {propertiesList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.location} (₹{p.pricePerNight.toLocaleString()}/night)
                </option>
              ))}
            </select>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Cover Photo Image URL</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (or leave blank for mountain default)"
                className="pl-9 rounded-xl border-stone-200 text-xs"
              />
            </div>
          </div>

          {/* Story Narrative Content */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Expedition Narrative & Guide Notes</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the trail conditions, quiet viewpoints, where to stop for native herbal chai, and your experience at the tagged Basera..."
              rows={6}
              className="w-full p-3.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100">
            <span className="text-[11px] text-stone-400">
              Published under: <strong className="text-stone-700">{creatorProfile?.fullName || 'Verified Creator'}</strong>
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold px-6 gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...
                  </span>
                ) : (
                  'Publish Journal Story'
                )}
              </Button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
