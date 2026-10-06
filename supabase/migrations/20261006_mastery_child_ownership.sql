-- Mastery rekordok: írni csak a SAJÁT gyerekre lehet
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)
--
-- MIÉRT: az írási szabály eddig csak azt nézte, hogy a sor a bejelentkezett
-- felhasználó nevén van-e (user_id), azt nem, hogy a gyerek (child_id) is az
-- övé-e. Így egy fiók idegen gyerek azonosítójával is írhatott — és mivel egy
-- gyerek–elem párosra (UNIQUE child_id, item_id, item_type) csak egy sor
-- létezhet, az idegen sor a valódi tulajdonos MINDEN kör végi feltöltését
-- elbuktatta (egyetlen kérésben megy fel az összes rekord): a gyerek haladása
-- onnantól nem került a felhőbe. Véletlenül a PIN-visszaállítás régi
-- fiókváltós hibája hozhatott létre ilyen sort (azóta javítva).
--
-- MIT CSINÁL:
--  1. a meglévő idegen sorokat a gyerek valódi tulajdonosának adja át (nem
--     törli — ütközés nem lehet, a gyerek–elem páros egyedi), így a feltöltése
--     újra működik, és a haladás sem vész el;
--  2. az írási és módosítási szabályt szigorítja: a sor csak akkor írható, ha
--     a felhasználó a saját nevére ír ÉS a gyerek is az övé. Az olvasás és a
--     törlés szabálya változatlan;
--  3. a végén ellenőrzi, hogy nem maradt-e más írási szabály a táblán (a
--     megengedő szabályok „vagy" kapcsolatban állnak, egy lazább maradék a
--     szigorítást hatástalanítaná). Ha maradt, hibát dob, és az EGÉSZ migráció
--     visszagörgetődik — semmi nem változik.
--
-- Visszavonás (az eredeti szabályok visszaállítása):
--   DROP POLICY "mastery_records: csak saját gyerekre írható" ON public.mastery_records;
--   DROP POLICY "mastery_records: csak saját gyerekre módosítható" ON public.mastery_records;
--   CREATE POLICY "mastery_records: csak saját adatok írhatók" ON public.mastery_records
--     FOR INSERT WITH CHECK (auth.uid() = user_id);
--   CREATE POLICY "mastery_records: csak saját adatok módosíthatók" ON public.mastery_records
--     FOR UPDATE USING (auth.uid() = user_id);

BEGIN;

-- 1. Meglévő idegen sorok átadása a gyerek valódi tulajdonosának
UPDATE public.mastery_records m
   SET user_id = c.user_id
  FROM public.child_profiles c
 WHERE c.id = m.child_id
   AND m.user_id <> c.user_id;

-- 2. Szigorúbb írási és módosítási szabály
DROP POLICY IF EXISTS "mastery_records: csak saját adatok írhatók" ON public.mastery_records;
DROP POLICY IF EXISTS "mastery_records: csak saját adatok módosíthatók" ON public.mastery_records;
DROP POLICY IF EXISTS "mastery_records: csak saját gyerekre írható" ON public.mastery_records;
DROP POLICY IF EXISTS "mastery_records: csak saját gyerekre módosítható" ON public.mastery_records;

CREATE POLICY "mastery_records: csak saját gyerekre írható" ON public.mastery_records
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.child_profiles c
       WHERE c.id = mastery_records.child_id
         AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "mastery_records: csak saját gyerekre módosítható" ON public.mastery_records
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.child_profiles c
       WHERE c.id = mastery_records.child_id
         AND c.user_id = (SELECT auth.uid())
    )
  );

-- 3. Önellenőrzés: más írási szabály nem maradhatott a táblán
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
     WHERE schemaname = 'public'
       AND tablename = 'mastery_records'
       AND cmd IN ('INSERT', 'UPDATE', 'ALL')
       AND policyname NOT IN (
         'mastery_records: csak saját gyerekre írható',
         'mastery_records: csak saját gyerekre módosítható'
       )
  ) THEN
    RAISE EXCEPTION 'Váratlan írási szabály van a mastery_records táblán — a migráció visszagörgetve, semmi nem változott. Listázd: SELECT policyname, cmd FROM pg_policies WHERE tablename = ''mastery_records'';';
  END IF;
END $$;

COMMIT;
