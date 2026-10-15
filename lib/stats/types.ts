// A statisztika oldal adatszerződése — a szerver (getStatsAction) számolja,
// a kliens csak megjeleníti. Kliensből is importálható: csak típusok.

export type ItemCategory = 'grapheme' | 'syllable' | 'word' | 'sentence' | 'comprehension';

// A mobilapp által írt státuszok. A 'locked' értéket az app sosem írja.
export type MasteryStatus = 'new' | 'learning' | 'practicing' | 'stable' | 'needs_review';

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
  practiced: number;
  notPracticed: number;
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
  answers: number;
  accuracy: number | null;
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

export interface StatsTotals {
  accounts: number;
  accountsWithProfile: number;
  profiles: number;
  practicedProfiles: number;
  /** Rögzített válaszok (helyes + hibás), a kézi szintugrás seed-rekordjai nélkül */
  answers: number;
  childrenNeedingReview: number;
  graphemeRecentAccuracy: number | null;
  graphemeLifetimeAccuracy: number | null;
}

export interface StatsData {
  generatedAt: string;
  includeInternal: boolean;
  internal: { accounts: number; profiles: number; records: number };
  totals: StatsTotals;
  funnel: FunnelStep[];
  /** Az utolsó DAILY_DAYS nap, a legrégebbitől a maiig */
  daily: DailyPoint[];
  /** Gyakorló gyerekenként: hány naptári napja gyakorolt utoljára (0 = ma) */
  practiceRecency: number[];
  phases: PhasePoint[];
  statusByCategory: CategoryStatus[];
  categories: CategorySummary[];
  items: ItemStat[];
  quality: QualityCheck[];
}

export type StatsResponse = { ok: true; data: StatsData } | { ok: false; error: string };
