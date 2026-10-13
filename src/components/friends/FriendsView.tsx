import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  UserCheck, 
  Mail, 
  Key,
  Plus
} from 'lucide-react';
import { User, Post } from '../../types';

interface FriendsViewProps {
  currentUser: User;
  friends: User[];
  posts: Post[];
  onOpenInvite: () => void;
  onOpenPhotoViewer: (photos: string[], initialIndex: number, post?: any) => void;
  onCreateMember?: (newMember: User) => void;
  onUpdateMember?: (memberId: string, updatedFields: Partial<User>) => void;
  onDeleteMember?: (memberId: string) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  currentUser,
  friends,
  posts,
  onOpenInvite,
  onOpenPhotoViewer,
  onCreateMember,
  onUpdateMember,
  onDeleteMember
}) => {
  const [selectedFriend, setSelectedFriend] = useState<User | null>(friends.length > 0 ? friends[0] : null);

  // CRUD Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  // Add Member Form States
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [newMemberBio, setNewMemberBio] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'member'>('member');
  const [newMemberStatus, setNewMemberStatus] = useState<'approved' | 'pending'>('approved');
  const [newMemberAvatarColor, setNewMemberAvatarColor] = useState('#0ea5e9');

  // Edit Member Form States
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'member'>('member');
  const [editStatus, setEditStatus] = useState<'approved' | 'pending' | 'suspended'>('approved');

  const avatarColorOptions = [
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald
    '#6366f1', // Indigo
    '#f43f5e', // Rose
    '#f59e0b', // Amber
    '#14b8a6', // Teal
    '#8b5cf6'  // Purple
  ];

  const handleOpenEdit = (friend: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMember(friend);
    setEditName(friend.name);
    setEditBio(friend.bio);
    setEditRole(friend.role);
    setEditStatus(friend.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !onUpdateMember) return;

    onUpdateMember(editingMember.id, {
      name: editName.trim(),
      bio: editBio.trim(),
      role: editRole,
      status: editStatus
    });

    // Update locally selected friend if edited
    if (selectedFriend?.id === editingMember.id) {
      setSelectedFriend({
        ...selectedFriend,
        name: editName.trim(),
        bio: editBio.trim(),
        role: editRole,
        status: editStatus
      });
    }

    setEditingMember(null);
  };

  const handleSaveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberUsername.trim() || !onCreateMember) return;

    const initialLetter = newMemberName.trim().charAt(0).toUpperCase();
    const encodedSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="${encodeURIComponent(newMemberAvatarColor)}"/><text x="50" y="58" font-family="sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initialLetter}</text></svg>`;

    const newMember: User = {
      id: `usr_${Date.now()}`,
      name: newMemberName.trim(),
      username: newMemberUsername.trim().replace(/^@/, ''),
      avatar: encodedSvg,
      role: newMemberRole,
      status: newMemberStatus,
      bio: newMemberBio.trim() || 'A trusted friend in our private circle.',
      mutualCount: 1,
      joinedDate: 'Just now',
      memoriesCount: 0
    };

    onCreateMember(newMember);
    setSelectedFriend(newMember);
    setIsAddModalOpen(false);

    // Reset fields
    setNewMemberName('');
    setNewMemberUsername('');
    setNewMemberBio('');
  };

  const handleDelete = (friendId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDeleteMember) return;
    if (confirm(`Are you sure you want to remove ${name} from your Inner Circle Directory?`)) {
      onDeleteMember(friendId);
      if (selectedFriend?.id === friendId) {
        setSelectedFriend(friends.filter(f => f.id !== friendId)[0] || null);
      }
    }
  };

  const friendPosts = selectedFriend 
    ? posts.filter(p => p.author.id === selectedFriend.id)
    : [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Style 4: Claymorphism • Inner Circle Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            The Inner Circle Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage membership, permissions, and roles ({1 + friends.length} total members in private circle).
          </p>
        </div>

        {/* Directory CRUD Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onCreateMember && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="clay-button px-4 py-2.5 bg-gradient-to-r from-sky-400 to-teal-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Circle Member</span>
            </button>
          )}

          <button
            onClick={onOpenInvite}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition"
          >
            <Key className="w-3.5 h-3.5 text-yellow-400" />
            <span>Generate Token</span>
          </button>
        </div>
      </div>

      {/* Circle Founder Card */}
      <div className="clay-card p-5 border border-sky-400/30 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-sky-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{currentUser.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Circle Founder / Admin
                </span>
              </div>
              <div className="text-xs text-sky-400 font-mono">@{currentUser.username}</div>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            Root Authority
          </span>
        </div>
      </div>

      {/* Friends Cards Carousel / Grid (Claymorphic inflated 3D cards) or Clean Empty State */}
      {friends.length === 0 ? (
        <div className="clay-card p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div className="text-lg font-bold text-white">No Other Members in Directory</div>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            As founder, you can add trusted friends directly using the button above or share single-use invitation tokens.
          </p>
          {onCreateMember && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="clay-button px-6 py-2.5 bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member to Circle</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => {
            const isSelected = selectedFriend?.id === friend.id;

            return (
              <div
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className={`clay-card p-5 cursor-pointer transition-all duration-300 relative group ${
                  isSelected 
                    ? 'ring-2 ring-sky-400 scale-[1.02] shadow-sky-950/50' 
                    : 'hover:scale-[1.01]'
                }`}
              >
                {/* Member Card Header */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img 
                      src={friend.avatar} 
                      alt={friend.name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                      friend.status === 'approved' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status Badge */}
                    <span className={`clay-badge px-2.5 py-0.5 text-[9px] uppercase tracking-wider ${
                      friend.status === 'approved' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                        : friend.status === 'suspended'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      {friend.status}
                    </span>

                    {/* Quick Edit (CRUD Update) */}
                    {onUpdateMember && (
                      <button
                        onClick={(e) => handleOpenEdit(friend, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
                        title="Edit Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Quick Delete (CRUD Delete) */}
                    {onDeleteMember && (
                      <button
                        onClick={(e) => handleDelete(friend.id, friend.name, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                        title="Remove Member from Circle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>{friend.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      friend.role === 'admin' ? 'bg-sky-500/20 text-sky-300' : 'bg-white/10 text-slate-400'
                    }`}>
                      {friend.role}
                    </span>
                  </h3>
                  <div className="text-xs text-sky-400 font-mono">
                    @{friend.username}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {friend.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{friend.memoriesCount} memories</span>
                  <span className="text-slate-300">Joined {friend.joinedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Friend Profile Deep Dive */}
      {selectedFriend && (
        <div className="mt-8 p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              <img 
                src={selectedFriend.avatar} 
                alt={selectedFriend.name} 
                className="w-16 h-16 rounded-3xl object-cover border-2 border-sky-400/40 shadow-xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{selectedFriend.name}</h2>
                  <span className="text-xs font-mono text-sky-400">@{selectedFriend.username}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedFriend.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onUpdateMember && (
                <button
                  onClick={(e) => handleOpenEdit(selectedFriend, e)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Edit Profile</span>
                </button>
              )}
              {onDeleteMember && (
                <button
                  onClick={(e) => handleDelete(selectedFriend.id, selectedFriend.name, e)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Expel</span>
                </button>
              )}
            </div>
          </div>

          {/* Member's Photos in Circle */}
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Memories Shared by {selectedFriend.name} ({friendPosts.length})
            </div>

            {friendPosts.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/5 bg-black/20 text-center text-xs text-slate-500">
                No memories shared by {selectedFriend.name} yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {friendPosts.flatMap(p => p.photos).map((photo, i) => (
                  <div 
                    key={i} 
                    onClick={() => onOpenPhotoViewer([photo], 0)}
                    className="relative group rounded-2xl overflow-hidden aspect-square bg-slate-800 cursor-zoom-in"
                  >
                    <img 
                      src={photo} 
                      alt="Friend memory" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE NEW MEMBER (CRUD CREATE) ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-white/15 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-sky-400" />
                Add Member to Inner Circle
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMember} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 rounded-xl glass-input text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Circle Username</label>
                <input
                  type="text"
                  required
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                  placeholder="mayalin"
                  className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Circle Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white bg-slate-900"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Status</label>
                  <select
                    value={newMemberStatus}
                    onChange={(e) => setNewMemberStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white bg-slate-900"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Avatar Badge Color</label>
                <div className="flex items-center gap-2">
                  {avatarColorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewMemberAvatarColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-xl transition-transform ${
                        newMemberAvatarColor === color ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Short Bio</label>
                <textarea
                  value={newMemberBio}
                  onChange={(e) => setNewMemberBio(e.target.value)}
                  placeholder="Tell the circle a bit about them..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl glass-input text-white resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="liquid-glass-pill px-5 py-2 rounded-xl font-bold text-white shadow-lg"
                >
                  Confirm & Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT MEMBER (CRUD UPDATE) ================= */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-white/15 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-400" />
                Edit Member: {editingMember.name}
              </h3>
              <button 
                onClick={() => setEditingMember(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white bg-slate-900"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Membership Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white bg-slate-900"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl glass-input text-white resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="liquid-glass-pill px-5 py-2 rounded-xl font-bold text-white shadow-lg"
                >
                  Save Member Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
