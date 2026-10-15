// A statisztika számítása a nyers sorokból. Tiszta függvény: se Supabase, se
// Next függősége nincs, így szintetikus adaton is ellenőrizhető.
//
// Amit az adat NEM tud (és ezért itt sem számolunk): a mastery_records
// gyerek × elem PILLANATKÉP, előzmény nélkül. Napi aktivitás, megtartás,
// körszám, feladattípusonkénti pontosság ebből nem számolható — ehhez
// eseménynapló kell (practice_sessions / exercise_attempts / phase_events).

import { classifyItem, describeItem, MAX_PHASE, type ClassifiedItem, type SentenceInfo } from './items';
import type {
  CategoryStatus,
  CategorySummary,
  DailyPoint,
  FunnelStep,
  ItemCategory,
  ItemStat,
  MasteryStatus,
  PhasePoint,
  QualityCheck,
  RecencyBuckets,
  StatsData,
  StatsPeriod,
} from './types';

export interface MasteryRow {
  child_id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  status: string;
  correct_count: number;
  incorrect_count: number;
  sessions: number;
  last_practiced: string;
  recent_results: string | null;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  current_phase: number;
  created_at: string;
}

export interface UserRow {
  id: string;
  created_at: string;
}

export interface RawStatsInput {
  mastery: MasteryRow[];
  /** A tábla pontos sorszáma — ezzel ellenőrizzük, hogy minden sor beolvasódott-e */
  masteryExactCount: number | null;
  profiles: ProfileRow[];
  users: UserRow[];
  internalUserIds: Set<string>;
  sentences: Map<string, SentenceInfo>;
  includeInternal: boolean;
  period: StatsPeriod;
  now: Date;
}

/** Összesen nézetben a napi sorozat legfeljebb ennyi napra nyúlik vissza */
const MAX_SERIES_DAYS = 730;

export const CATEGORY_ORDER: ItemCategory[] = ['grapheme', 'syllable', 'word', 'sentence', 'comprehension'];
const STATUSES: MasteryStatus[] = ['new', 'learning', 'practicing', 'stable', 'needs_review'];

// ── Idő: budapesti naptári napok ────────────────────────────────────────────
// A napokat egész számú indexként kezeljük (UTC éjfél / nap), így a téli-nyári
// időszámítás váltása nem csúsztatja el a sorozatot.

const DAY_MS = 86_400_000;
const BUDAPEST_DAY = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Budapest',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const budapestDayIndex = (date: Date): number => {
  const [y, m, d] = BUDAPEST_DAY.format(date).split('-').map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
};

const dayKey = (index: number): string => new Date(index * DAY_MS).toISOString().slice(0, 10);

// ── Kézi szintugrás seed-rekordjai ──────────────────────────────────────────
// A mobil seedMasteryForGraphemes a szülő által átugrott betűket „beérettként"
// rögzíti: 10 helyes, 0 hibás, minSessions (6) kör, teli ablak. Ez nem valódi
// gyakorlás, ezért a pontosságból, a válaszszámból és az aktivitásból kimarad.
export const isSeedRow = (r: MasteryRow): boolean =>
  r.item_type === 'grapheme' &&
  r.status === 'stable' &&
  r.correct_count === 10 &&
  r.incorrect_count === 0 &&
  r.sessions === 6 &&
  r.recent_results === '111111';

// ── Statisztikai segédek ────────────────────────────────────────────────────

/** 95%-os Wilson-intervallum: kevés válasznál széles, így a véletlen 0% nem kerül a lista élére. */
export const wilsonInterval = (correct: number, n: number): [number, number] | null => {
  if (n <= 0) return null;
  const z = 1.96;
  const z2 = z * z;
  const p = correct / n;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
};

const ratio = (part: number, whole: number): number | null => (whole > 0 ? part / whole : null);

const countOnes = (s: string): number => {
  let n = 0;
  for (const ch of s) if (ch === '1') n += 1;
  return n;
};

// ── Fő számítás ─────────────────────────────────────────────────────────────
//
// Az időszak két populációt szűr (lásd StatsTotals):
//  - ÚJ: a létrehozás napja esik az időszakba (fiók, profil) — pontos;
//  - AKTÍV: a gyakorlás napja esik az időszakba. A rekord csak az UTOLSÓ
//    gyakorlás napját őrzi, de az „volt-e gyakorlás az időszakban" kérdésre ez
//    is pontos válasz, mert az időszak mindig a mai napig tart.
// A helyes/hibás számlálók viszont élettartamra szólnak: egy elem válaszai nem
// bonthatók szét időszakra. Ezért az elemek pontossága „az időszakban gyakorolt
// elemek élettartam-pontossága", a válaszszám pedig mindig összesen.

interface ChildAgg {
  correct: number;
  answers: number;
  recentOnes: number;
  recentLen: number;
  last: number;
}

export const computeStats = (input: RawStatsInput): StatsData => {
  const { internalUserIds, includeInternal, sentences, period } = input;
  const today = budapestDayIndex(input.now);
  const dayOf = (iso: string) => budapestDayIndex(new Date(iso));
  const daysAgo = (iso: string) => today - dayOf(iso);
  // A mai nap is benne van: a 7 napos időszak = ma + az előző 6 nap.
  const inWindow = (day: number) => period === 'all' || today - day < period;
  const inPrevWindow = (day: number) => period !== 'all' && today - day >= period && today - day < 2 * period;
  const inScope = (userId: string) => includeInternal || !internalUserIds.has(userId);

  const users = input.users.filter(u => inScope(u.id));
  const profiles = input.profiles.filter(p => inScope(p.user_id));
  const rows = input.mastery.filter(r => inScope(r.user_id) && !isSeedRow(r));
  const windowRows = rows.filter(r => inWindow(dayOf(r.last_practiced)));

  // ── Gyerekek: az utolsó gyakorlás napja, a teljes előzményből ─────────────
  const lastDayByChild = new Map<string, number>();
  for (const r of rows) {
    const d = dayOf(r.last_practiced);
    const prev = lastDayByChild.get(r.child_id);
    if (prev === undefined || d > prev) lastDayByChild.set(r.child_id, d);
  }
  const practiced = (childId: string) => lastDayByChild.has(childId);
  const activeInWindow = (childId: string) => {
    const d = lastDayByChild.get(childId);
    return d !== undefined && inWindow(d);
  };

  // ── Új: az időszakban regisztrált fiókok és létrehozott profilok ──────────
  const cohortUsers = users.filter(u => inWindow(dayOf(u.created_at)));
  const cohortProfiles = profiles.filter(p => inWindow(dayOf(p.created_at)));

  const profilesByUser = new Map<string, ProfileRow[]>();
  for (const p of profiles) profilesByUser.set(p.user_id, [...(profilesByUser.get(p.user_id) ?? []), p]);
  let withProfile = 0;
  let withPractice = 0;
  let withAdvance = 0;
  for (const u of cohortUsers) {
    const own = profilesByUser.get(u.id) ?? [];
    if (own.length === 0) continue;
    withProfile += 1;
    const practicing = own.filter(p => practiced(p.id));
    if (practicing.length === 0) continue;
    withPractice += 1;
    if (practicing.some(p => p.current_phase >= 2)) withAdvance += 1;
  }

  const funnel: FunnelStep[] = [
    {
      label: 'Regisztrált fiók',
      value: cohortUsers.length,
      hint: period === 'all' ? 'Minden fiók.' : 'Az időszakban regisztrált fiókok.',
    },
    { label: 'Létrehozott gyerekprofilt', value: withProfile, hint: 'Legalább egy gyerekprofil tartozik a fiókhoz.' },
    { label: 'Gyereke gyakorolt', value: withPractice, hint: 'Legalább egy gyereknek van valódi (nem seedelt) gyakorlási rekordja.' },
    {
      label: 'Gyereke szintet lépett',
      value: withAdvance,
      hint: 'Egy gyakorló gyerek a 2. fázisban vagy feljebb tart (szülői kézi léptetéssel is).',
    },
  ];

  // ── Napi sorozat (regisztráció, új profil) ────────────────────────────────
  let firstDay = today - ((period === 'all' ? MAX_SERIES_DAYS : period) - 1);
  if (period === 'all') {
    const created = [...users.map(u => dayOf(u.created_at)), ...profiles.map(p => dayOf(p.created_at))];
    if (created.length > 0) firstDay = Math.max(firstDay, Math.min(...created));
    else firstDay = today;
  }
  const signupsByDay = new Map<number, number>();
  const profilesByDay = new Map<number, number>();
  for (const u of users) {
    const d = dayOf(u.created_at);
    signupsByDay.set(d, (signupsByDay.get(d) ?? 0) + 1);
  }
  for (const p of profiles) {
    const d = dayOf(p.created_at);
    profilesByDay.set(d, (profilesByDay.get(d) ?? 0) + 1);
  }
  const daily: DailyPoint[] = [];
  for (let d = firstDay; d <= today; d++) {
    daily.push({ date: dayKey(d), signups: signupsByDay.get(d) ?? 0, profiles: profilesByDay.get(d) ?? 0 });
  }

  // ── Utolsó gyakorlás: az időszakban létrehozott profilok ──────────────────
  const recency: RecencyBuckets = { last7: 0, days8to30: 0, over30: 0, never: 0 };
  for (const p of cohortProfiles) {
    const d = lastDayByChild.get(p.id);
    if (d === undefined) recency.never += 1;
    else if (today - d < 7) recency.last7 += 1;
    else if (today - d < 30) recency.days8to30 += 1;
    else recency.over30 += 1;
  }

  // ── Fázis-eloszlás: minden profil, az időszakban aktív / nem aktív ────────
  const maxPhase = Math.max(MAX_PHASE, ...profiles.map(p => p.current_phase));
  const phases: PhasePoint[] = Array.from({ length: maxPhase }, (_, i) => ({ phase: i + 1, active: 0, inactive: 0 }));
  for (const p of profiles) {
    const slot = phases[p.current_phase - 1];
    if (!slot) continue;
    if (activeInWindow(p.id)) slot.active += 1;
    else slot.inactive += 1;
  }

  // Ismétlésre szoruló: az időszakban aktív gyerek, akinek bármelyik eleme
  // MOST „ismétlés kell” státuszú (akkor is, ha azt az elemet régebben gyakorolta).
  const childrenNeedingReview = new Set<string>();
  let answers = 0;
  for (const r of rows) {
    answers += r.correct_count + r.incorrect_count;
    if (r.status === 'needs_review' && activeInWindow(r.child_id)) childrenNeedingReview.add(r.child_id);
  }

  // ── Elemek: az időszakban gyakorolt rekordok, gyerekenként összevonva ─────
  // Gyerekenként vonunk össze, mert a régi és az új szó-id ugyanannál a
  // gyereknél két sor lehet — a gyerekszám így sem duplázódik.
  const itemAggs = new Map<string, { item: ClassifiedItem; children: Map<string, ChildAgg> }>();
  const statusMap = new Map<ItemCategory, CategoryStatus>(
    CATEGORY_ORDER.map(category => [
      category,
      { category, new: 0, learning: 0, practicing: 0, stable: 0, needs_review: 0, total: 0 },
    ]),
  );
  let gCorrect = 0;
  let gAnswers = 0;
  let gRecentOnes = 0;
  let gRecentLen = 0;

  for (const r of windowRows) {
    const item = classifyItem(r.item_type, r.item_id);
    if (!item) continue;
    const n = r.correct_count + r.incorrect_count;

    if ((STATUSES as string[]).includes(r.status)) {
      const s = statusMap.get(item.category)!;
      s[r.status as MasteryStatus] += 1;
      s.total += 1;
    }

    const recent = r.recent_results ?? '';
    if (item.category === 'grapheme') {
      gCorrect += r.correct_count;
      gAnswers += n;
      gRecentOnes += countOnes(recent);
      gRecentLen += recent.length;
    }

    const key = `${item.category}:${item.id}`;
    let agg = itemAggs.get(key);
    if (!agg) {
      agg = { item, children: new Map() };
      itemAggs.set(key, agg);
    }
    const t = Date.parse(r.last_practiced);
    const c = agg.children.get(r.child_id);
    if (c) {
      c.correct += r.correct_count;
      c.answers += n;
      // Két sor ugyanannál a gyereknél (régi + új id): a frissebb ablak számít.
      if (t > c.last) {
        c.recentOnes = countOnes(recent);
        c.recentLen = recent.length;
        c.last = t;
      }
    } else {
      agg.children.set(r.child_id, {
        correct: r.correct_count,
        answers: n,
        recentOnes: countOnes(recent),
        recentLen: recent.length,
        last: t,
      });
    }
  }

  const items: ItemStat[] = [];
  const categoryAcc = new Map<ItemCategory, { items: number; children: Set<string>; correct: number; answers: number; recentOnes: number; recentLen: number }>(
    CATEGORY_ORDER.map(c => [c, { items: 0, children: new Set(), correct: 0, answers: 0, recentOnes: 0, recentLen: 0 }]),
  );
  for (const [key, { item, children }] of itemAggs) {
    let correct = 0;
    let n = 0;
    let recentOnes = 0;
    let recentLen = 0;
    let childAccSum = 0;
    let childAccCount = 0;
    let last = -Infinity;
    const cat = categoryAcc.get(item.category)!;
    for (const [childId, c] of children) {
      correct += c.correct;
      n += c.answers;
      recentOnes += c.recentOnes;
      recentLen += c.recentLen;
      if (c.answers > 0) {
        childAccSum += c.correct / c.answers;
        childAccCount += 1;
      }
      last = Math.max(last, c.last);
      cat.children.add(childId);
    }
    cat.items += 1;
    cat.correct += correct;
    cat.answers += n;
    cat.recentOnes += recentOnes;
    cat.recentLen += recentLen;

    const ci = wilsonInterval(correct, n);
    const meta = describeItem(item, sentences);
    items.push({
      key,
      id: item.id,
      category: item.category,
      label: meta.label,
      note: meta.note,
      phase: meta.phase,
      order: meta.order,
      children: children.size,
      correct,
      answers: n,
      accuracy: ratio(correct, n),
      childMeanAccuracy: childAccCount > 0 ? childAccSum / childAccCount : null,
      ciLow: ci?.[0] ?? null,
      ciHigh: ci?.[1] ?? null,
      recentAccuracy: ratio(recentOnes, recentLen),
      lastPracticedDaysAgo: today - budapestDayIndex(new Date(last)),
    });
  }
  items.sort((a, b) => b.answers - a.answers);

  const categories: CategorySummary[] = CATEGORY_ORDER.map(category => {
    const c = categoryAcc.get(category)!;
    return {
      category,
      items: c.items,
      children: c.children.size,
      answers: c.answers,
      accuracy: ratio(c.correct, c.answers),
      recentAccuracy: ratio(c.recentOnes, c.recentLen),
    };
  });

  const countPrev = (dates: string[]) => (period === 'all' ? null : dates.filter(d => inPrevWindow(dayOf(d))).length);

  return {
    generatedAt: input.now.toISOString(),
    period,
    includeInternal,
    internal: {
      accounts: input.users.filter(u => internalUserIds.has(u.id)).length,
      profiles: input.profiles.filter(p => internalUserIds.has(p.user_id)).length,
      records: input.mastery.filter(r => internalUserIds.has(r.user_id)).length,
    },
    totals: {
      accounts: cohortUsers.length,
      accountsPrev: countPrev(users.map(u => u.created_at)),
      accountsTotal: users.length,
      accountsWithProfile: withProfile,
      profiles: cohortProfiles.length,
      profilesPrev: countPrev(profiles.map(p => p.created_at)),
      profilesTotal: profiles.length,
      practicedProfiles: cohortProfiles.filter(p => practiced(p.id)).length,
      activeChildren: profiles.filter(p => activeInWindow(p.id)).length,
      practicingTotal: profiles.filter(p => practiced(p.id)).length,
      answers,
      childrenNeedingReview: childrenNeedingReview.size,
      graphemeRecentAccuracy: ratio(gRecentOnes, gRecentLen),
      graphemeLifetimeAccuracy: ratio(gCorrect, gAnswers),
    },
    funnel,
    daily,
    recency,
    phases,
    statusByCategory: CATEGORY_ORDER.map(c => statusMap.get(c)!),
    categories,
    items,
    quality: computeQuality(input, daysAgo),
  };
};

// ── Adatminőség — mindig a TELJES adatbázison, a szűrőtől függetlenül ──────

const plural = (n: number, word: string) => `${n.toLocaleString('hu-HU')} ${word}`;

const computeQuality = (input: RawStatsInput, daysAgo: (iso: string) => number): QualityCheck[] => {
  const { mastery, profiles, users, sentences, internalUserIds } = input;
  const checks: QualityCheck[] = [];

  const complete = input.masteryExactCount === null || input.masteryExactCount === mastery.length;
  checks.push({
    id: 'completeness',
    label: 'Beolvasott rekordok',
    value: `${mastery.length.toLocaleString('hu-HU')} / ${(input.masteryExactCount ?? mastery.length).toLocaleString('hu-HU')}`,
    level: complete ? 'ok' : 'warning',
    detail: complete
      ? 'A mastery_records minden sora bekerült a számításba (lapozott lekérés).'
      : 'A beolvasott sorok száma eltér a tábla sorszámától — a lekérés közben változhatott az adat, frissíts.',
  });

  const internalProfiles = profiles.filter(p => internalUserIds.has(p.user_id)).length;
  const internalRecords = mastery.filter(r => internalUserIds.has(r.user_id)).length;
  checks.push({
    id: 'internal',
    label: 'Belső fiókok (admin, teszt, demo)',
    value: `${plural(internalUserIds.size, 'fiók')} · ${plural(internalProfiles, 'profil')} · ${plural(internalRecords, 'rekord')}`,
    level: 'info',
    detail:
      'Az ADMIN_EMAILS és a STATS_EXCLUDED_EMAILS környezeti változóban felsorolt fiókok. ' +
      (input.includeInternal ? 'Most BENNE vannak a statisztikában.' : 'Most ki vannak zárva a statisztikából.'),
  });

  const seeds = mastery.filter(isSeedRow);
  checks.push({
    id: 'seed',
    label: 'Kézi szintugrás seed-rekordjai',
    value: `${plural(seeds.length, 'rekord')} · ${plural(new Set(seeds.map(r => r.child_id)).size, 'gyerek')}`,
    level: 'info',
    detail:
      'A szülői szintugrás az átugrott betűket „beérettként" rögzíti (10 helyes, 0 hibás). Ezek kimaradnak a pontosságból, ' +
      'a válaszszámból és az aktivitásból. Ha a gyerek később gyakorolja a betűt, a sor már nem ismerhető fel.',
  });

  const classified = mastery.map(r => ({ r, item: classifyItem(r.item_type, r.item_id) }));
  const legacy = classified.filter(x => x.item?.legacyWordId);
  checks.push({
    id: 'legacy-word-id',
    label: 'Régi formátumú szóazonosítók',
    value: `${plural(legacy.length, 'rekord')} · ${plural(new Set(legacy.map(x => x.item!.id)).size, 'szó')}`,
    level: legacy.length > 0 ? 'warning' : 'ok',
    detail:
      'Régebbi app-verziók előtag nélkül mentették a szavakat („kuka" a „word_kuka" helyett). A statisztika összevonja ' +
      'a kettőt; az adatbázisban egy takarító migráció rendezné.',
  });

  const clapping = classified.filter(x => x.item?.clappingWord);
  checks.push({
    id: 'clapping',
    label: 'Szóazonosító szótag típusban',
    value: plural(clapping.length, 'rekord'),
    level: 'info',
    detail: 'A szótagtapsolás a szó azonosítóját írja „syllable" típusba — szándékos, a Szótag kategóriában jelenik meg.',
  });

  const unknownIds = new Set<string>();
  for (const { r, item } of classified) {
    const missingSentence =
      (item?.category === 'sentence' || item?.category === 'comprehension') && !sentences.has(item.id);
    if (!item || item.unknown || missingSentence) unknownIds.add(`${r.item_type}:${r.item_id}`);
  }
  const unknownRows = classified.filter(({ r }) => unknownIds.has(`${r.item_type}:${r.item_id}`)).length;
  checks.push({
    id: 'unknown',
    label: 'Ismeretlen azonosítók',
    value: plural(unknownRows, 'rekord'),
    level: unknownRows > 0 ? 'warning' : 'ok',
    detail:
      unknownRows > 0
        ? `Nem azonosítható tananyag-elem (pl. törölt mondat). Minták: ${[...unknownIds].slice(0, 6).join(', ')}`
        : 'Minden rekord ismert betűre, szótagra, szóra vagy mondatra mutat.',
  });

  const statuses = new Set<string>(STATUSES);
  const oddStatus = mastery.filter(r => !statuses.has(r.status)).length;
  checks.push({
    id: 'status',
    label: 'Váratlan státuszértékek',
    value: plural(oddStatus, 'rekord'),
    level: oddStatus > 0 ? 'warning' : 'ok',
    detail: 'A mobilapp öt státuszt ír (új, tanulás, gyakorlás, stabil, ismétlés kell); a „locked" sosem fordul elő.',
  });

  const noWindow = mastery.filter(r => !r.recent_results).length;
  checks.push({
    id: 'window',
    label: 'Friss válaszablak nélküli rekordok',
    value: plural(noWindow, 'rekord'),
    level: 'info',
    detail: 'A recent_results oszlop később került be; ezek a sorok a „friss pontosságba" nem számítanak bele.',
  });

  const childrenWithRecords = new Set(mastery.filter(r => !isSeedRow(r)).map(r => r.child_id));
  const neverPracticed = profiles.filter(p => !childrenWithRecords.has(p.id)).length;
  checks.push({
    id: 'never-practiced',
    label: 'Soha nem gyakorolt gyerekprofilok',
    value: plural(neverPracticed, 'profil'),
    level: 'info',
    detail: 'A fázis-eloszlásban külön színnel jelennek meg, hogy ne torzítsák az 1. fázist.',
  });

  const usersWithProfile = new Set(profiles.map(p => p.user_id));
  checks.push({
    id: 'no-profile',
    label: 'Gyerekprofil nélküli fiókok',
    value: plural(users.filter(u => !usersWithProfile.has(u.id)).length, 'fiók'),
    level: 'info',
    detail: 'Regisztráltak, de még nem hoztak létre gyerekprofilt — a tölcsér első lépcsőjén akadtak el.',
  });

  const future = mastery.filter(r => daysAgo(r.last_practiced) < 0).length;
  if (future > 0) {
    checks.push({
      id: 'future',
      label: 'Jövőbeli gyakorlási dátum',
      value: plural(future, 'rekord'),
      level: 'warning',
      detail: 'A last_practiced a mai napnál későbbi — rosszul beállított készülékóra okozhatja.',
    });
  }

  checks.push({
    id: 'untracked',
    label: 'Nem rögzített tevékenység',
    value: '—',
    level: 'info',
    detail:
      'A szabad gyakorlás, a vonalkövetés és a szótag-memória nem ír rekordot, és a körök száma, időtartama sincs tárolva. ' +
      'Ezekhez eseménynapló kell (Megtartás fül).',
  });

  return checks;
};
