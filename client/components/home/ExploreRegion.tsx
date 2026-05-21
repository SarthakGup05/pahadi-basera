import React from 'react';
import { Home, ArrowUpRight } from 'lucide-react';

const ExploreRegion = () => {
  const regions = [
    {
      id: 'munsiyari',
      num: '01',
      title: 'Munsiyari',
      subtitle: 'Sunset over Panchachuli peaks.',
      properties: 24,
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop'    
    },
    {
      id: 'chopta',
      num: '02',
      title: 'Chopta',
      subtitle: "India's serene mini Switzerland.",
      properties: 18,
      image: 'https://images.unsplash.com/photo-1589136777351-fd6e473e09a5?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'auli',
      num: '03',
      title: 'Auli',
      subtitle: 'Pristine, snow-draped ski slopes.',
      properties: 15,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'kausani',
      num: '04',
      title: 'Kausani',
      subtitle: '300km panoramic peak views.',
      properties: 12,
      image: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=800&auto=format&fit=crop',
    }
  ];

  return (
    <section id="regions" className="w-full py-28 px-4 bg-zinc-50 relative overflow-hidden border-t border-gray-100/60">
      
      {/* Soft background light */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1250px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[#10b981] text-xs font-light tracking-[0.25em] uppercase mb-4 block">
            Himalayan Getaways
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight leading-tight">
            Explore by <span className="font-normal italic text-[#10b981]">Region</span>
          </h2>
          <p className="text-sm font-light text-gray-500 max-w-xl mx-auto mt-4 leading-relaxed">
            Discover handpicked sanctuaries tucked away in Uttarakhand's most pristine alpine valleys and mountain ridges.
          </p>
        </div>

        {/* Symmetrical Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region) => (
            <div 
              key={region.id}
              className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer aspect-[3/4.5] shadow-[0_15px_40px_-20px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] transition-all duration-700 ease-out border border-gray-200/20"
            >
              {/* Background Image with Slow Zoom */}
              <img 
                src={region.image} 
                alt={region.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-105"
              />

              {/* Rich Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

              {/* Top Details (Curation Index & Basera Counts) */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
                <span className="text-[11px] font-semibold tracking-widest text-[#10b981]/90">
                  {region.num} /
                </span>
                <span className="text-[9px] tracking-widest uppercase font-semibold text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Home className="w-3 h-3 text-[#10b981]" />
                  {region.properties} Baseras
                </span>
              </div>

              {/* Bottom Editorial Content */}
              <div className="absolute bottom-6 left-6 right-6 z-20 transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex justify-between items-end gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-light text-white tracking-tight leading-none mb-3">
                      {region.title}
                    </h3>
                    <p className="text-white/70 text-xs font-light leading-relaxed max-w-[190px]">
                      {region.subtitle}
                    </p>
                  </div>
                  
                  {/* Floating Action Trigger */}
                  <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#10b981] flex items-center justify-center text-white border border-white/15 group-hover:border-[#10b981] transition-all duration-500 transform group-hover:rotate-45 flex-shrink-0 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExploreRegion;