import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  Clock, 
  Users, 
  Bookmark, 
  ShieldAlert, 
  Settings, 
  Layers, 
  HardDrive,
  Sparkles,
  Info
} from 'lucide-react';
import { ViewTab, UIStyleId } from '../../types';
import { UI_STYLES } from '../../data/mockData';

interface SidebarNavProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  activeFilter?: UIStyleId | null;
  onOpenStyleGuide: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onTabChange,
  activeFilter,
  onOpenStyleGuide
}) => {
  const navItems = [
    {
      id: 'feed' as ViewTab,
      label: 'Social Feed',
      styleLabel: 'Minimalism',
      styleTag: 'Base Foundation',
      icon: Home
    },
    {
      id: 'dashboard' as ViewTab,
      label: 'Dashboard',
      styleLabel: 'Bento Grid',
      styleTag: 'Modular Cards',
      icon: LayoutGrid
    },
    {
      id: 'memories' as ViewTab,
      label: 'Memories Scrapbook',
      styleLabel: 'Skeuomorphism',
      styleTag: 'Polaroid & Washi',
      icon: Clock
    },
    {
      id: 'friends' as ViewTab,
      label: 'Circle Friends',
      styleLabel: 'Claymorphism',
      styleTag: '3D Inflated Badges',
      icon: Users
    },
    {
      id: 'favorites' as ViewTab,
      label: 'Saved Keepsakes',
      styleLabel: 'Curated',
      styleTag: 'Private Pins',
      icon: Bookmark
    },
    {
      id: 'admin' as ViewTab,
      label: 'Admin Security',
      styleLabel: 'Brutalism',
      styleTag: 'Hard Borders & Logs',
      icon: ShieldAlert
    },
    {
      id: 'settings' as ViewTab,
      label: 'Preferences',
      styleLabel: 'Neomorphism',
      styleTag: 'Tactile Controls',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col gap-6 py-6 pr-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Primary Navigation */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all group ${
                isActive
                  ? 'bg-sky-500/15 border border-sky-400/30 text-white font-semibold shadow-md shadow-sky-950/40'
                  : 'hover:bg-white/5 border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-xl transition ${
                  isActive 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-white/5 group-hover:bg-white/10 text-slate-400 group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm block">{item.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono block -mt-0.5">
                    {item.styleTag}
                  </span>
                </div>
              </div>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Style Design Matrix Card */}
      <div className="mt-auto p-4 rounded-3xl bg-slate-900/60 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>10 UI Styles Active</span>
          </div>
          <button 
            onClick={onOpenStyleGuide}
            className="text-[11px] text-sky-400 hover:text-sky-300 font-medium underline flex items-center gap-0.5"
          >
            <span>Details</span>
            <Info className="w-3 h-3" />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          All 10 design paradigms live concurrently in this single unified app.
        </p>

        {/* Mini 10 Style Pills */}
        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-slate-300">
          <div className="px-1.5 py-1 rounded bg-amber-950/40 border border-amber-500/20 text-amber-300 truncate">
            1. Skeuomorph
          </div>
          <div className="px-1.5 py-1 rounded bg-slate-800/80 border border-slate-600/30 truncate">
            2. Neomorph
          </div>
          <div className="px-1.5 py-1 rounded bg-sky-950/40 border border-sky-400/20 text-sky-300 truncate">
            3. Glassmorph
          </div>
          <div className="px-1.5 py-1 rounded bg-indigo-950/40 border border-indigo-400/20 text-indigo-300 truncate">
            4. Claymorph
          </div>
          <div className="px-1.5 py-1 rounded bg-zinc-800/80 border border-zinc-600/30 truncate">
            5. Minimalist
          </div>
          <div className="px-1.5 py-1 rounded bg-fuchsia-950/40 border border-fuchsia-400/20 text-fuchsia-300 truncate">
            6. Maximalist
          </div>
          <div className="px-1.5 py-1 rounded bg-yellow-400 text-black font-bold truncate">
            7. Brutalist
          </div>
          <div className="px-1.5 py-1 rounded bg-cyan-950/40 border border-cyan-400/30 text-cyan-200 truncate">
            8. Liquid Glass
          </div>
          <div className="px-1.5 py-1 rounded bg-emerald-950/40 border border-emerald-400/20 text-emerald-300 truncate">
            9. Bento Grid
          </div>
          <div className="px-1.5 py-1 rounded bg-purple-950/40 border border-purple-400/20 text-purple-300 truncate">
            10. Spatial UI
          </div>
        </div>

        {/* Private Storage Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-slate-500" />
              Drive Vault
            </span>
            <span className="font-mono text-slate-300">18.4 / 100 GB</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-teal-400 w-[18.4%] rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
