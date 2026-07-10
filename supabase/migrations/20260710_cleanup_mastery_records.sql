-- Árva / hibás mastery rekordok takarítása
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)
--
-- Előzmény: a mobilapp 2026-07-10 előtti verziói
--   1) fázisonként változó, index-alapú szó-azonosítókat mentettek
--      (word_12_alma — az új, stabil formátum: word_alma),
--   2) a first_sound / image_word_drag / direction_tracking feladatokat
--      tévesen 'grapheme' típusú rekordként rögzítették (item_id-jük szó
--      szövege vagy szó-azonosító, nem valódi graféma-id).
-- Ezeket a rekordokat semmi nem olvassa, csak zajt visznek a statisztikába.

-- 1) Régi, index-alapú szó-azonosítók (minden item_type-ban: a régi
--    syllable_clapping 'syllable' típussal is ilyen id-t mentett)
DELETE FROM mastery_records
WHERE item_id ~ '^word_[0-9]+_';

-- 2) 'grapheme' típusú rekordok, amelyek item_id-ja nem valódi graféma-id
--    (a lista a shared/curriculum/graphemes.ts-ből generálva, 88 elem)
DELETE FROM mastery_records
WHERE item_type = 'grapheme'
  AND item_id NOT IN (
    'a','i','ii','oo','o','m','s','t','v','e','l','uu','u','p','c','k','aa','f','h','z',
    'oee','oe','d','j','ee','n','sz','g','r','ue','uee','b','gy','cs','ny','zs','ty','ly',
    'dz','x','dzs','y','w','q',
    'A','I','II','O','OO','M','S','T','Z','P','H','U','UU','E','AA','K','L','N',
    'OE','OEE','EE','V','B','C','UE','UEE','F','G','J','D','R','Sz','Ty','Cs','Gy','Zs','Ny','Ly',
    'Dz','Dzs','X','W','Q','Y'
  );
