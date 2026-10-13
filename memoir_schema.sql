-- ============================================================
-- MEMOIR DATABASE SCHEMA
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name           text NOT NULL DEFAULT '',
  username       text UNIQUE NOT NULL DEFAULT '',
  avatar         text DEFAULT '',
  role           text NOT NULL DEFAULT 'member' CHECK (role IN ('admin','member')),
  status         text NOT NULL DEFAULT 'approved' CHECK (status IN ('approved','pending','suspended')),
  bio            text DEFAULT '',
  mutual_count   int DEFAULT 0,
  joined_date    text DEFAULT '',
  memories_count int DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_select ON public.profiles;
DROP POLICY IF EXISTS profiles_insert ON public.profiles;
DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id                text PRIMARY KEY,
  author_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caption           text DEFAULT '',
  photos            text[] DEFAULT '{}',
  location          text DEFAULT '',
  variant           text DEFAULT 'minimal' CHECK (variant IN ('minimal','skeuomorphic','maximalist','spatial')),
  celebration_title text,
  celebration_type  text,
  memory_date       text,
  likes_count       int DEFAULT 0,
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS posts_select ON public.posts;
DROP POLICY IF EXISTS posts_insert ON public.posts;
DROP POLICY IF EXISTS posts_update ON public.posts;
DROP POLICY IF EXISTS posts_delete ON public.posts;
CREATE POLICY posts_select ON public.posts FOR SELECT USING (true);
CREATE POLICY posts_insert ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY posts_update ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY posts_delete ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- 3. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id         text PRIMARY KEY,
  post_id    text NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text       text NOT NULL,
  likes      int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS comments_select ON public.comments;
DROP POLICY IF EXISTS comments_insert ON public.comments;
DROP POLICY IF EXISTS comments_delete ON public.comments;
CREATE POLICY comments_select ON public.comments FOR SELECT USING (true);
CREATE POLICY comments_insert ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY comments_delete ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- 4. POST LIKES TABLE
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id    text NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS likes_select ON public.post_likes;
DROP POLICY IF EXISTS likes_insert ON public.post_likes;
DROP POLICY IF EXISTS likes_delete ON public.post_likes;
CREATE POLICY likes_select ON public.post_likes FOR SELECT USING (true);
CREATE POLICY likes_insert ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY likes_delete ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- 5. SAVED POSTS TABLE
CREATE TABLE IF NOT EXISTS public.saved_posts (
  post_id    text NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS saved_select ON public.saved_posts;
DROP POLICY IF EXISTS saved_insert ON public.saved_posts;
DROP POLICY IF EXISTS saved_delete ON public.saved_posts;
CREATE POLICY saved_select ON public.saved_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY saved_insert ON public.saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY saved_delete ON public.saved_posts FOR DELETE USING (auth.uid() = user_id);

-- 6. AUTO-CREATE PROFILE ON AUTH SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username, avatar, role, status, bio, joined_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', regexp_replace(split_part(NEW.email,'@',1), '[^a-zA-Z0-9_]', '', 'g')),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
    COALESCE(NEW.raw_user_meta_data->>'status', 'approved'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    to_char(now(), 'Month YYYY')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. MANUALLY INSERT PROFILE FOR EXISTING USER (Mahadin)
INSERT INTO public.profiles (id, name, username, avatar, role, status, bio, joined_date)
VALUES (
  '591859a2-7629-4fae-85fc-7eb82698b224',
  'Mahadin',
  'mahadin',
  'https://ui-avatars.com/api/?name=Mahadin&background=0f172a&color=60a5fa&size=128&bold=true',
  'admin',
  'approved',
  'Circle founder & administrator.',
  'October 2026'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  avatar = EXCLUDED.avatar,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  bio = EXCLUDED.bio;

-- 8. REALTIME: Enable for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
