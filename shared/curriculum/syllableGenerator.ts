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
// Pl: mam, sir, tos — csak később, magasabb szintokban
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
        if (c1.id === c2.id) continue; // nem generálunk pl. "mam"-ot
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

  return syllables;
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

    // Homogén gátlás: kerüljük a túl hasonló szótagokat
    // Ha az első betű ugyanaz, ne adjuk zavarókként
    const targetFirst = target.text[0];
    const candidateFirst = s.text[0];
    if (targetFirst === candidateFirst) return false;

    return true;
  });

  // Véletlenszerű választás a jelöltekből
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
