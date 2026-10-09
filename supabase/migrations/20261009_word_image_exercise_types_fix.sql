-- Szóképek feladattípus-jelöléseinek rendbetétele (2026-10-09)
-- Futtasd le a Supabase SQL Editorban. Újrafuttatható, publikálás nem kell:
-- a mobilapp a jelölések közül csak a first_sound-ot olvassa, az nem változik.
--
-- 1. A „Betű a szóban" (letter_in_word) csak írott szavakkal dolgozik, képet
--    sosem használt, ezért nem képköteles.
-- 2. A „Hiányzó betű" (missing_letter) és a „Rövid vagy hosszú?" (word_length)
--    minden publikált szóképet használ, de egy sorra sem volt bejelölve. A jelölés
--    minden szóképre felkerül, amely legalább egy szóképes típusban benne van;
--    a Kizárt szavakhoz (egyik szóképes típusban sincsenek) nem nyúlunk.

UPDATE exercise_type_config
SET requires_image = false, updated_at = now()
WHERE id = 'letter_in_word';

UPDATE image_needs
SET exercise_types = array_append(exercise_types, 'missing_letter'), updated_at = now()
WHERE exercise_types && ARRAY['image_word_match', 'image_word_drag', 'first_sound']
  AND NOT ('missing_letter' = ANY(exercise_types));

UPDATE image_needs
SET exercise_types = array_append(exercise_types, 'word_length'), updated_at = now()
WHERE exercise_types && ARRAY['image_word_match', 'image_word_drag', 'first_sound']
  AND NOT ('word_length' = ANY(exercise_types));
