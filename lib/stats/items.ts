// A mastery_records elemeinek besorolása és olvasható neve.
//
// A tábla item_type mezője nem elég a besoroláshoz: a mobilapp 'word' típussal
// írja a mondatos feladatokat is (s… = mondatrendezés / mondat–kép, c… =
// szövegértés), a régebbi verziók előtag nélküli szó-id-t is mentettek
// ('kuka' a mai 'word_kuka' helyett), a szótagtapsolás pedig szó-id-t ír
// 'syllable' típusba. Itt egy helyen dől el, melyik sor mi.

import { GRAPHEMES } from '../../shared/curriculum/graphemes';
import { DISPLAY_TO_ID, splitIntoGraphemes, splitNameIntoGraphemes } from '../../shared/curriculum/wordFilter';
import type { ItemCategory } from './types';

export interface ClassifiedItem {
  category: ItemCategory;
  /** Normalizált azonosító — a régi szó-id itt már `word_<szó>` */
  id: string;
  /** Régi, előtag nélküli szó-azonosító volt */
  legacyWordId: boolean;
  /** Szó-azonosító a 'syllable' típusban (szótagtapsolás) */
  clappingWord: boolean;
  /** Nem ismert minta — az adatminőség panel jelzi */
  unknown: boolean;
}

const SENTENCE_ID = /^s\d+$/;
const COMPREHENSION_ID = /^c\d+$/;
const PLAIN_WORD = /^\p{L}+$/u;

// A 99-es „fázis" jelölő: a betű nem része a Meixner-tananyagnak (q, Q, Y).
const OUT_OF_CURRICULUM_PHASE = 99;

const GRAPHEME_BY_ID = new Map(GRAPHEMES.map((g, index) => [g.id, { display: g.display, phase: g.phase, order: index }]));
const PHASE_BY_GRAPHEME_ID = new Map(GRAPHEMES.map(g => [g.id, g.phase]));

/** A tanmenet utolsó fázisa (a tanmeneten kívüli jelölő nélkül) */
export const MAX_PHASE = Math.max(...GRAPHEMES.map(g => g.phase).filter(p => p < OUT_OF_CURRICULUM_PHASE));

const curriculumPhase = (phase: number | null | undefined): number | null =>
  phase === null || phase === undefined || phase >= OUT_OF_CURRICULUM_PHASE ? null : phase;

export const classifyItem = (itemType: string, itemId: string): ClassifiedItem | null => {
  const base = { legacyWordId: false, clappingWord: false, unknown: false };
  switch (itemType) {
    case 'grapheme':
      return { ...base, category: 'grapheme', id: itemId, unknown: !GRAPHEME_BY_ID.has(itemId) };
    case 'syllable':
      return { ...base, category: 'syllable', id: itemId, clappingWord: itemId.startsWith('word_') };
    case 'word':
      if (SENTENCE_ID.test(itemId)) return { ...base, category: 'sentence', id: itemId };
      if (COMPREHENSION_ID.test(itemId)) return { ...base, category: 'comprehension', id: itemId };
      if (itemId.startsWith('word_')) return { ...base, category: 'word', id: itemId };
      if (PLAIN_WORD.test(itemId)) return { ...base, category: 'word', id: `word_${itemId}`, legacyWordId: true };
      return { ...base, category: 'word', id: itemId, unknown: true };
    default:
      return null;
  }
};

const wordPhaseCache = new Map<string, number | null>();

/** A szó fázisa = a legkésőbb tanított betűjének fázisa (mint a mobil szószűrőjében). */
const wordPhase = (text: string): number | null => {
  const cached = wordPhaseCache.get(text);
  if (cached !== undefined) return cached;
  const isName = text[0] !== undefined && text[0] !== text[0].toLowerCase();
  const graphemes = isName ? splitNameIntoGraphemes(text) : splitIntoGraphemes(text);
  let phase: number | null = null;
  for (const g of graphemes) {
    const id = DISPLAY_TO_ID[g];
    const p = id ? PHASE_BY_GRAPHEME_ID.get(id) : undefined;
    if (p === undefined) {
      phase = null;
      break;
    }
    phase = Math.max(phase ?? 0, p);
  }
  wordPhaseCache.set(text, phase);
  return phase;
};

export interface SentenceInfo {
  label: string;
  phase: number;
}

export interface ItemMeta {
  label: string;
  note: string | null;
  phase: number | null;
  order: number | null;
}

export const describeItem = (
  item: ClassifiedItem,
  sentences: Map<string, SentenceInfo>,
): ItemMeta => {
  switch (item.category) {
    case 'grapheme': {
      const g = GRAPHEME_BY_ID.get(item.id);
      return { label: g?.display ?? item.id, note: null, phase: curriculumPhase(g?.phase), order: g?.order ?? null };
    }
    case 'syllable': {
      if (item.clappingWord) {
        const text = item.id.slice('word_'.length);
        return { label: text, note: 'szótagtapsolás', phase: curriculumPhase(wordPhase(text)), order: null };
      }
      return { label: item.id, note: null, phase: curriculumPhase(wordPhase(item.id)), order: null };
    }
    case 'word': {
      if (item.unknown) return { label: item.id, note: 'ismeretlen azonosító', phase: null, order: null };
      const text = item.id.slice('word_'.length);
      return { label: text, note: null, phase: curriculumPhase(wordPhase(text)), order: null };
    }
    case 'sentence':
    case 'comprehension': {
      const s = sentences.get(item.id);
      return { label: s?.label ?? item.id, note: s ? null : 'nincs a bankban', phase: curriculumPhase(s?.phase), order: null };
    }
  }
};
