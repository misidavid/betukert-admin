// A statisztika oldal adatszerződése — a szerver (getStatsAction) számolja,
// a kliens csak megjeleníti. Kliensből is importálható: típusok és konstansok.

export type ItemCategory = 'grapheme' | 'syllable' | 'word' | 'sentence' | 'comprehension';

// A mobilapp által írt státuszok. A 'locked' értéket az app sosem írja.
export type MasteryStatus = 'new' | 'learning' | 'practicing' | 'stable' | 'needs_review';

// Egy elem az időszakban gyakorolt gyerek × elem rekordokból. A helyes/hibás
// számlálók élettartamra szólnak: időszakos nézetben is ezeknek a gyerekeknek
// az ÖSSZES válaszát tartalmazzák az adott elemre.
export interface ItemStat {
  /** `${category}:${id}` — egyedi kulcs a listában */
  key: string;
  /** Normalizált azonosító (a régi, előtag nélküli szó-id `word_<szó>` alakra hozva) */
  id: string;
  category: ItemCategory;
  /** Olvasható név: betű, szó, mondat szövege */
  label: string;
  /** Kiegészítő megjegyzés, pl. „szótagtapsolás” */
  note: string | null;
  phase: number | null;
  /** Betűknél a tanmenetbeli sorrend (GRAPHEMES index), máshol null */
  order: number | null;
  children: number;
  correct: number;
  answers: number;
  /** Összes válaszból számolt pontosság (0–1) */
  accuracy: number | null;
  /** Gyerekenként számolt pontosságok átlaga (0–1) — a sokat gyakorlók nem nyomják el a többit */
  childMeanAccuracy: number | null;
  /** 95%-os Wilson-intervallum az összes válaszból számolt pontosságra */
  ciLow: number | null;
  ciHigh: number | null;
  /** A friss válaszablakokból (recent_results) számolt pontosság (0–1) */
  recentAccuracy: number | null;
  /** Hány naptári napja gyakorolta utoljára bármelyik gyerek (budapesti idő) */
  lastPracticedDaysAgo: number;
}

export interface DailyPoint {
  /** YYYY-MM-DD, budapesti naptári nap */
  date: string;
  signups: number;
  profiles: number;
}

export interface PhasePoint {
  phase: number;
  /** Az időszakban gyakorolt (összesen: valaha gyakorolt) */
  active: number;
  /** Az időszakban nem gyakorolt (összesen: soha nem gyakorolt) */
  inactive: number;
}

export type StatusCounts = Record<MasteryStatus, number>;

export interface CategoryStatus extends StatusCounts {
  category: ItemCategory;
  total: number;
}

export interface CategorySummary {
  category: ItemCategory;
  items: number;
  children: number;
  /** Élettartam-számlálók — időszakra nem bonthatók */
  answers: number;
  accuracy: number | null;
  /** A friss válaszablakokból — az időszakban gyakorolt rekordokra */
  recentAccuracy: number | null;
}

export interface FunnelStep {
  label: string;
  value: number;
  hint: string;
}

export type QualityLevel = 'ok' | 'info' | 'warning';

export interface QualityCheck {
  id: string;
  label: string;
  value: string;
  level: QualityLevel;
  detail: string;
}

/** Időablak napokban, vagy a teljes eddigi időszak */
export type StatsPeriod = 7 | 30 | 90 | 'all';

export const STATS_PERIODS: StatsPeriod[] = [7, 30, 90, 'all'];

// Két populáció, két kérdés:
//  - ÚJ (kohorsz): az időszakban regisztrált fiókok / létrehozott profilok —
//    növekedés, aktiválás;
//  - AKTÍV: akik / amik az időszakban gyakoroltak — használat, tanulás.
// Összesen nézetben mindkettő a teljes eddigi időszak.
export interface StatsTotals {
  /** Az időszakban regisztrált fiókok */
  accounts: number;
  /** Az előző, ugyanilyen hosszú időszakban regisztrált fiókok (összesen nézetben null) */
  accountsPrev: number | null;
  accountsTotal: number;
  /** Az időszakban regisztrált fiókok közül, amelyikhez gyerekprofil tartozik */
  accountsWithProfile: number;
  /** Az időszakban létrehozott gyerekprofilok */
  profiles: number;
  profilesPrev: number | null;
  profilesTotal: number;
  /** Az időszakban létrehozott profilok közül, amelyik már gyakorolt */
  practicedProfiles: number;
  /** Az időszakban gyakorló gyerekek */
  activeChildren: number;
  /** Valaha gyakorolt gyerekek */
  practicingTotal: number;
  /** Rögzített válaszok — élettartam-számláló, MINDIG összesen (időszakra nem bontható) */
  answers: number;
  /** Az időszakban gyakorló gyerekek közül, akiknek van „ismétlés kell” eleme */
  childrenNeedingReview: number;
  /** Az időszakban gyakorolt betűrekordokból */
  graphemeRecentAccuracy: number | null;
  graphemeLifetimeAccuracy: number | null;
}

/** Az időszakban létrehozott profilok megoszlása az utolsó gyakorlás szerint */
export interface RecencyBuckets {
  last7: number;
  days8to30: number;
  over30: number;
  never: number;
}

export interface StatsData {
  generatedAt: string;
  period: StatsPeriod;
  includeInternal: boolean;
  internal: { accounts: number; profiles: number; records: number };
  totals: StatsTotals;
  funnel: FunnelStep[];
  /** Az időszak napjai a legrégebbitől a maiig (összesen nézetben az első regisztrációtól) */
  daily: DailyPoint[];
  recency: RecencyBuckets;
  phases: PhasePoint[];
  statusByCategory: CategoryStatus[];
  categories: CategorySummary[];
  items: ItemStat[];
  quality: QualityCheck[];
}

export type StatsResponse = { ok: true; data: StatsData } | { ok: false; error: string };
