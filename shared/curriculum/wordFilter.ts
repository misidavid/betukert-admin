import { WordItem } from '../types';
import { getGraphemesByPhase } from './graphemes';

const VOWELS = ['a', 'á', 'e', 'é', 'i', 'í', 'o', 'ó', 'ö', 'ő', 'u', 'ú', 'ü', 'ű'];
const DIGRAPHS = ['dzs', 'cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'];

export const splitIntoGraphemes = (word: string): string[] => {
  const graphemes: string[] = [];
  let i = 0;
  while (i < word.length) {
    let matched = false;
    for (const digraph of DIGRAPHS) {
      if (word.slice(i, i + digraph.length).toLowerCase() === digraph) {
        graphemes.push(digraph);
        i += digraph.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      graphemes.push(word[i].toLowerCase());
      i++;
    }
  }
  return graphemes;
};

const isVowel = (g: string): boolean => VOWELS.includes(g);

export const splitIntoSyllables = (word: string): string[] => {
  const graphemes = splitIntoGraphemes(word.toLowerCase());

  const vowelPositions = graphemes
    .map((g, i) => isVowel(g) ? i : -1)
    .filter(i => i !== -1);

  if (vowelPositions.length === 0) return [word];
  if (vowelPositions.length === 1) return [graphemes.join('')];

  const syllables: string[] = [];
  let start = 0;

  for (let v = 0; v < vowelPositions.length - 1; v++) {
    const currentVowel = vowelPositions[v];
    const nextVowel = vowelPositions[v + 1];
    const consonantsBetween = nextVowel - currentVowel - 1;

    let cutPoint: number;
    if (consonantsBetween === 0) cutPoint = currentVowel + 1;
    else if (consonantsBetween === 1) cutPoint = currentVowel + 1;
    else cutPoint = currentVowel + 2;

    syllables.push(graphemes.slice(start, cutPoint).join(''));
    start = cutPoint;
  }

  syllables.push(graphemes.slice(start).join(''));
  return syllables.filter(s => s.length > 0);
};

export const wordIsKnown = (
  word: string,
  knownGraphemeIds: string[]
): boolean => {
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
    'q': 'q', 'w': 'w', 'x': 'x', 'y': 'y',
  };

  return graphemes.every(g => {
    const id = displayToId[g];
    return id && knownGraphemeIds.includes(id);
  });
};

export const getWordDifficulty = (word: string): number => {
  const syllables = splitIntoSyllables(word);
  const graphemes = splitIntoGraphemes(word);

  if (syllables.length === 1 && graphemes.length <= 2) return 1;
  if (syllables.length === 1) return 2;
  if (syllables.length === 2 && graphemes.length <= 4) return 2;
  if (syllables.length === 2) return 3;
  if (syllables.length === 3) return 4;
  return 5;
};

export const filterWordsByPhase = (
  words: string[],
  maxPhase: number
): WordItem[] => {
  const knownGraphemes = getGraphemesByPhase(maxPhase);
  const knownIds = knownGraphemes.map(g => g.id);

  return words
    .filter(word => wordIsKnown(word, knownIds))
    .map((word, index) => {
      const syllables = splitIntoSyllables(word);
      const graphemes = splitIntoGraphemes(word);
      const maxGraphemePhase = Math.max(
        ...graphemes.map(g => {
          const found = knownGraphemes.find(kg => kg.display === g);
          return found ? found.phase : 0;
        })
      );

      return {
        id: `word_${index}_${word}`,
        text: word,
        syllables,
        syllableCount: syllables.length,
        graphemes,
        phase: maxGraphemePhase,
        frequency: 0,
      };
    })
    .sort((a, b) => a.phase - b.phase || a.syllableCount - b.syllableCount);
};
