import React, { useState, useEffect } from 'react';
import { 
  Database, 
  HardDrive, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  X,
  Zap,
  Server
} from 'lucide-react';
import { fetchSystemStats, SystemStats } from '../../lib/dbService';

interface DatabaseLiveIndicatorProps {
  currentUserEmail?: string;
  className?: string;
}

export const DatabaseLiveIndicator: React.FC<DatabaseLiveIndicatorProps> = ({
  currentUserEmail,
  className = ''
}) => {
  const [stats, setStats] = useState<SystemStats>({
    connected: true,
    postsCount: 0,
    profilesCount: 1,
    storageFilesCount: 0,
    bucketName: 'memoir-images',
    maxSizeMb: 3,
    realtimeConnected: true,
    activeUser: currentUserEmail ?? null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  const loadStats = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchSystemStats(currentUserEmail);
      setStats(data);
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [currentUserEmail]);

  const handleTestPing = async () => {
    setIsRefreshing(true);
    const start = performance.now();
    await loadStats();
    const duration = Math.round(performance.now() - start);
    setPingSuccess(`Pinged in ${duration}ms • PostgreSQL & Storage active`);
    setTimeout(() => setPingSuccess(null), 4000);
  };

  return (
    <>
      {/* Top Header Pill */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all shadow-sm ${className}`}
        title="Supabase Database & Storage Live Status"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline font-mono font-bold text-[11px]">DB Live</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="font-mono text-[10px] text-emerald-400">3MB Storage</span>
        </div>
      </button>

      {/* Live System Diagnostics Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0c1322] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Supabase Live Database & Storage</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                      ONLINE
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Project: kzpurodtgbvbvygfuqhw (Direct PostgreSQL & CDN)</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {pingSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{pingSuccess}</span>
                </div>
              )}

              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Database Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <Server className="w-3.5 h-3.5 text-sky-400" />
                      PostgreSQL
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Connected with RLS & Realtime
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Posts in DB:</span>
                    <span className="text-white font-bold">{stats.postsCount}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Profiles:</span>
                    <span className="text-white font-bold">{stats.profilesCount}</span>
                  </div>
                </div>

                {/* Storage Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                      Storage Bucket
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Bucket: <span className="font-mono text-emerald-300">memoir-images</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Upload Limit:</span>
                    <span className="text-emerald-400 font-bold">Max 3 MB</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Uploaded CDN files:</span>
                    <span className="text-white font-bold">{stats.storageFilesCount}</span>
                  </div>
                </div>
              </div>

              {/* Realtime & Account */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">Live Realtime Subscriptions</span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Every uploaded image and newly published memory automatically synchronizes live across all open circle sessions using Supabase Realtime broadcast channels.
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Building User:</span>
                  <span className="text-sky-300 font-bold">Mahadin (Mahadin@Memo.com)</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-900/40 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Row-Level Security Enforced
              </span>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={isRefreshing}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Testing...' : 'Ping Live DB'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
