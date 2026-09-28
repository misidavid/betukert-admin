-- Mastery rekordok: régebbi gyakorlás nem írhatja felül az újabbat
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)
--
-- MIÉRT: a mobilapp a kör végén az ÖSSZES helyi rekordot feltölti (upsert).
-- Ha ugyanaz a gyerek két eszközön gyakorol, és az egyiken az app napokig a
-- háttérben maradt, annak elavult rekordjai felülírták a felhőben a másik
-- eszköz frissebb haladását — csendes adatvesztés, lassabb szintlépés.
--
-- MIT CSINÁL: frissítéskor ha a beérkező last_practiced RÉGEBBI a tároltnál,
-- a sor frissítése kimarad (hiba nélkül). Így a felhő az app-verziótól
-- függetlenül védett, és ugyanazt a szabályt követi, mint a letöltés
-- (profileStorage.ts: pickNewerRecord — a frissebben gyakorolt nyer).
--
-- NEM ÉRINTI: az új sorokat (INSERT), a törlést (szülői visszaléptetés), és a
-- normál gyakorlást — az mindig az aktuális időt írja.
--
-- Visszavonás:
--   DROP TRIGGER IF EXISTS mastery_records_keep_newer ON public.mastery_records;
--   DROP FUNCTION IF EXISTS public.mastery_records_keep_newer();

CREATE OR REPLACE FUNCTION public.mastery_records_keep_newer()
RETURNS TRIGGER AS $$
BEGIN
  -- A BEFORE UPDATE triggerből visszaadott NULL kihagyja a sor frissítését
  -- (upsert ON CONFLICT DO UPDATE ágára is érvényes), hibát nem okoz.
  IF NEW.last_practiced < OLD.last_practiced THEN
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

-- A függvényt csak a trigger hívhatja, a REST API nem.
REVOKE EXECUTE ON FUNCTION public.mastery_records_keep_newer() FROM anon, authenticated;

DROP TRIGGER IF EXISTS mastery_records_keep_newer ON public.mastery_records;
CREATE TRIGGER mastery_records_keep_newer
  BEFORE UPDATE ON public.mastery_records
  FOR EACH ROW EXECUTE FUNCTION public.mastery_records_keep_newer();
