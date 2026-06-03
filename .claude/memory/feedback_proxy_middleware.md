---
name: feedback-proxy-middleware
description: A proxy.ts middleware témát ne hozd fel hibának — az auth védelem működik
metadata:
  type: feedback
---

Ne jelezd hibának, hogy `proxy.ts` van `middleware.ts` helyett. Az autentikációs védelem működik: bejelentkezés nélkül a login oldal jelenik meg az admin oldalakon. Ez ismételten előkerült és ismételten hibás megállapítás volt.

**Why:** A felhasználó kétszer is visszautasította ezt mint téves finding-et.

**How to apply:** Ha biztonsági auditot végzel ezen a projekten, hagyd ki a `proxy.ts` / `middleware.ts` névkonvenciót a leletemlistából.
