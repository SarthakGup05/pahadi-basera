'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Compass, 
  MessageSquare, 
  Flame, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ChevronRight, 
  FolderHeart, 
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Banner from '@/components/ui/Banner';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  communityTrails, 
  communityMembers, 
  communityThreads, 
  localRecipes,
  CommunityThread,
  CommunityTrail,
  LocalRecipe
} from '@/lib/blogData';

// Helper to format time ago for threads
const formatTimeAgo = (dateString: string) => {
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
  return `${days} days ago`;
};

export default function CommunityHubPage() {
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [trails, setTrails] = useState<CommunityTrail[]>([]);
  const [recipes, setRecipes] = useState<LocalRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trails');

  // Discussion Form States
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Gear' | 'Routes' | 'Homestays' | 'Permits'>('Routes');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchCommunityData() {
      // 1. Fetch Trails
      try {
        const res = await fetch('http://localhost:5000/api/community/trails');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTrails(data);
          } else {
            setTrails(communityTrails);
          }
        } else {
          setTrails(communityTrails);
        }
      } catch (err) {
        console.error('Failed to fetch trails, using fallback:', err);
        setTrails(communityTrails);
      }

      // 2. Fetch Recipes
      try {
        const res = await fetch('http://localhost:5000/api/community/recipes');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRecipes(data);
          } else {
            setRecipes(localRecipes);
          }
        } else {
          setRecipes(localRecipes);
        }
      } catch (err) {
        console.error('Failed to fetch recipes, using fallback:', err);
        setRecipes(localRecipes);
      }

      // 3. Fetch Threads
      try {
        const res = await fetch('http://localhost:5000/api/community/threads');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((t: any) => ({
              id: t.id,
              title: t.title,
              author: { name: t.authorName, avatar: t.authorAvatar },
              category: t.category as any,
              replies: t.replies,
              upvotes: t.upvotes,
              timeAgo: formatTimeAgo(t.createdAt)
            }));
            setThreads(mapped);
          } else {
            setThreads(communityThreads);
          }
        } else {
          setThreads(communityThreads);
        }
      } catch (err) {
        console.error('Failed to fetch threads, using fallback:', err);
        setThreads(communityThreads);
      }

      setLoading(false);
    }

    fetchCommunityData();
  }, []);

  // Upvote helper
  const handleUpvote = async (id: string) => {
    // Optimistic UI update
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, upvotes: t.upvotes + 1 };
      }
      return t;
    }));

    try {
      await fetch(`http://localhost:5000/api/community/threads/${id}/upvote`, {
        method: 'POST'
      });
    } catch (err) {
      console.error('Failed to upvote thread in API:', err);
    }
  };

  // Submit discussion
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const payload = {
      title: newTitle,
      category: newCategory,
      authorName: 'Guest Explorer',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'
    };

    // Optimistic / immediate add to state
    const tempId = `thread-${Date.now()}`;
    const newThreadLocal: CommunityThread = {
      id: tempId,
      title: newTitle,
      author: {
        name: payload.authorName,
        avatar: payload.authorAvatar
      },
      category: newCategory,
      replies: 0,
      upvotes: 1,
      timeAgo: 'Just now'
    };

    setThreads(prev => [newThreadLocal, ...prev]);
    setNewTitle('');
    setIsDialogOpen(false);
    setActiveTab('discussions');

    try {
      const res = await fetch('http://localhost:5000/api/community/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setThreads(prev => prev.map(t => t.id === tempId ? {
          id: created.id,
          title: created.title,
          category: created.category as any,
          replies: created.replies,
          upvotes: created.upvotes,
          author: {
            name: created.authorName,
            avatar: created.authorAvatar
          },
          timeAgo: 'Just now'
        } : t));
      }
    } catch (err) {
      console.error('Failed to save new thread to API:', err);
    }
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Community', isCurrent: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-dashed border-[#10b981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen pb-24 font-sans text-gray-800 antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* Banner */}
      <Banner
        title="Explorers Community"
        subtitle="Welcome to the high-altitude slow travel guild. Share trail coordinates, find trekking partners, exchange local recipes, and keep mountain heritage alive."
        bgImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
        height="md"
        badge="Pahadi Explorers Club"
        breadcrumbItems={breadcrumbs}
      />

      <div className="max-w-[1250px] mx-auto px-6 mt-12 sm:mt-16">
        
        {/* Live Guild Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-16 relative overflow-hidden">
          {/* Subtle noise pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          
          <div className="flex flex-col p-4 text-center md:text-left relative z-10 border-r border-gray-150 last:border-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1">
              <Users className="w-3.5 h-3.5 text-[#10b981]" /> Active Explorers
            </span>
            <span className="text-3xl font-extrabold text-gray-900 leading-none">12,450+</span>
          </div>

          <div className="flex flex-col p-4 text-center md:text-left relative z-10 md:border-r border-gray-150 last:border-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#10b981]" /> Mapped Trails
            </span>
            <span className="text-3xl font-extrabold text-gray-900 leading-none">158</span>
          </div>

          <div className="flex flex-col p-4 text-center md:text-left relative z-10 border-r border-gray-150 last:border-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1">
              <Compass className="w-3.5 h-3.5 text-[#10b981]" /> Certified Guides
            </span>
            <span className="text-3xl font-extrabold text-gray-900 leading-none">42</span>
          </div>

          <div className="flex flex-col p-4 text-center md:text-left relative z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#10b981]" /> Thread Logs
            </span>
            <span className="text-3xl font-extrabold text-gray-900 leading-none">1,290+</span>
          </div>
        </div>

        {/* Tabs Control Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-200 pb-5">
            <TabsList className="bg-gray-100/80 p-1.5 rounded-2xl flex flex-wrap gap-1 max-w-full">
              <TabsTrigger value="trails" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer">
                Trails & Maps
              </TabsTrigger>
              <TabsTrigger value="members" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer">
                Chasers Board
              </TabsTrigger>
              <TabsTrigger value="discussions" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer">
                Forum Threads
              </TabsTrigger>
              <TabsTrigger value="recipes" className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer">
                Pahadi Kitchen
              </TabsTrigger>
            </TabsList>

            {/* Start discussion CTA trigger */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-zinc-950 hover:bg-[#10b981] text-white px-5 h-11 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border-0 cursor-pointer shadow-md hover:shadow-lg">
                  <Plus className="w-4 h-4" /> Start Discussion
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md bg-white border border-gray-150 rounded-2xl p-6 shadow-2xl text-left">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold text-gray-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#10b981] animate-pulse" /> Launch New Thread
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-500 font-light leading-relaxed">
                    Ask questions about trails, gear recommendations, permits, or homestays. The community usually responds within an hour.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateThread} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Question / Discussion Title</label>
                    <Input
                      type="text"
                      placeholder="e.g. Is Jalori Pass walkable without cleats in late Nov?"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="h-11 border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="h-11 border border-gray-200 bg-gray-50/50 rounded-xl px-3 text-sm font-medium outline-none focus:border-[#10b981] focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Routes">Routes & Maps</option>
                      <option value="Gear">Alpine Gear</option>
                      <option value="Homestays">Homestay Stays</option>
                      <option value="Permits">Border Permits</option>
                    </select>
                  </div>

                  <DialogFooter className="pt-4 gap-2 flex flex-row justify-end items-center">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="rounded-xl border-gray-200 text-gray-700 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" className="rounded-xl bg-[#10b981] hover:bg-[#0e9f6e] text-white h-10 px-5 text-xs font-bold uppercase tracking-wider border-0 cursor-pointer shadow-sm">
                      Post Thread
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* TAB CONTENT: Trails */}
          <TabsContent value="trails">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trails.map((trail) => (
                <div 
                  key={trail.id}
                  className="group flex flex-col bg-white rounded-[2rem] border border-gray-200/70 p-6 shadow-sm text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-[#10b981] text-[10px] font-bold tracking-wider uppercase rounded-lg border border-emerald-100/50">
                      {trail.location.split(',')[0]}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      trail.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                      trail.difficulty === 'Moderate' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>{trail.difficulty}</span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-emerald-600 transition-colors mb-2">
                    {trail.title}
                  </h4>

                  <p className="text-gray-500 text-xs font-light leading-relaxed mb-6">
                    {trail.description}
                  </p>

                  <div className="flex-1" />

                  <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between text-[11px] font-medium text-gray-600">
                      <span>Coordinates:</span>
                      <span className="font-mono text-gray-900">{trail.coordinates}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-gray-600">
                      <span>Mapped By:</span>
                      <span className="font-bold text-stone-900">{trail.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB CONTENT: Members */}
          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {communityMembers.map((member) => (
                <div 
                  key={member.id}
                  className="group flex flex-col bg-white rounded-[2rem] border border-gray-200/70 p-6 shadow-sm text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-base leading-tight mb-1">{member.name}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${member.badgeColor}`}>
                        {member.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs font-light leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  <div className="flex-1" />

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-medium text-gray-500">Expeditions Logged:</span>
                    <span className="text-sm font-extrabold text-[#10b981]">{member.tripsCount} runs</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB CONTENT: Discussions */}
          <TabsContent value="discussions">
            <div className="bg-white border border-gray-200/60 rounded-3xl p-5 shadow-sm space-y-4">
              {threads.map((thread) => (
                <div 
                  key={thread.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 hover:border-emerald-100/50 hover:bg-emerald-50/5 rounded-2xl transition-all duration-300 text-left"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={thread.author.avatar} 
                      alt={thread.author.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="space-y-1">
                      <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-100/50 rounded-md px-2 py-0.5 uppercase tracking-widest">
                        {thread.category}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm leading-snug sm:text-base hover:text-emerald-600 transition-colors">
                        {thread.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium">
                        By {thread.author.name} &bull; {thread.timeAgo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <button 
                      onClick={() => handleUpvote(thread.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 text-xs font-bold text-gray-700 hover:text-emerald-600 transition-all cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-rose-500" />
                      <span>{thread.upvotes}</span>
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span>{thread.replies}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB CONTENT: Recipes */}
          <TabsContent value="recipes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recipes.map((recipe) => (
                <div 
                  key={recipe.id}
                  className="group grid grid-cols-1 sm:grid-cols-12 bg-white rounded-[2rem] border border-gray-200/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className="sm:col-span-5 h-44 sm:h-full relative shrink-0">
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold tracking-widest uppercase rounded-lg border border-white/10 shadow-sm">
                        {recipe.origin}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-emerald-600 transition-colors mb-4">
                        {recipe.name}
                      </h4>

                      <div className="mb-4">
                        <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ingredients</span>
                        <ul className="grid grid-cols-1 gap-1 text-[11px] text-gray-600 font-light">
                          {recipe.ingredients.slice(0, 4).map((ing, i) => (
                            <li key={i} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                              <span className="truncate">{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-4 flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Method: {recipe.steps.length} steps</span>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer group/read">
                            Cook Recipe <ArrowUpRight className="w-3.5 h-3.5 group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 transition-transform" />
                          </button>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-lg bg-white border border-gray-150 rounded-2xl p-6 shadow-2xl text-left">
                          <DialogHeader className="mb-6">
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2.5 py-1 w-fit uppercase tracking-widest mb-2">
                              {recipe.origin} Traditional Dish
                            </span>
                            <DialogTitle className="text-2xl font-light text-gray-900">
                              How to cook <span className="font-semibold italic text-[#10b981]">{recipe.name}</span>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
                            {/* Ingredients */}
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Ingredient Checklist</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {recipe.ingredients.map((ing, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-light">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0" />
                                    <span>{ing}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Preparation Steps */}
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Preparation Steps</span>
                              <div className="space-y-4">
                                {recipe.steps.map((step, idx) => (
                                  <div key={idx} className="flex gap-3">
                                    <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 text-[#10b981] text-[10px] font-bold flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </span>
                                    <p className="text-xs text-gray-650 leading-relaxed font-light">{step}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <DialogFooter className="pt-6 border-t border-gray-100">
                            <DialogClose asChild>
                              <Button className="rounded-xl bg-zinc-900 hover:bg-[#10b981] text-white h-10 px-6 text-xs font-bold uppercase tracking-wider cursor-pointer border-0">
                                Got it
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

        </Tabs>

      </div>

    </div>
  );
}
