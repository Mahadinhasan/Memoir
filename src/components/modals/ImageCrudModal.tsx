import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Search, 
  HardDrive, 
  Cloud, 
  RefreshCw, 
  Plus, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Post } from '../../types';
import { ALL_GALLERY_PHOTOS, GalleryPhoto } from '../../data/galleryPhotos';
import { uploadImageToSupabase, validateImageFile } from '../../lib/imageService';

interface ImageCrudModalProps {
  isOpen: boolean;
  mode: 'add' | 'replace';
  post: Post | null;
  photoIndex: number;
  onClose: () => void;
  onSavePhoto: (photoUrl: string) => void;
  onDeleteCurrentPhoto?: (postId: string, photoIndex: number) => void;
}

export const ImageCrudModal: React.FC<ImageCrudModalProps> = ({
  isOpen,
  mode,
  post,
  photoIndex,
  onClose,
  onSavePhoto,
  onDeleteCurrentPhoto
}) => {
  if (!isOpen || !post) return null;

  const currentPhoto = post.photos && post.photos.length > photoIndex ? post.photos[photoIndex] : null;

  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'google' | 'url'>('gallery');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(
    mode === 'replace' && currentPhoto ? currentPhoto : ''
  );
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<string>('All');
  const [customUrl, setCustomUrl] = useState('');
  const [activeFilter, setActiveFilter] = useState<'none' | 'sepia' | 'grayscale' | 'contrast' | 'warm'>('none');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery categories
  const categories = ['All', 'Portraits & Riverside', 'Summer Sunshine', 'Green Canopy', 'Afternoon Golden'];

  const filteredGalleryPhotos = ALL_GALLERY_PHOTOS.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                          photo.name.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                          photo.location.toLowerCase().includes(gallerySearch.toLowerCase());
    const matchesCat = galleryCategory === 'All' || photo.category.includes(galleryCategory) || galleryCategory.includes(photo.category);
    return matchesSearch && matchesCat;
  });

  // Handle local file upload → Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    e.target.value = ''; // reset so same file can be re-selected

    // Client-side size/type validation
    const validationErr = validateImageFile(file);
    if (validationErr) {
      setUploadError(validationErr);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const result = await uploadImageToSupabase(file, 'posts');
    setIsUploading(false);

    if (result.error) {
      setUploadError(result.error);
      return;
    }

    setSelectedPhotoUrl(result.url!);
  };

  const handleApply = () => {
    if (!selectedPhotoUrl || isUploading) return;
    onSavePhoto(selectedPhotoUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0b1120] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar (Spatial / Liquid Glass style) */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
              mode === 'replace' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
            }`}>
              {mode === 'replace' ? <RefreshCw className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {mode === 'replace' ? `Replace Photo #${photoIndex + 1}` : 'Add Photo to Memory'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10">
                  {post.author.username}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Memory: "{post.caption || 'Circle photo'}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'replace' && onDeleteCurrentPhoto && currentPhoto && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete Photo #${photoIndex + 1} from this memory post?`)) {
                    onDeleteCurrentPhoto(post.id, photoIndex);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Delete this photo immediately"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Photo</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Preview (When in Replace Mode) */}
        {mode === 'replace' && currentPhoto && (
          <div className="px-6 py-3 bg-slate-950/70 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={currentPhoto} 
                  alt="Current" 
                  className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-slate-900/90 text-[9px] font-mono text-slate-400 border border-white/10">
                  Current
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500" />

              <div className="relative">
                {selectedPhotoUrl ? (
                  <img 
                    src={selectedPhotoUrl} 
                    alt="Replacement Preview" 
                    className="w-14 h-14 rounded-xl object-cover border-2 border-sky-400 shadow-lg shadow-sky-500/20 animate-scaleUp"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl border border-dashed border-white/30 flex items-center justify-center text-slate-500 text-xs">
                    Choose
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-sky-950 text-[9px] font-mono text-sky-300 border border-sky-500/40">
                  New
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-300">
                {selectedPhotoUrl === currentPhoto ? 'Select a new photo below' : 'Ready to replace'}
              </span>
              <p className="text-[11px] text-slate-500">
                Replaces photo at index {photoIndex + 1} of {post.photos.length}
              </p>
            </div>
          </div>
        )}

        {/* Source Navigation Tabs */}
        <div className="px-6 pt-3 pb-1 border-b border-white/10 bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Circle Gallery ({ALL_GALLERY_PHOTOS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'upload'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'google'
                ? 'bg-[#0066da] text-white shadow-md shadow-blue-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Google Photos / Drive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'url'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Direct Web Link</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: CIRCLE GALLERY (41 REAL PHOTOS) */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Search & Categories */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    placeholder="Search circle photo name, location or title..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                  {gallerySearch && (
                    <button 
                      onClick={() => setGallerySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryCategory(cat)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition font-medium ${
                        galleryCategory === cat
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredGalleryPhotos.map((photo) => {
                  const isSelected = selectedPhotoUrl === photo.path;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedPhotoUrl(photo.path)}
                      className={`relative group rounded-2xl overflow-hidden aspect-square border text-left transition-all ${
                        isSelected 
                          ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[0.98] shadow-xl' 
                          : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                      }`}
                    >
                      <img 
                        src={photo.path} 
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <span className="text-[10px] font-bold text-white line-clamp-1 drop-shadow">
                          {photo.title}
                        </span>
                        <span className="text-[9px] text-amber-300 font-mono">
                          {photo.date}
                        </span>
                      </div>

                      {/* Selected check badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD LOCAL DEVICE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Upload error banner */}
              {uploadError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300">{uploadError}</p>
                </div>
              )}

              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition group ${
                  isUploading
                    ? 'border-sky-400/40 bg-sky-950/20 cursor-wait'
                    : 'border-sky-400/40 hover:border-sky-400 bg-sky-950/10 hover:bg-sky-950/20 cursor-pointer'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {isUploading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {isUploading ? 'Uploading to Supabase…' : 'Click to browse or drop an image from your device'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-3">
                  JPG, PNG, WEBP, or HEIC — stored in Supabase Storage.
                </p>
                {/* 3MB limit badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300 font-mono mb-3">
                  <span>⚠</span>
                  <span>Max 3 MB per image</span>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition"
                  >
                    Browse Device Files
                  </button>
                )}
              </div>

              {selectedPhotoUrl && !selectedPhotoUrl.startsWith('data:') && selectedPhotoUrl.includes('supabase') && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center gap-4">
                  <img 
                    src={selectedPhotoUrl} 
                    alt="Uploaded preview" 
                    className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md"
                  />
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Uploaded to Supabase Storage
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ready to attach as {mode === 'replace' ? 'replacement' : 'new photo'}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* TAB 3: GOOGLE PHOTOS & DRIVE */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0066da]/20 text-sky-400 flex items-center justify-center">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Google Photos & Drive Cloud Sync</h4>
                    <p className="text-[11px] text-slate-400">Select authentic synchronized circle memories</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  Connected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ALL_GALLERY_PHOTOS.slice(0, 8).map((photo, i) => {
                  const isSelected = selectedPhotoUrl === photo.path;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedPhotoUrl(photo.path)}
                      className={`relative rounded-xl overflow-hidden aspect-video border text-left transition ${
                        isSelected ? 'border-sky-400 ring-2 ring-sky-400' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={photo.path} alt={photo.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                        <span className="text-[9px] font-mono text-sky-300">
                          {i % 2 === 0 ? 'Drive Vault' : 'Photos Album'}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-sky-400 text-white flex items-center justify-center font-bold">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT WEB URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Image Web URL (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrl.trim()) {
                        setSelectedPhotoUrl(customUrl.trim());
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Set URL
                  </button>
                </div>
              </div>

              {selectedPhotoUrl && (
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
                  <img 
                    src={selectedPhotoUrl} 
                    alt="URL preview" 
                    className="w-16 h-16 rounded-xl object-cover border border-white/20"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-slate-300 truncate max-w-md">
                    {selectedPhotoUrl}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUploading ? (
              <span className="text-xs text-sky-400 flex items-center gap-1.5 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading to Supabase…
              </span>
            ) : selectedPhotoUrl ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Photo selected
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Please pick a photo from gallery, device or cloud
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedPhotoUrl || isUploading}
              onClick={handleApply}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 ${
                selectedPhotoUrl && !isUploading
                  ? mode === 'replace'
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/25 cursor-pointer'
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25 cursor-pointer'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading…</span>
                </>
              ) : mode === 'replace' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace This Photo</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo to Memory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


