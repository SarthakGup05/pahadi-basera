'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Eye, Compass, Calendar, ShieldCheck, Heart, Share2, Info } from 'lucide-react';
import Banner from '@/components/ui/Banner';
import { Button } from '@/components/ui/button';
import { blogLogs, BlogItem } from '@/lib/blogData';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [mounted, setMounted] = useState(false);
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchBlog() {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            const mapped: BlogItem = {
              id: data.id,
              title: data.title,
              excerpt: data.excerpt,
              content: data.content,
              altitude: data.altitude,
              duration: data.duration,
              author: {
                name: data.authorName,
                role: data.authorRole,
                avatar: data.authorAvatar,
                socials: { instagram: '#', twitter: '#', substack: '#' }
              },
              images: data.images,
              views: data.views,
              tags: data.tags,
              difficulty: data.difficulty as any,
              bestSeason: data.bestSeason,
              gearList: data.gearList,
              routeCoordinates: data.routeCoordinates || []
            };
            setBlog(mapped);
            setLikes(Math.floor(parseFloat(mapped.views) * 10) + 12);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch blog details from API, falling back to local data:', err);
      }

      // Fallback to static data
      const foundBlog = blogLogs.find((b) => b.id === slug);
      if (foundBlog) {
        setBlog(foundBlog);
        setLikes(Math.floor(parseFloat(foundBlog.views) * 10) + 12);
      }
    }
    fetchBlog().finally(() => setLoading(false));
  }, [slug]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-dashed border-[#10b981] animate-spin" />
      </div>
    );
  }

  // 404 Fallback if blog slug is invalid
  if (!blog) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full border border-dashed border-rose-400 text-rose-500 flex items-center justify-center mb-6 bg-rose-50/50">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-light text-stone-900 tracking-tight mb-2">Journal Not Found</h2>
        <p className="text-sm font-light text-stone-500 leading-relaxed mb-8 max-w-sm">
          We couldn't locate the mountain journal matching the slug <span className="font-bold text-stone-950">"{slug}"</span>. Let's return to the active feed!
        </p>
        <Button asChild className="rounded-xl bg-stone-900 hover:bg-[#10b981] text-white px-8 h-12 text-xs font-bold tracking-widest uppercase border-0 cursor-pointer">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Feed
          </Link>
        </Button>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Journals', href: '/blog' },
    { label: blog.title, isCurrent: true }
  ];

  // Get other recommended blogs
  const recommendedBlogs = blogLogs.filter((b) => b.id !== blog.id).slice(0, 3);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-stone-800 selection:bg-[#10b981]/20 selection:text-[#0e9f6e] relative overflow-hidden">
      
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:48px_48px] opacity-40" />
        <div className="absolute top-[25%] -left-[10%] w-[700px] h-[700px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] -right-[15%] w-[650px] h-[650px] bg-blue-500/5 blur-[130px] rounded-full mix-blend-multiply" />
      </div>

      {/* Cinematic Header Banner */}
      <div className="relative z-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
        <Banner
          title={blog.title}
          subtitle={blog.excerpt}
          badge={`Alt: ${blog.altitude} • ${blog.duration}`}
          bgImage={blog.images[0]}
          height="lg"
          overlayOpacity="dark"
          breadcrumbItems={breadcrumbs}
        >
          <Button
            asChild
            variant="outline"
            className="group/back relative overflow-hidden rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 px-8 h-12 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-500 ease-out pointer-events-auto"
          >
            <Link href="/blog" className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover/back:-translate-x-1">
                <ArrowLeft className="w-3 h-3" />
              </div>
              <span className="relative z-10">Back to Journals</span>
            </Link>
          </Button>
        </Banner>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Article Body & Author details */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Article Block */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-stone-200/55 shadow-sm text-left">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <p className="text-sm font-bold text-stone-900 leading-tight mb-0.5">{blog.author.name}</p>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">{blog.author.role}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                    hasLiked
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 stroke-rose-500' : ''}`} />
                  <span>{likes}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('📋 Link copied to clipboard!');
                  }}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"
                  title="Share post"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Render HTML content */}
            <div 
              className="prose prose-emerald max-w-none text-stone-700 font-light"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Image Showcase */}
            {blog.images.length > 1 && (
              <div className="mt-10 rounded-[2rem] overflow-hidden shadow-md">
                <img 
                  src={blog.images[1]} 
                  alt="Secondary scenic view" 
                  className="w-full h-80 object-cover" 
                />
              </div>
            )}

            {/* Tags footer */}
            <div className="flex items-center gap-2 mt-10 pt-6 border-t border-stone-100 flex-wrap">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">Tags:</span>
              {blog.tags.map((tag) => (
                <span key={tag} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Stats & Checkpoints */}
        <div className="lg:col-span-4 lg:sticky lg:top-[90px] space-y-8">
          
          {/* Trek Stats summary */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-250/50 shadow-sm text-left">
            <span className="text-[8px] text-stone-400 uppercase tracking-[0.2em] font-bold block mb-1">Trek Parameters</span>
            <h3 className="text-2xl font-light tracking-tight text-stone-900 mb-6">
              Expedition <span className="font-normal italic text-[#10b981]">Stats</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-xs font-medium text-stone-500">Trek Difficulty</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  blog.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                  blog.difficulty === 'Moderate' ? 'bg-amber-50 text-amber-700' :
                  'bg-rose-50 text-rose-700'
                }`}>{blog.difficulty}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-xs font-medium text-stone-500">Best Season</span>
                <span className="text-xs font-bold text-stone-800">{blog.bestSeason}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-xs font-medium text-stone-500">Stay Duration</span>
                <span className="text-xs font-bold text-stone-800">{blog.duration}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-medium text-stone-500">Peak Altitude</span>
                <span className="text-xs font-bold text-emerald-600">{blog.altitude}</span>
              </div>
            </div>
          </div>

          {/* Route timeline coordinates */}
          {blog.routeCoordinates.length > 0 && (
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-250/50 shadow-sm text-left">
              <h3 className="text-lg font-semibold text-stone-900 mb-6 leading-tight">
                Altitude <span className="font-normal italic text-[#10b981]">Timeline Profile</span>
              </h3>
              
              <div className="relative pl-5 border-l border-stone-200 space-y-6 ml-2 py-1">
                {blog.routeCoordinates.map((coord, idx) => (
                  <div key={idx} className="relative text-left">
                    <div className="absolute left-[-26px] top-1 w-3 h-3 rounded-full bg-white border border-stone-300 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 group-hover:bg-[#10b981]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-850 leading-tight">{coord.name}</h4>
                      <span className="text-[9px] text-[#10b981] font-bold uppercase tracking-wider">{coord.alt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gear checklist */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-250/50 shadow-sm text-left">
            <span className="text-[8px] text-stone-400 uppercase tracking-[0.2em] font-bold block mb-1">Recommended Gear</span>
            <h3 className="text-lg font-semibold text-stone-900 mb-6 leading-tight">
              Essential <span className="font-normal italic text-[#10b981]">Alpine Kit</span>
            </h3>

            <ul className="space-y-3.5">
              {blog.gearList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-light text-stone-600">
                  <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Section: Recommended Read logs */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 mt-20 border-t border-stone-200/50 pt-16 text-left">
        <h3 className="text-2xl sm:text-3xl font-light text-stone-900 tracking-tight mb-8">
          More <span className="font-normal italic text-[#10b981]">Expedition Chronicles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendedBlogs.map((rec) => (
            <Link
              key={rec.id}
              href={`/blog/${rec.id}`}
              className="group flex flex-col bg-white rounded-3xl border border-stone-200/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-full h-40 relative">
                <img 
                  src={rec.images[0]} 
                  alt={rec.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-[9px] font-bold text-[#10b981] uppercase tracking-wider mb-2">Alt: {rec.altitude}</span>
                <h4 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors mb-3">
                  {rec.title}
                </h4>
                <p className="text-[11px] font-light text-stone-500 line-clamp-2 leading-relaxed">
                  {rec.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
