import { Syllable, Grapheme } from '../types';
import { getVowels, getConsonants } from './graphemes';

// ============================================
// MEIXNER SZÓTAGGENERÁTOR
// Szabály: csak ismert betűkből generál szótagot
// Sorrend: előbb VC (óm, im), aztán CV (ma, mi)
// ============================================

// VC típusú szótagok: magánhangzó + mássalhangzó
// Pl: am, im, óm, av, iv
const generateVCSyllables = (
  vowels: Grapheme[],
  consonants: Grapheme[],
  phase: number
): Syllable[] => {
  const syllables: Syllable[] = [];

  for (const vowel of vowels) {
    for (const consonant of consonants) {
      const text = vowel.display + consonant.display;
      syllables.push({
        id: `vc_${vowel.id}_${consonant.id}`,
        text,
        type: 'VC',
        graphemes: [vowel.id, consonant.id],
        phase: Math.max(vowel.phase, consonant.phase),
      });
    }
  }

  return syllables.filter(s => s.phase <= phase);
};

// CV típusú szótagok: mássalhangzó + magánhangzó
// Pl: ma, mi, mó, sa, si
// FONTOS: ez nehezebb mint a VC — Meixner szerint később jön!
const generateCVSyllables = (
  vowels: Grapheme[],
  consonants: Grapheme[],
  phase: number
): Syllable[] => {
  const syllables: Syllable[] = [];

  for (const consonant of consonants) {
    for (const vowel of vowels) {
      const text = consonant.display + vowel.display;
      syllables.push({
        id: `cv_${consonant.id}_${vowel.id}`,
        text,
        type: 'CV',
        graphemes: [consonant.id, vowel.id],
        phase: Math.max(vowel.phase, consonant.phase),
      });
    }
  }

  return syllables.filter(s => s.phase <= phase);
};

// CVC típusú szótagok: mássalhangzó + magánhangzó + mássalhangzó
// Pl: mam, hal, fal, sir — csak később, magasabb szintokban
// Meixner: azonos kezdő- és záró-mássalhangzójú szótagok (hal, fal) jönnek ELŐBB
const generateCVCSyllables = (
  vowels: Grapheme[],
  consonants: Grapheme[],
  phase: number
): Syllable[] => {
  // Csak 10-es szint felett generálunk CVC szótagokat
  if (phase < 10) return [];

  const syllables: Syllable[] = [];

  for (const c1 of consonants) {
    for (const vowel of vowels) {
      for (const c2 of consonants) {
        const text = c1.display + vowel.display + c2.display;
        const syllablePhase = Math.max(c1.phase, vowel.phase, c2.phase);
        if (syllablePhase <= phase) {
          syllables.push({
            id: `cvc_${c1.id}_${vowel.id}_${c2.id}`,
            text,
            type: 'CVC',
            graphemes: [c1.id, vowel.id, c2.id],
            phase: syllablePhase,
          });
        }
      }
    }
  }

  // Meixner 4-fokozatú CVC-sorrend:
  //   1. Szimmetrikus (C1===C3): mam, sis — a legegyszerűbb keret
  //   2. Azonos záró mássalhangzó (C3): hal, fal, kal — stage-2 gyakorlatok alapja
  //   3. Azonos C1+C3 keret (hal, hol): a C3→C1 szerinti belső csoportosítás fedezi
  //   4. Azonos nyitó (C1) / mind különböző — az exercise engine dolga
  return syllables.sort((a, b) => {
    if (a.phase !== b.phase) return a.phase - b.phase;

    const aSymmetric = a.graphemes[0] === a.graphemes[2] ? 0 : 1;
    const bSymmetric = b.graphemes[0] === b.graphemes[2] ? 0 : 1;
    if (aSymmetric !== bSymmetric) return aSymmetric - bSymmetric;

    // C3 szerinti csoportosítás → azonos záró mássalhangzójú szótagok szomszédosak (2. fokozat)
    const c3Cmp = a.graphemes[2].localeCompare(b.graphemes[2]);
    if (c3Cmp !== 0) return c3Cmp;

    // Azonos C3-on belül C1 szerinti csoportosítás → azonos keret (hal, hol) szomszédos (1b fokozat)
    return a.graphemes[0].localeCompare(b.graphemes[0]);
  });
};

// Fő generátor függvény
export const generateSyllables = (maxPhase: number): Syllable[] => {
  const vowels = getVowels(maxPhase);
  const consonants = getConsonants(maxPhase);

  const vc = generateVCSyllables(vowels, consonants, maxPhase);
  const cv = generateCVSyllables(vowels, consonants, maxPhase);
  const cvc = generateCVCSyllables(vowels, consonants, maxPhase);

  return [...vc, ...cv, ...cvc];
};

// Meixner-féle tévesztőpárok — soha nem szerepelhetnek ugyanabban a feladatban
// Forrás: Meixner Ildikó (589344797), NT-98488 kézikönyv
// Vizuálisan ÉS akusztikusan hasonló (legsúlyosabb): b–d, m–n
// Csak vizuálisan hasonló: b–p, d–p, f–t, h–n
// Csak akusztikusan hasonló (képzés helye): f–v, t–n
// Csak akusztikusan hasonló (képzés módja): sz–f, g–d
const CONFUSION_PAIRS: [string, string][] = [
  ['b', 'd'],
  ['b', 'p'],
  ['d', 'p'],
  ['m', 'n'],
  ['f', 't'],
  ['f', 'v'],
  ['t', 'n'],
  ['h', 'n'],
  ['sz', 'f'],
  ['g', 'd'],
];

const sharesConfusionPair = (g1: string[], g2: string[]): boolean => {
  const set1 = new Set(g1);
  const set2 = new Set(g2);
  return CONFUSION_PAIRS.some(([a, b]) =>
    (set1.has(a) && set2.has(b)) || (set1.has(b) && set2.has(a))
  );
};

// Zavarók generálása — Meixner elvek szerint
// Soha nem adunk hasonló hangzású zavarót!
export const generateDistractors = (
  target: Syllable,
  allSyllables: Syllable[],
  count: number = 3
): Syllable[] => {
  const candidates = allSyllables.filter(s => {
    if (s.id === target.id) return false;
    if (s.type !== target.type) return false;

    // Homogén gátlás: ha az első karakter ugyanaz, ne adjuk zavarókként
    if (target.text[0] === s.text[0]) return false;

    // Meixner-féle tévesztőpárok: ha a célszótag és a jelölt
    // egymással összekeverhetős graféméket tartalmaz, kizárjuk
    if (sharesConfusionPair(target.graphemes, s.graphemes)) return false;

    return true;
  });

  // Véletlenszerű választás a jelöltekből
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
