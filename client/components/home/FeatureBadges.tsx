import React from 'react';
import { ShieldCheck, Utensils, Car, ArrowUpRight } from 'lucide-react';

const FeaturesBadges = () => {
  const features = [
    {
      id: 'verified',
      num: '01',
      tag: 'SAFE HAVENS',
      title: 'Verified Mountain Homestays',
      description: 'Authentic stone chalets and wooden cottages vetted strictly for safety, hygiene, and high-altitude warmth.',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-[#10b981]',
    },
    {
      id: 'kitchen',
      num: '02',
      tag: 'LOCAL SOUL',
      title: 'Traditional Pahadi Kitchens',
      description: 'Taste original, organic recipes prepared fresh by local hosts over traditional firewood and earthen hearths.',
      icon: Utensils,
      iconBg: 'bg-orange-50 text-orange-600',
    },
    {
      id: 'taxi',
      num: '03',
      tag: 'SEAMLESS HIGHLANDS',
      title: 'Hill Transits & Escapes',
      description: 'Hassle-free transfers across winding mountain roads with certified local drivers and customized trail maps.',
      icon: Car,
      iconBg: 'bg-blue-50 text-blue-600',
    },
  ];

  return (
    <section className="w-full bg-[#fafbfc]/80 backdrop-blur-md border-y border-gray-100/60 py-14 px-4 sm:px-6 relative z-20">
      <div className="max-w-[1250px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id} 
                className={`group flex flex-col justify-between transition-all duration-300 md:px-8 ${
                  idx > 0 ? 'md:border-l md:border-gray-200/40' : ''
                }`}
              >
                <div>
                  {/* Top line with serial number and minimal icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] tracking-[0.25em] font-light text-[#10b981] flex items-center gap-2">
                      <span className="font-semibold">[{item.num}]</span>
                      {item.tag}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${item.iconBg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Typography details */}
                  <h4 className="text-xl font-light text-gray-900 tracking-tight mb-3 group-hover:text-[#10b981] transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs font-light text-gray-500 leading-relaxed max-w-[320px] transition-colors duration-300 group-hover:text-gray-600">
                    {item.description}
                  </p>
                </div>
                
                {/* Subtle bottom arrow trigger */}
                <div className="mt-8 flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold text-gray-400 group-hover:text-[#10b981] transition-all duration-300 pointer-events-none">
                  <span>Learn details</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

              </div>
            );
          })}
          
        </div>
      </div>
    </section>
  );
};

export default FeaturesBadges;
