-- Gyerekprofil beállításainak kulcsonkénti frissítése
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)
-- FONTOS: az ezt használó app-verzió kiadása ELŐTT kell lefuttatni — nélküle
-- a beállítások (PIN, nagybetű, felolvasás, feladattípusok) mentése hibát ad.
--
-- MIÉRT: a mobilapp eddig minden beállítás-mentésnél a TELJES profilt írta
-- (név, szint, ismert betűk, az összes beállítás) az eszköz memóriájában lévő,
-- akár napokkal korábbi állapot szerint. Két eszköznél így egy elavult eszköz
-- visszaírta a másikon közben beállított PIN-t, feladattípusokat, sőt a
-- gyerek korábbi, alacsonyabb szintjét is.
--
-- MIT CSINÁL: a settings JSON-ba CSAK a megadott kulcsokat írja (jsonb ||,
-- felső szintű egyesítés), a szinthez és a többi oszlophoz nem nyúl, és
-- visszaadja a friss profilt.
--
-- JOGOSULTSÁG: SECURITY INVOKER — a hívó jogaival fut, tehát a child_profiles
-- RLS szabályai érvényesek: mindenki csak a saját gyerekprofilját frissítheti
-- (idegen profilra 0 sort ad vissza). Csak bejelentkezett felhasználó hívhatja.
--
-- Visszavonás:
--   DROP FUNCTION IF EXISTS public.patch_child_settings(uuid, jsonb);

CREATE OR REPLACE FUNCTION public.patch_child_settings(p_child_id uuid, p_patch jsonb)
RETURNS SETOF public.child_profiles
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  UPDATE public.child_profiles
     SET settings   = COALESCE(settings, '{}'::jsonb) || p_patch,
         updated_at = now()
   WHERE id = p_child_id
  RETURNING *;
$$;

REVOKE ALL ON FUNCTION public.patch_child_settings(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.patch_child_settings(uuid, jsonb) TO authenticated;
