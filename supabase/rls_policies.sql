-- RLS (Row Level Security) bekapcsolása és policy-k beállítása
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

-- ============================================================
-- RLS bekapcsolása minden táblán
-- ============================================================
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_type_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_packages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- words tábla
-- Csak bejelentkezett admin felhasználó írhat/olvashat
-- ============================================================
CREATE POLICY "words: csak auth user olvashat" ON words
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "words: csak auth user írhat" ON words
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- image_needs tábla
-- ============================================================
CREATE POLICY "image_needs: csak auth user olvashat" ON image_needs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "image_needs: csak auth user írhat" ON image_needs
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- sound_needs tábla
-- ============================================================
CREATE POLICY "sound_needs: csak auth user olvashat" ON sound_needs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "sound_needs: csak auth user írhat" ON sound_needs
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- exercise_type_config tábla
-- ============================================================
CREATE POLICY "exercise_type_config: csak auth user olvashat" ON exercise_type_config
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercise_type_config: csak auth user írhat" ON exercise_type_config
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- published_packages tábla
-- Olvasás: mindenki (a mobilapp anon kulccsal olvassa)
-- Írás: csak bejelentkezett admin
-- ============================================================
CREATE POLICY "published_packages: bárki olvashat" ON published_packages
  FOR SELECT USING (true);

CREATE POLICY "published_packages: csak auth user írhat" ON published_packages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
