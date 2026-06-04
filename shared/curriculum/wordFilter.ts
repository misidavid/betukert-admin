import { WordItem } from '../types';
import { getGraphemesForWordFilter } from './graphemes';

const VOWELS = ['a', 'á', 'e', 'é', 'i', 'í', 'o', 'ó', 'ö', 'ő', 'u', 'ú', 'ü', 'ű'];
const DIGRAPHS = ['dzs', 'cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'];
// Nagybetűs kétjegyűek (keresztnevekhez, pl. Cs-illa, Gy-ula, Sz-abi)
const UPPER_DIGRAPHS = ['Dzs', 'Dz', 'Cs', 'Gy', 'Ly', 'Ny', 'Sz', 'Ty', 'Zs'];

export const splitIntoGraphemes = (word: string): string[] => {
  const graphemes: string[] = [];
  const lower = word.toLowerCase();
  let i = 0;
  while (i < lower.length) {
    let matched = false;

    // Doubled digraphs (ggy→gy+gy, nny→ny+ny, ssz→sz+sz, ccs→cs+cs, etc.):
    // the first char is the digraph's first char doubled, so advance only 1.
    for (const digraph of DIGRAPHS) {
      if (lower[i] === digraph[0] && lower.slice(i + 1, i + 1 + digraph.length) === digraph) {
        graphemes.push(digraph);
        i += 1;
        matched = true;
        break;
      }
    }

    if (!matched) {
      for (const digraph of DIGRAPHS) {
        if (lower.slice(i, i + digraph.length) === digraph) {
          graphemes.push(digraph);
          i += digraph.length;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      graphemes.push(lower[i]);
      i++;
    }
  }
  return graphemes;
};

// Keresztnevekhez: az első grafémát nagybetűsen adja vissza, a többit kisbetűsen.
// Pl. 'Csilla' → ['Cs', 'i', 'l', 'l', 'a'], 'Alma' → ['A', 'l', 'm', 'a']
export const splitNameIntoGraphemes = (word: string): string[] => {
  if (!word || word[0] === word[0].toLowerCase()) return splitIntoGraphemes(word);
  for (const digraph of UPPER_DIGRAPHS) {
    if (word.startsWith(digraph)) {
      return [digraph, ...splitIntoGraphemes(word.slice(digraph.length))];
    }
  }
  return [word[0], ...splitIntoGraphemes(word.slice(1))];
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

export const DISPLAY_TO_ID: Record<string, string> = {
  // Kisbetűk
  'a': 'a', 'á': 'aa', 'e': 'e', 'é': 'ee',
  'i': 'i', 'í': 'ii', 'o': 'o', 'ó': 'oo',
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
  // Nagybetűk (keresztnevekhez)
  'A': 'A', 'Á': 'AA', 'E': 'E', 'É': 'EE',
  'I': 'I', 'Í': 'II', 'O': 'O', 'Ó': 'OO',
  'Ö': 'OE', 'Ő': 'OEE', 'U': 'U', 'Ú': 'UU',
  'Ü': 'UE', 'Ű': 'UEE',
  'B': 'B', 'C': 'C', 'Cs': 'Cs', 'D': 'D',
  'Dz': 'Dz', 'Dzs': 'Dzs', 'F': 'F', 'G': 'G',
  'Gy': 'Gy', 'H': 'H', 'J': 'J', 'K': 'K',
  'L': 'L', 'Ly': 'Ly', 'M': 'M', 'N': 'N',
  'Ny': 'Ny', 'P': 'P', 'R': 'R', 'S': 'S',
  'Sz': 'Sz', 'T': 'T', 'Ty': 'Ty', 'V': 'V',
  'Z': 'Z', 'Zs': 'Zs',
};

export const wordIsKnown = (
  word: string,
  knownGraphemeIds: string[]
): boolean => {
  const graphemes = splitIntoGraphemes(word.toLowerCase());
  return graphemes.every(g => {
    const id = DISPLAY_TO_ID[g];
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
  const knownGraphemes = getGraphemesForWordFilter(maxPhase);
  const knownIds = knownGraphemes.map(g => g.id);
  const idToPhase: Record<string, number> = {};
  knownGraphemes.forEach(g => { idToPhase[g.id] = g.phase; });

  return words
    .filter(word => wordIsKnown(word, knownIds))
    .map((word, index) => {
      const syllables = splitIntoSyllables(word);
      const graphemes = splitIntoGraphemes(word);
      const maxGraphemePhase = Math.max(
        ...graphemes.map(g => {
          const id = DISPLAY_TO_ID[g];
          return id ? (idToPhase[id] ?? 0) : 0;
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
