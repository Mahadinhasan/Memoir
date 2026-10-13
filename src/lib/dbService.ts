/**
 * Memoir Database Service
 * Live CRUD for posts, comments, likes, saves, and profiles via Supabase.
 * Includes Realtime subscriptions for live updates.
 */
import { supabase } from './supabase';
import type { Post, User, Comment } from '../types';

// ─── Type helpers ────────────────────────────────────────────────────────────

/** Row shape coming from the `posts` table (joined with profiles) */
interface PostRow {
  id: string;
  author_id: string;
  caption: string;
  photos: string[];
  location: string;
  variant: 'minimal' | 'skeuomorphic' | 'maximalist' | 'spatial';
  celebration_title: string | null;
  celebration_type: string | null;
  memory_date: string | null;
  likes_count: number;
  created_at: string;
  profiles: ProfileRow;
  comments: CommentRow[];
  post_likes: { user_id: string }[];
  saved_posts: { user_id: string }[];
}

interface CommentRow {
  id: string;
  post_id: string;
  author_id: string;
  text: string;
  likes: number;
  created_at: string;
  profiles: ProfileRow;
}

interface ProfileRow {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  status: string;
  bio: string;
  mutual_count: number;
  joined_date: string;
  memories_count: number;
}

// ─── Converters ───────────────────────────────────────────────────────────────

function profileToUser(p: ProfileRow): User {
  return {
    id: p.id,
    name: p.name,
    username: p.username,
    avatar: p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0f172a&color=60a5fa&size=128&bold=true`,
    role: (p.role as User['role']) ?? 'member',
    status: (p.status as User['status']) ?? 'approved',
    bio: p.bio ?? '',
    mutualCount: p.mutual_count ?? 0,
    joinedDate: p.joined_date ?? '',
    memoriesCount: p.memories_count ?? 0,
  };
}

function rowToPost(row: PostRow, currentUserId?: string): Post {
  const author = row.profiles ? profileToUser(row.profiles) : {
    id: row.author_id, name: 'Unknown', username: 'unknown',
    avatar: '', role: 'member' as const, status: 'approved' as const,
    bio: '', mutualCount: 0, joinedDate: '', memoriesCount: 0
  };

  const comments: Comment[] = (row.comments ?? []).map(c => ({
    id: c.id,
    author: c.profiles ? profileToUser(c.profiles) : author,
    text: c.text,
    createdAt: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    likes: c.likes ?? 0,
  }));

  const hasLiked = currentUserId
    ? (row.post_likes ?? []).some(l => l.user_id === currentUserId)
    : false;

  const saved = currentUserId
    ? (row.saved_posts ?? []).some(s => s.user_id === currentUserId)
    : false;

  const createdDate = new Date(row.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  let createdAt = 'Just now';
  if (diffMins < 60) createdAt = diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
  else if (diffMins < 1440) createdAt = `${Math.floor(diffMins / 60)}h ago`;
  else createdAt = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    id: row.id,
    author,
    caption: row.caption ?? '',
    photos: row.photos ?? [],
    location: row.location ?? '',
    variant: row.variant ?? 'minimal',
    celebrationTitle: row.celebration_title ?? undefined,
    celebrationType: (row.celebration_type as Post['celebrationType']) ?? undefined,
    memoryDate: row.memory_date ?? undefined,
    likesCount: row.likes_count ?? 0,
    hasLiked,
    saved,
    comments,
    createdAt,
  };
}

// ─── POSTS ────────────────────────────────────────────────────────────────────

/** Fetch all posts with author, comments, likes, and saved status */
export async function fetchPosts(currentUserId?: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles!posts_author_id_fkey (*),
      comments (
        *,
        profiles!comments_author_id_fkey (*)
      ),
      post_likes (user_id),
      saved_posts (user_id)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] fetchPosts error:', error.message);
    return [];
  }

  return (data as PostRow[]).map(row => rowToPost(row, currentUserId));
}

/** Insert a new post */
export async function createPost(
  post: Post,
  authorId: string
): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      id: post.id,
      author_id: authorId,
      caption: post.caption,
      photos: post.photos,
      location: post.location ?? '',
      variant: post.variant ?? 'minimal',
      celebration_title: post.celebrationTitle ?? null,
      celebration_type: post.celebrationType ?? null,
      memory_date: post.memoryDate ?? null,
      likes_count: 0,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[DB] createPost error:', error.message);
    return { id: null, error: error.message };
  }
  return { id: data.id, error: null };
}

/** Update caption, photos, variant, location of a post */
export async function updatePost(
  postId: string,
  fields: Partial<Pick<Post, 'caption' | 'photos' | 'variant' | 'location' | 'celebrationTitle'>>
): Promise<{ error: string | null }> {
  const update: Record<string, unknown> = {};
  if (fields.caption !== undefined) update.caption = fields.caption;
  if (fields.photos !== undefined) update.photos = fields.photos;
  if (fields.variant !== undefined) update.variant = fields.variant;
  if (fields.location !== undefined) update.location = fields.location;
  if (fields.celebrationTitle !== undefined) update.celebration_title = fields.celebrationTitle;

  const { error } = await supabase.from('posts').update(update).eq('id', postId);
  if (error) console.error('[DB] updatePost error:', error.message);
  return { error: error?.message ?? null };
}

/** Delete a post */
export async function deletePost(postId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) console.error('[DB] deletePost error:', error.message);
  return { error: error?.message ?? null };
}

// ─── LIKES ────────────────────────────────────────────────────────────────────

export async function toggleLike(
  postId: string,
  userId: string,
  currentlyLiked: boolean
): Promise<{ error: string | null }> {
  if (currentlyLiked) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) return { error: error.message };
    try {
      await supabase.rpc('decrement_likes', { post_id: postId });
    } catch {
      // ignore rpc fallback
    }
  } else {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });
    if (error && error.code !== '23505') return { error: error.message }; // ignore duplicate
    try {
      await supabase.rpc('increment_likes', { post_id: postId });
    } catch {
      // ignore rpc fallback
    }
  }
  return { error: null };
}

// ─── SAVED ────────────────────────────────────────────────────────────────────

export async function toggleSaved(
  postId: string,
  userId: string,
  currentlySaved: boolean
): Promise<{ error: string | null }> {
  if (currentlySaved) {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from('saved_posts')
      .insert({ post_id: postId, user_id: userId });
    if (error && error.code !== '23505') return { error: error.message };
  }
  return { error: null };
}

// ─── COMMENTS ────────────────────────────────────────────────────────────────

export async function addComment(
  postId: string,
  authorId: string,
  text: string
): Promise<{ comment: Comment | null; error: string | null }> {
  const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const { data, error } = await supabase
    .from('comments')
    .insert({ id, post_id: postId, author_id: authorId, text })
    .select('*, profiles!comments_author_id_fkey (*)')
    .single();

  if (error) {
    console.error('[DB] addComment error:', error.message);
    return { comment: null, error: error.message };
  }

  const commentRow = data as CommentRow;
  const comment: Comment = {
    id: commentRow.id,
    author: commentRow.profiles ? profileToUser(commentRow.profiles) : {
      id: authorId, name: 'You', username: 'you',
      avatar: '', role: 'member', status: 'approved',
      bio: '', mutualCount: 0, joinedDate: '', memoriesCount: 0
    },
    text: commentRow.text,
    createdAt: 'Just now',
    likes: 0,
  };

  return { comment, error: null };
}

// ─── PROFILES ─────────────────────────────────────────────────────────────────

export async function fetchProfiles(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[DB] fetchProfiles error:', error.message);
    return [];
  }
  return (data as ProfileRow[]).map(profileToUser);
}

export async function upsertProfile(user: User): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    bio: user.bio,
    joined_date: user.joinedDate,
    memories_count: user.memoriesCount,
    mutual_count: user.mutualCount,
  }, { onConflict: 'id' });
  if (error) console.error('[DB] upsertProfile error:', error.message);
  return { error: error?.message ?? null };
}

// ─── REALTIME ─────────────────────────────────────────────────────────────────

type RealtimeCallback = (eventType: 'INSERT' | 'UPDATE' | 'DELETE', row: Record<string, unknown>) => void;

/** Subscribe to live post changes */
export function subscribeToPostChanges(callback: RealtimeCallback) {
  const channel = supabase
    .channel('memoir-posts-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
      callback(payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE', payload.new as Record<string, unknown>);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

/** Subscribe to live comment changes */
export function subscribeToCommentChanges(callback: RealtimeCallback) {
  const channel = supabase
    .channel('memoir-comments-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
      callback(payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE', payload.new as Record<string, unknown>);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

/** Subscribe to live like changes */
export function subscribeToLikeChanges(callback: RealtimeCallback) {
  const channel = supabase
    .channel('memoir-likes-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, (payload) => {
      callback(payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE', payload.new as Record<string, unknown>);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

// ─── SYSTEM & STORAGE STATS ───────────────────────────────────────────────────

export interface SystemStats {
  connected: boolean;
  postsCount: number;
  profilesCount: number;
  storageFilesCount: number;
  bucketName: string;
  maxSizeMb: number;
  realtimeConnected: boolean;
  activeUser: string | null;
}

export async function fetchSystemStats(userEmail?: string): Promise<SystemStats> {
  let connected = true;
  let postsCount = 0;
  let profilesCount = 0;
  let storageFilesCount = 0;

  try {
    const { count: pCount, error: pErr } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    if (!pErr && pCount !== null) postsCount = pCount;

    const { count: profCount, error: profErr } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    if (!profErr && profCount !== null) profilesCount = profCount;

    const { data: files } = await supabase.storage.from('memoir-images').list('posts');
    if (files) storageFilesCount = files.length;
  } catch (err) {
    console.error('[DB] fetchSystemStats error:', err);
    connected = false;
  }

  return {
    connected,
    postsCount,
    profilesCount,
    storageFilesCount,
    bucketName: 'memoir-images',
    maxSizeMb: 3,
    realtimeConnected: true,
    activeUser: userEmail ?? null,
  };
}
