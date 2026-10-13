import React, { useState } from 'react';
import { 
  Settings, 
  Moon, 
  Eye, 
  Bell, 
  ShieldCheck, 
  HardDrive, 
  Lock, 
  Key, 
  Smartphone, 
  LogOut,
  Sparkles,
  Layers,
  UserCheck
} from 'lucide-react';
import { User } from '../../types';

interface SettingsViewProps {
  currentUser: User;
  onOpenStyleGuide: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onOpenStyleGuide,
  onOpenAuth,
  onLogout
}) => {
  const [spatialMotion, setSpatialMotion] = useState(true);
  const [instantNotifications, setInstantNotifications] = useState(true);
  const [googleDriveSync, setGoogleDriveSync] = useState(true);
  const [oledDarkTheme, setOledDarkTheme] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Settings Top Header */}
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-200 border border-slate-600">
              Style 2: Neomorphism & Style 5: Minimalism
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Circle Preferences & Controls
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure privacy keys, storage vault syncing, and spatial motion physics.
          </p>
        </div>

        <button
          onClick={onOpenStyleGuide}
          className="neo-button px-4 py-2 text-xs font-bold text-sky-400 flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Styles Guide</span>
        </button>
      </div>

      {/* Profile Info Summary with Account Switching & Logout */}
      <div className="minimal-feed-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/40 shadow-lg"
          />
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                currentUser.role === 'admin' 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-sky-500/20 text-sky-300'
              }`}>
                {currentUser.role === 'admin' ? 'Circle Founder' : 'Active Member'}
              </span>
            </h2>
            <div className="text-xs text-sky-400 font-mono">@{currentUser.username}</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">{currentUser.bio}</p>
          </div>
        </div>

        {/* Auth Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenAuth && (
            <button
              onClick={() => onOpenAuth('login')}
              className="neo-button px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Switch Account</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="neo-button px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Neomorphic Tactile Settings Controls */}
      <div className="space-y-4">
        {/* Toggle 1: Spatial 3D Parallax Motion */}
        <div className="neo-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Spatial 3D UI & Parallax Motion</div>
              <p className="text-xs text-slate-400">
                Interactive cursor tilt and layered Z-depth in full-screen memory viewer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSpatialMotion(!spatialMotion)}
            className={`w-14 h-7 rounded-full transition-colors relative p-0.5 border border-white/10 ${
              spatialMotion ? 'bg-sky-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform shadow-md ${
              spatialMotion ? 'translate-x-7' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 2: Private Google Drive API Encrypted Vault */}
        <div className="neo-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Private Google Drive Storage Sync</div>
              <p className="text-xs text-slate-400">
                Protected server-side OAuth endpoints. Zero publicly exposed cloud URLs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGoogleDriveSync(!googleDriveSync)}
            className={`w-14 h-7 rounded-full transition-colors relative p-0.5 border border-white/10 ${
              googleDriveSync ? 'bg-sky-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform shadow-md ${
              googleDriveSync ? 'translate-x-7' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 3: Instant Push Alerts for Circle Activity */}
        <div className="neo-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Direct Circle Push Notifications</div>
              <p className="text-xs text-slate-400">
                Receive notifications when approved friends love memories or comment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setInstantNotifications(!instantNotifications)}
            className={`w-14 h-7 rounded-full transition-colors relative p-0.5 border border-white/10 ${
              instantNotifications ? 'bg-sky-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform shadow-md ${
              instantNotifications ? 'translate-x-7' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 4: Midnight OLED Dark Theme */}
        <div className="neo-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-300 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Midnight OLED Theme</div>
              <p className="text-xs text-slate-400">
                Ultra deep blacks enhancing contrast for photographic color fidelity.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOledDarkTheme(!oledDarkTheme)}
            className={`w-14 h-7 rounded-full transition-colors relative p-0.5 border border-white/10 ${
              oledDarkTheme ? 'bg-sky-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform shadow-md ${
              oledDarkTheme ? 'translate-x-7' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-4 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          Session Token: <span className="text-emerald-400 font-bold">SHA256: 9b2a...e71c</span>
        </div>

        <button
          onClick={handleSave}
          className="neo-button px-6 py-2.5 text-xs font-bold text-sky-400 hover:text-sky-300 cursor-pointer"
        >
          {savedSuccess ? 'Preferences Updated ✓' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};
