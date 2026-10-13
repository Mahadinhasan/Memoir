import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Sparkles, 
  Maximize2,
  Calendar,
  Layers,
  Award,
  MoreVertical,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Post, User } from '../../types';

interface FeedPostProps {
  post: Post;
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onOpenPhotoViewer: (photos: string[], initialIndex: number, post: Post) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  onAddPhoto?: (post: Post) => void;
  onReplacePhoto?: (post: Post, photoIndex: number) => void;
  onDeletePhoto?: (postId: string, photoIndex: number) => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  currentUser,
  onLikeToggle,
  onSaveToggle,
  onOpenComments,
  onOpenPhotoViewer,
  onEditPost,
  onDeletePost,
  onAddPhoto,
  onReplacePhoto,
  onDeletePhoto
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const safePhotoIndex = post.photos && post.photos.length > 0 
    ? Math.min(Math.max(0, photoIndex), post.photos.length - 1) 
    : 0;
  const [showMenu, setShowMenu] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt calculation for Spatial UI
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || post.variant !== 'spatial') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 18;
    const tiltY = (centerX - x) / 18;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const triggerCelebrationConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#8b5cf6', '#facc15', '#38bdf8']
    });
  };

  // Next / Previous Photo
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : post.photos.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev < post.photos.length - 1 ? prev + 1 : 0));
  };

  // Determine current variant
  const isSkeuomorphic = post.variant === 'skeuomorphic';
  const isMaximalist = post.variant === 'maximalist';
  const isSpatial = post.variant === 'spatial';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={
        isSpatial
          ? {
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: isHovered ? 'none' : 'transform 0.4s ease'
            }
          : undefined
      }
      className={`relative transition-all duration-300 ${
        isSkeuomorphic
          ? 'skeuo-polaroid skeuo-paper-texture max-w-[650px] mx-auto text-slate-800'
          : isMaximalist
          ? 'maximalist-card p-6 border-2 border-fuchsia-400/40 text-white'
          : 'minimal-feed-card p-4 sm:p-5 shadow-lg'
      }`}
    >
      {/* Skeuomorphic Washi Tape & Brass Photo Corners */}
      {isSkeuomorphic && (
        <>
          <div className="skeuo-washi-tape"></div>
          <div className="skeuo-photo-corner top-2 left-2 border-t-2 border-l-2"></div>
          <div className="skeuo-photo-corner top-2 right-2 border-t-2 border-r-2"></div>
        </>
      )}

      {/* Style Indicator Pill (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        {isSkeuomorphic && (
          <span className="px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-200 text-[10px] font-mono border border-amber-600/40 flex items-center gap-1 shadow-md">
            <Layers className="w-3 h-3 text-amber-300" />
            Style: Skeuomorphism
          </span>
        )}
        {isMaximalist && (
          <button
            onClick={triggerCelebrationConfetti}
            className="maximalist-badge px-3 py-1 text-[11px] flex items-center gap-1 animate-bounce"
            title="Trigger Confetti!"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Style: Maximalism (Tap 🎉)
          </button>
        )}
        {isSpatial && (
          <span className="px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-200 text-[10px] font-mono border border-purple-500/40 flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-purple-300" />
            Style: Spatial UI (3D Tilt)
          </span>
        )}
        {!isSkeuomorphic && !isMaximalist && !isSpatial && (
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-mono border border-white/10 hidden sm:inline-flex">
            Style: Minimalism
          </span>
        )}
      </div>

      {/* Maximalist Top Celebration Headline */}
      {isMaximalist && post.celebrationTitle && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="maximalist-sticker bg-yellow-400 text-black">
              ★ CIRCLE SPOTLIGHT ★
            </span>
            <span className="maximalist-sticker bg-white text-black">
              VERIFIED MEMORY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-md">
            {post.celebrationTitle}
          </h2>
        </div>
      )}

      {/* Post Author Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className={`w-10 h-10 rounded-2xl object-cover ${
              isSkeuomorphic ? 'border-2 border-amber-900/40' : 'border border-white/20'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isSkeuomorphic ? 'text-amber-950' : 'text-white'}`}>
                {post.author.name}
              </span>
              <span className={`text-[11px] ${isSkeuomorphic ? 'text-amber-800/80 font-serif' : 'text-slate-400'}`}>
                @{post.author.username}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className={isSkeuomorphic ? 'text-amber-900/70' : 'text-slate-400'}>
                {post.createdAt}
              </span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className={`flex items-center gap-1 ${isSkeuomorphic ? 'text-amber-900 font-medium' : 'text-slate-300'}`}>
                    <MapPin className="w-3 h-3 text-sky-400" />
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Menu (Edit / Delete) */}
        {(onEditPost || onDeletePost) && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-1.5 rounded-xl transition ${
                isSkeuomorphic 
                  ? 'text-amber-900/60 hover:text-amber-950 hover:bg-amber-900/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Post Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 glass-panel rounded-2xl p-1.5 shadow-2xl border border-white/15 z-30 animate-fadeIn text-xs">
                {onAddPhoto && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onAddPhoto(post);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl text-left hover:bg-white/10 text-sky-300 flex items-center gap-2 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-sky-400" />
                    <span>Add Photo</span>
                  </button>
                )}
                {post.photos.length > 0 && onReplacePhoto && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onReplacePhoto(post, safePhotoIndex);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl text-left hover:bg-white/10 text-amber-300 flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Replace Current Photo</span>
                  </button>
                )}
                {post.photos.length > 0 && onDeletePhoto && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm(`Delete Photo #${safePhotoIndex + 1} from this memory post?`)) {
                        onDeletePhoto(post.id, safePhotoIndex);
                        if (safePhotoIndex > 0) setPhotoIndex(safePhotoIndex - 1);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl text-left hover:bg-rose-500/20 text-rose-300 flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Current Photo</span>
                  </button>
                )}
                <div className="my-1 border-t border-white/10"></div>
                {onEditPost && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditPost(post);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl text-left hover:bg-white/10 text-slate-200 flex items-center gap-2 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Edit Post Details</span>
                  </button>
                )}
                {onDeletePost && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm('Are you sure you want to delete this memory from the circle?')) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl text-left hover:bg-rose-500/20 text-rose-400 flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Entire Post</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Photo Container with Image CRUD Action Bar */}
      {post.photos.length > 0 ? (
        <div 
          onClick={() => onOpenPhotoViewer(post.photos, safePhotoIndex, post)}
          className="relative group rounded-2xl overflow-hidden bg-black/40 cursor-zoom-in select-none aspect-[4/3] sm:aspect-[16/10]"
        >
          <img 
            src={post.photos[safePhotoIndex]} 
            alt={`Memory by ${post.author.name}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />

          {/* Top Info Overlay: Photo Counter + Spatial View (READ) */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <div className="p-1.5 px-2.5 rounded-xl glass-panel text-white text-[11px] font-mono flex items-center gap-1.5 shadow-lg">
              <ImageIcon className="w-3 h-3 text-sky-400" />
              <span>{safePhotoIndex + 1}/{post.photos.length}</span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 px-2.5 rounded-xl glass-panel text-white text-[11px] flex items-center gap-1.5 shadow-lg hidden sm:flex">
              <Maximize2 className="w-3 h-3 text-purple-300" />
              <span>Spatial View</span>
            </div>
          </div>

          {/* Top-Right Image CRUD Action Dock (CREATE, UPDATE, DELETE) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 flex items-center gap-1.5 z-20"
          >
            {/* 1. UPDATE / REPLACE PHOTO */}
            {onReplacePhoto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReplacePhoto(post, safePhotoIndex);
                }}
                className="px-2.5 py-1.5 rounded-xl glass-panel hover:bg-amber-500/30 text-amber-200 hover:text-white text-[11px] font-bold flex items-center gap-1 shadow-lg transition-all border border-amber-400/40 hover:scale-105"
                title="Replace / Update this photo"
              >
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin-slow" />
                <span className="hidden sm:inline">Replace</span>
              </button>
            )}

            {/* 2. CREATE / ADD PHOTO */}
            {onAddPhoto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddPhoto(post);
                }}
                className="px-2.5 py-1.5 rounded-xl glass-panel hover:bg-sky-500/30 text-sky-200 hover:text-white text-[11px] font-bold flex items-center gap-1 shadow-lg transition-all border border-sky-400/40 hover:scale-105"
                title="Add new photo to this memory"
              >
                <Plus className="w-3 h-3 text-sky-400" />
                <span className="hidden sm:inline">+ Add</span>
              </button>
            )}

            {/* 3. DELETE PHOTO */}
            {onDeletePhoto && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete Photo #${safePhotoIndex + 1} of ${post.photos.length} from this memory?`)) {
                    onDeletePhoto(post.id, safePhotoIndex);
                    if (safePhotoIndex > 0) setPhotoIndex(safePhotoIndex - 1);
                  }
                }}
                className="p-1.5 px-2 rounded-xl glass-panel hover:bg-rose-500/30 text-rose-300 hover:text-white text-[11px] flex items-center gap-1 shadow-lg transition-all border border-rose-400/30 hover:scale-105"
                title="Delete this photo"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
              </button>
            )}
          </div>

          {/* Carousel controls if multi-photo */}
          {post.photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-white opacity-80 hover:opacity-100 hover:scale-110 transition shadow-lg z-10"
                title="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-white opacity-80 hover:opacity-100 hover:scale-110 transition shadow-lg z-10"
                title="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Photo count dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-panel z-10">
                {post.photos.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === safePhotoIndex ? 'bg-sky-400 w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Empty photos state when all photos were deleted */
        <div className="rounded-2xl border-2 border-dashed border-white/15 p-6 flex flex-col items-center justify-center text-center bg-white/[0.02]">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 mb-2">
            <ImageIcon className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 font-medium mb-1">No photos in this memory post</p>
          <p className="text-[11px] text-slate-500 mb-3">Attach a photo from the circle gallery or device</p>
          {onAddPhoto && (
            <button
              type="button"
              onClick={() => onAddPhoto(post)}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Photo</span>
            </button>
          )}
        </div>
      )}

      {/* Skeuomorphic Memory Date / Film Strip details */}
      {isSkeuomorphic && post.memoryDate && (
        <div className="mt-3 flex items-center justify-between text-xs font-serif italic text-amber-950/80 border-b border-amber-900/10 pb-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-800" />
            {post.memoryDate}
          </span>
          <span className="text-[10px] font-mono text-amber-900/60 uppercase">
            Film Negative #04-B
          </span>
        </div>
      )}

      {/* Post Actions Bar: Neomorphic controls + Claymorphic badges */}
      <div className="flex items-center justify-between mt-4 pt-2">
        <div className="flex items-center gap-3">
          {/* Like Button (Claymorphic / Tactile) */}
          <button
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              post.hasLiked 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold shadow-sm scale-105' 
                : isSkeuomorphic 
                ? 'bg-amber-900/10 text-amber-900 hover:bg-amber-900/20' 
                : 'neo-button text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="text-xs font-medium">{post.likesCount}</span>
          </button>

          {/* Comment Drawer Trigger */}
          <button
            onClick={() => onOpenComments(post)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
              isSkeuomorphic 
                ? 'bg-amber-900/10 text-amber-900 hover:bg-amber-900/20' 
                : 'neo-button text-slate-300 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{post.comments.length}</span>
          </button>

          {/* Share with Circle */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Memoir Post', text: post.caption, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Memory link copied to clipboard!');
              }
            }}
            className={`p-1.5 rounded-full transition ${
              isSkeuomorphic ? 'text-amber-900 hover:bg-amber-900/10' : 'text-slate-400 hover:text-white'
            }`}
            title="Share with Circle"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Neomorphic Tactile Bookmark/Save Button */}
        <button
          onClick={() => onSaveToggle(post.id)}
          className={`p-2 rounded-xl transition ${
            post.saved 
              ? 'bg-sky-500/20 text-sky-400 border border-sky-400/40' 
              : isSkeuomorphic 
              ? 'text-amber-900 hover:bg-amber-900/10' 
              : 'neo-button text-slate-400 hover:text-white'
          }`}
          title={post.saved ? 'Saved to Keepsakes' : 'Save to Keepsakes'}
        >
          <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-sky-400' : ''}`} />
        </button>
      </div>

      {/* Caption & Metadata */}
      <div className="mt-3">
        <p className={`text-sm leading-relaxed ${
          isSkeuomorphic 
            ? 'font-serif text-amber-950 font-normal italic' 
            : isMaximalist 
            ? 'font-sans text-white font-medium drop-shadow-sm' 
            : 'text-slate-200'
        }`}>
          <span className={`font-bold mr-2 ${isSkeuomorphic ? 'text-amber-950 not-italic' : 'text-white'}`}>
            {post.author.username}
          </span>
          {post.caption}
        </p>
      </div>

      {/* Preview Comments summary if any */}
      {post.comments.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/5">
          <button
            onClick={() => onOpenComments(post)}
            className={`text-xs ${
              isSkeuomorphic ? 'text-amber-900/70 font-serif hover:text-amber-950' : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            View all {post.comments.length} comments from circle...
          </button>
          <div className="mt-1 text-xs truncate">
            <span className={`font-semibold mr-1.5 ${isSkeuomorphic ? 'text-amber-950' : 'text-slate-200'}`}>
              {post.comments[post.comments.length - 1].author.username}
            </span>
            <span className={isSkeuomorphic ? 'text-amber-900/90' : 'text-slate-400'}>
              {post.comments[post.comments.length - 1].text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
