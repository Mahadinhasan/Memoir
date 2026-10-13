import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Heart, 
  Bookmark, 
  Share2, 
  Layers, 
  Sparkles, 
  Eye, 
  RotateCw,
  MapPin,
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import { Post, User } from '../../types';

interface PhotoViewerModalProps {
  isOpen: boolean;
  photos: string[];
  initialIndex: number;
  post: Post | null;
  currentUser: User;
  onClose: () => void;
  onLikeToggle?: (postId: string) => void;
  onSaveToggle?: (postId: string) => void;
  onReplacePhoto?: (postId: string, photoIndex: number) => void;
  onAddPhoto?: (postId: string) => void;
  onDeletePhoto?: (postId: string, photoIndex: number) => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  photos,
  initialIndex,
  post,
  currentUser,
  onClose,
  onLikeToggle,
  onSaveToggle,
  onReplacePhoto,
  onAddPhoto,
  onDeletePhoto
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSpatialMode, setIsSpatialMode] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
      if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length, onClose]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSpatialMode) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = (clientX - centerX) / 40;
    const y = (clientY - centerY) / 40;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl overflow-hidden select-none animate-fadeIn"
    >
      {/* Dynamic Background Atmospheric Glow based on image */}
      <div 
        className="absolute inset-0 opacity-25 filter blur-3xl scale-125 transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url(${currentPhoto})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      {/* Top Floating Spatial HUD Bar (Liquid Glass) */}
      <div className="absolute top-6 inset-x-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Author information & Spatial badge */}
        <div className="pointer-events-auto liquid-glass-pill px-4 py-2 rounded-2xl flex items-center gap-3">
          {post && (
            <>
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-8 h-8 rounded-xl object-cover border border-white/20"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{post.author.name}</span>
                  {post.location && (
                    <span className="text-slate-400 font-normal flex items-center gap-0.5 text-[10px]">
                      <MapPin className="w-2.5 h-2.5 text-sky-400" />
                      {post.location}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">
                  {post.createdAt} • Photo {currentIndex + 1} of {photos.length}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Spatial / Liquid Glass Mode Toggle & Close */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Spatial 3D Toggle */}
          <button
            onClick={() => setIsSpatialMode(!isSpatialMode)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSpatialMode 
                ? 'liquid-glass-pill text-purple-200 border-purple-400/50' 
                : 'bg-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Spatial 3D Parallax"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Spatial Depth {isSpatialMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Close Viewer */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition"
            title="Close Viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main 3D Spatial Canvas */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-8 spatial-stage"
      >
        <div 
          className="relative max-w-5xl max-h-[80vh] flex items-center justify-center transition-transform duration-100 ease-out"
          style={
            isSpatialMode ? {
              transform: `perspective(1200px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg) scale(${zoomLevel})`,
              transformStyle: 'preserve-3d'
            } : {
              transform: `scale(${zoomLevel})`
            }
          }
        >
          {/* Main Photo Layer (Z: 0) */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/60">
            <img 
              src={currentPhoto} 
              alt="Memory Full View" 
              className="max-h-[75vh] max-w-[85vw] object-contain transition-all duration-300"
            />
          </div>

          {/* Spatial Foreground Floating Tag (Z: +45px) */}
          {isSpatialMode && post && (
            <div 
              className="absolute -bottom-6 left-8 spatial-hud px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs text-white pointer-events-none hidden sm:flex"
              style={{
                transform: `translateZ(45px)`
              }}
            >
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
              <span className="font-medium text-slate-200">{post.caption.slice(0, 70)}...</span>
              <span className="font-mono text-[10px] text-purple-300 px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30">
                Spatial Z: 45px
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full liquid-glass-pill text-white hover:scale-110 active:scale-95 transition z-30"
            title="Previous (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0))}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full liquid-glass-pill text-white hover:scale-110 active:scale-95 transition z-30"
            title="Next (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Floating Liquid Glass Action Dock */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-30">
        <div className="liquid-glass-dock px-5 py-2.5 rounded-full flex items-center gap-4 text-white shadow-2xl">
          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300 hover:text-white"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          <div className="w-px h-4 bg-white/20"></div>

          {/* Like */}
          {post && onLikeToggle && (
            <button
              onClick={() => onLikeToggle(post.id)}
              className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/10 text-rose-400 transition"
              title="Love Memory"
            >
              <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500' : ''}`} />
              <span className="text-xs font-semibold">{post.likesCount}</span>
            </button>
          )}

          {/* Save Keepsake */}
          {post && onSaveToggle && (
            <button
              onClick={() => onSaveToggle(post.id)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-sky-400 transition"
              title="Save Keepsake"
            >
              <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-sky-400' : ''}`} />
            </button>
          )}

          <div className="w-px h-4 bg-white/20"></div>

          {/* Photo CRUD Actions inside Fullscreen Viewer */}
          {post && onReplacePhoto && (
            <button
              onClick={() => onReplacePhoto(post.id, currentIndex)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition text-xs font-semibold"
              title="Replace / Swap this photo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replace</span>
            </button>
          )}

          {post && onAddPhoto && (
            <button
              onClick={() => onAddPhoto(post.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition text-xs font-semibold"
              title="Add another photo to this memory"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}

          {post && onDeletePhoto && (
            <button
              onClick={() => {
                if (confirm(`Delete Photo ${currentIndex + 1} of ${photos.length} from this circle memory?`)) {
                  onDeletePhoto(post.id, currentIndex);
                }
              }}
              className="p-1.5 px-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition"
              title="Delete this photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Download Photo */}
          <a
            href={currentPhoto}
            download={`memoir_${post ? post.id : 'photo'}_${currentIndex + 1}.jpg`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="Download original photo"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
