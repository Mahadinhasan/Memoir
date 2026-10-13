import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Layers, 
  Search, 
  ShieldCheck, 
  Check, 
  Heart, 
  MessageCircle, 
  Sparkles,
  Lock,
  UserCheck,
  UserPlus,
  LogOut,
  ChevronDown,
  Key
} from 'lucide-react';
import { MemoirLogo } from '../common/MemoirLogo';
import { NotificationItem, User, ViewTab } from '../../types';

interface AppHeaderProps {
  currentUser: User;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenUpload: () => void;
  onOpenStyleGuide: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onOpenUpload,
  onOpenStyleGuide,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationRead
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onTabChange('feed')} 
            className="text-left focus:outline-none"
          >
            <MemoirLogo size="md" />
          </button>

          {/* Circle Security Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="font-medium">Encrypted Circle</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">6 Members</span>
          </div>
        </div>

        {/* Center Search / Filter (Glassmorphic) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories, locations, or friends..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl glass-input text-xs text-slate-100 placeholder:text-slate-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Style System Inspector Button (Highlights all 10 styles) */}
          <button
            onClick={onOpenStyleGuide}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:via-indigo-500/30 hover:to-purple-500/30 border border-sky-400/30 text-sky-200 text-xs font-semibold shadow-sm transition-all"
            title="Inspect 10 UI Styles Integration"
          >
            <Layers className="w-3.5 h-3.5 text-sky-300" />
            <span>10 UI Styles</span>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          </button>

          {/* Quick Upload Button (Liquid Glass Button) */}
          <button
            onClick={onOpenUpload}
            className="liquid-glass-pill px-3.5 sm:px-4 py-1.5 rounded-2xl text-xs font-bold text-white flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-sky-300" />
            <span className="hidden sm:inline">New Memory</span>
          </button>

          {/* Notification Button & Glassmorphic Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#0c111f] shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Glassmorphism Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-3xl p-4 shadow-2xl border border-white/15 animate-fadeIn z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">Circle Activity</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
                      {unreadCount} new
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Glassmorphic Panel</span>
                </div>

                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto mt-2 -mr-1 pr-1">
                  {notifications.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => onMarkNotificationRead(item.id)}
                      className={`py-3 px-2 rounded-xl flex items-start gap-3 cursor-pointer transition ${
                        item.read ? 'opacity-70 hover:opacity-100 hover:bg-white/5' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="relative">
                        <img 
                          src={item.user.avatar} 
                          alt={item.user.name} 
                          className="w-9 h-9 rounded-xl object-cover border border-white/20"
                        />
                        <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-white/20">
                          {item.type === 'like' && <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />}
                          {item.type === 'comment' && <MessageCircle className="w-2.5 h-2.5 text-sky-400 fill-sky-400" />}
                          {item.type === 'memory' && <Sparkles className="w-2.5 h-2.5 text-amber-400" />}
                          {item.type === 'invite' && <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />}
                        </span>
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="text-slate-200 leading-snug">
                          <strong className="text-white font-semibold">{item.user.name}</strong> {item.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {item.timeAgo}
                        </span>
                      </div>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5"></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current User Pill & Interactive Auth / Switch Menu */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
              title="Account & Auth"
            >
              <span className="text-xs font-semibold text-slate-200 hidden md:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-xl object-cover border border-sky-400/40"
              />
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Glassmorphic User & Auth Menu Popover */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 glass-panel rounded-3xl p-4 shadow-2xl border border-white/15 animate-fadeIn z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-10 h-10 rounded-2xl object-cover border border-sky-400/40"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-sky-400 font-mono truncate">@{currentUser.username}</div>
                    <span className={`inline-block mt-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      currentUser.role === 'admin' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-300'
                    }`}>
                      {currentUser.role === 'admin' ? 'Circle Founder' : 'Member'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 py-3 border-b border-white/10 text-xs">
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-white/10 text-slate-200 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                      Switch / Sign In
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Login</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuth('register');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-white/10 text-slate-200 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-3.5 h-3.5 text-teal-400" />
                      Register New Pass
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Join</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-white/10 text-slate-200 flex items-center gap-2 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Security & Preferences</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-rose-500/20 text-rose-400 flex items-center gap-2 text-xs transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Circle</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
