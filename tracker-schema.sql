-- ==========================================
-- Tracker Schema: İzleme Takip Sistemi
-- ==========================================

-- Tablo oluşturma: user_shows
CREATE TABLE IF NOT EXISTS public.user_shows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  show_id TEXT NOT NULL, -- TMDB ID (string veya integer olabilir, proje standartlarına göre)
  show_type TEXT NOT NULL CHECK (show_type IN ('tv', 'movie')),
  last_watched_season INTEGER,
  last_watched_episode INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Aynı kullanıcının aynı içeriği birden fazla kaydetmesini önlemek için:
  UNIQUE(user_id, show_id, show_type)
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.user_shows ENABLE ROW LEVEL SECURITY;

-- Politikalar: Kullanıcılar yalnızca kendi kayıtlarını görebilir, ekleyebilir ve güncelleyebilir.
DROP POLICY IF EXISTS "Users can view their own tracked shows" ON public.user_shows;
CREATE POLICY "Users can view their own tracked shows"
  ON public.user_shows
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tracked shows" ON public.user_shows;
CREATE POLICY "Users can insert their own tracked shows"
  ON public.user_shows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tracked shows" ON public.user_shows;
CREATE POLICY "Users can update their own tracked shows"
  ON public.user_shows
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tracked shows" ON public.user_shows;
CREATE POLICY "Users can delete their own tracked shows"
  ON public.user_shows
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optimizasyon İçin İndeksler
CREATE INDEX IF NOT EXISTS idx_user_shows_user_id ON public.user_shows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_shows_updated_at ON public.user_shows(updated_at DESC);
