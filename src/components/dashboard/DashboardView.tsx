import React from 'react';
import { 
  Users, 
  Sparkles, 
  HardDrive, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  Plus, 
  ArrowUpRight, 
  Layers, 
  Lock,
  Clock,
  Compass,
  UserPlus
} from 'lucide-react';
import { User, Post, MemoryItem } from '../../types';

interface DashboardViewProps {
  currentUser: User;
  friends: User[];
  posts: Post[];
  memories: MemoryItem[];
  onOpenUpload: () => void;
  onNavigateToMemories: () => void;
  onNavigateToFriends: () => void;
  onNavigateToAdmin: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  friends,
  posts,
  memories,
  onOpenUpload,
  onNavigateToMemories,
  onNavigateToFriends,
  onNavigateToAdmin
}) => {
  const throwback = memories.length > 0 ? memories[0] : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Style 9: Bento Grid
            </span>
            <span className="text-xs text-slate-400">Dashboard Architecture</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            Circle Intelligence & Highlights
          </h1>
          <p className="text-xs text-slate-400">
            Modular overview of your private social collective, encrypted storage, and shared moments.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="liquid-glass-pill px-4 py-2 rounded-2xl text-xs font-bold text-white flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-sky-300" />
          <span>New Circle Memory</span>
        </button>
      </div>

      {/* Bento Grid Layout (12-column responsive system) */}
      <div className="bento-grid">
        {/* Bento 1: "On This Day" Throwback Spotlight (Col 1-8, 2 Rows) */}
        <div className="bento-card col-span-12 lg:col-span-8 p-6 relative group flex flex-col justify-between overflow-hidden">
          {throwback ? (
            <>
              <div className="absolute inset-0 z-0">
                <img 
                  src={throwback.photos[0]} 
                  alt={throwback.title} 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c111f] via-[#0c111f]/70 to-transparent"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {throwback.yearAgo}
                  </span>
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                    {throwback.date}
                  </span>
                </div>
                <button 
                  onClick={onNavigateToMemories}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-xs"
                >
                  <span>View Scrapbook</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative z-10 mt-16 sm:mt-24">
                <div className="text-xs font-serif italic text-amber-200/90 mb-1">
                  {throwback.mood}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {throwback.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1.5 leading-relaxed line-clamp-2">
                  {throwback.story}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <img 
                    src={throwback.author.avatar} 
                    alt={throwback.author.name} 
                    className="w-6 h-6 rounded-full border border-white/20 object-cover"
                  />
                  <span className="text-xs text-slate-300">
                    Shared by {throwback.author.name}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-between h-full py-4 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Memory Vault Ready
                </span>
                <span className="text-xs text-slate-400 font-mono">Encrypted & Active</span>
              </div>

              <div className="space-y-2 py-6">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Start Your Private Circle Chronicle
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                  Upload photos from your computer, Google Drive, or Google Photos. As moments accumulate, nostalgic polaroids, anniversaries, and "On This Day" throwbacks will automatically generate here.
                </p>
              </div>

              <div>
                <button
                  onClick={onOpenUpload}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-sky-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Circle Memory</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bento 2: Circle Members Status Card (Col 9-12) */}
        <div className="bento-card col-span-12 sm:col-span-6 lg:col-span-4 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Private Circle</div>
                  <div className="text-[10px] text-slate-400">Invite-Only Access</div>
                </div>
              </div>
              <button 
                onClick={onNavigateToFriends}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Manage
              </button>
            </div>

            {friends.length === 0 ? (
              <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                <UserPlus className="w-8 h-8 mx-auto text-slate-500" />
                <div className="text-xs font-bold text-white">Circle Founder Active</div>
                <p className="text-[11px] text-slate-400">
                  Invite your closest friends using cryptographic single-use invitation tokens in Admin.
                </p>
                <button
                  onClick={onNavigateToAdmin}
                  className="mt-1 text-[11px] text-sky-400 font-bold hover:underline"
                >
                  Generate Invite Code →
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {friends.slice(0, 4).map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="flex items-center gap-2.5">
                      <img src={f.avatar} alt={f.name} className="w-7 h-7 rounded-xl object-cover" />
                      <div className="text-xs">
                        <div className="font-semibold text-white">{f.name}</div>
                        <div className="text-[10px] text-slate-400">{f.memoriesCount} memories</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Circle cap: {1 + friends.length}/10</span>
            <span className="text-emerald-400 font-mono font-semibold">100% Encrypted</span>
          </div>
        </div>

        {/* Bento 3: Google Drive Storage & Vault Encryption (Col 1-4) */}
        <div className="bento-card col-span-12 sm:col-span-6 lg:col-span-4 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Private Storage Vault</div>
                <div className="text-[10px] text-slate-400">Google Drive API Protected</div>
              </div>
            </div>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-black text-white font-mono">0.0 GB</span>
              <span className="text-xs text-slate-400 font-mono">of 100 GB</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-500 w-[1%] rounded-full"></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-slate-300 font-bold">{posts.flatMap(p => p.photos).length} Photos</div>
                <div>Circle Vault</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-emerald-400 font-bold">0 Public</div>
                <div>URLs exposed</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>End-to-end authenticated tokens</span>
          </div>
        </div>

        {/* Bento 4: Circle Moments Stat & Heart Count (Col 5-8) */}
        <div className="bento-card col-span-12 sm:col-span-6 lg:col-span-4 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500/20" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Memories Engagement</div>
                <div className="text-[10px] text-slate-400">Close Circle Only</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
              Private Feed
            </span>
          </div>

          <div className="my-2 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-white/5 text-center">
              <div className="text-2xl font-black text-white">{posts.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Total Shared Posts</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 text-center">
              <div className="text-2xl font-black text-rose-400">
                {posts.reduce((sum, p) => sum + p.likesCount, 0)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Circle Hearts</div>
            </div>
          </div>

          <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-white/5">
            <span>Algorithm Interference:</span>
            <span className="font-bold text-emerald-400 font-mono">0% (Pure Chronological)</span>
          </div>
        </div>

        {/* Bento 5: Brutalism Security Access Shortcut (Col 9-12) */}
        <div className="bento-card col-span-12 sm:col-span-6 lg:col-span-4 p-5 flex flex-col justify-between border-yellow-400/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-mono font-bold">
                7
              </div>
              <div>
                <div className="text-xs font-bold text-white">Admin Security Access</div>
                <div className="text-[10px] text-yellow-400/80 font-mono">Brutalist Protocol</div>
              </div>
            </div>
            <button 
              onClick={onNavigateToAdmin}
              className="text-xs font-mono font-bold text-yellow-400 hover:underline flex items-center gap-1"
            >
              Open
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="text-emerald-400 font-bold">SECURE</span>
            </div>
            <div className="flex justify-between">
              <span>INVITE TOKENS:</span>
              <span className="text-yellow-400 font-bold">READY</span>
            </div>
            <div className="flex justify-between">
              <span>AUDIT TRAIL:</span>
              <span className="text-sky-400">AUTHENTICATED</span>
            </div>
          </div>

          <button
            onClick={onNavigateToAdmin}
            className="w-full mt-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider font-mono transition"
          >
            Launch Admin Guard
          </button>
        </div>
      </div>
    </div>
  );
};
