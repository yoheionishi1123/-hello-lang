-- Supabase SQL Schema for HelloLang (Phrase Swiper)
-- Please run this script in the Supabase SQL Editor.

-- 1. Create the `phrases` table
-- This table stores all phrases added by users.
CREATE TABLE public.phrases (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    original TEXT NOT NULL,
    translation TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'learning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable Row Level Security (RLS)
-- This ensures users can only see and edit their own phrases.
ALTER TABLE public.phrases ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Policy: Users can view their own phrases
CREATE POLICY "Users can view their own phrases."
ON public.phrases FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own phrases
CREATE POLICY "Users can insert their own phrases."
ON public.phrases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own phrases
CREATE POLICY "Users can update their own phrases."
ON public.phrases FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own phrases
CREATE POLICY "Users can delete their own phrases."
ON public.phrases FOR DELETE
USING (auth.uid() = user_id);
