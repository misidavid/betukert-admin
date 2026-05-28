import { Grapheme } from '../types';

export const GRAPHEMES: Grapheme[] = [
  { id: 'a',   display: 'a',   phoneme: 'a',   type: 'vowel',     rare: false, phase: 1 },
  { id: 'i',   display: 'i',   phoneme: 'i',   type: 'vowel',     rare: false, phase: 1 },
  { id: 'oo',  display: 'ó',   phoneme: 'ó',   type: 'vowel',     rare: false, phase: 2 },
  { id: 'o',   display: 'o',   phoneme: 'o',   type: 'vowel',     rare: false, phase: 2,  implicit: true },
  { id: 'm',   display: 'm',   phoneme: 'm',   type: 'consonant', rare: false, phase: 3 },
  { id: 't',   display: 't',   phoneme: 't',   type: 'consonant', rare: false, phase: 3 },
  { id: 's',   display: 's',   phoneme: 's',   type: 'consonant', rare: false, phase: 3 },
  { id: 'v',   display: 'v',   phoneme: 'v',   type: 'consonant', rare: false, phase: 4 },
  { id: 'e',   display: 'e',   phoneme: 'e',   type: 'vowel',     rare: false, phase: 5 },
  { id: 'l',   display: 'l',   phoneme: 'l',   type: 'consonant', rare: false, phase: 6 },
  { id: 'uu',  display: 'ú',   phoneme: 'ú',   type: 'vowel',     rare: false, phase: 7 },
  { id: 'u',   display: 'u',   phoneme: 'u',   type: 'vowel',     rare: false, phase: 7,  implicit: true },
  { id: 'p',   display: 'p',   phoneme: 'p',   type: 'consonant', rare: false, phase: 8 },
  { id: 'c',   display: 'c',   phoneme: 'c',   type: 'consonant', rare: false, phase: 9 },
  { id: 'k',   display: 'k',   phoneme: 'k',   type: 'consonant', rare: false, phase: 10 },
  { id: 'aa',  display: 'á',   phoneme: 'á',   type: 'vowel',     rare: false, phase: 11 },
  { id: 'f',   display: 'f',   phoneme: 'f',   type: 'consonant', rare: false, phase: 12 },
  { id: 'h',   display: 'h',   phoneme: 'h',   type: 'consonant', rare: false, phase: 13 },
  { id: 'z',   display: 'z',   phoneme: 'z',   type: 'consonant', rare: false, phase: 14 },
  { id: 'oee', display: 'ő',   phoneme: 'ő',   type: 'vowel',     rare: false, phase: 15 },
  { id: 'd',   display: 'd',   phoneme: 'd',   type: 'consonant', rare: false, phase: 16 },
  { id: 'oe',  display: 'ö',   phoneme: 'ö',   type: 'vowel',     rare: false, phase: 17 },
  { id: 'j',   display: 'j',   phoneme: 'j',   type: 'consonant', rare: false, phase: 18 },
  { id: 'ee',  display: 'é',   phoneme: 'é',   type: 'vowel',     rare: false, phase: 19 },
  { id: 'n',   display: 'n',   phoneme: 'n',   type: 'consonant', rare: false, phase: 20 },
  { id: 'sz',  display: 'sz',  phoneme: 'sz',  type: 'digraph',   rare: false, phase: 21 },
  { id: 'g',   display: 'g',   phoneme: 'g',   type: 'consonant', rare: false, phase: 22 },
  { id: 'r',   display: 'r',   phoneme: 'r',   type: 'consonant', rare: false, phase: 23 },
  { id: 'uee', display: 'ű',   phoneme: 'ű',   type: 'vowel',     rare: false, phase: 24 },
  { id: 'ue',  display: 'ü',   phoneme: 'ü',   type: 'vowel',     rare: false, phase: 24 },
  { id: 'b',   display: 'b',   phoneme: 'b',   type: 'consonant', rare: false, phase: 25 },
  { id: 'gy',  display: 'gy',  phoneme: 'gy',  type: 'digraph',   rare: false, phase: 26 },
  { id: 'cs',  display: 'cs',  phoneme: 'cs',  type: 'digraph',   rare: false, phase: 27 },
  { id: 'ny',  display: 'ny',  phoneme: 'ny',  type: 'digraph',   rare: false, phase: 28 },
  { id: 'zs',  display: 'zs',  phoneme: 'zs',  type: 'digraph',   rare: false, phase: 29 },
  { id: 'ty',  display: 'ty',  phoneme: 'ty',  type: 'digraph',   rare: false, phase: 30 },
  { id: 'ly',  display: 'ly',  phoneme: 'j',   type: 'digraph',   rare: false, phase: 31 },
  { id: 'dz',  display: 'dz',  phoneme: 'dz',  type: 'digraph',   rare: false, phase: 32 },
  { id: 'x',   display: 'x',   phoneme: 'ksz', type: 'consonant', rare: true,  phase: 33 },
  { id: 'dzs', display: 'dzs', phoneme: 'dzs', type: 'trigraph',  rare: false, phase: 34 },
  { id: 'y',   display: 'y',   phoneme: 'i',   type: 'consonant', rare: true,  phase: 35 },
  { id: 'w',   display: 'w',   phoneme: 'v',   type: 'consonant', rare: true,  phase: 36 },
  { id: 'q',   display: 'q',   phoneme: 'k',   type: 'consonant', rare: true,  phase: 99 },
  { id: 'ii',  display: 'í',   phoneme: 'í',   type: 'vowel',     rare: true,  phase: 99 },
];

export const getGraphemesByPhase = (maxPhase: number): Grapheme[] =>
  GRAPHEMES.filter(g => g.phase <= maxPhase && !g.rare && !g.implicit);

export const getGraphemesForWordFilter = (maxPhase: number): Grapheme[] =>
  GRAPHEMES.filter(g => g.phase <= maxPhase && !g.rare);

export const getGraphemeById = (id: string): Grapheme | undefined =>
  GRAPHEMES.find(g => g.id === id);

export const getVowels = (maxPhase: number): Grapheme[] =>
  getGraphemesByPhase(maxPhase).filter(g => g.type === 'vowel');

export const getConsonants = (maxPhase: number): Grapheme[] =>
  getGraphemesByPhase(maxPhase).filter(g =>
    g.type === 'consonant' || g.type === 'digraph' || g.type === 'trigraph'
  );
