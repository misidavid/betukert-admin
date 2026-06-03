-- RLS (Row Level Security) bekapcsolása és policy-k beállítása
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)
--
-- FONTOS: A Supabase Dashboard-on is kapcsold ki a nyilvános regisztrációt:
-- Authentication → Providers → Email → "Enable sign ups" kikapcsolása

-- ============================================================
-- RLS bekapcsolása minden táblán
-- ============================================================
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_type_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_packages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Régi policy-k törlése (újrafuttatáshoz)
-- ============================================================
DROP POLICY IF EXISTS "words: csak auth user olvashat" ON words;
DROP POLICY IF EXISTS "words: csak auth user írhat" ON words;
DROP POLICY IF EXISTS "image_needs: csak auth user olvashat" ON image_needs;
DROP POLICY IF EXISTS "image_needs: csak auth user írhat" ON image_needs;
DROP POLICY IF EXISTS "sound_needs: csak auth user olvashat" ON sound_needs;
DROP POLICY IF EXISTS "sound_needs: csak auth user írhat" ON sound_needs;
DROP POLICY IF EXISTS "exercise_type_config: csak auth user olvashat" ON exercise_type_config;
DROP POLICY IF EXISTS "exercise_type_config: csak auth user írhat" ON exercise_type_config;
DROP POLICY IF EXISTS "published_packages: bárki olvashat" ON published_packages;
DROP POLICY IF EXISTS "published_packages: csak auth user írhat" ON published_packages;

-- ============================================================
-- words tábla
-- ============================================================
CREATE POLICY "words: csak admin olvashat" ON words
  FOR SELECT USING (auth.email() = 'misi.david@gmail.com');

CREATE POLICY "words: csak admin írhat" ON words
  FOR ALL USING (auth.email() = 'misi.david@gmail.com');

-- ============================================================
-- image_needs tábla
-- ============================================================
CREATE POLICY "image_needs: csak admin olvashat" ON image_needs
  FOR SELECT USING (auth.email() = 'misi.david@gmail.com');

CREATE POLICY "image_needs: csak admin írhat" ON image_needs
  FOR ALL USING (auth.email() = 'misi.david@gmail.com');

-- ============================================================
-- sound_needs tábla
-- ============================================================
CREATE POLICY "sound_needs: csak admin olvashat" ON sound_needs
  FOR SELECT USING (auth.email() = 'misi.david@gmail.com');

CREATE POLICY "sound_needs: csak admin írhat" ON sound_needs
  FOR ALL USING (auth.email() = 'misi.david@gmail.com');

-- ============================================================
-- exercise_type_config tábla
-- ============================================================
CREATE POLICY "exercise_type_config: csak admin olvashat" ON exercise_type_config
  FOR SELECT USING (auth.email() = 'misi.david@gmail.com');

CREATE POLICY "exercise_type_config: csak admin írhat" ON exercise_type_config
  FOR ALL USING (auth.email() = 'misi.david@gmail.com');

-- ============================================================
-- published_packages tábla
-- Olvasás: mindenki (a mobilapp anon kulccsal olvassa)
-- Írás: csak admin
-- ============================================================
CREATE POLICY "published_packages: bárki olvashat" ON published_packages
  FOR SELECT USING (true);

CREATE POLICY "published_packages: csak admin írhat" ON published_packages
  FOR INSERT WITH CHECK (auth.email() = 'misi.david@gmail.com');
