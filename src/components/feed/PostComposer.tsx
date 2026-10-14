import React, { useState } from 'react';
import { Image, MapPin, Smile, Send, Sparkles, Lock, X, HardDrive } from 'lucide-react';
import { User, Post } from '../../types';

interface PostComposerProps {
  currentUser: User;
  onAddPost: (post: Post) => void;
  onOpenUploadModal: (source?: 'device' | 'drive' | 'photos') => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  currentUser,
  onAddPost,
  onOpenUploadModal
}) => {
  const [caption, setCaption] = useState('');
  const [selectedMood, setSelectedMood] = useState('✨ Cozy');
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [styleMode, setStyleMode] = useState<'minimal' | 'skeuomorphic' | 'maximalist'>('minimal');

  const moods = ['✨ Cozy', '🎉 Celebrating', '🌿 Nostalgic', '🌊 Peaceful', '☕ Studio Mode'];

  const handleQuickPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      caption: `${selectedMood} • ${caption}`,
      photos: [],
      location: location.trim() || 'Private Circle Sanctuary',
      createdAt: 'Just now',
      likesCount: 1,
      hasLiked: true,
      saved: false,
      variant: styleMode,
      celebrationTitle: styleMode === 'maximalist' ? 'MOMENT OF THE DAY' : undefined,
      celebrationType: styleMode === 'maximalist' ? 'milestone' : undefined,
      comments: []
    };

    onAddPost(newPost);
    setCaption('');
    setLocation('');
    setShowLocationInput(false);
  };

  return (
    <div className="minimal-feed-card p-3 sm:p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Top Author & Privacy - Mobile shows only profile (Avatar + Name) and mode */}
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/5 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover border border-sky-400/30 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
              <span className="truncate">{currentUser.name}</span>
              <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                {currentUser.role === 'admin' ? 'Circle Admin' : 'Member'}
              </span>
            </div>
            <div className="hidden sm:flex text-[11px] text-slate-400 items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">Visible only to approved circle</span>
            </div>
          </div>
        </div>

        {/* Style Variant Selector for the post (Clean, Polaroid, Celebration) */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[10px] sm:text-[11px] flex-shrink-0">
          <button
            type="button"
            onClick={() => setStyleMode('minimal')}
            className={`px-2 py-0.5 rounded-lg transition ${
              styleMode === 'minimal' ? 'bg-sky-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Clean
          </button>
          <button
            type="button"
            onClick={() => setStyleMode('skeuomorphic')}
            className={`px-2 py-0.5 rounded-lg transition ${
              styleMode === 'skeuomorphic' ? 'bg-amber-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Polaroid
          </button>
          <button
            type="button"
            onClick={() => setStyleMode('maximalist')}
            className={`px-2 py-0.5 rounded-lg transition ${
              styleMode === 'maximalist' ? 'bg-pink-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Celebration
          </button>
        </div>
      </div>

      {/* Caption Textarea */}
      <form onSubmit={handleQuickPublish} className="mt-2.5 sm:mt-3">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Share a memory, an unsaid thought..."
          rows={2}
          className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none pt-0.5"
        />

        {showLocationInput && (
          <div className="flex items-center gap-2 mb-2 sm:mb-3 bg-white/5 p-2 rounded-xl text-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (e.g., Big Sur, Tokyo, Studio)..."
              className="bg-transparent flex-1 focus:outline-none text-slate-200 text-xs"
            />
            <button 
              type="button" 
              onClick={() => setShowLocationInput(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Claymorphic Mood Pills (Visible on sm: and up to keep mobile clean & narrow) */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <span className="text-[10px] text-slate-500 font-medium mr-1 flex items-center gap-1">
            Mood:
          </span>
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMood(m)}
              className={`clay-badge px-2.5 py-1 text-[11px] whitespace-nowrap transition-all ${
                selectedMood === m
                  ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-white/5 mt-1 sm:mt-2 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Open Full Multi-file Upload Modal */}
            <button
              type="button"
              onClick={() => onOpenUploadModal('device')}
              className="p-1.5 sm:p-2 px-2.5 sm:px-3 rounded-xl bg-white/5 hover:bg-white/10 text-sky-400 border border-white/10 flex items-center gap-1.5 text-xs font-semibold transition"
              title="Upload Photos from Device"
            >
              <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add Photos</span>
            </button>

            {/* Direct Google Drive Import Shortcut (Hidden on mobile to keep narrow) */}
            <button
              type="button"
              onClick={() => onOpenUploadModal('drive')}
              className="hidden sm:flex px-2.5 py-2 rounded-xl bg-[#0066da]/15 hover:bg-[#0066da]/25 text-[#72aaff] border border-[#4285f4]/30 items-center gap-1.5 text-xs font-semibold transition"
              title="Import Directly from Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#4285f4]" />
              <span>Google Drive</span>
            </button>

            {/* Direct Google Photos Import Shortcut (Hidden on mobile to keep narrow) */}
            <button
              type="button"
              onClick={() => onOpenUploadModal('photos')}
              className="hidden sm:flex px-2.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 items-center gap-1.5 text-xs font-semibold transition"
              title="Import Directly from Google Photos"
            >
              <Image className="w-3.5 h-3.5 text-rose-400" />
              <span>Google Photos</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLocationInput(!showLocationInput)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition"
              title="Add Location"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Liquid Glass Publish Button */}
          <button
            type="submit"
            disabled={!caption.trim()}
            className="liquid-glass-pill px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-lg flex-shrink-0"
          >
            <span className="hidden sm:inline">Share Memory</span>
            <span className="sm:hidden">Share</span>
            <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
