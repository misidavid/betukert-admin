INSERT INTO exercise_type_config (id, label, requires_image, updated_at)
VALUES (
  gen_random_uuid(),
  'Kép-szó párosítás',
  true,
  now()
)
ON CONFLICT DO NOTHING;
