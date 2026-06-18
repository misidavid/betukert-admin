-- Mondatrendezés feladatok táblája
CREATE TABLE sentence_bank (
  id TEXT PRIMARY KEY,
  words TEXT[] NOT NULL,
  accepted_orders JSONB NOT NULL,
  phase INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mondatértés feladatok táblája
CREATE TABLE comprehension_bank (
  id TEXT PRIMARY KEY,
  sentence TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  wrong_answers TEXT[] NOT NULL,
  phase INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: csak authenticated felhasználók olvashatják/szerkeszthetik
ALTER TABLE sentence_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprehension_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sentence_bank"
  ON sentence_bank FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can modify sentence_bank"
  ON sentence_bank FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read comprehension_bank"
  ON comprehension_bank FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can modify comprehension_bank"
  ON comprehension_bank FOR ALL TO authenticated USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sentence_bank_updated_at
  BEFORE UPDATE ON sentence_bank
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comprehension_bank_updated_at
  BEFORE UPDATE ON comprehension_bank
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
