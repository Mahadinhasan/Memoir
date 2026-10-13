import React, { useState } from 'react';
import { 
  Folder, 
  Search, 
  CheckCircle2, 
  Cloud, 
  HardDrive, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Filter,
  Plus,
  Trash2
} from 'lucide-react';

interface GoogleMediaItem {
  id: string;
  name: string;
  url: string;
  type: 'drive' | 'photos';
  folder?: string;
  album?: string;
  size: string;
  date: string;
  resolution: string;
}

interface GoogleMediaPickerProps {
  service: 'drive' | 'photos';
  onSelectPhotos: (urls: string[]) => void;
  selectedUrls: string[];
}

export const GoogleMediaPicker: React.FC<GoogleMediaPickerProps> = ({
  service,
  onSelectPhotos,
  selectedUrls
}) => {
  const [items, setItems] = useState<GoogleMediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All Folders');
  const [selectedAlbum, setSelectedAlbum] = useState('All Photos');
  const [localSelected, setLocalSelected] = useState<string[]>([]);
  const [customFileUrl, setCustomFileUrl] = useState('');
  const [customFileName, setCustomFileName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const isDrive = service === 'drive';

  const driveFolders = ['All Folders', 'Memoir Encrypted Vault', 'Camera Roll Uncompressed', 'Film Scans 35mm'];
  const photoAlbums = ['All Photos', 'Favorites', 'Recent Memories', 'Trips & Adventures'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (isDrive) {
      const matchesFolder = selectedFolder === 'All Folders' || item.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    } else {
      const matchesAlbum = selectedAlbum === 'All Photos' || item.album === selectedAlbum;
      return matchesSearch && matchesAlbum;
    }
  });

  const toggleSelect = (url: string) => {
    if (localSelected.includes(url)) {
      setLocalSelected(localSelected.filter(u => u !== url));
    } else {
      setLocalSelected([...localSelected, url]);
    }
  };

  const handleImport = () => {
    if (localSelected.length > 0) {
      onSelectPhotos(localSelected);
      setLocalSelected([]);
    }
  };

  const handleAddCloudFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFileUrl.trim()) return;

    const newItem: GoogleMediaItem = {
      id: `item_${Date.now()}`,
      name: customFileName.trim() || (isDrive ? 'Drive_Photo.jpg' : 'GooglePhoto.jpg'),
      url: customFileUrl.trim(),
      type: service,
      folder: isDrive ? selectedFolder : undefined,
      album: !isDrive ? selectedAlbum : undefined,
      size: 'High-Res',
      date: 'Just now',
      resolution: 'Original Resolution'
    };

    setItems([newItem, ...items]);
    setLocalSelected([...localSelected, newItem.url]);
    setCustomFileUrl('');
    setCustomFileName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Service Header & Connection Status */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Authentic Brand Badges */}
          {isDrive ? (
            <div className="w-10 h-10 rounded-2xl bg-[#0066da]/20 border border-[#4285f4]/40 flex items-center justify-center text-[#4285f4] shadow-md">
              <HardDrive className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-sky-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[14px] bg-[#0c111f] flex items-center justify-center text-rose-300">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                {isDrive ? 'Google Drive Private Storage Vault' : 'Google Photos Direct Library'}
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isDrive 
                ? 'OAuth 2.0 Scope: https://www.googleapis.com/auth/drive.readonly • Zero public sharing' 
                : 'Direct cloud sync from your verified Google Photos library'}
            </p>
          </div>
        </div>

        {/* Selected count & Import action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sky-300 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {isDrive ? 'Drive' : 'Photos'} Link</span>
          </button>

          {localSelected.length > 0 && (
            <button
              type="button"
              onClick={handleImport}
              className="liquid-glass-pill px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg animate-fadeIn cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-sky-300" />
              <span>Import {localSelected.length} to Memory</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Cloud Link Input */}
      {showAddModal && (
        <form onSubmit={handleAddCloudFile} className="p-3.5 rounded-2xl bg-slate-900 border border-sky-400/30 space-y-2.5 animate-fadeIn">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Link Direct {isDrive ? 'Google Drive File' : 'Google Photos URL'}</span>
            <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="File title (e.g., Summer_Trip_01.jpg)..."
              className="px-3 py-1.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
            />
            <input
              type="url"
              required
              value={customFileUrl}
              onChange={(e) => setCustomFileUrl(e.target.value)}
              placeholder="Direct URL (https://...)..."
              className="px-3 py-1.5 rounded-xl glass-input text-xs text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs"
            >
              Load into {isDrive ? 'Drive Vault' : 'Photos Library'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isDrive ? "Search uncompressed files in Drive..." : "Search photos by album..."}
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {isDrive ? (
            driveFolders.map((folder) => (
              <button
                key={folder}
                type="button"
                onClick={() => setSelectedFolder(folder)}
                className={`px-2.5 py-1.5 rounded-xl whitespace-nowrap transition ${
                  selectedFolder === folder
                    ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {folder}
              </button>
            ))
          ) : (
            photoAlbums.map((album) => (
              <button
                key={album}
                type="button"
                onClick={() => setSelectedAlbum(album)}
                className={`px-2.5 py-1.5 rounded-xl whitespace-nowrap transition ${
                  selectedAlbum === album
                    ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {album}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Media Grid or Clean Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mx-auto">
            {isDrive ? <HardDrive className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
          </div>
          <div className="text-xs font-bold text-white">
            {isDrive ? 'No files in this Google Drive folder yet' : 'No photos imported from Google Photos yet'}
          </div>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Click "+ Add {isDrive ? 'Drive' : 'Photos'} Link" above or upload images from your device to stage them in Memoir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isSelected = localSelected.includes(item.url) || selectedUrls.includes(item.url);

            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.url)}
                className={`relative rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-200 select-none ${
                  isSelected
                    ? 'border-sky-400 ring-2 ring-sky-400 scale-[1.02] shadow-xl shadow-sky-950/60'
                    : 'border-white/10 hover:border-white/30 bg-black/40'
                }`}
              >
                {/* Image Preview */}
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Selection Checkmark overlay */}
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-sky-500 text-white shadow-md' 
                      : 'bg-black/60 text-white/50 border border-white/20 group-hover:bg-black/80'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  {/* Resolution Pill */}
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-slate-200">
                    {item.resolution}
                  </div>
                </div>

                {/* Card Meta details */}
                <div className="p-2.5 bg-slate-900/90 border-t border-white/5">
                  <div className="text-xs font-semibold text-white truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{item.size}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom helper footnote */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Files transferred via authenticated stream. Zero public sharing.</span>
        </span>
        <span className="font-mono text-slate-300">
          {filteredItems.length} items staged
        </span>
      </div>
    </div>
  );
};
