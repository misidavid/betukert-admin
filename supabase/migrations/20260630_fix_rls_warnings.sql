-- RLS warnings javítása
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

-- ============================================================
-- 1. update_updated_at függvény: rögzített search_path
--    (function_search_path_mutable warning)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- ============================================================
-- 2-3. sentence_bank és comprehension_bank
--    Az "Authenticated users can modify" policy bármely bejelentkezett
--    felhasználónak (mobilappfelhasználónak is) teljes írási jogot ad.
--    Az admin service role klienssel ír (bypass-olja az RLS-t),
--    a mobilapp ezeket a táblákat nem olvassa közvetlenül
--    (csak a published_packages manifeszten keresztül kapja az adatot).
--    → Az összes policy törölhető, a táblákon marad az RLS deny-all.
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can read sentence_bank" ON sentence_bank;
DROP POLICY IF EXISTS "Authenticated users can modify sentence_bank" ON sentence_bank;
DROP POLICY IF EXISTS "Authenticated users can read comprehension_bank" ON comprehension_bank;
DROP POLICY IF EXISTS "Authenticated users can modify comprehension_bank" ON comprehension_bank;
