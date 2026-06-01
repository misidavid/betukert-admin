import { GRAPHEMES } from '../shared/curriculum/graphemes';
import {
  splitIntoSyllables,
  splitIntoGraphemes,
  wordIsKnown,
  DISPLAY_TO_ID,
} from '../shared/curriculum/wordFilter';
import type { WordInsertData } from '../app/actions/words';

const getPhase = (word: string): number => {
  const graphemes = splitIntoGraphemes(word.toLowerCase());
  let maxPhase = 1;
  for (const g of graphemes) {
    const id = DISPLAY_TO_ID[g];
    if (id) {
      const grapheme = GRAPHEMES.find(gr => gr.id === id);
      if (grapheme && grapheme.phase > maxPhase) maxPhase = grapheme.phase;
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

export const buildWordsFromLines = (
  existingTexts: Set<string>,
  lines: string[],
  maxCount: number,
): WordInsertData[] => {
  const maxPhase = Math.max(...GRAPHEMES.filter(g => !g.rare).map(g => g.phase));
  const allKnownIds = GRAPHEMES
    .filter(g => g.phase <= maxPhase && !g.rare)
    .map(g => g.id);

  const words: WordInsertData[] = [];

  for (const line of lines) {
    if (words.length >= maxCount) break;

    const word = line.trim().split(' ')[0].toLowerCase();
    if (word.length < 2 || word.length > 12) continue;
    if (existingTexts.has(word)) continue;
    if (!/^[a-záéíóöőúüű]+$/.test(word)) continue;
    if (!wordIsKnown(word, allKnownIds)) continue;

    const syllables = splitIntoSyllables(word);
    const graphemes = splitIntoGraphemes(word);
    words.push({ text: word, syllables, syllable_count: syllables.length, graphemes, phase: getPhase(word), difficulty: getDifficulty(word), enabled: true });
  }

  return words;
};
