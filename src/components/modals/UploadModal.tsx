import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  MapPin, 
  Lock, 
  CheckCircle2, 
  Plus, 
  Trash2,
  HardDrive,
  Cloud,
  Link,
  Laptop
} from 'lucide-react';
import { Post, User } from '../../types';
import { GoogleMediaPicker } from './GoogleMediaPicker';
import { ALL_GALLERY_PHOTOS } from '../../data/galleryPhotos';

interface UploadModalProps {
  isOpen: boolean;
  currentUser: User;
  initialSource?: 'device' | 'drive' | 'photos' | 'gallery';
  onClose: () => void;
  onPublish: (newPost: Post) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  currentUser,
  initialSource = 'gallery',
  onClose,
  onPublish
}) => {
  const [activeSource, setActiveSource] = useState<'gallery' | 'device' | 'drive' | 'photos' | 'url'>(initialSource);
  const [photos, setPhotos] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [variant, setVariant] = useState<'minimal' | 'skeuomorphic' | 'maximalist' | 'spatial'>('minimal');
  const [celebrationTitle, setCelebrationTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('All');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Real local file upload handler
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

  const handleAddImportedPhotos = (newUrls: string[]) => {
    const unique = newUrls.filter(u => !photos.includes(u));
    setPhotos([...photos, ...unique]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) return;

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newPost: Post = {
            id: `post_${Date.now()}`,
            author: currentUser,
            caption: caption.trim() || 'A quiet, unrepeatable memory with the circle.',
            photos: photos,
            location: location.trim() || 'Sanctuary Circle',
            createdAt: 'Just now',
            likesCount: 0,
            hasLiked: false,
            saved: false,
            variant: variant,
            celebrationTitle: variant === 'maximalist' ? (celebrationTitle || 'CELEBRATING TOGETHER') : undefined,
            celebrationType: variant === 'maximalist' ? 'milestone' : undefined,
            memoryDate: variant === 'skeuomorphic' ? 'Archived Polaroid • Circle Vault' : undefined,
            comments: []
          };
          onPublish(newPost);
          setIsUploading(false);
          onClose();
        }, 300);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Private Memory</h3>
              <p className="text-[11px] text-slate-400">Direct import from Google Drive, Google Photos, or Device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Media Source Tab Switcher */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Choose Photo Source</span>
              <span className="text-[10px] text-sky-400 font-mono">
                {photos.length} selected for post
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {/* Option 0: Gallery 2022 Vault */}
              <button
                type="button"
                onClick={() => setActiveSource('gallery')}
                className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
                  activeSource === 'gallery'
                    ? 'bg-amber-500/25 border-amber-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-black font-black text-[10px] flex-shrink-0">
                  ★
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold truncate">Gallery Vault</div>
                  <div className="text-[10px] text-amber-300 truncate">41 2022 Photos</div>
                </div>
              </button>

              {/* Option 1: Device Upload */}
              <button
                type="button"
                onClick={() => setActiveSource('device')}
                className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${
                  activeSource === 'device'
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold truncate">Device Upload</div>
                  <div className="text-[10px] text-slate-400 truncate">Local Files / RAW</div>
                </div>
              </button>

              {/* Option 2: Google Drive */}
              <button
                type="button"
                onClick={() => setActiveSource('drive')}
                className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${
                  activeSource === 'drive'
                    ? 'bg-[#0066da]/30 border-[#4285f4] text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 rounded bg-[#4285f4] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  ▲
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold truncate">Google Drive</div>
                  <div className="text-[10px] text-sky-300 truncate">Encrypted Vault</div>
                </div>
              </button>

              {/* Option 3: Google Photos */}
              <button
                type="button"
                onClick={() => setActiveSource('photos')}
                className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${
                  activeSource === 'photos'
                    ? 'bg-rose-500/20 border-rose-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold truncate">Google Photos</div>
                  <div className="text-[10px] text-rose-300 truncate">Direct Albums</div>
                </div>
              </button>

              {/* Option 4: Direct URL */}
              <button
                type="button"
                onClick={() => setActiveSource('url')}
                className={`p-3 rounded-2xl text-left border transition flex items-center gap-2.5 ${
                  activeSource === 'url'
                    ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Link className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold truncate">Cloud URL</div>
                  <div className="text-[10px] text-teal-300 truncate">Direct Link</div>
                </div>
              </button>
            </div>
          </div>

          {/* Active Source Area */}
          <div className="rounded-2xl p-4 bg-slate-950/60 border border-white/10">
            {/* SOURCE 0: GALLERY VAULT (41 PHOTOS) */}
            {activeSource === 'gallery' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Circle Gallery Vault (41 Images)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        2022 Archive
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      High-resolution photos from your Gallary/2022 directory. Click any photo to toggle selection.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allPaths = ALL_GALLERY_PHOTOS.map(p => p.path);
                        const unique = Array.from(new Set([...photos, ...allPaths]));
                        setPhotos(unique);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold border border-amber-500/30 transition"
                    >
                      Select All (41)
                    </button>
                    {photos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPhotos([])}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[11px] font-semibold border border-white/10 transition"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories Filter Bar */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {['All', 'Portraits & Riverside', 'Summer Sunshine', 'Monsoon Greenery', 'Woodland Tales', 'Rustic Home', 'Circle Portraits', 'Twilight Glow'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition ${
                        galleryCategoryFilter === cat
                          ? 'bg-amber-500 text-black font-bold shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 41 Gallery Photos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {ALL_GALLERY_PHOTOS
                    .filter(p => galleryCategoryFilter === 'All' || p.category === galleryCategoryFilter)
                    .map((photo) => {
                      const isSelected = photos.includes(photo.path);

                      return (
                        <div
                          key={photo.id}
                          onClick={() => {
                            if (isSelected) {
                              setPhotos(photos.filter(u => u !== photo.path));
                            } else {
                              setPhotos([...photos, photo.path]);
                            }
                          }}
                          className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg scale-[0.98]'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <img
                            src={photo.path}
                            alt={photo.title}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                            <span className="text-[10px] font-semibold text-white truncate block">
                              {photo.title}
                            </span>
                            <span className="text-[9px] text-slate-300 truncate block">
                              {photo.date}
                            </span>
                          </div>

                          {/* Selected Checkmark Badge */}
                          <div
                            className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-black shadow-md font-bold'
                                : 'bg-black/40 text-transparent border border-white/30'
                            }`}
                          >
                            ✓
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {/* SOURCE 1: DEVICE UPLOAD */}
            {activeSource === 'device' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLocalFiles}
                  multiple
                  accept="image/*"
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="clay-card p-6 text-center border-2 border-dashed border-sky-400/30 flex flex-col items-center justify-center cursor-pointer hover:border-sky-400/60 transition group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 mb-2.5 group-hover:scale-110 transition-transform">
                    <Laptop className="w-7 h-7" />
                  </div>
                  <div className="text-sm font-bold text-white">Click or drag local images here</div>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Select JPEG, PNG, HEIC, or RAW from your computer. Processed locally and protected for circle members.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/20"
                  >
                    Browse Device Files
                  </button>
                </div>
              </div>
            )}

            {/* SOURCE 2: GOOGLE DRIVE */}
            {activeSource === 'drive' && (
              <GoogleMediaPicker
                service="drive"
                selectedUrls={photos}
                onSelectPhotos={handleAddImportedPhotos}
              />
            )}

            {/* SOURCE 3: GOOGLE PHOTOS */}
            {activeSource === 'photos' && (
              <GoogleMediaPicker
                service="photos"
                selectedUrls={photos}
                onSelectPhotos={handleAddImportedPhotos}
              />
            )}

            {/* SOURCE 4: DIRECT URL */}
            {activeSource === 'url' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300">
                  Paste Direct High-Resolution Image URL
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://drive.google.com/..."
                    className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    disabled={!customUrl.trim()}
                    className="px-4 py-2 rounded-xl bg-teal-500 text-white font-bold text-xs disabled:opacity-40"
                  >
                    Add Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Photos Staged for this Post */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Staged Photos ({photos.length})
              </label>
              {photos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPhotos([])}
                  className="text-[11px] text-rose-400 hover:text-rose-300"
                >
                  Clear All
                </button>
              )}
            </div>

            {photos.length === 0 ? (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center text-xs text-slate-500">
                No photos selected yet. Pick from Google Drive, Google Photos, or Device above.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-white/15 group bg-black/40">
                    <img src={url} alt="Staged" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-rose-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow"
                      title="Remove Photo"
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

          {/* Style Paradigm Treatment Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
              <span>Choose Memory Style Presentation</span>
              <span className="text-[10px] text-sky-400 font-mono">10 Styles Ecosystem</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setVariant('minimal')}
                className={`p-3 rounded-2xl text-left border transition ${
                  variant === 'minimal' 
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">1. Minimalism</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Clean & pristine</div>
              </button>

              <button
                type="button"
                onClick={() => setVariant('skeuomorphic')}
                className={`p-3 rounded-2xl text-left border transition ${
                  variant === 'skeuomorphic' 
                    ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-lg' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">2. Skeuomorphic</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Polaroid & Washi</div>
              </button>

              <button
                type="button"
                onClick={() => setVariant('maximalist')}
                className={`p-3 rounded-2xl text-left border transition ${
                  variant === 'maximalist' 
                    ? 'bg-pink-600/30 border-pink-400 text-pink-200 shadow-lg' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">3. Maximalist</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Celebration Fanfare</div>
              </button>

              <button
                type="button"
                onClick={() => setVariant('spatial')}
                className={`p-3 rounded-2xl text-left border transition ${
                  variant === 'spatial' 
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-lg' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">4. Spatial UI</div>
                <div className="text-[10px] text-slate-400 mt-0.5">3D Parallax Tilt</div>
              </button>
            </div>
          </div>

          {/* Maximalist title field if selected */}
          {variant === 'maximalist' && (
            <div className="animate-fadeIn">
              <label className="text-xs font-semibold text-pink-300 block mb-1">
                Celebration Headline (Maximalism)
              </label>
              <input
                type="text"
                value={celebrationTitle}
                onChange={(e) => setCelebrationTitle(e.target.value)}
                placeholder="e.g. 25TH BIRTHDAY BASH, SUMMER ROADTRIP..."
                className="w-full px-4 py-2.5 rounded-2xl bg-pink-950/40 border border-pink-500/40 text-xs text-white placeholder:text-pink-300/40"
              />
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Memory Story & Notes
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell the circle what made this moment unforgettable..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none"
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
                placeholder="e.g. Big Sur, California or Kyoto Bamboo Grove"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Progress Bar simulation */}
          {isUploading && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>Encrypting & Storing in Drive Vault...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-teal-400 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Modal Actions with Liquid Glass Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visible to 6 approved circle members</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={photos.length === 0 || isUploading}
                className="liquid-glass-pill px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 disabled:opacity-40 transition shadow-lg cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>{isUploading ? 'Publishing...' : 'Publish to Feed'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
