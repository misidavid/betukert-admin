-- Véglegesen kizárt szavak nyilvántartása
-- Cél: ha egy szót törölnek az adminban, az "Alap szóbank visszaállítása"
-- funkció ne hozza vissza automatikusan
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS excluded_words (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE excluded_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "excluded_words: csak admin olvashat" ON excluded_words
  FOR SELECT USING (auth.email() = 'misi.david@gmail.com');

CREATE POLICY "excluded_words: csak admin írhat" ON excluded_words
  FOR ALL USING (auth.email() = 'misi.david@gmail.com');
