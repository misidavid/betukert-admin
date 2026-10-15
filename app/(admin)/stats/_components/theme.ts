import type { ItemCategory, MasteryStatus, StatsPeriod } from '../../../../lib/stats/types';

// Színtokenek. A diagramszíneket a dataviz-validátor ellenőrizte fehér
// felületen: az ORDINAL egyszínű, monoton sorrendi skála (a legvilágosabb lépcső
// is ≥ 2:1), az ACCENT + SERIES_2 pár pedig színtévesztéssel is elkülönül.
export const C = {
  ink: '#1D211C',
  ink2: '#4F534B',
  muted: '#858A80',
  grid: '#ECE8DE',
  axis: '#CFC9BA',
  border: 'rgba(29, 33, 28, 0.10)',
  surface: '#FFFFFF',
  subtle: '#F6F3EC',
  accent: '#2F7A45',
  accentSoft: '#E4F0E6',
  series2: '#2A78D6',
  neutralFill: '#D9D4C7',
  critical: '#D03B3B',
  criticalSoft: '#FBE9E7',
  warning: '#B7791F',
  warningSoft: '#FDF3DC',
  info: '#4F6B8A',
  infoSoft: '#EAF0F6',
  goodText: '#1F6B35',
} as const;

/** Sorrendi skála világostól sötétig (Új → Stabil, illetve régi → friss) */
export const ORDINAL = ['#86BA92', '#559C69', '#2F7A45', '#1B4D2B'] as const;

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  grapheme: 'Betű',
  syllable: 'Szótag',
  word: 'Szó',
  sentence: 'Mondat',
  comprehension: 'Szövegértés',
};

export const STATUS_ORDER: MasteryStatus[] = ['new', 'learning', 'practicing', 'stable', 'needs_review'];

export const STATUS_LABELS: Record<MasteryStatus, string> = {
  new: 'Új',
  learning: 'Tanulás',
  practicing: 'Gyakorlás',
  stable: 'Stabil',
  needs_review: 'Ismétlés kell',
};

export const STATUS_COLORS: Record<MasteryStatus, string> = {
  new: ORDINAL[0],
  learning: ORDINAL[1],
  practicing: ORDINAL[2],
  stable: ORDINAL[3],
  needs_review: C.critical,
};

// ── Formázók ────────────────────────────────────────────────────────────────

const NUM = new Intl.NumberFormat('hu-HU');

export const fmtNum = (n: number): string => NUM.format(n);

export const fmtPct = (ratio: number | null | undefined, digits = 0): string =>
  ratio === null || ratio === undefined ? '–' : `${(ratio * 100).toFixed(digits).replace('.', ',')}%`;

export const fmtDaysAgo = (days: number): string => {
  if (days <= 0) return 'ma';
  if (days === 1) return 'tegnap';
  return `${days} napja`;
};

/** 'YYYY-MM-DD' → 'MM.DD.' */
export const fmtShortDate = (iso: string): string => `${iso.slice(5, 7)}.${iso.slice(8, 10)}.`;

/** 'YYYY-MM-DD' → 'YYYY. MM. DD.' */
export const fmtLongDate = (iso: string): string => `${iso.slice(0, 4)}. ${iso.slice(5, 7)}. ${iso.slice(8, 10)}.`;

// ── Időszak ─────────────────────────────────────────────────────────────────

/** Rövid címke a választóhoz: „7 nap" / „Összesen" */
export const periodOption = (p: StatsPeriod): string => (p === 'all' ? 'Összesen' : `${p} nap`);

/** Kártya-sarok: „utolsó 7 nap" / „összesen" */
export const periodScope = (p: StatsPeriod): string => (p === 'all' ? 'összesen' : `utolsó ${p} nap`);

/** Mondatba: „az utolsó 7 napban" / „eddig összesen" */
export const periodPhrase = (p: StatsPeriod): string => (p === 'all' ? 'eddig összesen' : `az utolsó ${p} napban`);

/** Mondat elejére: „Az utolsó 7 napban" / „Eddig összesen" */
export const periodPhraseStart = (p: StatsPeriod): string => (p === 'all' ? 'Eddig összesen' : `Az utolsó ${p} napban`);
