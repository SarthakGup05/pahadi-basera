'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, ArrowRight, BookOpen, Compass, TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Banner from '@/components/ui/Banner';
import { blogLogs, BlogItem } from '@/lib/blogData';

export default function BlogFeedPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('http://localhost:5000/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((post: any) => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              altitude: post.altitude,
              duration: post.duration,
              author: {
                name: post.authorName,
                role: post.authorRole,
                avatar: post.authorAvatar,
                socials: { instagram: '#', twitter: '#', substack: '#' }
              },
              images: post.images,
              views: post.views,
              tags: post.tags,
              difficulty: post.difficulty as any,
              bestSeason: post.bestSeason,
              gearList: post.gearList,
              routeCoordinates: post.routeCoordinates || []
            }));
            setBlogs(mapped);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch blogs from API, falling back to local data:', err);
      }
      setBlogs(blogLogs);
    }
    fetchBlogs().finally(() => setLoading(false));
  }, []);

  // Extract all unique tags
  const allTags = Array.from(new Set(blogs.flatMap((log) => log.tags)));

  // Filter journals
  const filteredBlogs = blogs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || log.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const featuredBlog = blogs[0]; // Set the first blog as the featured spotlight
  const listBlogs = filteredBlogs.filter((log) => !featuredBlog || log.id !== featuredBlog.id || selectedTag || searchQuery);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Journals', isCurrent: true }
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-dashed border-[#10b981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen pb-24 font-sans text-gray-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Banner */}
      <Banner
        title="Mountain Journals"
        subtitle="Unfiltered travel logs, high-altitude hiking maps, local gastronomical records, and stargazing chronicles written directly from the ridges."
        bgImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop"
        height="md"
        badge="Himalayan Diaries"
        breadcrumbItems={breadcrumbs}
      />

      <div className="max-w-[1250px] mx-auto px-6 mt-12 sm:mt-16">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-gray-200/60 rounded-3xl p-5 shadow-sm mb-12">
          
          {/* Tag Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs font-semibold py-2 px-4 rounded-full border transition-all shrink-0 ${
                selectedTag === null
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              All Logs
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs font-semibold py-2 px-4 rounded-full border transition-all shrink-0 ${
                  selectedTag === tag
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Search Engine */}
          <div className="relative w-full md:w-80 group shrink-0">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <Input
              type="text"
              placeholder="Search journals or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm bg-gray-50/50 focus:bg-white"
            />
          </div>

        </div>

        {/* Feature Spotlight Section (Only visible when no search query/tag is selected) */}
        {!searchQuery && !selectedTag && featuredBlog && (
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white border border-emerald-100 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[#10b981] text-[10px] font-bold tracking-[0.25em] uppercase">
                Featured Journal
              </span>
            </div>
            
            <Link
              href={`/blog/${featuredBlog.id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-[2.5rem] border border-gray-200/70 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ease-out"
            >
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-[450px] relative p-4 pb-0 lg:pb-4 lg:pr-0">
                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-zinc-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-85 transition-opacity" />
                  <img
                    src={featuredBlog.images[0]}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 text-white text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{featuredBlog.routeCoordinates[0]?.name || 'Himalayas'}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 lg:py-10 lg:pr-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs font-bold text-emerald-600 mb-4">
                  <span className="bg-emerald-50 px-3 py-1 rounded-md">Alt: {featuredBlog.altitude}</span>
                  <span>•</span>
                  <span>{featuredBlog.duration}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight leading-snug mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  {featuredBlog.title}
                </h3>

                <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
                  {featuredBlog.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredBlog.author.avatar}
                      alt={featuredBlog.author.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-none mb-1">{featuredBlog.author.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{featuredBlog.author.role}</p>
                    </div>
                  </div>

                  <div className="h-10 px-5 rounded-xl bg-gray-900 group-hover:bg-[#10b981] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors duration-300">
                    <span>Read Log</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Blog Feed Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-gray-900 text-lg uppercase tracking-wider">
              {searchQuery || selectedTag ? 'Search Results' : 'All Expedition Journals'}
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredBlogs.length} articles
            </span>
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {filteredBlogs.map((log) => (
                <Link
                  key={log.id}
                  href={`/blog/${log.id}`}
                  className="group flex flex-col bg-white rounded-[2rem] border border-gray-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
                >
                  <div className="w-full h-48 sm:h-52 shrink-0 relative p-3 pb-0">
                    <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-75 transition-opacity" />
                      <img
                        src={log.images[0]}
                        alt={log.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 z-20 flex gap-2">
                        <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold tracking-widest uppercase rounded-lg border border-white/10 shadow-sm">
                          {log.views} views
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 text-white text-[11px] font-bold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{log.tags[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                      {log.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-[#10b981] bg-emerald-50 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-gray-900 font-bold text-lg leading-snug mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
                      {log.title}
                    </h4>

                    <p className="text-gray-500 text-xs font-light leading-relaxed mb-6 line-clamp-3">
                      {log.excerpt}
                    </p>

                    <div className="flex-1" />

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={log.author.avatar}
                          alt={log.author.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">{log.author.name}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">{log.author.role}</p>
                        </div>
                      </div>

                      <div className="h-8 w-8 rounded-full bg-gray-50 group-hover:bg-[#10b981] group-hover:text-white text-gray-700 flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                <Compass className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Journals Found</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm">
                We couldn't find any travel logs matching your search criteria. Try using different keywords or tags.
              </p>
              <Button
                onClick={handleResetFilters}
                className="rounded-xl bg-gray-900 hover:bg-emerald-500 text-white px-6 h-11 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset Filters
              </Button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
