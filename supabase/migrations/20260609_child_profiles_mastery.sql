-- Gyerekprofilok és mastery rekordok felhős tárolása
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

-- ============================================================
-- child_profiles tábla
-- Egy szülői fiók (auth.users) alatt több gyerekprofil lehet
-- ============================================================
CREATE TABLE IF NOT EXISTS child_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  current_phase INTEGER NOT NULL DEFAULT 1,
  known_graphemes TEXT[] NOT NULL DEFAULT '{"a","i"}',
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "child_profiles: csak saját adatok olvashatók" ON child_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "child_profiles: csak saját adatok írhatók" ON child_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "child_profiles: csak saját adatok módosíthatók" ON child_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "child_profiles: csak saját adatok törölhetők" ON child_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- mastery_records tábla
-- Egy gyerekprofil alá tartozó szó/feladattípus teljesítmény
-- user_id denormalizálva az RLS egyszerűsítése érdekében
-- ============================================================
CREATE TABLE IF NOT EXISTS mastery_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id        UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id         TEXT NOT NULL,
  item_type       TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'new',
  correct_count   INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  sessions        INTEGER NOT NULL DEFAULT 0,
  last_practiced  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (child_id, item_id, item_type)
);

ALTER TABLE mastery_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mastery_records: csak saját adatok olvashatók" ON mastery_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "mastery_records: csak saját adatok írhatók" ON mastery_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mastery_records: csak saját adatok módosíthatók" ON mastery_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "mastery_records: csak saját adatok törölhetők" ON mastery_records
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Indexek a gyakori lekérések gyorsítására
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_child_profiles_user_id ON child_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_mastery_records_child_id ON mastery_records(child_id);
CREATE INDEX IF NOT EXISTS idx_mastery_records_user_id ON mastery_records(user_id);
