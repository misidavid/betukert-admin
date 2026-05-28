import { Grapheme } from '../types';

export const GRAPHEMES: Grapheme[] = [

  // ─── KISBETŰK (1–35. fázis) ─────────────────────────────────────────────
  // Forrás: Az olvasástanítás betűsorrendje — Módszertan-meixner.pdf
  // Alapelv: rövid-hosszú párokat NEM tanítjuk együtt (kivétel: ü–ű)

  // Fázis 1 — a, i  (+í implicit: rövid-hosszú nem tanítjuk együtt, de olvasásban korán megjelenik)
  { id: 'a',   display: 'a',   phoneme: 'a',   type: 'vowel',     rare: false, phase: 1 },
  { id: 'i',   display: 'i',   phoneme: 'i',   type: 'vowel',     rare: false, phase: 1 },
  { id: 'ii',  display: 'í',   phoneme: 'í',   type: 'vowel',     rare: false, phase: 1,  implicit: true },

  // Fázis 2 — ó  (+o implicit)
  { id: 'oo',  display: 'ó',   phoneme: 'ó',   type: 'vowel',     rare: false, phase: 2 },
  { id: 'o',   display: 'o',   phoneme: 'o',   type: 'vowel',     rare: false, phase: 2,  implicit: true },

  // Fázis 3 — m, s, t  (a hivatal sorrend: m, s, t — s megelőzi t-t!)
  { id: 'm',   display: 'm',   phoneme: 'm',   type: 'consonant', rare: false, phase: 3 },
  { id: 's',   display: 's',   phoneme: 's',   type: 'consonant', rare: false, phase: 3 },
  { id: 't',   display: 't',   phoneme: 't',   type: 'consonant', rare: false, phase: 3 },

  // Fázis 4 — v
  { id: 'v',   display: 'v',   phoneme: 'v',   type: 'consonant', rare: false, phase: 4 },

  // Fázis 5 — e
  { id: 'e',   display: 'e',   phoneme: 'e',   type: 'vowel',     rare: false, phase: 5 },

  // Fázis 6 — l
  { id: 'l',   display: 'l',   phoneme: 'l',   type: 'consonant', rare: false, phase: 6 },

  // Fázis 7 — ú  (+u implicit)
  { id: 'uu',  display: 'ú',   phoneme: 'ú',   type: 'vowel',     rare: false, phase: 7 },
  { id: 'u',   display: 'u',   phoneme: 'u',   type: 'vowel',     rare: false, phase: 7,  implicit: true },

  // Fázis 8 — p
  { id: 'p',   display: 'p',   phoneme: 'p',   type: 'consonant', rare: false, phase: 8 },

  // Fázis 9 — c
  { id: 'c',   display: 'c',   phoneme: 'c',   type: 'consonant', rare: false, phase: 9 },

  // Fázis 10 — k
  { id: 'k',   display: 'k',   phoneme: 'k',   type: 'consonant', rare: false, phase: 10 },

  // Fázis 11 — á
  { id: 'aa',  display: 'á',   phoneme: 'á',   type: 'vowel',     rare: false, phase: 11 },

  // Fázis 12 — f
  { id: 'f',   display: 'f',   phoneme: 'f',   type: 'consonant', rare: false, phase: 12 },

  // Fázis 13 — h
  { id: 'h',   display: 'h',   phoneme: 'h',   type: 'consonant', rare: false, phase: 13 },

  // Fázis 14 — z
  { id: 'z',   display: 'z',   phoneme: 'z',   type: 'consonant', rare: false, phase: 14 },

  // Fázis 15 — ő  (+ö implicit: "ö megfigyelése" a módszertanban)
  { id: 'oee', display: 'ő',   phoneme: 'ő',   type: 'vowel',     rare: false, phase: 15 },
  { id: 'oe',  display: 'ö',   phoneme: 'ö',   type: 'vowel',     rare: false, phase: 15, implicit: true },

  // Fázis 16 — d
  { id: 'd',   display: 'd',   phoneme: 'd',   type: 'consonant', rare: false, phase: 16 },

  // Fázis 17 — j
  { id: 'j',   display: 'j',   phoneme: 'j',   type: 'consonant', rare: false, phase: 17 },

  // Fázis 18 — é
  { id: 'ee',  display: 'é',   phoneme: 'é',   type: 'vowel',     rare: false, phase: 18 },

  // Fázis 19 — n
  { id: 'n',   display: 'n',   phoneme: 'n',   type: 'consonant', rare: false, phase: 19 },

  // Fázis 20 — sz
  { id: 'sz',  display: 'sz',  phoneme: 'sz',  type: 'digraph',   rare: false, phase: 20 },

  // Fázis 21 — g
  { id: 'g',   display: 'g',   phoneme: 'g',   type: 'consonant', rare: false, phase: 21 },

  // Fázis 22 — r
  { id: 'r',   display: 'r',   phoneme: 'r',   type: 'consonant', rare: false, phase: 22 },

  // Fázis 23 — ü, ű  (egyedüli kivétel: rövid-hosszú pár egyszerre kerül be)
  { id: 'ue',  display: 'ü',   phoneme: 'ü',   type: 'vowel',     rare: false, phase: 23 },
  { id: 'uee', display: 'ű',   phoneme: 'ű',   type: 'vowel',     rare: false, phase: 23 },

  // Fázis 24 — b
  { id: 'b',   display: 'b',   phoneme: 'b',   type: 'consonant', rare: false, phase: 24 },

  // Fázis 25 — gy
  { id: 'gy',  display: 'gy',  phoneme: 'gy',  type: 'digraph',   rare: false, phase: 25 },

  // Fázis 26 — cs
  { id: 'cs',  display: 'cs',  phoneme: 'cs',  type: 'digraph',   rare: false, phase: 26 },

  // Fázis 27 — ny
  { id: 'ny',  display: 'ny',  phoneme: 'ny',  type: 'digraph',   rare: false, phase: 27 },

  // Fázis 28 — zs
  { id: 'zs',  display: 'zs',  phoneme: 'zs',  type: 'digraph',   rare: false, phase: 28 },

  // Fázis 29 — ty
  { id: 'ty',  display: 'ty',  phoneme: 'ty',  type: 'digraph',   rare: false, phase: 29 },

  // Fázis 30 — ly
  { id: 'ly',  display: 'ly',  phoneme: 'j',   type: 'digraph',   rare: false, phase: 30 },

  // Fázis 31 — dz
  { id: 'dz',  display: 'dz',  phoneme: 'dz',  type: 'digraph',   rare: false, phase: 31 },

  // Fázis 32 — x  (ritka: idegen szavakban)
  { id: 'x',   display: 'x',   phoneme: 'ksz', type: 'consonant', rare: true,  phase: 32 },

  // Fázis 33 — dzs
  { id: 'dzs', display: 'dzs', phoneme: 'dzs', type: 'trigraph',  rare: false, phase: 33 },

  // Fázis 34 — y
  { id: 'y',   display: 'y',   phoneme: 'i',   type: 'consonant', rare: false, phase: 34 },

  // Fázis 35 — w  (ritka: idegen szavakban)
  { id: 'w',   display: 'w',   phoneme: 'v',   type: 'consonant', rare: true,  phase: 35 },

  // Fázis 99 — q  (nem szerepel a Meixner-tananyagban)
  { id: 'q',   display: 'q',   phoneme: 'k',   type: 'consonant', rare: true,  phase: 99 },


  // ─── NAGYBETŰK (37–46. fázis) ────────────────────────────────────────────
  // Forrás: Módszertan-meixner.pdf — nagybetűk sorrendje
  // Elv: „Nagybetűket később tanítunk — a módszer nem tanítja együtt
  //       a kis- és a nyomtatott nagybetűket." (Módszertan, 169. sor)

  // Fázis 37 — A, I, Í, O, Ó, M, S, T
  { id: 'A',   display: 'A',   phoneme: 'a',   type: 'vowel',     rare: false, phase: 37 },
  { id: 'I',   display: 'I',   phoneme: 'i',   type: 'vowel',     rare: false, phase: 37 },
  { id: 'II',  display: 'Í',   phoneme: 'í',   type: 'vowel',     rare: false, phase: 37 },
  { id: 'O',   display: 'O',   phoneme: 'o',   type: 'vowel',     rare: false, phase: 37 },
  { id: 'OO',  display: 'Ó',   phoneme: 'ó',   type: 'vowel',     rare: false, phase: 37 },
  { id: 'M',   display: 'M',   phoneme: 'm',   type: 'consonant', rare: false, phase: 37 },
  { id: 'S',   display: 'S',   phoneme: 's',   type: 'consonant', rare: false, phase: 37 },
  { id: 'T',   display: 'T',   phoneme: 't',   type: 'consonant', rare: false, phase: 37 },

  // Fázis 38 — Z, P, H
  { id: 'Z',   display: 'Z',   phoneme: 'z',   type: 'consonant', rare: false, phase: 38 },
  { id: 'P',   display: 'P',   phoneme: 'p',   type: 'consonant', rare: false, phase: 38 },
  { id: 'H',   display: 'H',   phoneme: 'h',   type: 'consonant', rare: false, phase: 38 },

  // Fázis 39 — U, Ú, E, Á, K, L, N
  { id: 'U',   display: 'U',   phoneme: 'u',   type: 'vowel',     rare: false, phase: 39 },
  { id: 'UU',  display: 'Ú',   phoneme: 'ú',   type: 'vowel',     rare: false, phase: 39 },
  { id: 'E',   display: 'E',   phoneme: 'e',   type: 'vowel',     rare: false, phase: 39 },
  { id: 'AA',  display: 'Á',   phoneme: 'á',   type: 'vowel',     rare: false, phase: 39 },
  { id: 'K',   display: 'K',   phoneme: 'k',   type: 'consonant', rare: false, phase: 39 },
  { id: 'L',   display: 'L',   phoneme: 'l',   type: 'consonant', rare: false, phase: 39 },
  { id: 'N',   display: 'N',   phoneme: 'n',   type: 'consonant', rare: false, phase: 39 },

  // Fázis 40 — Ö, Ő, É, V, B, C
  { id: 'OE',  display: 'Ö',   phoneme: 'ö',   type: 'vowel',     rare: false, phase: 40 },
  { id: 'OEE', display: 'Ő',   phoneme: 'ő',   type: 'vowel',     rare: false, phase: 40 },
  { id: 'EE',  display: 'É',   phoneme: 'é',   type: 'vowel',     rare: false, phase: 40 },
  { id: 'V',   display: 'V',   phoneme: 'v',   type: 'consonant', rare: false, phase: 40 },
  { id: 'B',   display: 'B',   phoneme: 'b',   type: 'consonant', rare: false, phase: 40 },
  { id: 'C',   display: 'C',   phoneme: 'c',   type: 'consonant', rare: false, phase: 40 },

  // Fázis 41 — Ü, Ű, F, G, J
  { id: 'UE',  display: 'Ü',   phoneme: 'ü',   type: 'vowel',     rare: false, phase: 41 },
  { id: 'UEE', display: 'Ű',   phoneme: 'ű',   type: 'vowel',     rare: false, phase: 41 },
  { id: 'F',   display: 'F',   phoneme: 'f',   type: 'consonant', rare: false, phase: 41 },
  { id: 'G',   display: 'G',   phoneme: 'g',   type: 'consonant', rare: false, phase: 41 },
  { id: 'J',   display: 'J',   phoneme: 'j',   type: 'consonant', rare: false, phase: 41 },

  // Fázis 42 — D, R, Sz, Ty, Cs
  { id: 'D',   display: 'D',   phoneme: 'd',   type: 'consonant', rare: false, phase: 42 },
  { id: 'R',   display: 'R',   phoneme: 'r',   type: 'consonant', rare: false, phase: 42 },
  { id: 'Sz',  display: 'Sz',  phoneme: 'sz',  type: 'digraph',   rare: false, phase: 42 },
  { id: 'Ty',  display: 'Ty',  phoneme: 'ty',  type: 'digraph',   rare: false, phase: 42 },
  { id: 'Cs',  display: 'Cs',  phoneme: 'cs',  type: 'digraph',   rare: false, phase: 42 },

  // Fázis 43 — Gy, Zs, Ny, Ly
  { id: 'Gy',  display: 'Gy',  phoneme: 'gy',  type: 'digraph',   rare: false, phase: 43 },
  { id: 'Zs',  display: 'Zs',  phoneme: 'zs',  type: 'digraph',   rare: false, phase: 43 },
  { id: 'Ny',  display: 'Ny',  phoneme: 'ny',  type: 'digraph',   rare: false, phase: 43 },
  { id: 'Ly',  display: 'Ly',  phoneme: 'j',   type: 'digraph',   rare: false, phase: 43 },

  // Fázis 44 — Dz, Dzs
  { id: 'Dz',  display: 'Dz',  phoneme: 'dz',  type: 'digraph',   rare: false, phase: 44 },
  { id: 'Dzs', display: 'Dzs', phoneme: 'dzs', type: 'trigraph',  rare: false, phase: 44 },

  // Fázis 45 — X  (ritka)
  { id: 'X',   display: 'X',   phoneme: 'ksz', type: 'consonant', rare: true,  phase: 45 },

  // Fázis 46 — W  (ritka)
  { id: 'W',   display: 'W',   phoneme: 'v',   type: 'consonant', rare: true,  phase: 46 },

  // Fázis 99 — ritka nagybetűk (nem szerepelnek a Meixner-tananyagban)
  { id: 'Q',   display: 'Q',   phoneme: 'k',   type: 'consonant', rare: true,  phase: 99 },
  { id: 'Y',   display: 'Y',   phoneme: 'i',   type: 'consonant', rare: true,  phase: 99 },
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
