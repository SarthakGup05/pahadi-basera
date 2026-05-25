'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Clock, 
  MapPin, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Coffee, 
  Tent, 
  Compass as GuideIcon, 
  Car, 
  UtensilsCrossed 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Packages = () => {
  const packagesList = [
    {
      id: 'chopta-trek',
      num: '01',
      title: 'Chopta-Tungnath Summit Trek',
      location: 'Chopta, Uttarakhand',
      duration: '4 Days / 3 Nights',
      vibe: 'High-Altitude Adventure',
      difficulty: 'Moderate',
      price: '12,499',
      image: 'https://images.unsplash.com/photo-1589136777351-fd6e473e09a5?q=80&w=800&auto=format&fit=crop',
      badge: "Trekker's Choice",
      description: "Conquer the sacred ridge trail leading to the world's highest Shiva temple. Awaken to breathtaking sunrises casting golden hues on Mount Trishul and Nanda Devi.",
      amenities: ['Professional Guide', 'Premium Alpine Tents', 'All Organic Meals'],
      includes: [
        { name: 'Transit', icon: Car },
        { name: 'Meals', icon: UtensilsCrossed },
        { name: 'Shelter', icon: Tent },
        { name: 'Guide', icon: GuideIcon }
      ]
    },
    {
      id: 'almora-wellness',
      num: '02',
      title: 'Bohemian Wellness & Yoga Retreat',
      location: 'Almora, Uttarakhand',
      duration: '5 Days / 4 Nights',
      vibe: 'Deep Rejuvenation',
      difficulty: 'Relaxing',
      price: '18,999',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
      badge: 'Deep Rejuvenation',
      description: 'Heal your body and soul within pristine pine forest glades. Features daily sunrise Hatha yoga sessions and quiet meditation walks along misty mountain ridges.',
      amenities: ['Certified Yoga Guru', 'Farm-to-Table Dining', 'Forest Sauna Session'],
      includes: [
        { name: 'Transit', icon: Car },
        { name: 'Vegan Meals', icon: UtensilsCrossed },
        { name: 'Glass Cabin', icon: Tent },
        { name: 'Wellness', icon: Sparkles }
      ]
    },
    {
      id: 'munsiyari-sky',
      num: '03',
      title: 'Munsiyari Celestial Sky Escapade',
      location: 'Munsiyari, Uttarakhand',
      duration: '6 Days / 5 Nights',
      vibe: 'Celestial Luxury',
      difficulty: 'Easy',
      price: '24,500',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
      badge: 'Stargazer Edition',
      description: 'Retreat to a high-altitude sanctuary facing the colossal Panchachuli Peaks. Gaze deep into the cosmos from our private stargazing deck equipped with a high-end telescope.',
      amenities: ['Astrophotography Guide', 'Private Telescope', 'Kumaoni Heritage Dining'],
      includes: [
        { name: 'Chauffeur', icon: Car },
        { name: 'Dining', icon: UtensilsCrossed },
        { name: 'Ridge Villa', icon: Tent },
        { name: 'Telescope', icon: Coffee }
      ]
    }
  ];

  const handleBookPackage = (pkgTitle: string) => {
    alert(`🏔️ Booking request initiated for: "${pkgTitle}"\n\nOur custom quotation and tax calculator will prepare your personalized experiential package!`);
  };

  return (
    <section id="packages" className="w-full py-16 px-4 bg-zinc-50 relative overflow-hidden border-t border-gray-100/60 z-10 font-sans">
      
      {/* Ambient Lighting & Topographic Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] left-[10%] w-[600px] h-[600px] bg-emerald-400/5 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[5%] right-[5%] w-[550px] h-[550px] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply" />
        
        {/* Abstract Fluid Topography SVG */}
        <svg className="absolute w-full h-full bottom-0 left-0 opacity-[0.03] text-gray-900" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
          <path d="M-100 800 C300 400 600 900 1500 200" stroke="currentColor" strokeWidth="2" />
          <path d="M-100 850 C300 450 600 950 1500 250" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M-100 900 C300 500 600 1000 1500 300" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-[1250px] mx-auto relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 bg-white border border-emerald-100 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#10b981] text-[10px] font-bold tracking-[0.25em] uppercase">
              Curated Expeditions
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-light text-gray-900 tracking-tight leading-tight">
            Experiential <span className="font-normal italic text-[#10b981] relative inline-block">
              Packages
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#10b981]/20" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-sm md:text-base font-light text-gray-500 leading-relaxed mt-6 max-w-lg mx-auto">
            Hassle-free mountain explorations. We bundle luxury remote lodgings, curated organic meals, dedicated native guides, and private hill transfers.
          </p>
        </div>

        {/* 3-Column Premium Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {packagesList.map((pkg) => (
            <div 
              key={pkg.id}
              className="group flex flex-col bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 hover:border-emerald-100/50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
            >
              
              {/* Image & Header Overlay */}
              <div className="relative aspect-[16/11] p-2.5 pb-0">
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-sm">
                  
                  {/* Subtle Image Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Background Image with Cinematic Ken Burns Zoom */}
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transform-gpu transition-transform duration-[8000ms] ease-out group-hover:scale-110"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                    <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-[#10b981] text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-sm border border-white/20 transition-transform duration-500 group-hover:scale-105">
                      {pkg.badge}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-white/70 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
                      {pkg.num}
                    </span>
                  </div>

                  {/* Frosted Glass Footer inside Image */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 transform-gpu transition-transform duration-500">
                    <span className="block text-[9px] font-bold text-emerald-300 uppercase tracking-widest mb-1 drop-shadow-sm">
                      {pkg.vibe}
                    </span>
                    <span className="flex items-center gap-1.5 text-white text-[11px] font-semibold tracking-wide drop-shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {pkg.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Details & Content */}
              <div className="p-6 md:p-7 flex flex-col flex-1 bg-gradient-to-b from-white to-zinc-50/50">
                
                {/* Duration & Difficulty */}
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 group-hover:bg-[#10b981]/10 group-hover:text-[#0e9f6e] transition-colors duration-300">
                    <Flame className="w-3.5 h-3.5" />
                    {pkg.difficulty}
                  </span>
                </div>

                {/* Main Title */}
                <h3 className="text-gray-900 group-hover:text-[#10b981] transition-colors duration-300 font-semibold text-xl md:text-2xl leading-tight mb-3 line-clamp-2">
                  {pkg.title}
                </h3>

                {/* Editorial Description */}
                <p className="text-xs font-light text-gray-500 leading-relaxed mb-6 line-clamp-2">
                  {pkg.description}
                </p>

                {/* Micro-Pills for Includes (Replaces bulky grid) */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {pkg.includes.map((inc, i) => {
                    const IncIcon = inc.icon;
                    return (
                      <div 
                        key={i} 
                        className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 group-hover:border-emerald-100 group-hover:bg-emerald-50/30 transition-colors duration-300"
                      >
                        <IncIcon className="w-3 h-3 text-[#10b981]" />
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">{inc.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Checklists */}
                <div className="flex flex-col gap-2.5 mb-6 border-t border-gray-100 pt-5">
                  {pkg.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[11px] font-medium text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" strokeWidth={2.5} />
                      <span className="group-hover:text-gray-900 transition-colors duration-300">{amenity}</span>
                    </div>
                  ))}
                </div>

                {/* Spacer to push footer down uniformly */}
                <div className="flex-1" />

                {/* Package Footer & Call to Action */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Starting at</span>
                    <div className="text-gray-900 flex items-baseline gap-1">
                      <span className="font-bold text-xl md:text-2xl leading-none">₹{pkg.price}</span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">/pp</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => { e.stopPropagation(); handleBookPackage(pkg.title); }}
                    className="group/btn relative overflow-hidden bg-zinc-900 hover:bg-[#10b981] text-white rounded-xl px-5 h-10 md:h-11 text-[10px] md:text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-md hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 border-0"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      Reserve 
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* View All Packages Footer */}
        <div className="mt-12 flex justify-center">
          <Button 
            asChild
            variant="outline"
            className="group/all rounded-full bg-transparent border-gray-200 text-gray-700 hover:bg-white hover:border-emerald-200 hover:text-[#10b981] px-8 h-12 text-[11px] font-bold tracking-widest uppercase shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link href="/packages" className="flex items-center">
              Explore All Packages
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/all:translate-x-1" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Packages;