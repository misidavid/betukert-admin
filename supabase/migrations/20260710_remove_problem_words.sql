-- Problémás szavak törlése a szóbankból (2026-07-10-i tartalmi audit)
-- Futtasd le a Supabase SQL Editorban, majd publikálj az admin felületről!
--
--   kaftan  — elírás (helyesen: kaftán), gyerekszókincsnek idegen
--   ünnepe  — ragozott alak (tőszó-elv), az „ünnep" külön szerepel
--   evet    — archaikus szó (mókus), élő gyerekszókincsben nincs jelen
--   banya   — pejoratív
--   béna    — köznyelvben degradáló jelentésű
--
-- A shared/data/wordbank.ts-ből (mindkét repóban) szintén törölve,
-- így újra-seedelésnél sem kerülnek vissza.

DELETE FROM words WHERE text IN ('kaftan', 'ünnepe', 'evet', 'banya', 'béna');
