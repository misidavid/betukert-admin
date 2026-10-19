-- Eseménynapló: gyakorlókörök, feladatonkénti válaszok, szintváltások
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)
--
-- MIÉRT: a mastery_records gyerek × elem PILLANATKÉP — azt őrzi, hol tart most
-- a gyerek, azt nem, hogy mikor és hogyan jutott oda. Ezért a statisztika nem
-- tud napi aktivitást, megtartást, feladattípusonkénti pontosságot, tévesztési
-- mátrixot vagy fázison töltött időt számolni. Ez a három tábla az eseményeket
-- rögzíti; a mobilapp írja őket (src/storage/eventLog.ts).
--
-- ELVEK:
--  - Csak beszúrás: a sorokat a telefon sosem módosítja vagy törli. Az
--    azonosítót a telefon generálja, így egy offline sorból újrapróbált
--    feltöltés nem duplikál (ON CONFLICT DO NOTHING).
--  - Írni csak a SAJÁT gyerekre lehet (mint a mastery_records-nál,
--    20261006_mastery_child_ownership.sql).
--  - A gyerekprofil vagy a fiók törlésekor minden sor törlődik (CASCADE) — a
--    fióktörlés ígérete („minden tanulási adat eltávolítása") így ezekre is áll.
--  - A feladatonkénti napló 12 hónapig marad meg (20261019_event_log_retention.sql).
--
-- Visszavonás:
--   DROP TABLE IF EXISTS public.phase_events, public.exercise_attempts, public.practice_sessions;

BEGIN;

-- ============================================================
-- practice_sessions — körönként egy sor (befejezett és félbehagyott is)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id             UUID PRIMARY KEY,
  child_id       UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode           TEXT NOT NULL CHECK (mode IN ('normal', 'free')),
  -- A fázis a kör kezdetekor
  phase          INTEGER NOT NULL,
  started_at     TIMESTAMPTZ NOT NULL,
  -- Befejezett körnél a befejezés, félbehagyottnál az utolsó válasz ideje
  ended_at       TIMESTAMPTZ NOT NULL,
  planned_count  INTEGER NOT NULL CHECK (planned_count >= 0),
  answered_count INTEGER NOT NULL CHECK (answered_count >= 0),
  correct_count  INTEGER NOT NULL CHECK (correct_count >= 0),
  completed      BOOLEAN NOT NULL,
  -- Ha a kör végén szintet lépett: az új fázis; különben NULL
  advanced_to    INTEGER,
  platform       TEXT,
  app_version    TEXT,
  -- Az OTA-frissítés azonosítója (NULL: a binárisba épített kód fut)
  update_id      TEXT,
  -- Szerveridő: a feltöltés pillanata (offline sornál késhet a started_at-hez képest)
  received_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_sessions_child_started ON public.practice_sessions (child_id, started_at);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_started ON public.practice_sessions (started_at);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user ON public.practice_sessions (user_id);

-- ============================================================
-- exercise_attempts — feladatonként egy sor
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exercise_attempts (
  id             UUID PRIMARY KEY,
  session_id     UUID NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
  child_id       UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Hányadik feladat a körben (0-tól)
  position       INTEGER NOT NULL CHECK (position >= 0),
  exercise_type  TEXT NOT NULL,
  -- A mastery szerinti elemtípus (grapheme / syllable / word); NULL, ha a
  -- feladat nem ír mastery-rekordot (pl. vonalkövetés)
  item_type      TEXT,
  target_items   TEXT[] NOT NULL,
  correct        BOOLEAN NOT NULL,
  -- A választott opció — csak választós feladatnál; húzós, építős, rajzolós
  -- feladatnál NULL
  answer         TEXT,
  correct_answer TEXT,
  option_count   INTEGER,
  -- A feladat megjelenésétől a válaszig eltelt idő
  response_ms    INTEGER CHECK (response_ms IS NULL OR response_ms >= 0),
  answered_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exercise_attempts_session ON public.exercise_attempts (session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_answered ON public.exercise_attempts (answered_at);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_type ON public.exercise_attempts (exercise_type, answered_at);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_child ON public.exercise_attempts (child_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user ON public.exercise_attempts (user_id);

-- ============================================================
-- phase_events — szintváltásonként egy sor
-- ============================================================
CREATE TABLE IF NOT EXISTS public.phase_events (
  id                UUID PRIMARY KEY,
  child_id          UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_phase        INTEGER NOT NULL,
  to_phase          INTEGER NOT NULL,
  -- mastery: minden betű beérett · safety_net: a „túl sokáig tartó szint"
  -- biztonsági hálója engedte tovább · parent_up / parent_down: szülői állítás
  reason            TEXT NOT NULL CHECK (reason IN ('mastery', 'safety_net', 'parent_up', 'parent_down')),
  -- Hány kör telt el a kiinduló fázisban (eszközönkénti számláló)
  sessions_in_phase INTEGER,
  -- A kör, amelynek végén történt (szülői állításnál NULL). Szándékosan nincs
  -- idegen kulcs: a szintváltás akkor is megmaradjon, ha a kör sora elveszett.
  session_id        UUID,
  occurred_at       TIMESTAMPTZ NOT NULL,
  received_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_phase_events_child_occurred ON public.phase_events (child_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_phase_events_occurred ON public.phase_events (occurred_at);
CREATE INDEX IF NOT EXISTS idx_phase_events_user ON public.phase_events (user_id);

-- ============================================================
-- Jogosultságok
-- A Supabase 2026-10-30 után nem ad implicit hozzáférést az új táblákhoz.
-- A telefon csak beszúr és a sajátját olvassa; módosítani, törölni nem tud.
-- Az admin (service_role) olvas; a megőrzési törlés a pg_cron jobból fut.
-- ============================================================
GRANT SELECT, INSERT ON public.practice_sessions, public.exercise_attempts, public.phase_events TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.practice_sessions, public.exercise_attempts, public.phase_events TO service_role;

ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_events ENABLE ROW LEVEL SECURITY;

-- Olvasás: csak a saját sorok (egy későbbi szülői nézethez)
CREATE POLICY "practice_sessions: csak saját olvasható" ON public.practice_sessions
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "exercise_attempts: csak saját olvasható" ON public.exercise_attempts
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "phase_events: csak saját olvasható" ON public.phase_events
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

-- Írás: csak a saját nevére ÉS a saját gyerekére
CREATE POLICY "practice_sessions: csak saját gyerekre írható" ON public.practice_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.child_profiles c
       WHERE c.id = practice_sessions.child_id
         AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "exercise_attempts: csak saját gyerekre írható" ON public.exercise_attempts
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.child_profiles c
       WHERE c.id = exercise_attempts.child_id
         AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "phase_events: csak saját gyerekre írható" ON public.phase_events
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.child_profiles c
       WHERE c.id = phase_events.child_id
         AND c.user_id = (SELECT auth.uid())
    )
  );

COMMIT;
