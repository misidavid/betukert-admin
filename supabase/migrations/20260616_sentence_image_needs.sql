-- Mondat-kép párosítás feladattípushoz: mondatokhoz tartozó képek nyilvántartása
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS sentence_image_needs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sentence_id   TEXT NOT NULL UNIQUE,   -- 's1', 'c1', stb. (sentencebank.ts id mező)
  source        TEXT NOT NULL,          -- 'sentence_order' | 'sentence_comprehension'
  sentence_text TEXT NOT NULL,          -- megjelenítendő mondat (words.join(' ') vagy c.sentence)
  phase         INTEGER NOT NULL,
  exercise_type TEXT NOT NULL DEFAULT 'sentence_picture_match',
  image_brief   TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'missing',
  file_path     TEXT,
  file_url      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE sentence_image_needs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sentence_image_needs: csak admin olvashat" ON sentence_image_needs
  FOR SELECT USING (auth.email() = 'misi.david@gmail.com');

CREATE POLICY "sentence_image_needs: csak admin írhat" ON sentence_image_needs
  FOR ALL USING (auth.email() = 'misi.david@gmail.com');

INSERT INTO exercise_type_config (id, label, requires_image, updated_at)
VALUES ('sentence_picture_match', 'Mondat-kép párosítás', true, now())
ON CONFLICT (id) DO NOTHING;
