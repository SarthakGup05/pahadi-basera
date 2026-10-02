'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  ArrowRight,
  Globe,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  Phone,
  Compass,
  CheckCircle2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

const TravelCommunity = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Explorers Club Invite Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [hubChoice, setHubChoice] = useState<'whatsapp' | 'discord'>('whatsapp');
  const [contactValue, setContactValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get<any[]>('/api/blogs');
        if (Array.isArray(data)) {
          const formatted = data.map((b: any) => ({
            id: b.id,
            title: b.title,
            excerpt: b.excerpt,
            altitude: b.altitude || '2,400m',
            duration: b.duration || '3 Days',
            author: {
              name: b.author?.name || b.authorName || 'Himalayan Explorer',
              role: b.author?.role || b.authorRole || 'Alpine Chronicler',
              avatar: b.author?.avatar || b.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              socials: b.author?.socials || { instagram: '#', twitter: '#', substack: '#' }
            },
            images: Array.isArray(b.images) && b.images.length > 0 ? b.images : ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'],
            views: b.views || '1.2K views',
            tags: Array.isArray(b.tags) && b.tags.length > 0 ? b.tags : ['Himalayas', 'Expedition']
          }));
          setBlogs(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch community blogs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleJoinCommunity = () => {
    setIsSubmitted(false);
    setIsInviteModalOpen(true);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) {
      toast.error('Please enter your contact details to receive your invite.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Welcome to Pahadi Explorers Club! Your invitation has been dispatched.');
    }, 600);
  };

  return (
    <section id="community" className="w-full py-16 px-4 bg-zinc-50 relative overflow-hidden border-t border-gray-100/60 z-10 font-sans">

      {/* Ambient Topographic Lighting Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] left-[5%] w-[600px] h-[600px] bg-emerald-400/5 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[10%] w-[550px] h-[550px] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply" />

        {/* Abstract Fluid Topography SVG */}
        <svg className="absolute w-full h-full bottom-0 left-0 opacity-[0.03] text-gray-900" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
          <path d="M-100 500 C400 100 700 600 1500 -100" stroke="currentColor" strokeWidth="2" />
          <path d="M-100 550 C400 150 700 650 1500 -50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M-100 600 C400 200 700 700 1500 0" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-[1250px] mx-auto relative z-10">

        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white border border-emerald-100 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#10b981] text-[10px] font-bold tracking-[0.25em] uppercase">
              Himalayan Community Hub
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-light text-gray-900 tracking-tight leading-[1.1]">
            Explore Mountain <span className="font-normal italic text-[#10b981] relative inline-block">
              Journals
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#10b981]/20" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-sm md:text-base font-light text-gray-500 leading-relaxed mt-6 max-w-lg mx-auto">
            Discover real-life high-altitude chronicles, native recipes, astrophotography guides, and hidden routes logged by seasonal travelers.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-24">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm animate-pulse p-4">
                <div className="w-full h-48 bg-gray-200 rounded-[1.5rem] mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-4/5 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 max-w-lg mx-auto shadow-sm mb-24">
            <Sparkles className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Mountain Stories Incoming</h3>
            <p className="text-sm text-gray-500">Fresh expedition logs and travel guides are being drafted. Check back soon!</p>
          </div>
        )}

        {/* 3-Column Blog Cards Grid */}
        {!isLoading && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-24 text-left">
            {blogs.slice(0, 3).map((log) => (
              <Link
                key={log.id}
                href={`/blog/${log.id}`}
                className="group flex flex-col bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 hover:border-emerald-100/50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                {/* Card Images Segment */}
                <div className="w-full h-48 sm:h-52 shrink-0 relative p-2.5 pb-0">
                  <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-sm bg-zinc-100">

                    {/* Subtle vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

                    {/* Main cover image */}
                    <img
                      src={log.images[0]}
                      alt={log.title}
                      className="w-full h-full object-cover transform-gpu transition-transform duration-[10000ms] ease-out group-hover:scale-110"
                    />

                    {/* Top Stats badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                      <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-[9px] font-bold tracking-widest uppercase rounded-lg border border-white/20 shadow-sm">
                        {log.views}
                      </span>
                      <span className="text-[9px] font-bold tracking-widest text-emerald-300 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                        {log.duration}
                      </span>
                    </div>

                    {/* Location & Altitude Bottom Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-white text-[11px] font-bold tracking-wider drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {log.tags[0] || 'Himalayas'}
                      </div>
                      <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest drop-shadow-md">
                        Alt: {log.altitude}
                      </span>
                    </div>

                  </div>
                </div>

              {/* Card Content details */}
              <div className="p-6 md:p-7 flex flex-col flex-1 bg-white">

                {/* Hash Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {Array.isArray(log.tags) && log.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-[#10b981] bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-100/50">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Blog Journal Title */}
                <h3 className="text-gray-900 group-hover:text-[#10b981] transition-colors duration-300 font-semibold text-lg md:text-xl leading-snug mb-3 line-clamp-2">
                  {log.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs font-light text-gray-500 leading-relaxed mb-6 line-clamp-3">
                  {log.excerpt}
                </p>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Blogger bio & Profile footer */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-zinc-200 ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <img src={log.author.avatar} alt={log.author.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-tight mb-0.5">{log.author.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{log.author.role}</p>
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}

        {/* Unified Premium Call to Action Banner */}
        <div className="relative overflow-hidden bg-zinc-950 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] z-10 border border-white/10 group/banner">

          {/* Ambient Inner Glows */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/20 blur-[140px] rounded-full pointer-events-none transition-opacity duration-700 group-hover/banner:opacity-70" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

          {/* Noise/Grid Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Users className="w-3.5 h-3.5" /> Join 12,000+ Himalayan Chasers
              </span>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-tight mb-5">
                The Pahadi <span className="font-semibold italic text-[#10b981]">Explorers Club</span>
              </h3>

              <p className="text-sm font-light text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect with passionate explorers, access exclusive unpublished maps of off-beat trails, coordinate hiking rides, and support local mountain homesteaders.
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center lg:items-end gap-4">
              <Button
                onClick={handleJoinCommunity}
                className="bg-[#10b981] hover:bg-[#0e9f6e] text-white rounded-2xl px-8 h-14 text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-0 group/join cursor-pointer hover:scale-105 hover:-translate-y-1"
              >
                Request Free Invite
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/join:translate-x-0.5 group-hover/join:-translate-y-0.5" />
              </Button>

              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                WhatsApp & Discord
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Explorers Club Frosted-Glass Dialog */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="max-w-md w-full bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] text-stone-900">
          <DialogHeader className="text-center sm:text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10b981] mb-1 shadow-xs">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-light tracking-tight text-stone-900">
              The Pahadi <span className="font-semibold text-[#10b981]">Explorers Club</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 font-light leading-relaxed">
              Join 12,000+ high-altitude backpackers, photographers, native guides, and homestay hosts across the Himalayas.
            </DialogDescription>
          </DialogHeader>

          {!isSubmitted ? (
            <form onSubmit={handleInviteSubmit} className="mt-5 space-y-4">
              {/* Field 1: Hub Preference Toggle Buttons */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block text-left">
                  1. Select Preferred Community Hub
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setHubChoice('whatsapp'); setContactValue(''); }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      hubChoice === 'whatsapp'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#10b981]" /> WhatsApp
                      </span>
                      {hubChoice === 'whatsapp' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal leading-tight">
                      Live trail alerts, road closures & rides
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setHubChoice('discord'); setContactValue(''); }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      hubChoice === 'discord'
                        ? 'border-[#5865F2] bg-indigo-50/70 text-indigo-950 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#5865F2]" /> Discord Server
                      </span>
                      {hubChoice === 'discord' && (
                        <span className="w-2 h-2 rounded-full bg-[#5865F2]" />
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 font-normal leading-tight">
                      Photo critiques, maps & route planning
                    </span>
                  </button>
                </div>
              </div>

              {/* Field 2: Contact Information */}
              <div className="space-y-1.5 text-left pt-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
                  {hubChoice === 'whatsapp' ? '2. WhatsApp Phone Number' : '2. Discord Username or Tag'}
                </label>

                {hubChoice === 'whatsapp' ? (
                  <div className="flex gap-2">
                    <span className="h-11 px-3.5 bg-stone-100 border border-stone-200 rounded-xl flex items-center font-bold text-xs text-stone-700 select-none">
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#10b981] font-medium"
                    />
                  </div>
                ) : (
                  <Input
                    type="text"
                    placeholder="@mountain_explorer or username#1234"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    required
                    className="h-11 rounded-xl bg-stone-50/80 border-stone-200 text-xs focus-visible:ring-[#5865F2] font-medium"
                  />
                )}
                <p className="text-[10px] text-stone-400 font-light">
                  {hubChoice === 'whatsapp' 
                    ? 'We will send your one-time private group invitation link via SMS.' 
                    : 'We will dispatch a direct server invitation bot link.'}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-stone-900 hover:bg-[#10b981] text-white text-xs uppercase tracking-widest font-bold border-0 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer mt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Dispatching Invite...
                  </>
                ) : (
                  'Request Access Code'
                )}
              </Button>
            </form>
          ) : (
            /* Instant Action Step */
            <div className="mt-5 space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900">Invitation Granted!</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Your token has been verified. You can now jump straight into the sanctuary:
                </p>
              </div>

              {hubChoice === 'whatsapp' ? (
                <a
                  href="https://chat.whatsapp.com/invite/pahadibasera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open WhatsApp Community
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <a
                  href="https://discord.gg/pahadibasera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  Join Discord Sanctuary
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-[11px] text-stone-400 hover:text-stone-700 transition cursor-pointer font-medium pt-1"
              >
                Close Window
              </button>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <p className="text-[10px] text-stone-400 font-light flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#10b981]" /> Verified Himalayan Community &bull; Zero Spam Policy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TravelCommunity;