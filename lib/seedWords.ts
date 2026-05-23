import { supabase } from './supabase';
import { WORD_BANK } from '../shared/data/wordbank';
import {
  splitIntoSyllables,
  splitIntoGraphemes,
} from '../shared/curriculum/wordFilter';
import { GRAPHEMES } from '../shared/curriculum/graphemes';

const getPhase = (word: string): number => {
  const graphemes = splitIntoGraphemes(word.toLowerCase());
  const displayToId: Record<string, string> = {
    'a': 'a', 'á': 'aa', 'e': 'e', 'é': 'ee',
    'i': 'i', 'í': 'ii', 'o': 'o', 'ó': 'o',
    'ö': 'oe', 'ő': 'oee', 'u': 'u', 'ú': 'uu',
    'ü': 'ue', 'ű': 'uee',
    'b': 'b', 'c': 'c', 'cs': 'cs', 'd': 'd',
    'dz': 'dz', 'dzs': 'dzs', 'f': 'f', 'g': 'g',
    'gy': 'gy', 'h': 'h', 'j': 'j', 'k': 'k',
    'l': 'l', 'ly': 'ly', 'm': 'm', 'n': 'n',
    'ny': 'ny', 'p': 'p', 'r': 'r', 's': 's',
    'sz': 'sz', 't': 't', 'ty': 'ty', 'v': 'v',
    'z': 'z', 'zs': 'zs',
  };

  let maxPhase = 1;
  for (const g of graphemes) {
    const id = displayToId[g];
    if (id) {
      const grapheme = GRAPHEMES.find(gr => gr.id === id);
      if (grapheme && grapheme.phase > maxPhase) {
        maxPhase = grapheme.phase;
      }
    }
  }
  return maxPhase;
};

const getDifficulty = (word: string): number => {
  const syllables = splitIntoSyllables(word);
  const graphemes = splitIntoGraphemes(word);
  if (syllables.length === 1 && graphemes.length <= 2) return 1;
  if (syllables.length === 1) return 2;
  if (syllables.length === 2 && graphemes.length <= 4) return 2;
  if (syllables.length === 2) return 3;
  if (syllables.length === 3) return 4;
  return 5;
};

export const seedWords = async (): Promise<{ inserted: number; skipped: number }> => {
  const { data: existing } = await supabase
    .from('words')
    .select('text');

  const existingTexts = new Set(existing?.map(e => e.text) || []);

  // Deduplikálás
  const uniqueWords = [...new Set(WORD_BANK)];

  const toInsert = uniqueWords
    .filter(word => word.length >= 2 && !existingTexts.has(word))
    .map(word => {
      const syllables = splitIntoSyllables(word.toLowerCase());
      const graphemes = splitIntoGraphemes(word.toLowerCase());
      return {
        text: word,
        syllables,
        syllable_count: syllables.length,
        graphemes,
        phase: getPhase(word),
        difficulty: getDifficulty(word),
        enabled: true,
      };
    });

  if (toInsert.length === 0) {
    return { inserted: 0, skipped: existingTexts.size };
  }

  const { error } = await supabase.from('words').insert(toInsert);
  if (error) throw error;

  return { inserted: toInsert.length, skipped: existingTexts.size };
};
