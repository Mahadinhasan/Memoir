import React from 'react';
import { Home, LayoutGrid, Clock, Users, Plus, ShieldAlert, Settings } from 'lucide-react';
import { ViewTab } from '../../types';

interface MobileBottomNavProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenUpload: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenUpload
}) => {
  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-40 flex justify-center">
      <nav className="liquid-glass-dock px-3 py-2 rounded-full flex items-center justify-between gap-1 max-w-md w-full shadow-2xl">
        <button
          onClick={() => onTabChange('feed')}
          className={`p-2.5 rounded-full transition ${
            activeTab === 'feed' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Social Feed"
        >
          <Home className="w-5 h-5" />
        </button>

        <button
          onClick={() => onTabChange('dashboard')}
          className={`p-2.5 rounded-full transition ${
            activeTab === 'dashboard' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Bento Dashboard"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Central Liquid Glass Floating Upload Action */}
        <button
          onClick={onOpenUpload}
          className="liquid-glass-pill -my-3 p-3.5 rounded-full text-white bg-gradient-to-tr from-sky-400 to-teal-400 shadow-xl shadow-sky-500/30 active:scale-95 transition"
          title="New Memory"
        >
          <Plus className="w-6 h-6 text-white stroke-[2.5]" />
        </button>

        <button
          onClick={() => onTabChange('memories')}
          className={`p-2.5 rounded-full transition ${
            activeTab === 'memories' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Scrapbook Memories"
        >
          <Clock className="w-5 h-5" />
        </button>

        <button
          onClick={() => onTabChange('friends')}
          className={`p-2.5 rounded-full transition ${
            activeTab === 'friends' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Circle Friends"
        >
          <Users className="w-5 h-5" />
        </button>

        <button
          onClick={() => onTabChange('admin')}
          className={`p-2.5 rounded-full transition ${
            activeTab === 'admin' ? 'bg-yellow-400 text-black shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
          title="Admin Security"
        >
          <ShieldAlert className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};
