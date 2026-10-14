import React, { useState, useEffect } from 'react';
import { 
  MOCK_POSTS, 
  MOCK_FRIENDS, 
  MOCK_MEMORIES, 
  MOCK_NOTIFICATIONS, 
  CURRENT_USER,
  UI_STYLES 
} from './data/mockData';
import { Post, User, ViewTab, UIStyleId, MemoryItem, NotificationItem } from './types';
import { onAuthStateChange, signOut } from './lib/authService';
import { 
  fetchPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  toggleLike, 
  toggleSaved, 
  addComment, 
  fetchProfiles,
  subscribeToPostChanges,
  subscribeToCommentChanges,
  subscribeToLikeChanges
} from './lib/dbService';
import { AppHeader } from './components/navigation/AppHeader';
import { SidebarNav } from './components/navigation/SidebarNav';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { PostComposer } from './components/feed/PostComposer';
import { FeedPost } from './components/feed/FeedPost';
import { CommentDrawer } from './components/feed/CommentDrawer';
import { PhotoViewerModal } from './components/modals/PhotoViewerModal';
import { UploadModal } from './components/modals/UploadModal';
import { EditPostModal } from './components/modals/EditPostModal';
import { ImageCrudModal } from './components/modals/ImageCrudModal';
import { StyleGuideModal } from './components/common/StyleGuideModal';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { MemoriesTimelineView } from './components/memories/MemoriesTimelineView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { FriendsView } from './components/friends/FriendsView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { SettingsView } from './components/settings/SettingsView';
import { 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  Filter, 
  Check, 
  Eye,
  UserCheck
} from 'lucide-react';

// Helper: merge mock data with localStorage-persisted user data.
// localStorage versions take priority (they contain user's uploaded photos).
// New items from mock data that don't exist in localStorage are also included.
function mergeWithMock<T extends { id: string }>(storageKey: string, mockData: T[]): T[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const stored: T[] = JSON.parse(raw);
      // Build a map of stored items by ID
      const storedMap = new Map(stored.map(item => [item.id, item]));
      // Add any mock items not already in storage (new mock data added by developers)
      for (const mockItem of mockData) {
        if (!storedMap.has(mockItem.id)) {
          storedMap.set(mockItem.id, mockItem);
        }
      }
      // Return stored order first, then any new mock items
      const result: T[] = [...stored];
      for (const mockItem of mockData) {
        if (!stored.some(s => s.id === mockItem.id)) {
          result.push(mockItem);
        }
      }
      return result;
    }
  } catch {
    // ignore parse errors
  }
  return mockData;
}

export function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('feed');
  const [posts, setPosts] = useState<Post[]>(() => mergeWithMock<Post>('memoir_posts', MOCK_POSTS));
  const [friends, setFriends] = useState<User[]>(MOCK_FRIENDS);
  const [memories, setMemories] = useState<MemoryItem[]>(() => mergeWithMock<MemoryItem>('memoir_memories', MOCK_MEMORIES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Persist posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('memoir_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn('localStorage quota exceeded for posts. Uploaded images may not persist after reload.', e);
    }
  }, [posts]);

  // Persist memories to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('memoir_memories', JSON.stringify(memories));
    } catch (e) {
      console.warn('localStorage quota exceeded for memories.', e);
    }
  }, [memories]);
  
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(true);

  // Restore Supabase session on mount
  useEffect(() => {
    const { unsubscribe } = onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // No active session – show login screen
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Live Supabase Database Data Synchronization
  useEffect(() => {
    let isMounted = true;

    async function syncFromSupabase() {
      try {
        const dbPosts = await fetchPosts(currentUser.id);
        if (isMounted && dbPosts.length > 0) {
          setPosts(dbPosts);
          // Sync memories timeline from database posts
          const dbMemories: MemoryItem[] = dbPosts
            .filter(p => p.photos && p.photos.length > 0)
            .map(p => ({
              id: `mem_${p.id}`,
              yearAgo: 'Today',
              date: p.createdAt || 'Present Day',
              title: p.celebrationTitle || (p.caption.length > 30 ? p.caption.slice(0, 30) + '...' : p.caption) || 'Circle Memory',
              story: p.caption,
              photos: p.photos,
              author: p.author,
              mood: 'Joyful',
              style: p.variant === 'maximalist' ? 'maximalist' : p.variant === 'spatial' ? 'spatial' : 'polaroid',
              tags: ['Live Memory', 'Vault']
            }));
          if (dbMemories.length > 0) {
            setMemories(dbMemories);
          }
        }

        const dbProfiles = await fetchProfiles();
        if (isMounted && dbProfiles.length > 0) {
          setFriends(dbProfiles.filter(p => p.id !== currentUser.id));
        }
      } catch (err) {
        console.warn('[DB] Supabase live sync initial notice:', err);
      }
    }

    syncFromSupabase();

    // Subscribe to live Realtime database updates
    const unsubPosts = subscribeToPostChanges(async () => {
      const fresh = await fetchPosts(currentUser.id);
      if (isMounted && fresh.length > 0) setPosts(fresh);
    });

    const unsubComments = subscribeToCommentChanges(async () => {
      const fresh = await fetchPosts(currentUser.id);
      if (isMounted && fresh.length > 0) setPosts(fresh);
    });

    const unsubLikes = subscribeToLikeChanges(async () => {
      const fresh = await fetchPosts(currentUser.id);
      if (isMounted && fresh.length > 0) setPosts(fresh);
    });

    return () => {
      isMounted = false;
      unsubPosts();
      unsubComments();
      unsubLikes();
    };
  }, [currentUser.id]);


  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadInitialSource, setUploadInitialSource] = useState<'device' | 'drive' | 'photos'>('device');
  const [isStyleGuideOpen, setIsStyleGuideOpen] = useState(false);
  const [activeStyleFilter, setActiveStyleFilter] = useState<UIStyleId | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [visiblePostLimit, setVisiblePostLimit] = useState<number>(100);

  // Photo CRUD State
  const [imageCrudState, setImageCrudState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'replace';
    post: Post | null;
    photoIndex: number;
  }>({
    isOpen: false,
    mode: 'replace',
    post: null,
    photoIndex: 0
  });

  // Photo Viewer State
  const [photoViewerState, setPhotoViewerState] = useState<{
    isOpen: boolean;
    photos: string[];
    initialIndex: number;
    post: Post | null;
  }>({
    isOpen: false,
    photos: [],
    initialIndex: 0,
    post: null
  });

  // Comment Drawer State
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);

  // Upload Modal Opener with source selection
  const handleOpenUpload = (source: 'device' | 'drive' | 'photos' = 'device') => {
    setUploadInitialSource(source);
    setIsUploadOpen(true);
  };

  // Auth Handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsAuthOpen(false);

    // If new user registered, add them to friends list if not existing
    if (!friends.some(f => f.id === user.id) && user.id !== CURRENT_USER.id) {
      setFriends(prev => [user, ...prev]);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setCurrentUser(CURRENT_USER);
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Post & Social Handlers
  const handleLikeToggle = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const currentlyLiked = post?.hasLiked ?? false;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));

    // Persist to Supabase Database
    toggleLike(postId, currentUser.id, currentlyLiked).catch(err =>
      console.warn('[DB] like toggle failed:', err)
    );
  };

  const handleSaveToggle = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const currentlySaved = post?.saved ?? false;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, saved: !p.saved };
      }
      return p;
    }));

    // Persist to Supabase Database
    toggleSaved(postId, currentUser.id, currentlySaved).catch(err =>
      console.warn('[DB] save toggle failed:', err)
    );
  };

  // POST CRUD OPERATIONS
  const handleAddPost = async (newPost: Post) => {
    // Immediate UI update
    setPosts(prev => [newPost, ...prev]);
    if (newPost.photos && newPost.photos.length > 0) {
      const newMemory: MemoryItem = {
        id: `mem_${newPost.id}`,
        yearAgo: 'Today',
        date: 'Present Day',
        title: newPost.celebrationTitle || (newPost.caption.length > 30 ? newPost.caption.slice(0, 30) + '...' : newPost.caption) || 'Circle Memory',
        story: newPost.caption,
        photos: newPost.photos,
        author: newPost.author,
        mood: 'Joyful',
        style: newPost.variant === 'maximalist' ? 'maximalist' : newPost.variant === 'spatial' ? 'spatial' : 'polaroid',
        tags: ['New Memory', 'Private Circle']
      };
      setMemories(prev => [newMemory, ...prev]);
    }

    // Persist directly to Supabase Database
    try {
      const res = await createPost(newPost, currentUser.id);
      if (res.error) {
        console.error('[DB] createPost error in Supabase:', res.error);
      }
    } catch (err) {
      console.error('[DB] createPost unexpected error:', err);
    }
  };

  const handleUpdatePost = (postId: string, updatedFields: Partial<Post>) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updatedFields } : p));
    setMemories(prev => prev.map(m => m.id === `mem_${postId}` ? {
      ...m,
      title: updatedFields.celebrationTitle || (updatedFields.caption ? (updatedFields.caption.length > 30 ? updatedFields.caption.slice(0, 30) + '...' : updatedFields.caption) : m.title),
      story: updatedFields.caption ?? m.story,
      photos: updatedFields.photos ?? m.photos,
      style: updatedFields.variant === 'maximalist' ? 'maximalist' : updatedFields.variant === 'spatial' ? 'spatial' : m.style
    } : m));
    if (editingPost?.id === postId) {
      setEditingPost(null);
    }

    // Persist to Supabase Database
    updatePost(postId, updatedFields).catch(err =>
      console.warn('[DB] updatePost failed in Supabase:', err)
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setMemories(prev => prev.filter(m => m.id !== `mem_${postId}`));
    if (editingPost?.id === postId) {
      setEditingPost(null);
    }

    // Persist to Supabase Database
    deletePost(postId).catch(err =>
      console.warn('[DB] deletePost failed in Supabase:', err)
    );
  };

  // FEED PHOTO CRUD OPERATIONS
  const handleOpenAddPhotoToPost = (post: Post) => {
    setImageCrudState({
      isOpen: true,
      mode: 'add',
      post,
      photoIndex: post.photos ? post.photos.length : 0
    });
  };

  const handleOpenReplacePhotoInPost = (post: Post, photoIndex: number) => {
    setImageCrudState({
      isOpen: true,
      mode: 'replace',
      post,
      photoIndex
    });
  };

  const handleAddPhotoToPost = (postId: string, newPhotoUrl: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextPhotos = [...(p.photos || []), newPhotoUrl];
        return { ...p, photos: nextPhotos };
      }
      return p;
    }));
    setMemories(prev => prev.map(m => {
      if (m.id === `mem_${postId}`) {
        return { ...m, photos: [...(m.photos || []), newPhotoUrl] };
      }
      return m;
    }));
    setPhotoViewerState(prev => {
      if (prev.isOpen && prev.post?.id === postId) {
        const nextPhotos = [...prev.photos, newPhotoUrl];
        return { ...prev, photos: nextPhotos, post: { ...prev.post, photos: nextPhotos } };
      }
      return prev;
    });
  };

  const handleReplacePhotoInPost = (postId: string, photoIndex: number, newPhotoUrl: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextPhotos = [...p.photos];
        if (photoIndex >= 0 && photoIndex < nextPhotos.length) {
          nextPhotos[photoIndex] = newPhotoUrl;
        } else {
          nextPhotos.push(newPhotoUrl);
        }
        return { ...p, photos: nextPhotos };
      }
      return p;
    }));
    setMemories(prev => prev.map(m => {
      if (m.id === `mem_${postId}`) {
        const nextPhotos = [...m.photos];
        if (photoIndex >= 0 && photoIndex < nextPhotos.length) {
          nextPhotos[photoIndex] = newPhotoUrl;
        }
        return { ...m, photos: nextPhotos };
      }
      return m;
    }));
    setPhotoViewerState(prev => {
      if (prev.isOpen && prev.post?.id === postId) {
        const nextPhotos = [...prev.photos];
        if (photoIndex >= 0 && photoIndex < nextPhotos.length) {
          nextPhotos[photoIndex] = newPhotoUrl;
        }
        return { ...prev, photos: nextPhotos, post: { ...prev.post, photos: nextPhotos } };
      }
      return prev;
    });
  };

  const handleDeletePhotoFromPost = (postId: string, photoIndex: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextPhotos = p.photos.filter((_, idx) => idx !== photoIndex);
        return { ...p, photos: nextPhotos };
      }
      return p;
    }));
    setMemories(prev => prev.map(m => {
      if (m.id === `mem_${postId}`) {
        const nextPhotos = m.photos.filter((_, idx) => idx !== photoIndex);
        return { ...m, photos: nextPhotos };
      }
      return m;
    }));
    setPhotoViewerState(prev => {
      if (prev.isOpen && prev.post?.id === postId) {
        const nextPhotos = prev.photos.filter((_, idx) => idx !== photoIndex);
        if (nextPhotos.length === 0) {
          return { ...prev, isOpen: false, photos: [], post: null };
        }
        const nextIdx = Math.min(prev.initialIndex, nextPhotos.length - 1);
        return {
          ...prev,
          photos: nextPhotos,
          initialIndex: Math.max(0, nextIdx),
          post: { ...prev.post, photos: nextPhotos }
        };
      }
      return prev;
    });
  };

  const handleSavePhotoFromCrud = (newPhotoUrl: string) => {
    if (!imageCrudState.post) return;
    const targetPostId = imageCrudState.post.id;
    if (imageCrudState.mode === 'replace') {
      handleReplacePhotoInPost(targetPostId, imageCrudState.photoIndex, newPhotoUrl);
    } else {
      handleAddPhotoToPost(targetPostId, newPhotoUrl);
    }
  };

  // INNER CIRCLE DIRECTORY (MEMBERS) CRUD OPERATIONS
  const handleCreateMember = (newMember: User) => {
    setFriends(prev => [newMember, ...prev]);
  };

  const handleUpdateMember = (memberId: string, updatedFields: Partial<User>) => {
    setFriends(prev => prev.map(f => f.id === memberId ? { ...f, ...updatedFields } : f));
    if (currentUser.id === memberId) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const handleDeleteMember = (memberId: string) => {
    setFriends(prev => prev.filter(f => f.id !== memberId));
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser,
      text,
      createdAt: 'Just now',
      likes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedComments = [...p.comments, newComment];
        const updatedPost = { ...p, comments: updatedComments };
        if (activeCommentPost?.id === postId) {
          setActiveCommentPost(updatedPost);
        }
        return updatedPost;
      }
      return p;
    }));

    // Persist to Supabase Database
    addComment(postId, currentUser.id, text).catch(err =>
      console.warn('[DB] addComment failed in Supabase:', err)
    );
  };

  const handleOpenPhotoViewer = (photos: string[], initialIndex: number, post?: Post) => {
    setPhotoViewerState({
      isOpen: true,
      photos,
      initialIndex,
      post: post || null
    });
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Filtered posts based on active style filter
  const filteredPosts = activeStyleFilter
    ? posts.filter(p => {
        if (activeStyleFilter === 'skeuomorphism') return p.variant === 'skeuomorphic';
        if (activeStyleFilter === 'maximalism') return p.variant === 'maximalist';
        if (activeStyleFilter === 'spatial-ui') return p.variant === 'spatial';
        if (activeStyleFilter === 'minimalism') return p.variant === 'minimal';
        return true;
      })
    : posts;

  // 100 images/memories pagination
  const displayedPosts = filteredPosts.slice(0, visiblePostLimit);
  const hasMorePosts = filteredPosts.length > visiblePostLimit;
  const remainingCount = filteredPosts.length - visiblePostLimit;

  // Calculate total images count across posts
  const totalImagesDisplayed = displayedPosts.reduce((acc, p) => acc + (p.photos?.length || 1), 0);
  const totalImagesAvailable = filteredPosts.reduce((acc, p) => acc + (p.photos?.length || 1), 0);

  // Show a minimal loader while Supabase restores the session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080d19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-sky-500/30 border-t-sky-400 animate-spin" />
          <p className="text-xs text-slate-500 font-mono animate-pulse">Restoring session…</p>
        </div>
      </div>
    );
  }

  // If user signed out, display full-screen Auth Screen
  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={true}
        isFullPage={true}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b101e] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* 1. Glassmorphic App Header */}
      <AppHeader
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenUpload={() => handleOpenUpload('device')}
        onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Body Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex-1 w-full flex min-w-0">
        {/* 2. Left Desktop Navigation Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeFilter={activeStyleFilter}
          onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
        />

        {/* 3. Center Main Content Area */}
        <main className="flex-1 min-w-0 py-4 sm:py-6 pb-28 md:pb-8 md:px-6 w-full max-w-full">
          {/* Active Style Filter Alert Bar if user is filtering */}
          {activeStyleFilter && (
            <div className="mb-4 p-3 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-between text-xs text-sky-200 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-sky-400" />
                <span>Showing posts highlighting: <strong className="text-white capitalize">{activeStyleFilter}</strong></span>
              </div>
              <button
                onClick={() => setActiveStyleFilter(null)}
                className="text-xs text-sky-300 hover:text-white underline font-semibold"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* TAB 1: SOCIAL FEED (Minimalism Foundation) */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Centered Social Feed Column (Minimalism) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Post Composer */}
                <PostComposer
                  currentUser={currentUser}
                  onAddPost={handleAddPost}
                  onOpenUploadModal={(source) => handleOpenUpload(source || 'device')}
                />

                {/* Feed Counter & Batch Indicator */}
                {filteredPosts.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-400 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Showing <strong className="text-white font-mono">{displayedPosts.length}</strong> of <strong className="text-white font-mono">{filteredPosts.length}</strong> memories</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-sky-300 font-mono font-medium">({totalImagesDisplayed} images visible)</span>
                    </div>
                    {filteredPosts.length > 100 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-200">
                        Batch: 100 per load
                      </span>
                    )}
                  </div>
                )}

                {/* Continuous Social Feed */}
                <div className="space-y-6">
                  {displayedPosts.length === 0 ? (
                    <div className="minimal-feed-card p-8 sm:p-10 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mx-auto">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-bold text-white">No Circle Memories Yet</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Start by sharing a memory above, or upload photos directly from your device, Google Drive, or Google Photos.
                      </p>
                      <div className="pt-2 flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleOpenUpload('device')}
                          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20"
                        >
                          Upload from Device
                        </button>
                        <button
                          onClick={() => handleOpenUpload('drive')}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs border border-white/10"
                        >
                          Google Drive
                        </button>
                        <button
                          onClick={() => handleOpenUpload('photos')}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs border border-white/10"
                        >
                          Google Photos
                        </button>
                      </div>
                    </div>
                  ) : (
                    displayedPosts.map((post) => (
                      <FeedPost
                        key={post.id}
                        post={post}
                        currentUser={currentUser}
                        onLikeToggle={handleLikeToggle}
                        onSaveToggle={handleSaveToggle}
                        onOpenComments={(p) => setActiveCommentPost(p)}
                        onOpenPhotoViewer={(photos, idx, p) => handleOpenPhotoViewer(photos, idx, p)}
                        onEditPost={(p) => setEditingPost(p)}
                        onDeletePost={handleDeletePost}
                        onAddPhoto={handleOpenAddPhotoToPost}
                        onReplacePhoto={handleOpenReplacePhotoInPost}
                        onDeletePhoto={handleDeletePhotoFromPost}
                      />
                    ))
                  )}
                </div>

                {/* Load More Button if 100+ items */}
                {hasMorePosts && (
                  <div className="pt-6 pb-4 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-transparent to-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-sm animate-fadeIn">
                    <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                      <span>Showing <strong className="text-white font-mono">{displayedPosts.length}</strong> of <strong className="text-white font-mono">{filteredPosts.length}</strong> circle memories</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sky-400 font-mono font-bold">({totalImagesDisplayed} of {totalImagesAvailable} photos)</span>
                    </div>
                    <button
                      id="btn-load-more"
                      onClick={() => setVisiblePostLimit(prev => prev + 100)}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 border border-white/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
                      <span>Load More (Show Next 100)</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-xs font-mono font-bold text-yellow-200">
                        +{Math.min(100, remainingCount)}
                      </span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center max-w-sm">
                      Click to reveal the next 100 images and memories without infinite scroll noise.
                    </p>
                  </div>
                )}

                {/* End of feed indicator when all are caught up */}
                {!hasMorePosts && displayedPosts.length > 0 && (
                  <div className="p-8 text-center text-xs text-slate-500 border-t border-white/5 space-y-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-2 animate-ping"></div>
                    <p className="font-medium text-slate-400">All {filteredPosts.length} circle memories caught up ({totalImagesAvailable} images)</p>
                    <p className="text-[11px] text-slate-600">Zero algorithmic noise. Only approved circle friends.</p>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Spotlight & 10 UI Styles Inspector Widget */}
              <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20 self-start">
                {/* 10 UI Styles Master Card */}
                <div className="minimal-feed-card p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">All 10 UI Styles</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Cohesive 10/10
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Every section and interaction is intentionally designed using one of the 10 UI design paradigms.
                  </p>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {UI_STYLES.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => {
                          setActiveStyleFilter(activeStyleFilter === style.id ? null : style.id);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                          activeStyleFilter === style.id
                            ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="font-medium block">{style.name}</span>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {style.role}
                          </span>
                        </div>
                        {activeStyleFilter === style.id ? (
                          <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsStyleGuideOpen(true)}
                    className="w-full mt-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sky-400 text-xs font-semibold border border-white/10 transition"
                  >
                    Open Complete Architecture Modal
                  </button>
                </div>

                {/* Circle Spotlight: On This Day Quick Card */}
                {memories.length > 0 ? (
                  <div className="skeuo-polaroid skeuo-paper-texture p-4 text-slate-800">
                    <div className="skeuo-washi-tape"></div>
                    <div className="text-[11px] font-mono text-amber-900/60 uppercase text-center mb-2">
                      On This Day • {memories[0].yearAgo}
                    </div>
                    <img 
                      src={memories[0].photos[0]} 
                      alt="Throwback" 
                      className="w-full h-36 object-cover rounded-sm mb-2"
                    />
                    <div className="text-center font-serif italic text-xs text-amber-950 font-bold">
                      "{memories[0].title}"
                    </div>
                    <button
                      onClick={() => setActiveTab('memories')}
                      className="w-full mt-2 text-[10px] text-amber-900 font-sans font-bold hover:underline text-center"
                    >
                      Open Memories Scrapbook →
                    </button>
                  </div>
                ) : (
                  <div className="skeuo-polaroid skeuo-paper-texture p-5 text-slate-800 text-center">
                    <div className="skeuo-washi-tape"></div>
                    <div className="text-[11px] font-mono text-amber-900/60 uppercase mb-2">
                      Memory Scrapbook
                    </div>
                    <div className="h-28 rounded border-2 border-dashed border-amber-900/20 flex flex-col items-center justify-center p-3 mb-2">
                      <Sparkles className="w-6 h-6 text-amber-800/60 mb-1" />
                      <span className="text-xs font-serif italic text-amber-950 font-bold">Scrapbook Ready</span>
                      <span className="text-[10px] text-amber-900/70 mt-0.5">Post memories to generate throwback cards</span>
                    </div>
                    <button
                      onClick={() => handleOpenUpload('device')}
                      className="text-xs text-amber-950 font-sans font-bold hover:underline"
                    >
                      Create First Memory →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BENTO GRID DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              friends={friends}
              posts={posts}
              memories={memories}
              onOpenUpload={() => handleOpenUpload('device')}
              onNavigateToMemories={() => setActiveTab('memories')}
              onNavigateToFriends={() => setActiveTab('friends')}
              onNavigateToAdmin={() => setActiveTab('admin')}
            />
          )}

          {/* TAB 3: SKEUOMORPHIC & MAXIMALIST MEMORIES SCRAPBOOK */}
          {activeTab === 'memories' && (
            <MemoriesTimelineView
              memories={memories}
              currentUser={currentUser}
              onOpenPhotoViewer={(photos, idx) => handleOpenPhotoViewer(photos, idx)}
            />
          )}

          {/* TAB 4: CIRCLE FRIENDS DIRECTORY (Claymorphism) */}
          {activeTab === 'friends' && (
            <FriendsView
              currentUser={currentUser}
              friends={friends}
              posts={posts}
              onOpenInvite={() => setActiveTab('admin')}
              onOpenPhotoViewer={(photos, idx) => handleOpenPhotoViewer(photos, idx)}
              onCreateMember={handleCreateMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {/* TAB 5: FAVORITES / SAVED KEEPSAKES */}
          {activeTab === 'favorites' && (
            <FavoritesView
              posts={posts}
              currentUser={currentUser}
              onOpenPhotoViewer={(photos, idx, post) => handleOpenPhotoViewer(photos, idx, post)}
              onSaveToggle={handleSaveToggle}
            />
          )}

          {/* TAB 6: ADMIN SECURITY (Brutalism) */}
          {activeTab === 'admin' && (
            <AdminDashboardView
              currentUser={currentUser}
              friends={friends}
            />
          )}

          {/* TAB 7: SETTINGS & CONTROLS (Neomorphism) */}
          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onOpenStyleGuide={() => setIsStyleGuideOpen(true)}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Dock (Liquid Glass) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenUpload={() => handleOpenUpload('device')}
      />

      {/* 5. Modals & Drawers */}
      <UploadModal
        isOpen={isUploadOpen}
        currentUser={currentUser}
        initialSource={uploadInitialSource}
        onClose={() => setIsUploadOpen(false)}
        onPublish={handleAddPost}
      />

      <EditPostModal
        isOpen={!!editingPost}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSave={handleUpdatePost}
      />

      <StyleGuideModal
        isOpen={isStyleGuideOpen}
        onClose={() => setIsStyleGuideOpen(false)}
        activeFilter={activeStyleFilter}
        onSelectStyleFilter={setActiveStyleFilter}
      />

      {/* Auth Modal for Login and Registration */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <PhotoViewerModal
        isOpen={photoViewerState.isOpen}
        photos={photoViewerState.photos}
        initialIndex={photoViewerState.initialIndex}
        post={photoViewerState.post}
        currentUser={currentUser}
        onClose={() => setPhotoViewerState(prev => ({ ...prev, isOpen: false }))}
        onLikeToggle={handleLikeToggle}
        onSaveToggle={handleSaveToggle}
        onAddPhoto={(postId) => {
          const p = posts.find(item => item.id === postId);
          if (p) handleOpenAddPhotoToPost(p);
        }}
        onReplacePhoto={(postId, idx) => {
          const p = posts.find(item => item.id === postId);
          if (p) handleOpenReplacePhotoInPost(p, idx);
        }}
        onDeletePhoto={handleDeletePhotoFromPost}
      />

      {/* Feed Image CRUD Modal (Create / Add, Update / Replace, Delete) */}
      <ImageCrudModal
        isOpen={imageCrudState.isOpen}
        mode={imageCrudState.mode}
        post={imageCrudState.post}
        photoIndex={imageCrudState.photoIndex}
        onClose={() => setImageCrudState(prev => ({ ...prev, isOpen: false }))}
        onSavePhoto={handleSavePhotoFromCrud}
        onDeleteCurrentPhoto={handleDeletePhotoFromPost}
      />

      <CommentDrawer
        post={activeCommentPost}
        isOpen={!!activeCommentPost}
        onClose={() => setActiveCommentPost(null)}
        currentUser={currentUser}
        onAddComment={handleAddComment}
      />
    </div>
  );
}

export default App;
