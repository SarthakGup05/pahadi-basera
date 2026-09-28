'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
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
  Tag,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogItem, CommunityTrail } from '@/lib/blogData';
import api from '@/lib/api';
import { PropertyItem } from '@/lib/propertiesData';
import { toast } from 'sonner';

export default function CreatorPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string || '').toLowerCase();

  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'stories' | 'stays' | 'trails'>('stories');
  const [isFollowing, setIsFollowing] = useState(false);
  const [allStories, setAllStories] = useState<BlogItem[]>([]);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [trails, setTrails] = useState<CommunityTrail[]>([]);
  const [loading, setLoading] = useState(true);

  // Directory of creators with rich content
  const creatorProfilesDirectory: Record<string, any> = {
    'aarav-semwal': {
      name: 'Aarav Semwal',
      handle: 'aarav_semwal',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'Alpine Photographer & Ridge Scout',
      bio: 'High-altitude slow traveler documenting silent bugyals, slate villages, and traditional stone cottages in Garhwal and Kumaon.',
      specialty: 'High-Altitude Photography',
      referralCode: 'AARAV8',
      altitudeRecord: '3,680m',
      valleysExplored: ['Chopta', 'Tungnath', 'Mukteshwar', 'Sari'],
      bannerImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
      tripsCount: 14
    },
    'tenzing-norbu': {
      name: 'Tenzing Norbu',
      handle: 'tenzing_norbu',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      role: 'High-Altitude Trail Scout',
      bio: 'Alpine mountaineer and slow travel guide specializing in high mountain passes, cold deserts, and sustainable homestays.',
      specialty: 'Trekking & High Passes',
      referralCode: 'TENZING8',
      altitudeRecord: '4,270m',
      valleysExplored: ['Spiti', 'Kinnaur', 'Zanskar', 'Jalori'],
      bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
      tripsCount: 22
    },
    'meera-joshi': {
      name: 'Meera Joshi',
      handle: 'meera_joshi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Kumaon Heritage & Slow Living Author',
      bio: 'Living among ancient pine groves in Mukteshwar. Chronicling mountain cuisine, stone architecture, and slow living.',
      specialty: 'Heritage & Slow Stays',
      referralCode: 'MEERA8',
      altitudeRecord: '2,400m',
      valleysExplored: ['Mukteshwar', 'Almora', 'Binsar', 'Naukuchiatal'],
      bannerImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80',
      tripsCount: 18
    },
    'priyanka-rawat': {
      name: 'Priyanka Rawat',
      handle: 'priyanka_rawat',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Cultural Gastronomist',
      bio: 'Exploring traditional Pahadi kitchens, indigenous millets, and wild berry jams across organic mountain orchards.',
      specialty: 'Pahadi Kitchen & Culture',
      referralCode: 'PRIYANKA8',
      altitudeRecord: '2,100m',
      valleysExplored: ['Almora', 'Ranikhet', 'Mukteshwar'],
      bannerImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80',
      tripsCount: 12
    }
  };

  // Determine current creator
  const creator = creatorProfilesDirectory[slug] || {
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    handle: slug.replace(/-/g, '_'),
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'Verified Himalayan Creator',
    bio: 'Slow traveler and contributor on Pahadi Basera sharing authentic high-altitude journeys and homestay reviews.',
    specialty: 'Slow Living & Homestays',
    referralCode: 'HIMALAYA8',
    altitudeRecord: '2,400m',
    valleysExplored: ['Mukteshwar', 'Garhwal', 'Kumaon'],
    bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    tripsCount: 8
  };

  useEffect(() => {
    // Check local follow state
    const savedFollow = localStorage.getItem(`pb_following_${creator.handle}`);
    if (savedFollow) {
      setIsFollowing(savedFollow === 'true');
    }

    async function fetchCreatorData() {
      try {
        const [storiesRes, propsRes, trailsRes] = await Promise.allSettled([
          api.get('/api/blogs'),
          api.get('/api/properties/get-all-properties'),
          api.get('/api/community/trails')
        ]);
        if (storiesRes.status === 'fulfilled' && Array.isArray(storiesRes.value.data)) {
          setAllStories(storiesRes.value.data);
        }
        if (propsRes.status === 'fulfilled' && Array.isArray(propsRes.value.data)) {
          setProperties(propsRes.value.data);
        }
        if (trailsRes.status === 'fulfilled' && Array.isArray(trailsRes.value.data)) {
          setTrails(trailsRes.value.data);
        }
      } catch (err) {
        console.error('Failed to fetch creator data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCreatorData();
  }, [creator.handle]);

  const creatorStories = allStories.filter(s => {
    const sAuthor = (s.author?.name || (s as any).authorName || '').toLowerCase();
    const cName = creator.name.toLowerCase();
    return sAuthor.includes(cName) || cName.includes(sAuthor) || slug.includes(sAuthor.replace(/\s+/g, '-'));
  });

  const displayStories = creatorStories.length > 0 ? creatorStories : allStories.slice(0, 3);

  const toggleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    localStorage.setItem(`pb_following_${creator.handle}`, String(next));
    toast.success(next ? `Following @${creator.handle}` : `Unfollowed @${creator.handle}`);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(creator.referralCode);
    setCopiedCode(true);
    toast.success(`Referral code ${creator.referralCode} copied! (5% discount on homestays)`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(`Profile link for ${creator.name} copied!`);
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 font-sans selection:bg-[#10b981] selection:text-white pt-24 pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
        <Link 
          href="/community" 
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Field Notes
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Full Page Profile Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Mountain Cover Banner */}
          <div className="relative h-44 sm:h-64 bg-stone-900 overflow-hidden">
            <img
              src={creator.bannerImage}
              alt={creator.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <button
              onClick={shareProfile}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 transition-all cursor-pointer backdrop-blur-md shadow-sm"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Header Details */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              {/* Avatar with Verified check */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-stone-100 shrink-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-end">
                <Button
                  onClick={toggleFollow}
                  className={`rounded-full text-xs font-semibold px-6 h-10 transition-all cursor-pointer ${
                    isFollowing 
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow Creator'}
                </Button>

                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold transition-all cursor-pointer"
                  title="Copy 5% discount code"
                >
                  {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-700" /> : <Tag className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>5% Guest OFF: <strong className="font-mono">{creator.referralCode}</strong></span>
                </button>
              </div>
            </div>

            {/* Title & Bio */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  {creator.name}
                </h1>
                <span className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0" title="DigiLocker Verified Creator">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              </div>

              <p className="text-xs font-mono text-stone-500">
                @{creator.handle} &bull; <span className="text-stone-700 font-sans font-medium">{creator.role}</span>
              </p>

              <p className="text-sm text-stone-600 font-light leading-relaxed max-w-2xl pt-1">
                {creator.bio}
              </p>
            </div>

            {/* Creator Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100 text-center">
              <div className="p-3 bg-stone-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Stories</span>
                <span className="text-base font-extrabold text-stone-900">{displayStories.length} published</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Highest Peak</span>
                <span className="text-base font-extrabold text-emerald-700">{creator.altitudeRecord}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Expeditions</span>
                <span className="text-base font-extrabold text-stone-900">{creator.tripsCount || 12} logged</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">DigiLocker KYC</span>
                <span className="text-base font-extrabold text-stone-900 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Authenticated
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 mt-8 border-b border-stone-200/80 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('stories')}
                className={`pb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'stories' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Field Notes & Dispatches ({displayStories.length})
                {activeTab === 'stories' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('stays')}
                className={`pb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'stays' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Recommended Baseras
                {activeTab === 'stays' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('trails')}
                className={`pb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'trails' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Mapped Valleys
                {activeTab === 'trails' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-6">
              
              {/* TAB 1: Stories */}
              {activeTab === 'stories' && (
                <div className="space-y-4">
                  {displayStories.map((story) => (
                    <div 
                      key={story.id}
                      className="p-5 rounded-2xl border border-stone-200/80 bg-[#fafaf7] hover:border-stone-300 transition-all flex flex-col sm:flex-row gap-5 items-start justify-between group"
                    >
                      {story.images && story.images.length > 0 && (
                        <img
                          src={story.images[0]}
                          alt={story.title}
                          className="w-full sm:w-44 h-32 rounded-xl object-cover shrink-0"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                          {story.altitude} &bull; {story.duration} &bull; {story.bestSeason}
                        </span>
                        
                        <Link 
                          href={`/blog/${story.id}`}
                          className="text-base font-bold text-stone-900 hover:text-emerald-700 transition-colors block mb-1.5"
                        >
                          {story.title}
                        </Link>

                        <p className="text-xs text-stone-600 font-light line-clamp-2 leading-relaxed">
                          {story.excerpt}
                        </p>

                        <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                          <span className="text-stone-400 text-[11px]">
                            {story.views || '1.4K'} views &bull; {story.likesCount || 38} appreciations
                          </span>
                          
                          <Link 
                            href={`/blog/${story.id}`}
                            className="text-xs font-bold text-stone-900 hover:text-[#10b981] flex items-center gap-1 transition-colors"
                          >
                            Read Full Dispatch <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: Recommended Baseras */}
              {activeTab === 'stays' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {properties.slice(0, 4).map((stay) => (
                    <div key={stay.id} className="p-4 rounded-2xl border border-stone-200 bg-[#fafaf7] flex flex-col justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={stay.bgImage || stay.image} alt={stay.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">{stay.location}</span>
                          <h4 className="text-xs font-bold text-stone-900 truncate">{stay.title}</h4>
                          <p className="text-xs text-stone-500">₹{stay.pricePerNight?.toLocaleString('en-IN')}/night</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                          5% OFF with code: <strong>{creator.referralCode}</strong>
                        </span>
                        <Link 
                          href={`/properties/${stay.id}?ref=${creator.referralCode}`}
                          className="text-xs font-bold text-stone-900 hover:text-[#10b981] flex items-center gap-1"
                        >
                          Book Stay <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Mapped Valleys */}
              {activeTab === 'trails' && (
                <div className="space-y-3">
                  {trails.map((trail) => (
                    <div key={trail.id} className="p-4 rounded-2xl border border-stone-200 bg-[#fafaf7] flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">{trail.location}</span>
                        <h4 className="text-sm font-bold text-stone-900">{trail.title}</h4>
                        <p className="text-xs text-stone-500 font-light mt-0.5">{trail.description}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-emerald-800 border border-emerald-200 shrink-0">
                        {trail.altitude}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
