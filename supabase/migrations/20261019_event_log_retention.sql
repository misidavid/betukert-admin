-- Eseménynapló: a feladatonkénti napló 12 hónapos megőrzése
-- Futtasd le a Supabase SQL Editorban, a 20261019_event_log.sql UTÁN.
--
-- MIÉRT: a feladatonkénti sorok (exercise_attempts) a legrészletesebb
-- gyerekadatok. Adattakarékosságból 12 hónap után automatikusan törlődnek — ez
-- szerepel az adatvédelmi tájékoztatóban is. A körök (practice_sessions) és a
-- szintváltások (phase_events) összesített adatok, a fiók törléséig maradnak.
--
-- HOGYAN: a pg_cron naponta egyszer (03:17 UTC) törli a 12 hónapnál régebbi
-- sorokat. Ha a CREATE EXTENSION hibát ad, engedélyezd a pg_cron bővítményt a
-- Dashboard → Database → Extensions oldalon, és futtasd újra.
--
-- Ellenőrzés:   SELECT jobname, schedule, command FROM cron.job;
-- Visszavonás:  SELECT cron.unschedule('exercise-attempts-retention');

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Újrafuttatható: a régi ütemezést előbb eltávolítjuk, hogy ne legyen kettő.
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'exercise-attempts-retention';

SELECT cron.schedule(
  'exercise-attempts-retention',
  '17 3 * * *',
  $$DELETE FROM public.exercise_attempts WHERE answered_at < now() - interval '12 months'$$
);
