import React, { useState } from 'react';
import { X, Sparkles, Layers, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { UI_STYLES } from '../../data/mockData';
import { UIStyleId } from '../../types';

interface StyleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter?: UIStyleId | null;
  onSelectStyleFilter?: (styleId: UIStyleId | null) => void;
}

export const StyleGuideModal: React.FC<StyleGuideModalProps> = ({
  isOpen,
  onClose,
  activeFilter,
  onSelectStyleFilter
}) => {
  const [selectedStyle, setSelectedStyle] = useState<UIStyleId>('skeuomorphism');

  if (!isOpen) return null;

  const currentInfo = UI_STYLES.find(s => s.id === selectedStyle) || UI_STYLES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0f172a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                The 10 UI Styles Architecture
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Unified System
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Explore how all 10 distinct UI paradigms harmoniously collaborate inside Memoir.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 p-6 gap-6">
          {/* Left Column: Style Navigation */}
          <div className="md:col-span-5 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 pb-1">
              Select A Design Paradigm (10/10)
            </div>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {UI_STYLES.map((style, idx) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between border ${
                      isSelected 
                        ? 'bg-sky-500/15 border-sky-400/40 text-white shadow-lg shadow-sky-950' 
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-slate-400">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold">{style.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[190px]">
                          {style.role}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-sky-400 translate-x-1' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Style Deep-dive details */}
          <div className="md:col-span-7 flex flex-col justify-between bg-slate-900/50 border border-white/10 rounded-2xl p-6">
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block text-xs font-mono px-2.5 py-1 rounded-full border ${currentInfo.badgeColor} mb-2`}>
                    Style #{UI_STYLES.findIndex(s => s.id === currentInfo.id) + 1}
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {currentInfo.name}
                  </h3>
                  <div className="text-sm font-medium text-sky-300 mt-0.5">
                    Role: {currentInfo.role}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentInfo.description}
              </p>

              {/* Where Applied in Memoir */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Exact Implementation in Memoir:
                </div>
                <div className="text-sm text-slate-200">
                  {currentInfo.appliedTo}
                </div>
              </div>

              {/* Interactive Live Preview Box of the style */}
              <div className="rounded-2xl p-4 border border-white/10 bg-slate-950/60">
                <div className="text-xs text-slate-400 font-mono mb-3">Live Component Sample:</div>

                {selectedStyle === 'skeuomorphism' && (
                  <div className="skeuo-polaroid max-w-[220px] mx-auto text-slate-800 rotate-1">
                    <div className="skeuo-washi-tape"></div>
                    <img 
                      src="/memoir-logo.jpg" 
                      className="w-full h-32 object-cover rounded-sm mb-2" 
                      alt="Memoir Sample" 
                    />
                    <div className="text-center font-serif italic text-xs text-amber-950 font-bold">
                      Memoir Circle Archive
                    </div>
                  </div>
                )}

                {selectedStyle === 'neomorphism' && (
                  <div className="flex items-center justify-center gap-4 py-4">
                    <button className="neo-button px-5 py-2.5 text-xs font-semibold text-slate-200">
                      Tactile Control
                    </button>
                    <button className="neo-button neo-button-pressed px-5 py-2.5 text-xs font-semibold text-sky-400">
                      Pressed State
                    </button>
                  </div>
                )}

                {selectedStyle === 'glassmorphism' && (
                  <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                    <div className="text-xs text-slate-200 font-medium">Translucent Frosted Surface</div>
                    <span className="text-[10px] glass-pill px-2.5 py-1 rounded-full text-sky-300">
                      Blur 20px
                    </span>
                  </div>
                )}

                {selectedStyle === 'claymorphism' && (
                  <div className="flex items-center justify-center gap-3 py-3">
                    <span className="clay-badge px-4 py-2 bg-pink-500/30 text-pink-200 text-xs border border-pink-400/30">
                      ❤️ 14 Loves
                    </span>
                    <button className="clay-button px-5 py-2 bg-sky-500 text-white font-bold text-xs">
                      Puffed Clay Action
                    </button>
                  </div>
                )}

                {selectedStyle === 'minimalism' && (
                  <div className="minimal-feed-card p-4 text-left">
                    <div className="text-xs text-slate-400">mehedi • 2h ago</div>
                    <div className="text-sm font-medium text-white mt-1">Clean, spacious typography with maximum content legibility.</div>
                  </div>
                )}

                {selectedStyle === 'maximalism' && (
                  <div className="maximalist-card p-4 text-center">
                    <span className="maximalist-badge px-3 py-1 text-xs">
                      ⚡ CELEBRATION MILESTONE ⚡
                    </span>
                    <div className="text-lg font-black text-white mt-2 drop-shadow-md">
                      25TH BIRTHDAY ROOFTOP BLOWOUT!
                    </div>
                  </div>
                )}

                {selectedStyle === 'brutalism' && (
                  <div className="brutal-card p-3">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider">
                      SYSTEM ACCESS AUDIT: [ROOT_ACTIVE]
                    </div>
                    <button className="brutal-btn px-3 py-1 text-xs mt-2">
                      REVOKE TOKEN
                    </button>
                  </div>
                )}

                {selectedStyle === 'liquid-glass' && (
                  <div className="flex justify-center py-2">
                    <button className="liquid-glass-pill px-6 py-2.5 text-xs font-bold text-sky-100 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                      Fluid Specular Pill
                    </button>
                  </div>
                )}

                {selectedStyle === 'bento-grid' && (
                  <div className="grid grid-cols-3 gap-2 py-1">
                    <div className="bento-card col-span-2 p-3 text-xs text-slate-300">
                      Stats Card (2-Col Span)
                    </div>
                    <div className="bento-card col-span-1 p-3 text-xs text-sky-400 font-bold">
                      100 GB Vault
                    </div>
                  </div>
                )}

                {selectedStyle === 'spatial-ui' && (
                  <div className="spatial-hud p-4 text-center">
                    <div className="text-xs font-mono text-purple-300">
                      VisionOS Depth HUD • Z-Index: 50px
                    </div>
                    <div className="text-xs text-slate-300 mt-1">Interactive 3D Parallax Tilt Enabled</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom action */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Active in feed & dashboard
              </div>
              {onSelectStyleFilter && (
                <button
                  onClick={() => {
                    onSelectStyleFilter(activeFilter === selectedStyle ? null : selectedStyle);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {activeFilter === selectedStyle ? 'Clear Filter' : `Filter by ${currentInfo.name}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
