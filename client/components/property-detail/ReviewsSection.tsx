'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { PropertyItem } from '@/lib/propertiesData';

interface ReviewItem {
  id: number;
  author: string;
  role: string;
  date: string;
  rating: number;
  avatar: string;
  comment: string;
}

interface ReviewsSectionProps {
  property: PropertyItem;
  reviews: ReviewItem[]; // Initial reviews passed from parent catalog
}

export default function ReviewsSection({ property, reviews }: ReviewsSectionProps) {
  const [activeTab, setActiveTab] = useState<'property' | 'host'>('property');

  // Curated, heartwarming Host Hospitality reviews celebrating traditional local hosts
  const hostReviews: ReviewItem[] = [
    {
      id: 101,
      author: 'Priya Nair',
      role: 'Slow Travel Blogger',
      date: 'May 2026',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      comment: 'Uncle Ramesh and Aunty Savitri treated us like their own family. Auntie\'s early morning rhododendron tea is magical, and Uncle sat with us by the stone hearth, sharing ancient folklore of the peak shepherds. This host connection is what makes Pahadi Basera so special.'
    },
    {
      id: 102,
      author: 'Vikram Sengupta',
      role: 'Slow Gastronomy Chef',
      date: 'April 2026',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      comment: 'Stellar culinary hospitality. The hosts walked us through their terraced backyard garden, picked fresh organic wild greens, and cooked a phenomenal traditional feast inside their firewood clay oven. True farm-to-table mountain heritage.'
    },
    {
      id: 103,
      author: 'Meera Joshi',
      role: 'Yoga & Meditation Guide',
      date: 'March 2026',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment: 'Incredible warmth. When I got minor altitude fatigue on Day 2, Aunty Savitri prepared a healing ginger-honey-tulsi herbal infusion and checked on me multiple times. You don\'t just book a rental here; you become part of the family.'
    }
  ];

  const displayedReviews = activeTab === 'property' ? reviews : hostReviews;

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-left">
      
      {/* Reviews Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Guest Chronicles
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            Based on {property.reviewsCount} organic guest stays
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-gray-900 leading-none">{property.rating || '4.9'}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mt-0.5">Rating Summary</span>
        </div>
      </div>

      {/* Modern Airbnb-Style Segmented Tab Switcher */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-50 border border-gray-100/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('property')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'property' 
              ? 'bg-white text-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100/70 scale-103' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Property Experience
        </button>
        <button 
          onClick={() => setActiveTab('host')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'host' 
              ? 'bg-white text-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100/70 scale-103' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Host Hospitality
        </button>
      </div>

      {/* Review metrics progress bars - Visible only under Property Experience tab */}
      {activeTab === 'property' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 mb-8 animate-fade-in animate-duration-300">
          {[
            { label: 'Cleanliness', score: '5.0' },
            { label: 'Accuracy', score: '4.9' },
            { label: 'Communication', score: '4.9' },
            { label: 'Location', score: '5.0' },
            { label: 'Check-in', score: '4.8' },
            { label: 'Value', score: '4.9' }
          ].map((metric, i) => (
            <div key={i} className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-500 w-28 text-left">{metric.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5 mx-4 overflow-hidden relative">
                <div 
                  className="bg-[#10b981] h-1.5 rounded-full" 
                  style={{ width: `${parseFloat(metric.score) * 20}%` }} 
                />
              </div>
              <span className="text-gray-800 tabular-nums w-6 text-right">{metric.score}</span>
            </div>
          ))}
        </div>
      )}

      {/* Host Performance highlight - Visible only under Host Hospitality tab */}
      {activeTab === 'host' && (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/20 border border-emerald-100/30 p-5 rounded-2xl mb-8 animate-fade-in animate-duration-300">
          <div className="w-3 h-3 rounded-full bg-[#10b981] flex-shrink-0" />
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-gray-900 mb-1">Local Host Community Champion</h4>
            <p className="text-xs font-light text-gray-500 leading-relaxed">
              Our hosts are traditional homesteaders committed to slow travel, local gastronomy preservation, and organic waste mitigation.
            </p>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div 
            key={review.id} 
            className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 flex flex-col text-left animate-fade-in animate-duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                  <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight mb-0.5">{review.author}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{review.role} &bull; {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded-lg text-amber-600 font-bold text-[10px]">
                <Star className="w-3.5 h-3.5 fill-current" /> {review.rating.toFixed(1)}
              </div>
            </div>
            <p className="text-xs sm:text-sm font-light text-gray-600 leading-relaxed pl-1 italic">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
