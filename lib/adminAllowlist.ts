// Admin e-mail allowlist — a mobilapp és az admin ugyanazt a Supabase
// projektet használja, ezért a session megléte önmagában nem jogosultság:
// csak az ADMIN_EMAILS env változóban felsorolt fiókok érhetik el az admint.
// Ha a változó nincs beállítva, senki sem admin (fail closed).
const parseAllowlist = (): Set<string> =>
  new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)
  );

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return parseAllowlist().has(email.trim().toLowerCase());
};
