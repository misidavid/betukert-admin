import { supabase } from './supabase';
import { GRAPHEMES } from '../shared/curriculum/graphemes';
import {
  splitIntoSyllables,
  splitIntoGraphemes,
  wordIsKnown,
} from '../shared/curriculum/wordFilter';

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

export const generateWordsFromCorpus = async (
  maxCount: number
): Promise<{ inserted: number; skipped: number; total: number }> => {

  // Meglévő szavak betöltése
  const { data: existing } = await supabase
    .from('words')
    .select('text');
  const existingTexts = new Set(existing?.map(e => e.text) || []);

  // Szólista betöltése
  const response = await fetch('/hu_words.txt');
  const text = await response.text();
  const lines = text.trim().split('\n');

  // Összes ismert graféma ID-k (max fázis)
  const maxPhase = Math.max(...GRAPHEMES.filter(g => !g.rare).map(g => g.phase));
  const allKnownIds = GRAPHEMES
    .filter(g => g.phase <= maxPhase && !g.rare)
    .map(g => g.id);

  const toInsert: any[] = [];

  for (const line of lines) {
    if (toInsert.length >= maxCount) break;

    const parts = line.trim().split(' ');
    if (parts.length < 1) continue;

    const word = parts[0].toLowerCase().trim();

    // Kiszűrjük:
    if (word.length < 2) continue;           // túl rövid
    if (word.length > 12) continue;          // túl hosszú
    if (existingTexts.has(word)) continue;   // már létezik
    if (!/^[a-záéíóöőúüű]+$/.test(word)) continue; // nem magyar betűk

    // Csak olyan szavak, amelyek minden betűje ismert
    if (!wordIsKnown(word, allKnownIds)) continue;

    const syllables = splitIntoSyllables(word);
    const graphemes = splitIntoGraphemes(word);

    toInsert.push({
      text: word,
      syllables,
      syllable_count: syllables.length,
      graphemes,
      phase: getPhase(word),
      difficulty: getDifficulty(word),
      enabled: true,
    });
  }

  if (toInsert.length === 0) {
    return { inserted: 0, skipped: existingTexts.size, total: lines.length };
  }

  // Batch insert 100-asával
  const batchSize = 100;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const { error } = await supabase.from('words').insert(batch);
    if (!error) inserted += batch.length;
  }

  return { inserted, skipped: existingTexts.size, total: lines.length };
};
