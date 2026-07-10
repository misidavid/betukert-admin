-- Új szavak a dz (31.) és dzs (33.) fázishoz — Meixner-példaszavak
-- (a 31-35. fázistartománynak eddig nem volt szóanyaga)
-- Futtasd le a Supabase SQL Editorban, majd publikálj az admin felületről!

INSERT INTO words (text, syllables, syllable_count, graphemes, phase, difficulty, enabled)
VALUES
  ('bodza', ARRAY['bo','dza'], 2, ARRAY['b','o','dz','a'], 31, 2, true),
  ('madzag', ARRAY['ma','dzag'], 2, ARRAY['m','a','dz','a','g'], 31, 3, true),
  ('edz', ARRAY['edz'], 1, ARRAY['e','dz'], 31, 1, true),
  ('pedz', ARRAY['pedz'], 1, ARRAY['p','e','dz'], 31, 2, true),
  ('bodzafa', ARRAY['bo','dza','fa'], 3, ARRAY['b','o','dz','a','f','a'], 31, 4, true),
  ('dzsem', ARRAY['dzsem'], 1, ARRAY['dzs','e','m'], 33, 2, true),
  ('dzsungel', ARRAY['dzsun','gel'], 2, ARRAY['dzs','u','n','g','e','l'], 33, 3, true),
  ('dzsip', ARRAY['dzsip'], 1, ARRAY['dzs','i','p'], 33, 2, true),
  ('maharadzsa', ARRAY['ma','ha','ra','dzsa'], 4, ARRAY['m','a','h','a','r','a','dzs','a'], 33, 5, true)
ON CONFLICT DO NOTHING;

