-- RLS bekapcsolása a tartalmi táblákon
-- Az admin minden DB-műveletet most már getSupabaseAdmin() (service role) klienssel végez,
-- amely bypass-olja az RLS-t — így a policy-k nem korlátozzák az admin munkáját.
--
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

-- ============================================================
-- words, image_needs, sound_needs, exercise_type_config
-- Ezek csak az admin felületről olvashatók (service role bypass-olja az RLS-t).
-- Anon felhasználónak nincs policy → nincs hozzáférés.
-- ============================================================
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_type_config ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- sentence_image_needs
-- 2026-06-17-én explicit DISABLE-lal kapcsoltuk ki az RLS-t,
-- mert az admin anon kulccsal olvasta. Ez mostantól megváltozik.
-- ============================================================
ALTER TABLE sentence_image_needs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- published_packages
-- A mobilapp anon kulccsal olvassa — ezért marad a nyilvános olvasási policy.
-- Írás: az admin service role klienssel ír, az RLS nem korlátozza.
-- ============================================================
ALTER TABLE published_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "published_packages: bárki olvashat" ON published_packages;
CREATE POLICY "published_packages: bárki olvashat" ON published_packages
  FOR SELECT USING (true);
