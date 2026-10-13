import React from 'react';

interface MemoirLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const MemoirLogo: React.FC<MemoirLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl'
  };

  const imgSizeMap = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-[18px]',
    xl: 'w-16 h-16 rounded-[22px]'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon using user's uploaded icon */}
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-teal-400 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>
        <img 
          src="/memoir-logo.jpg" 
          alt="Memoir Logo" 
          className={`relative ${imgSizeMap[size]} object-cover shadow-lg border border-white/20 transition-transform duration-300 group-hover:scale-105`}
        />
        {/* Subtle active circle status dot */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0c111f] rounded-full animate-pulse shadow-sm"></span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-200">
              Memoir
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Private
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 -mt-0.5 tracking-wide">
            Trusted Circle
          </span>
        </div>
      )}
    </div>
  );
};
