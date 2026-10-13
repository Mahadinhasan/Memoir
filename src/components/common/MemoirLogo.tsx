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
  const imgSizeMap = {
    sm: { img: 'w-8 h-8', rounded: 'rounded-xl', glow: '-inset-[3px] rounded-xl blur-[6px]', dot: 'w-2.5 h-2.5' },
    md: { img: 'w-10 h-10', rounded: 'rounded-2xl', glow: '-inset-[4px] rounded-2xl blur-[8px]', dot: 'w-3 h-3' },
    lg: { img: 'w-12 h-12', rounded: 'rounded-[18px]', glow: '-inset-[5px] rounded-[20px] blur-[10px]', dot: 'w-3.5 h-3.5' },
    xl: { img: 'w-16 h-16', rounded: 'rounded-[22px]', glow: '-inset-[6px] rounded-[24px] blur-[12px]', dot: 'w-4 h-4' },
  };

  const textSizeMap = {
    sm: { name: 'text-base', sub: 'text-[10px]' },
    md: { name: 'text-lg', sub: 'text-[11px]' },
    lg: { name: 'text-xl', sub: 'text-xs' },
    xl: { name: 'text-2xl', sub: 'text-sm' },
  };

  const cfg = imgSizeMap[size];
  const txt = textSizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logo Image with animated glow */}
      <div className="relative group cursor-pointer shrink-0">
        {/* Outer glow ring */}
        <div
          className={`absolute ${cfg.glow} bg-gradient-to-br from-sky-400 via-teal-400 to-indigo-500 opacity-50 group-hover:opacity-90 transition-all duration-500`}
        />
        {/* Inner ring border for crisp edge */}
        <div className={`absolute inset-0 ${cfg.rounded} ring-1 ring-white/30 group-hover:ring-white/60 transition-all duration-300 z-10 pointer-events-none`} />
        {/* Actual Logo Image */}
        <img
          src="/memoir-logo.jpg"
          alt="Memoir"
          className={`relative ${cfg.img} ${cfg.rounded} object-cover shadow-xl z-[5] transition-transform duration-300 group-hover:scale-105`}
          style={{ display: 'block' }}
          onError={(e) => {
            // Fallback: show gradient icon if image fails
            const el = e.currentTarget;
            el.style.display = 'none';
            const parent = el.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = `${cfg.img} ${cfg.rounded} bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-xl z-[5]`;
              fallback.textContent = 'M';
              parent.insertBefore(fallback, el);
            }
          }}
        />
        {/* Live status dot */}
        <span
          className={`absolute -top-0.5 -right-0.5 ${cfg.dot} bg-emerald-400 border-2 border-[#0c111f] rounded-full animate-pulse shadow-sm shadow-emerald-400/60 z-20`}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`${txt.name} font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-teal-200`}
              style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}
            >
              Memoir
            </span>
            <span className={`${txt.sub} font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/25 leading-none`}>
              Private
            </span>
          </div>
          <span className={`${txt.sub} font-medium text-slate-400 tracking-wide`}>
            Trusted Circle
          </span>
        </div>
      )}
    </div>
  );
};
