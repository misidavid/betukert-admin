-- Explicit GRANT-ok minden public sémabeli táblára
-- Supabase 2026-10-30 után már nem ad implicit hozzáférést új táblákhoz —
-- ez a migráció a meglévő táblákra rögzíti azt, ami ma implicit.
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

-- Admin-only táblák: csak bejelentkezett felhasználó éri el
GRANT SELECT, INSERT, UPDATE, DELETE ON words              TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON image_needs        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sound_needs        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON exercise_type_config TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON excluded_words     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sentence_image_needs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sentence_bank      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON comprehension_bank TO authenticated;

-- Felhasználói adatok: mindenki csak a sajátját látja (RLS védi)
GRANT SELECT, INSERT, UPDATE, DELETE ON child_profiles  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON mastery_records TO authenticated;

-- published_packages: mobilapp anon kulccsal olvassa, admin írja
GRANT SELECT                          ON published_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE  ON published_packages TO authenticated;
