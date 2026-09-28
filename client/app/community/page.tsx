'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  Mountain, 
  MapPin, 
  Compass, 
  Search, 
  ArrowUpRight, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Tag, 
  PenTool, 
  Copy, 
  CheckCheck, 
  Image as ImageIcon, 
  Utensils, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BlogItem, 
  CommunityThread, 
  CommunityTrail, 
  LocalRecipe 
} from '@/lib/blogData';
import { PropertyItem } from '@/lib/propertiesData';
import CreatorKycModal from '@/components/community/CreatorKycModal';
import CreateStoryModal from '@/components/community/CreateStoryModal';
import CreatorDashboardModal from '@/components/community/CreatorDashboardModal';
import { toast } from 'sonner';

// Format relative time
const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '2h ago';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

export default function CommunityHubPage() {
  const router = useRouter();
  const [stories, setStories] = useState<BlogItem[]>([]);
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [trails, setTrails] = useState<CommunityTrail[]>([]);
  const [recipes, setRecipes] = useState<LocalRecipe[]>([]);
  const [availableStays, setAvailableStays] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active filter tab: 'stories' | 'homestays' | 'trails' | 'recipes'
  const [activeTab, setActiveTab] = useState<'stories' | 'homestays' | 'trails' | 'recipes'>('stories');

  // Creator state
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Social interactions
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [storyReplies, setStoryReplies] = useState<Record<string, Array<{ author: string; text: string; time: string }>>>({});

  // Field note composer
  const [noteContent, setNoteContent] = useState('');
  const [noteAltitude, setNoteAltitude] = useState('2,400m');
  const [noteStayId, setNoteStayId] = useState('1');
  const [noteImage, setNoteImage] = useState('');
  const [showImageField, setShowImageField] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Search & following
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    'aarav_semwal': true,
    'tenzing_norbu': false,
    'meera_joshi': false
  });

  // Helper to slugify creator names for full page routes
  const getCreatorSlug = (authorName: string) => {
    return authorName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  };

  useEffect(() => {
    // 1. Check local creator profile
    const saved = localStorage.getItem('pb_creator_profile');
    if (saved) {
      try {
        setCreatorProfile(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }

    async function loadData() {
      setLoading(true);
      try {
        const [blogsRes, threadsRes, trailsRes, recipesRes, staysRes] = await Promise.allSettled([
          api.get('/api/blogs'),
          api.get('/api/community/threads'),
          api.get('/api/community/trails'),
          api.get('/api/community/recipes'),
          api.get('/api/properties/get-all-properties')
        ]);

        if (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value.data)) {
          const mapped: BlogItem[] = blogsRes.value.data.map((b: any) => ({
            id: b.id,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            altitude: b.altitude || '2,400m',
            duration: b.duration || '3 Days',
            difficulty: (b.difficulty as any) || 'Moderate',
            bestSeason: b.bestSeason || 'Autumn',
            images: Array.isArray(b.images) && b.images.length > 0 ? b.images : [
              'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'
            ],
            views: b.views || '1.4K',
            tags: b.tags || ['SlowLiving', 'Himalayas'],
            gearList: b.gearList || [],
            routeCoordinates: b.routeCoordinates || [],
            author: {
              name: b.authorName || b.authorUser?.fullName || 'Himalayan Explorer',
              role: b.authorRole || 'Verified Himalayan Creator',
              avatar: b.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              socials: { instagram: '#', twitter: '#', substack: '#' }
            },
            isVerifiedCreator: b.isVerifiedCreator ?? true,
            taggedPropertyId: b.taggedPropertyId || '1',
            likesCount: b.likesCount || 0,
            authorReferralCode: b.authorUser?.referralCode || 'HIMALAYA8'
          }));
          setStories(mapped);
        } else {
          setStories([]);
        }

        if (threadsRes.status === 'fulfilled' && Array.isArray(threadsRes.value.data)) {
          setThreads(threadsRes.value.data);
        } else {
          setThreads([]);
        }

        if (trailsRes.status === 'fulfilled' && Array.isArray(trailsRes.value.data)) {
          setTrails(trailsRes.value.data);
        } else {
          setTrails([]);
        }

        if (recipesRes.status === 'fulfilled' && Array.isArray(recipesRes.value.data)) {
          setRecipes(recipesRes.value.data);
        } else {
          setRecipes([]);
        }

        if (staysRes.status === 'fulfilled' && Array.isArray(staysRes.value.data)) {
          setAvailableStays(staysRes.value.data);
          if (staysRes.value.data.length > 0) {
            setNoteStayId(staysRes.value.data[0].id);
          }
        } else {
          setAvailableStays([]);
        }
      } catch (e) {
        console.error('Failed to load community data:', e);
        setStories([]);
        setThreads([]);
        setTrails([]);
        setRecipes([]);
        setAvailableStays([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleLike = (id: string, initial: number) => {
    const isLiked = likedMap[id] ?? false;
    const count = likeCounts[id] ?? initial;

    setLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setLikeCounts(prev => ({ ...prev, [id]: isLiked ? count - 1 : count + 1 }));

    if (!isLiked) {
      toast.success('Appreciated story');
      api.post(`/api/blogs/${id}/like`).catch(() => {});
    }
  };

  const handleBookmark = (id: string) => {
    const saved = savedMap[id] ?? false;
    setSavedMap(prev => ({ ...prev, [id]: !saved }));
    toast.success(saved ? 'Removed from saved' : 'Saved to your mountain journal');
  };

  const handleShare = (story: BlogItem) => {
    const url = `${window.location.origin}/community#${story.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Story link copied to clipboard');
  };

  const handleSendReply = (storyId: string) => {
    if (!replyInput.trim()) return;

    const reply = {
      author: creatorProfile?.fullName || 'Fellow Explorer',
      text: replyInput.trim(),
      time: 'Just now'
    };

    setStoryReplies(prev => ({
      ...prev,
      [storyId]: [...(prev[storyId] || []), reply]
    }));

    setReplyInput('');
    toast.success('Note reply added');
  };

  const handlePublishNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsPublishing(true);
    const authorName = creatorProfile?.fullName || 'Mountain Explorer';
    const authorRefCode = creatorProfile?.referralCode || 'HIMALAYA8';

    const newStory: BlogItem = {
      id: `note-${Date.now()}`,
      title: noteContent.slice(0, 60),
      excerpt: noteContent,
      content: noteContent,
      altitude: noteAltitude,
      duration: 'Slow Travel',
      difficulty: 'Moderate',
      bestSeason: 'All Season',
      images: noteImage ? [noteImage] : [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ],
      views: '1',
      tags: ['FieldNote', 'SlowLiving'],
      gearList: [],
      routeCoordinates: [],
      author: {
        name: authorName,
        role: 'Himalayan Explorer',
        avatar: creatorProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        socials: { instagram: '#', twitter: '#', substack: '#' }
      },
      isVerifiedCreator: true,
      taggedPropertyId: noteStayId,
      likesCount: 1,
      authorReferralCode: authorRefCode
    };

    setStories(prev => [newStory, ...prev]);
    setNoteContent('');
    setNoteImage('');
    setShowImageField(false);
    setIsPublishing(false);
    toast.success('Your Himalayan note has been published!');

    try {
      await api.post('/api/blogs', {
        title: newStory.title,
        excerpt: newStory.excerpt,
        content: newStory.content,
        altitude: newStory.altitude,
        images: newStory.images,
        authorName: newStory.author.name,
        taggedPropertyId: newStory.taggedPropertyId
      });
    } catch (e) {
      // offline fallback
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    toast.success(`Referral code ${code} copied!`);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-[#10b981] animate-spin" />
      </div>
    );
  }

  const filteredStories = stories.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.excerpt.toLowerCase().includes(q) ||
      s.author.name.toLowerCase().includes(q) ||
      s.tags?.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 font-sans selection:bg-[#10b981] selection:text-white">
      
      {/* Editorial Header Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 border-b border-stone-200/80 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#10b981]" />
              Himalayan Slow Travel Guild
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              Field Notes & Mountain Stories
            </h1>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-light">
              A community of authentic Himalayan explorers, storytellers, and homestay hosts sharing slow travel diaries, altitude logs, and local culture.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {creatorProfile?.isVerified ? (
              <Button
                onClick={() => setIsDashboardModalOpen(true)}
                variant="outline"
                className="rounded-full border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold px-5 h-11"
              >
                Creator Ledger
              </Button>
            ) : (
              <Button
                asChild
                className="rounded-full bg-[#10b981] hover:bg-[#0e9f6e] text-white text-xs font-semibold px-6 h-11 shadow-sm"
              >
                <Link href="/community/join" className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Become a Creator
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid: Feed (Left) & Minimal Travel Sidebar (Right) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Creator Referral Bar if Verified */}
        {creatorProfile?.isVerified && (
          <div className="mb-8 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Verified Creator: {creatorProfile.fullName}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Your readers get 5% OFF and you earn 8% commission on homestay bookings.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Your Code:</span>
              <button
                onClick={() => copyCode(creatorProfile.referralCode || 'HIMALAYA8')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-mono font-bold text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <span>{creatorProfile.referralCode || 'HIMALAYA8'}</span>
                {codeCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter Navigation Tabs */}
            <div className="flex items-center gap-2 pb-1 overflow-x-auto border-b border-stone-200/70">
              <button
                onClick={() => setActiveTab('stories')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'stories'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Field Notes
              </button>
              <button
                onClick={() => setActiveTab('homestays')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'homestays'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Slow-Stay Reviews
              </button>
              <button
                onClick={() => setActiveTab('trails')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'trails'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Trail Coordinates
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'recipes'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Pahadi Kitchen
              </button>
            </div>

            {/* Field Note Composer (Clean & Tasteful) */}
            {activeTab === 'stories' && (
              <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {creatorProfile?.fullName ? creatorProfile.fullName.slice(0, 2).toUpperCase() : 'PB'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      rows={showImageField ? 2 : 3}
                      placeholder="Share a quiet mountain thought, morning ridge view, or trail update..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 border-0 focus:ring-0 p-0 resize-none outline-none leading-relaxed"
                    />

                    {/* Image URL toggle */}
                    {showImageField && (
                      <div className="mt-2 mb-2">
                        <Input
                          type="text"
                          placeholder="Paste image link from Unsplash or trail camera..."
                          value={noteImage}
                          onChange={(e) => setNoteImage(e.target.value)}
                          className="text-xs h-9 border-stone-200 rounded-xl"
                        />
                      </div>
                    )}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1 text-[11px] text-stone-500">
                        <Mountain className="w-3.5 h-3.5 text-[#10b981]" />
                        <select
                          value={noteAltitude}
                          onChange={(e) => setNoteAltitude(e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-0.5 text-[11px] text-stone-700 outline-none cursor-pointer"
                        >
                          <option value="1,800m">1,800m (Mukteshwar)</option>
                          <option value="2,400m">2,400m (Jibhi Ridge)</option>
                          <option value="3,200m">3,200m (Jalori Pass)</option>
                          <option value="4,100m">4,100m (High Ridge)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-stone-500 ml-2">
                        <Tag className="w-3.5 h-3.5 text-[#10b981]" />
                        <select
                          value={noteStayId}
                          onChange={(e) => setNoteStayId(e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-0.5 text-[11px] text-stone-700 outline-none cursor-pointer max-w-[160px] truncate"
                        >
                          {availableStays.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setShowImageField(!showImageField)}
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>{showImageField ? 'Hide Photo' : 'Attach Photo'}</span>
                      </button>

                      <Button
                        onClick={handlePublishNote}
                        disabled={!noteContent.trim() || isPublishing}
                        className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold px-5 h-9 cursor-pointer shadow-sm"
                      >
                        {isPublishing ? 'Sharing...' : 'Share Note'}
                      </Button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: Stories & Field Notes Feed */}
            {activeTab === 'stories' && (
              <div className="space-y-6">
                {filteredStories.map((story) => {
                  const isLiked = likedMap[story.id] ?? false;
                  const likes = likeCounts[story.id] ?? (story.likesCount || 38);
                  const isSaved = savedMap[story.id] ?? false;
                  const taggedStay = availableStays.find(p => p.id === story.taggedPropertyId);
                  const replies = storyReplies[story.id] || [];

                  return (
                    <article 
                      key={story.id} 
                      id={story.id}
                      className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-stone-300 transition-all space-y-4"
                    >
                      {/* Author Header (Direct link to creator profile - no account needed) */}
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/community/creator/${getCreatorSlug(story.author.name)}`}
                          className="flex items-center gap-3 group/author"
                          title={`View ${story.author.name}'s Profile`}
                        >
                          <img
                            src={story.author.avatar}
                            alt={story.author.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-200 group-hover/author:ring-[#10b981] transition-all"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover/author:text-emerald-700 transition-colors">
                                {story.author.name}
                              </h3>
                              <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0" title="Verified Creator">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            </div>
                            <span className="text-[11px] text-stone-400 font-light block">
                              {story.author.role} &bull; {formatTimeAgo(story.duration)}
                            </span>
                          </div>
                        </Link>

                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                          <Mountain className="w-3 h-3 text-[#10b981]" />
                          {story.altitude}
                        </span>
                      </div>

                      {/* Story Text (Clickable to read full story on full page) */}
                      <Link 
                        href={`/blog/${story.id}`}
                        className="block text-xs sm:text-sm text-stone-700 leading-relaxed font-light group/text"
                        title="Click to read full dispatch"
                      >
                        <h4 className="font-bold text-stone-900 text-sm mb-1 group-hover/text:text-emerald-700 transition-colors">
                          {story.title}
                        </h4>
                        <p className="whitespace-pre-line line-clamp-3">
                          {story.excerpt || story.content}
                        </p>
                      </Link>

                      {/* High-res Travel Photo (Clickable to view full story) */}
                      {story.images && story.images.length > 0 && (
                        <Link 
                          href={`/blog/${story.id}`}
                          className="block rounded-2xl overflow-hidden border border-stone-100 max-h-[380px] group/photo"
                          title="Click to view full story and photography"
                        >
                          <img
                            src={story.images[0]}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover/photo:scale-[1.01] transition-transform duration-500"
                          />
                        </Link>
                      )}

                      {/* Tagged Homestay Mini-Card (Tasteful Travel Style) */}
                      {taggedStay && (
                        <div className="bg-[#fafaf7] border border-stone-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={taggedStay.bgImage || taggedStay.image}
                              alt={taggedStay.title}
                              className="w-14 h-14 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block">
                                Recommended Stay
                              </span>
                              <h4 className="text-xs font-bold text-stone-900 truncate">
                                {taggedStay.title}
                              </h4>
                              <p className="text-[11px] text-stone-500 truncate">
                                {taggedStay.location} &bull; ₹{taggedStay.pricePerNight?.toLocaleString('en-IN')}/night
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Code {story.authorReferralCode || 'HIMALAYA8'} (5% OFF)
                            </span>
                            <Link
                              href={`/properties/${taggedStay.id}?ref=${story.authorReferralCode || 'HIMALAYA8'}`}
                              className="text-xs font-bold text-stone-900 hover:text-[#10b981] flex items-center gap-1 transition-colors"
                            >
                              Explore <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Minimal Social Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(story.id, story.likesCount || 38)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isLiked ? 'text-rose-600 font-semibold' : 'hover:text-rose-600'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`} />
                            <span>{likes}</span>
                          </button>

                          <button
                            onClick={() => setActiveReplyId(activeReplyId === story.id ? null : story.id)}
                            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{replies.length} replies</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/blog/${story.id}`}
                            className="text-[11px] font-semibold text-stone-600 hover:text-emerald-700 flex items-center gap-1 transition-colors mr-1"
                            title="Read Full Dispatch on dedicated page"
                          >
                            <span>Read Dispatch</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleBookmark(story.id)}
                            className={`hover:text-stone-900 transition-colors cursor-pointer ${
                              isSaved ? 'text-[#10b981]' : ''
                            }`}
                            title="Save Note"
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#10b981] stroke-[#10b981]' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleShare(story)}
                            className="hover:text-stone-900 transition-colors cursor-pointer"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Replies Thread */}
                      {activeReplyId === story.id && (
                        <div className="pt-3 border-t border-stone-100 space-y-3">
                          {replies.map((r, i) => (
                            <div key={i} className="flex gap-2.5 text-xs bg-stone-50 p-2.5 rounded-xl">
                              <span className="font-bold text-stone-900">{r.author}:</span>
                              <span className="text-stone-600 font-light">{r.text}</span>
                            </div>
                          ))}

                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Write a response..."
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              className="text-xs h-9 border-stone-200 rounded-xl"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendReply(story.id);
                              }}
                            />
                            <Button
                              onClick={() => handleSendReply(story.id)}
                              className="bg-stone-900 hover:bg-stone-800 text-white text-xs rounded-xl px-4 h-9 cursor-pointer"
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      )}

                    </article>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Homestay Reviews */}
            {activeTab === 'homestays' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {availableStays.slice(0, 6).map(prop => (
                  <div key={prop.id} className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <img src={prop.bgImage || prop.image} alt={prop.title} className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{prop.location}</span>
                      <h4 className="text-sm font-bold text-stone-900">{prop.title}</h4>
                      <p className="text-xs text-stone-500 font-light line-clamp-2">{prop.description}</p>
                      <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                        <span className="text-xs font-semibold text-stone-900">₹{prop.pricePerNight?.toLocaleString('en-IN')}/night</span>
                        <Link href={`/properties/${prop.id}`} className="text-xs font-bold text-[#10b981] hover:underline flex items-center gap-1">
                          View Homestay <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Trails */}
            {activeTab === 'trails' && (
              <div className="space-y-4">
                {trails.map(trail => (
                  <div key={trail.id} className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{trail.location}</span>
                        <h4 className="text-base font-bold text-stone-900">{trail.title}</h4>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {trail.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">{trail.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                      <span>Altitude: <strong className="text-stone-800">{trail.altitude}</strong></span>
                      <span>Documented by: <strong className="text-stone-800">{trail.author}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: Recipes */}
            {activeTab === 'recipes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{recipe.origin}</span>
                      <h4 className="text-sm font-bold text-stone-900">{recipe.name}</h4>
                      <p className="text-xs text-stone-500 font-light line-clamp-2">{recipe.steps?.[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Travel Companion Column (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Search Box */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-sm relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search valleys, notes, trails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-transparent border-0 focus:ring-0 text-xs text-stone-800 placeholder:text-stone-400 h-9"
              />
            </div>

            {/* Creator Guild Card (Tasteful Light Theme) */}
            {!creatorProfile?.isVerified && (
              <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Creator Program</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900">
                  Earn 8% Commission on Stays
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Authenticate your travel identity via DigiLocker to write stories, share trail maps, and earn direct UPI commission.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#10b981] hover:bg-[#0e9f6e] text-white text-xs font-semibold rounded-xl h-10 shadow-sm"
                >
                  <Link href="/community/join">
                    Apply for Creator Status →
                  </Link>
                </Button>
              </div>
            )}

            {/* Featured Slow-Travel Authors */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Featured Mountain Authors
              </h3>
              <div className="space-y-3">
                {/* Author 1 */}
                <div className="flex items-center justify-between gap-2">
                  <Link 
                    href="/community/creator/aarav-semwal"
                    className="flex items-center gap-2.5 min-w-0 group/author"
                    title="View Aarav Semwal's Full Profile"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                      alt="Aarav"
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-stone-200 group-hover/author:ring-[#10b981] transition-all"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-stone-900 block truncate group-hover/author:text-emerald-700 transition-colors">Aarav Semwal</span>
                      <span className="text-[10px] text-stone-400 block truncate">Garhwal Ridges</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setFollowingMap(p => ({ ...p, aarav_semwal: !p.aarav_semwal }));
                      toast.success(followingMap.aarav_semwal ? 'Unfollowed Aarav' : 'Following Aarav');
                    }}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      followingMap.aarav_semwal
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    {followingMap.aarav_semwal ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Author 2 */}
                <div className="flex items-center justify-between gap-2">
                  <Link 
                    href="/community/creator/tenzing-norbu"
                    className="flex items-center gap-2.5 min-w-0 group/author"
                    title="View Tenzing Norbu's Full Profile"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80"
                      alt="Tenzing"
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-stone-200 group-hover/author:ring-[#10b981] transition-all"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-stone-900 block truncate group-hover/author:text-emerald-700 transition-colors">Tenzing Norbu</span>
                      <span className="text-[10px] text-stone-400 block truncate">High Altitude Trails</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setFollowingMap(p => ({ ...p, tenzing_norbu: !p.tenzing_norbu }));
                      toast.success(followingMap.tenzing_norbu ? 'Unfollowed Tenzing' : 'Following Tenzing');
                    }}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      followingMap.tenzing_norbu
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    {followingMap.tenzing_norbu ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Author 3 */}
                <div className="flex items-center justify-between gap-2">
                  <Link 
                    href="/community/creator/meera-joshi"
                    className="flex items-center gap-2.5 min-w-0 group/author"
                    title="View Meera Joshi's Full Profile"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                      alt="Meera"
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-stone-200 group-hover/author:ring-[#10b981] transition-all"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-stone-900 block truncate group-hover/author:text-emerald-700 transition-colors">Meera Joshi</span>
                      <span className="text-[10px] text-stone-400 block truncate">Kumaon Heritage</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setFollowingMap(p => ({ ...p, meera_joshi: !p.meera_joshi }));
                      toast.success(followingMap.meera_joshi ? 'Unfollowed Meera' : 'Following Meera');
                    }}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      followingMap.meera_joshi
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    {followingMap.meera_joshi ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Himalayan Valleys */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Popular Mountain Valleys
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {['#Mukteshwar', '#JibhiValley', '#KasolTrails', '#ChoptaMeadows', '#KumaonHeritage', '#SlowTravel'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag.replace('#', ''))}
                    className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Leave No Trace Guild Principle */}
            <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200/60 text-xs text-stone-500 leading-relaxed font-light">
              <span className="font-semibold text-stone-800 block mb-1">Mountain Etiquette</span>
              Respect village customs, avoid single-use plastics, and leave the Himalayan trails quieter than you found them.
            </div>

          </aside>

        </div>

      </div>

      {/* Creator Modals (Only for creator onboarding, posting, and dashboard) */}

      {/* Creator Modals */}
      <CreatorKycModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        onSuccess={(data) => {
          setCreatorProfile(data);
          localStorage.setItem('pb_creator_profile', JSON.stringify(data));
          setIsKycModalOpen(false);
          toast.success('KYC Approved! Creator privileges unlocked.');
        }}
      />

      <CreateStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        creatorProfile={creatorProfile}
        onPostCreated={(newStory) => {
          setStories(prev => [newStory, ...prev]);
        }}
      />

      <CreatorDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        creatorProfile={creatorProfile}
      />

    </div>
  );
}
