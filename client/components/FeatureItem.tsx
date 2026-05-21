import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const FeatureItem = ({ title, description, Icon }: FeatureItemProps) => {
  return (
    <div className="group flex flex-col items-start p-6 bg-white rounded-[2rem] border border-gray-100 hover:border-[#10b981]/30 hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full">
      
      {/* Icon Container with subtle hover bounce */}
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm mb-4">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>

      {/* Text Content */}
      <h4 className="text-base font-semibold text-gray-900 mb-2 tracking-tight group-hover:text-[#10b981] transition-colors">
        {title}
      </h4>
      <p className="text-xs sm:text-[13px] text-gray-500 font-light leading-relaxed">
        {description}
      </p>
      
    </div>
  );
};

export default FeatureItem;