import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Sparkles, 
  Layers, 
  MapPin, 
  Heart, 
  Maximize2, 
  BookOpen, 
  Filter,
  Camera,
  Plus
} from 'lucide-react';
import { MemoryItem, User } from '../../types';

interface MemoriesTimelineViewProps {
  memories: MemoryItem[];
  currentUser: User;
  onOpenPhotoViewer: (photos: string[], initialIndex: number) => void;
}

export const MemoriesTimelineView: React.FC<MemoriesTimelineViewProps> = ({
  memories,
  currentUser,
  onOpenPhotoViewer
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = ['all', '#Campfire', '#Roadtrip', '#Celebration', '#Portraits'];

  const filteredMemories = selectedTag === 'all'
    ? memories
    : memories.filter(m => m.tags.includes(selectedTag));

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Style 1: Skeuomorphism & Style 6: Maximalism
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            The Circle Scrapbook & Archives
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tactile physical polaroids and vibrant celebratory milestones preserved forever.
          </p>
        </div>

        {/* Nostalgic Tag Filters (Neomorphic) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition capitalize ${
                selectedTag === tag
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'neo-button text-slate-300 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Grid or Clean Skeuomorphic Empty State */}
      {filteredMemories.length === 0 ? (
        <div className="skeuo-polaroid skeuo-paper-texture max-w-xl mx-auto p-8 text-center text-slate-800 space-y-4 my-8">
          <div className="skeuo-washi-tape"></div>
          <div className="w-16 h-16 rounded-2xl bg-amber-900/10 border border-amber-900/20 flex items-center justify-center text-amber-900 mx-auto">
            <Camera className="w-8 h-8" />
          </div>
          <div className="font-serif italic text-2xl font-bold text-amber-950">
            A Clean Slate for Tangible Memories
          </div>
          <p className="font-serif italic text-sm text-amber-900/80 max-w-md mx-auto leading-relaxed">
            Your private scrapbook is completely empty. When you publish photo posts using the <strong>Polaroid</strong> or <strong>Celebration</strong> treatment, they will be archived here with tactile washi tape, paper grain, and gold foil stamps.
          </p>
          <div className="text-[11px] font-mono text-amber-900/60 uppercase pt-2 border-t border-amber-900/10">
            Encrypted Circle Archive • Ready For Memories
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredMemories.map((mem) => {
            const isMaximalist = mem.style === 'maximalist';
            const isPolaroid = mem.style === 'polaroid';

            if (isPolaroid) {
              return (
                <div 
                  key={mem.id}
                  className="skeuo-polaroid skeuo-paper-texture cursor-pointer relative group flex flex-col justify-between"
                  onClick={() => onOpenPhotoViewer(mem.photos, 0)}
                >
                  {/* Washi Tape on Top Center */}
                  <div className="skeuo-washi-tape"></div>

                  {/* Brass Photo Corner accents */}
                  <div className="skeuo-photo-corner top-3 left-3 border-t-2 border-l-2"></div>
                  <div className="skeuo-photo-corner top-3 right-3 border-t-2 border-r-2"></div>
                  <div className="skeuo-photo-corner bottom-12 left-3 border-b-2 border-l-2"></div>
                  <div className="skeuo-photo-corner bottom-12 right-3 border-b-2 border-r-2"></div>

                  {/* Photo */}
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-amber-950/20 shadow-inner">
                    <img 
                      src={mem.photos[0]} 
                      alt={mem.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] backdrop-blur-sm">
                      {mem.yearAgo}
                    </div>
                  </div>

                  {/* Hand-written / Serif Polaroid Bottom Caption */}
                  <div className="mt-3 px-1 text-center">
                    <h3 className="font-serif italic text-base sm:text-lg font-bold text-amber-950 leading-tight">
                      {mem.title}
                    </h3>
                    <p className="font-serif italic text-xs text-amber-900/80 mt-1 line-clamp-2">
                      "{mem.story}"
                    </p>
                    <div className="mt-2 pt-2 border-t border-amber-900/10 flex items-center justify-between text-[10px] font-mono text-amber-900/60 uppercase">
                      <span>{mem.date}</span>
                      <span>By {mem.author.name}</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Maximalist Variant Card
            return (
              <div 
                key={mem.id}
                onClick={() => onOpenPhotoViewer(mem.photos, 0)}
                className="maximalist-card p-6 flex flex-col justify-between cursor-pointer group transform transition duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="maximalist-badge px-3 py-1 text-xs">
                      ★ {mem.yearAgo.toUpperCase()} ★
                    </span>
                    <span className="maximalist-sticker bg-white text-black text-[10px]">
                      MAXIMALIST
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase drop-shadow-md leading-none">
                    {mem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 mt-2 font-medium leading-relaxed">
                    {mem.story}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border-2 border-white/30 shadow-2xl">
                    <img 
                      src={mem.photos[0]} 
                      alt={mem.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span>{mem.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                        {mem.mood}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {mem.tags.map((t) => (
                      <span key={t} className="maximalist-sticker bg-black/40 text-yellow-300 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
