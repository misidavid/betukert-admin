-- update_updated_at trigger függvény javítása
-- SECURITY DEFINER → SECURITY INVOKER: trigger functionnak nem kell emelt jogosultság
-- REVOKE EXECUTE: a függvényt csak a trigger hívhatja, nem a REST API
-- Futtasd le a Supabase SQL Editorban (https://supabase.com/dashboard → SQL Editor)

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

REVOKE EXECUTE ON FUNCTION update_updated_at() FROM anon, authenticated;
