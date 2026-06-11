-- Új feladattípus felvétele a config táblába (id = slug, nem UUID)
INSERT INTO exercise_type_config (id, label, requires_image, updated_at)
VALUES (
  'image_word_drag',
  'Kép-szó párosítás',
  true,
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Meglévő image_needs rekordok frissítése: image_word_drag is igényel képet,
-- ugyanolyan szavak érintettek, mint az image_word_match
UPDATE image_needs
SET exercise_types = array_append(exercise_types, 'image_word_drag')
WHERE 'image_word_match' = ANY(exercise_types)
  AND NOT ('image_word_drag' = ANY(exercise_types));
