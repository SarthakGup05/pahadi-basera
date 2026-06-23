'use client';

import React from 'react';
import {
  Users,
  MapPin,
  ArrowRight,
  Globe,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const blogLogs = [
  {
    id: 'chopta-meadows',
    title: 'The Silent Meadows of Chopta: A Winter Solitude Log',
    excerpt: 'Stepping off the grid into deep pine woodlands covered in thick snow. This is the story of discovering pristine silent ridges untouched by mainstream tourism.',
    altitude: '2,680m',
    duration: '3 Days Trek',
    author: {
      name: 'Aarav Semwal',
      role: 'Alpine Photographer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      socials: { instagram: '#', twitter: '#', substack: '#' }
    },
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
    ],
    views: '12.4K views',
    tags: ['Chopta', 'Garhwal', 'Solo Trek']
  },
  {
    id: 'almora-retreat',
    title: 'Discovering Secret Wild Orchards in Almora',
    excerpt: 'Living alongside local Kumaoni farmers in ancestral stone houses. A journey into sustainable organic farming, slow forest bathing, and traditional local cuisine.',
    altitude: '1,600m',
    duration: '5 Days Rest',
    author: {
      name: 'Priyanka Rawat',
      role: 'Cultural Gastronomist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      socials: { instagram: '#', twitter: '#', substack: '#' }
    },
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    views: '9.8K views',
    tags: ['Almora', 'Kumaon', 'Organic']
  },
  {
    id: 'auli-slopes',
    title: 'Living Under the Panchachuli Stars in Auli',
    excerpt: 'An expedition report detailing the sub-zero stargazing conditions, astrophotography techniques, and building fires underneath high Himalayan peaks.',
    altitude: '3,050m',
    duration: '4 Days Camp',
    author: {
      name: 'Vikram Negi',
      role: 'Astro-Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      socials: { instagram: '#', twitter: '#', substack: '#' }
    },
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    views: '15.6K views',
    tags: ['Auli', 'Stargazing', 'Telescope']
  }
];

const TravelCommunity = () => {
  const handleJoinCommunity = () => {
    alert(
      `💚 Welcome to the Pahadi Explorers Community!\n\n` +
      `We have sent your invite token to join our exclusive WhatsApp & Discord Hub of 12,000+ mountain hikers, native guides, and homestay hosts.`
    );
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

        {/* 3-Column Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-24 text-left">
          {blogLogs.map((log) => (
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
                      {log.views} views
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-emerald-300 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                      {log.duration}
                    </span>
                  </div>

                  {/* Location & Altitude Bottom Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white text-[11px] font-bold tracking-wider drop-shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {log.tags[0]}
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
                  {log.tags.map((tag, i) => (
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
    </section>
  );
};

export default TravelCommunity;