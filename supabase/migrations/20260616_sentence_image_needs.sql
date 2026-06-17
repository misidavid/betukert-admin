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

-- Megjegyzés: a többi tartalmi tábla (image_needs, words, sound_needs,
-- exercise_type_config) ebben a projektben nincs RLS-sel védve, ezért itt sem
-- kapcsoljuk be — az admin UI a sima anon kulcsos klienssel olvas/ír.

INSERT INTO exercise_type_config (id, label, requires_image, updated_at)
VALUES ('sentence_picture_match', 'Mondat-kép párosítás', true, now())
ON CONFLICT (id) DO NOTHING;
