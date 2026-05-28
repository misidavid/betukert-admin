import { supabase } from './supabase';
import { WORD_BANK } from '../shared/data/wordbank';
import { splitIntoSyllables, splitIntoGraphemes, DISPLAY_TO_ID } from '../shared/curriculum/wordFilter';
import { GRAPHEMES } from '../shared/curriculum/graphemes';

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
    .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
    .replace(/[^a-z0-9]/g, '_');
};

const getFirstSound = (word: string): string => {
  const graphemes = splitIntoGraphemes(word.toLowerCase());
  return graphemes[0] || '';
};

const getFirstSyllable = (word: string): string => {
  const syllables = splitIntoSyllables(word.toLowerCase());
  return syllables[0] || '';
};

const getPhase = (word: string): number => {
  const graphemes = splitIntoGraphemes(word.toLowerCase());

  let maxPhase = 1;
  for (const g of graphemes) {
    const id = DISPLAY_TO_ID[g];
    if (id) {
      const grapheme = GRAPHEMES.find(gr => gr.id === id);
      if (grapheme && grapheme.phase > maxPhase) {
        maxPhase = grapheme.phase;
      }
    }
  }
  return maxPhase;
};

const getExerciseTypes = (word: string): string[] => {
  const syllables = splitIntoSyllables(word);
  const types = ['image_word_match', 'first_sound'];
  if (syllables.length >= 2) {
    types.push('syllable_clapping', 'word_builder');
  }
  return types;
};

export const generateImageNeeds = async (): Promise<{
  inserted: number;
  skipped: number;
}> => {
  // Lekérjük a már meglévő szavakat
  const { data: existing } = await supabase
    .from('image_needs')
    .select('word');

  const existingWords = new Set(existing?.map(e => e.word) || []);

  const toInsert = WORD_BANK
    .filter(word => word.length >= 2 && !existingWords.has(word))
    .map(word => {
      const syllables = splitIntoSyllables(word.toLowerCase());
      return {
        word,
        syllables,
        syllable_count: syllables.length,
        first_sound: getFirstSound(word),
        first_syllable: getFirstSyllable(word),
        phase: getPhase(word),
        exercise_types: getExerciseTypes(word),
        image_brief: `Egyértelmű, gyerekbarát illusztráció erről: "${word}"`,
        ambiguity_notes: '',
        status: 'missing',
      };
    });

  if (toInsert.length === 0) {
    return { inserted: 0, skipped: existingWords.size };
  }

  const { error } = await supabase
    .from('image_needs')
    .insert(toInsert);

  if (error) throw error;

  return {
    inserted: toInsert.length,
    skipped: existingWords.size,
  };
};
