-- A sentence_image_needs táblára korábban RLS-t kapcsoltunk, de a többi tartalmi
-- tábla (image_needs, words, sound_needs, exercise_type_config) a gyakorlatban
-- nincs RLS-sel védve ebben a projektben (a rls_policies.sql sosem futott le
-- élesben rájuk) — az admin felület ezért a sima anon kulcsos klienssel olvas.
-- A konzisztencia kedvéért a sentence_image_needs táblát is ehhez igazítjuk,
-- különben az admin UI 0 sort lát RLS miatt.
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

ALTER TABLE sentence_image_needs DISABLE ROW LEVEL SECURITY;
