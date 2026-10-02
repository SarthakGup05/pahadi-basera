'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BlogItem } from '@/lib/blogData';
import { 
  Share2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Mountain, 
  MapPin, 
  Send, 
  Compass,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface StoryShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: BlogItem | null;
}

export default function StoryShareModal({
  open,
  onOpenChange,
  story,
}: StoryShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!story) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pahadibasera.com';
  const shareUrl = `${origin}/community#${story.id}`;
  const shareText = `Check out this Himalayan field note "${story.title}" logged by ${story.author.name} (${story.altitude || '2,400m'}) on Pahadi Basera:`;

  // 1. Native Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${story.title} | Pahadi Basera`,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
        onOpenChange(false);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          toast.error('Sharing failed, copying link instead');
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // 2. Clipboard Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Story link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // 3. Social Deep Links
  const openWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const openTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=PahadiBasera,Himalayas,SlowTravel`;
    window.open(url, '_blank');
  };

  const openTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // 4. Visual 9:16 Instagram Story Card Generator via Canvas
  const handleDownloadStoryCard = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas not supported');

      // Base background
      ctx.fillStyle = '#0c1214';
      ctx.fillRect(0, 0, 1080, 1920);

      // Try loading story cover image
      const imgUrl = story.images[0] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1080';
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          try {
            // Draw background image scaled to fit/cover
            ctx.drawImage(img, 0, 0, 1080, 1920);
          } catch (e) {
            // continue with fallback gradient
          }
          resolve();
        };
        img.onerror = () => resolve(); // continue if CORS blocks cross-origin
        img.src = imgUrl;
      });

      // Dark luxury gradient overlays
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, 'rgba(10, 15, 13, 0.45)');
      grad.addColorStop(0.5, 'rgba(10, 15, 13, 0.65)');
      grad.addColorStop(0.85, 'rgba(10, 15, 13, 0.95)');
      grad.addColorStop(1, 'rgba(10, 15, 13, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Card Border Accent
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, 1000, 1840);

      // Top Header: Pahadi Basera Brand
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAHADI BASERA • EXPEDITIONS', 540, 150);

      ctx.fillStyle = '#d1d5db';
      ctx.font = '300 24px sans-serif';
      ctx.fillText('HIMALAYAN FIELD JOURNAL', 540, 195);

      // Elevation & Location Pill
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fillRect(290, 240, 500, 60);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(290, 240, 500, 60);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`📍 ${story.tags[0] || 'Garhwal'} • Alt: ${story.altitude || '2,400m'}`, 540, 280);

      // Centerpiece: Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 58px serif';
      ctx.textAlign = 'left';

      // Simple word wrapping for title
      const words = story.title.split(' ');
      let line = '';
      let y = 1100;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 920 && n > 0) {
          ctx.fillText(line, 80, y);
          line = words[n] + ' ';
          y += 72;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 80, y);

      // Excerpt quote
      y += 50;
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'italic 30px sans-serif';
      const cleanExcerpt = `"${story.excerpt.slice(0, 140)}..."`;
      const excWords = cleanExcerpt.split(' ');
      let excLine = '';
      for (let n = 0; n < excWords.length; n++) {
        const testExc = excLine + excWords[n] + ' ';
        const metrics = ctx.measureText(testExc);
        if (metrics.width > 920 && n > 0) {
          ctx.fillText(excLine, 80, y);
          excLine = excWords[n] + ' ';
          y += 46;
        } else {
          excLine = testExc;
        }
      }
      ctx.fillText(excLine, 80, y);

      // Author Signature Block
      y = 1600;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(80, y, 920, 140);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(80, y, 920, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(`Logged by @${story.author.name}`, 120, y + 60);

      ctx.fillStyle = '#10b981';
      ctx.font = '24px sans-serif';
      ctx.fillText(story.author.role || 'Alpine Contributor', 120, y + 105);

      // Bottom Watermark & Callout
      ctx.textAlign = 'center';
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('DISCOVER MORE ON PAHADIBASERA.COM/COMMUNITY', 540, 1830);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate image file.');
          setIsExporting(false);
          return;
        }
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = `pahadi-basera-story-${story.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(dlUrl);

        toast.success('Himalayan Story Card exported! Ready to share on Instagram.');
        setIsExporting(false);
      }, 'image/png');
    } catch (err: any) {
      console.error('Story export error:', err);
      toast.error('Could not export story image.');
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-900 font-sans">
        
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5" /> Mountain Dispatch Share Sheet
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-stone-900 truncate">
            {story.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500 font-light truncate">
            By {story.author.name} &bull; {story.altitude || '2,400m'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="share" className="mt-4 w-full">
          <TabsList className="grid grid-cols-2 bg-stone-100 p-1 rounded-2xl h-11 border border-stone-200/60">
            <TabsTrigger 
              value="share" 
              className="rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition-all"
            >
              Direct Share
            </TabsTrigger>
            <TabsTrigger 
              value="storycard" 
              className="rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition-all"
            >
              Instagram Story Card
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Direct Share */}
          <TabsContent value="share" className="mt-4 space-y-3">
            {/* Native Share button if supported */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <Button
                onClick={handleNativeShare}
                className="w-full h-11 rounded-xl bg-stone-900 hover:bg-[#10b981] text-white text-xs uppercase tracking-wider font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Share via Mobile Apps
              </Button>
            )}

            {/* Quick 1-click Channels */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="p-3 rounded-2xl border border-stone-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-bold">WhatsApp</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={openTwitter}
                className="p-3 rounded-2xl border border-stone-200 hover:border-stone-800 bg-stone-50 hover:bg-stone-100 text-stone-900 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span className="text-sm font-black">𝕏</span>
                <span className="text-[11px] font-bold">Twitter / X</span>
              </button>

              {/* Telegram */}
              <button
                onClick={openTelegram}
                className="p-3 rounded-2xl border border-stone-200 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 text-sky-900 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Compass className="w-4 h-4 text-sky-600" />
                <span className="text-[11px] font-bold">Telegram</span>
              </button>
            </div>

            {/* Copy Link input strip */}
            <div className="mt-3 p-2 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-2">
              <span className="text-xs text-stone-500 font-mono truncate pl-2">
                {shareUrl}
              </span>
              <Button
                size="sm"
                onClick={handleCopy}
                className="rounded-xl h-8 px-3 text-xs bg-stone-900 hover:bg-[#10b981] text-white font-semibold transition cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: 9:16 Instagram Story Card Generator */}
          <TabsContent value="storycard" className="mt-4 space-y-4">
            {/* Visual Story Card Preview (scaled down to fit modal) */}
            <div className="relative aspect-[9/16] w-52 mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-500/40 bg-stone-900 p-3 text-white flex flex-col justify-between">
              {/* Image Layer */}
              <img
                src={story.images[0]}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

              {/* Preview Content */}
              <div className="relative z-10 space-y-1 text-center pt-2">
                <span className="text-[8px] font-bold tracking-widest text-emerald-400 uppercase block">
                  Pahadi Basera
                </span>
                <span className="inline-block text-[7px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  📍 {story.tags[0] || 'Himalayas'} &bull; {story.altitude || '2,400m'}
                </span>
              </div>

              <div className="relative z-10 space-y-1 text-left px-1">
                <h4 className="text-[11px] font-bold leading-tight line-clamp-2 text-white font-serif">
                  {story.title}
                </h4>
                <p className="text-[8px] text-stone-300 line-clamp-2 italic leading-tight">
                  &ldquo;{story.excerpt}&rdquo;
                </p>
                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[7px] text-stone-400">
                  <span>@{story.author.name}</span>
                  <span className="text-emerald-400 font-bold uppercase">pahadibasera.com</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDownloadStoryCard}
              disabled={isExporting}
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating High-Res Story Card...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Export 9:16 Instagram Story (PNG)
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
