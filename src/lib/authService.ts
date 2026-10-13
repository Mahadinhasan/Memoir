/**
 * Memoir Auth Service
 * Wraps Supabase Auth to work with the app's User type.
 */
import { supabase } from './supabase';
import type { User as AppUser } from '../types';

/** Convert a Supabase auth user + optional profile metadata into the app User shape */
export function supabaseUserToAppUser(
  supabaseUser: import('@supabase/supabase-js').User,
  meta?: Partial<AppUser>
): AppUser {
  const email = supabaseUser.email ?? '';
  const username =
    meta?.username ??
    supabaseUser.user_metadata?.username ??
    email.split('@')[0] ??
    `user_${supabaseUser.id.slice(0, 6)}`;

  return {
    id: supabaseUser.id,
    name: meta?.name ?? supabaseUser.user_metadata?.name ?? username,
    username,
    avatar:
      meta?.avatar ??
      supabaseUser.user_metadata?.avatar_url ??
      `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=0ea5e9`,
    role: (meta?.role ?? supabaseUser.user_metadata?.role ?? 'member') as AppUser['role'],
    status: (meta?.status ?? supabaseUser.user_metadata?.status ?? 'approved') as AppUser['status'],
    bio: meta?.bio ?? supabaseUser.user_metadata?.bio ?? 'Circle member.',
    mutualCount: meta?.mutualCount ?? 0,
    joinedDate: meta?.joinedDate ?? new Date(supabaseUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    memoriesCount: meta?.memoriesCount ?? 0,
  };
}

/** Sign in with email & password via Supabase */
export async function signIn(
  email: string,
  password: string
): Promise<{ user: AppUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { user: null, error: error.message };
  }
  if (!data.user) {
    return { user: null, error: 'Authentication failed. Please try again.' };
  }

  return { user: supabaseUserToAppUser(data.user), error: null };
}

/** Sign up (register) a new user via Supabase */
export async function signUp(params: {
  email: string;
  password: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
}): Promise<{ user: AppUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        name: params.name,
        username: params.username,
        bio: params.bio ?? '',
        avatar_url: params.avatar ?? '',
        role: 'member',
        status: 'approved',
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }
  if (!data.user) {
    return { user: null, error: 'Registration failed. Please try again.' };
  }

  const appUser = supabaseUserToAppUser(data.user, {
    name: params.name,
    username: params.username,
    bio: params.bio,
    avatar: params.avatar,
    joinedDate: 'Just now',
  });

  return { user: appUser, error: null };
}

/** Sign out the current session */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Get the currently logged-in Supabase user (if any) as an AppUser */
export async function getCurrentUser(): Promise<AppUser | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return supabaseUserToAppUser(data.user);
}

/** Listen to auth state changes and invoke a callback */
export function onAuthStateChange(
  callback: (user: AppUser | null) => void
): { unsubscribe: () => void } {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback(supabaseUserToAppUser(session.user));
    } else {
      callback(null);
    }
  });

  return {
    unsubscribe: () => data.subscription.unsubscribe(),
  };
}
