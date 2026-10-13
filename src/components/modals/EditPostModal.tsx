import React, { useState, useRef } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Sparkles, 
  HardDrive, 
  Laptop, 
  Link as LinkIcon 
} from 'lucide-react';
import { Post } from '../../types';
import { GoogleMediaPicker } from './GoogleMediaPicker';
import { ALL_GALLERY_PHOTOS } from '../../data/galleryPhotos';

interface EditPostModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
  onSave: (postId: string, updatedFields: Partial<Post>) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  post,
  onClose,
  onSave
}) => {
  if (!isOpen || !post) return null;

  const [caption, setCaption] = useState(post.caption);
  const [location, setLocation] = useState(post.location || '');
  const [variant, setVariant] = useState<'minimal' | 'skeuomorphic' | 'maximalist' | 'spatial'>(post.variant || 'minimal');
  const [celebrationTitle, setCelebrationTitle] = useState(post.celebrationTitle || '');
  const [photos, setPhotos] = useState<string[]>(post.photos || []);
  const [activeMediaSource, setActiveMediaSource] = useState<'none' | 'gallery' | 'device' | 'drive' | 'photos' | 'url'>('none');
  const [customUrl, setCustomUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim() && !photos.includes(customUrl.trim())) {
      setPhotos([...photos, customUrl.trim()]);
      setCustomUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(post.id, {
      caption: caption.trim(),
      location: location.trim(),
      variant,
      celebrationTitle: variant === 'maximalist' ? celebrationTitle.trim() : undefined,
      photos
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Memory Post</h3>
              <p className="text-[11px] text-slate-400">Update story, add or remove photos, change presentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Current Photos Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Manage Photos ({photos.length})
              </label>
              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveMediaSource(activeMediaSource === 'gallery' ? 'none' : 'gallery')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeMediaSource === 'gallery' ? 'bg-amber-500 text-black shadow-md' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                  }`}
                >
                  ★ + Gallery (41)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaSource(activeMediaSource === 'drive' ? 'none' : 'drive')}
                  className="px-2.5 py-1 rounded-lg bg-[#0066da]/20 text-sky-300 border border-[#4285f4]/30 text-[11px]"
                >
                  + Google Drive
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaSource(activeMediaSource === 'photos' ? 'none' : 'photos')}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px]"
                >
                  + Google Photos
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px]"
                >
                  + Local File
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLocalFiles}
              multiple
              accept="image/*"
              className="hidden"
            />

            {/* Gallery 41 Drawer */}
            {activeMediaSource === 'gallery' && (
              <div className="mb-3 p-3 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>Pick from 41 Gallery Photos</span>
                  <button
                    type="button"
                    onClick={() => setActiveMediaSource('none')}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Close Picker ✕
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto pr-1">
                  {ALL_GALLERY_PHOTOS.map((p) => {
                    const isSelected = photos.includes(p.path);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (isSelected) {
                            setPhotos(photos.filter(u => u !== p.path));
                          } else {
                            setPhotos([...photos, p.path]);
                          }
                        }}
                        className={`relative rounded-lg overflow-hidden aspect-square cursor-pointer border transition ${
                          isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-white/10 hover:border-white/30'
                        }`}
                        title={p.title}
                      >
                        <img src={p.path} alt={p.title} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-bold flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cloud Picker Drawer if triggered */}
            {activeMediaSource === 'drive' && (
              <div className="mb-3 p-3 rounded-2xl bg-slate-950 border border-white/10">
                <GoogleMediaPicker
                  service="drive"
                  selectedUrls={photos}
                  onSelectPhotos={(urls) => setPhotos([...photos, ...urls.filter(u => !photos.includes(u))])}
                />
              </div>
            )}

            {activeMediaSource === 'photos' && (
              <div className="mb-3 p-3 rounded-2xl bg-slate-950 border border-white/10">
                <GoogleMediaPicker
                  service="photos"
                  selectedUrls={photos}
                  onSelectPhotos={(urls) => setPhotos([...photos, ...urls.filter(u => !photos.includes(u))])}
                />
              </div>
            )}

            {photos.length === 0 ? (
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 text-center text-xs text-slate-400">
                No photos attached to this post. Use the buttons above to attach photos.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-white/15 group bg-black/40">
                    <img src={url} alt="Post media" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow"
                      title="Delete this photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1 rounded bg-black/60 text-[9px] font-mono text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Style Presentation Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Memory Style Presentation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setVariant('minimal')}
                className={`p-2.5 rounded-xl text-left border transition text-xs font-bold ${
                  variant === 'minimal' ? 'bg-sky-500/20 border-sky-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                1. Minimalism
              </button>
              <button
                type="button"
                onClick={() => setVariant('skeuomorphic')}
                className={`p-2.5 rounded-xl text-left border transition text-xs font-bold ${
                  variant === 'skeuomorphic' ? 'bg-amber-600/30 border-amber-400 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                2. Skeuomorphic
              </button>
              <button
                type="button"
                onClick={() => setVariant('maximalist')}
                className={`p-2.5 rounded-xl text-left border transition text-xs font-bold ${
                  variant === 'maximalist' ? 'bg-pink-600/30 border-pink-400 text-pink-200' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                3. Maximalist
              </button>
              <button
                type="button"
                onClick={() => setVariant('spatial')}
                className={`p-2.5 rounded-xl text-left border transition text-xs font-bold ${
                  variant === 'spatial' ? 'bg-purple-600/30 border-purple-400 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                4. Spatial UI
              </button>
            </div>
          </div>

          {variant === 'maximalist' && (
            <div>
              <label className="text-xs font-semibold text-pink-300 block mb-1">
                Celebration Headline
              </label>
              <input
                type="text"
                value={celebrationTitle}
                onChange={(e) => setCelebrationTitle(e.target.value)}
                placeholder="CELEBRATION TITLE..."
                className="w-full px-3 py-2 rounded-xl bg-pink-950/40 border border-pink-500/40 text-xs text-white"
              />
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Caption & Story
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
                className="w-full pl-10 pr-3 py-2 rounded-2xl glass-input text-xs text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="liquid-glass-pill px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg"
            >
              <Save className="w-3.5 h-3.5 text-sky-300" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
