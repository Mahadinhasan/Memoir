import React from 'react';
import { Bookmark, Heart, Sparkles, MapPin } from 'lucide-react';
import { Post, User } from '../../types';

interface FavoritesViewProps {
  posts: Post[];
  currentUser: User;
  onOpenPhotoViewer: (photos: string[], initialIndex: number, post: Post) => void;
  onSaveToggle: (postId: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  posts,
  currentUser,
  onOpenPhotoViewer,
  onSaveToggle
}) => {
  const savedPosts = posts.filter(p => p.saved);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
            Personal Keepsakes
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Saved Circle Keepsakes ({savedPosts.length})
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Memories you have bookmarked for quick nostalgia and offline reminiscing.
        </p>
      </div>

      {savedPosts.length === 0 ? (
        <div className="text-center py-20 minimal-feed-card p-8">
          <Bookmark className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">No keepsakes saved yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Tap the bookmark icon on any post in your circle feed to save memories to your private vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedPosts.map((post) => (
            <div 
              key={post.id} 
              className="minimal-feed-card p-4 flex flex-col justify-between group overflow-hidden"
            >
              <div>
                <div 
                  onClick={() => onOpenPhotoViewer(post.photos, 0, post)}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black cursor-pointer"
                >
                  <img 
                    src={post.photos[0]} 
                    alt="Saved post" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.photos.length > 1 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white font-mono">
                      +{post.photos.length - 1} photos
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-white">{post.author.name}</span>
                  <span className="text-[10px] text-slate-400">• {post.createdAt}</span>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  {post.likesCount} loves
                </span>
                <button
                  onClick={() => onSaveToggle(post.id)}
                  className="text-sky-400 hover:text-sky-300 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
