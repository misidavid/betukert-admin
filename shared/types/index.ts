export interface Grapheme {
  id: string;
  display: string;
  phoneme: string;
  type: 'vowel' | 'consonant' | 'digraph' | 'trigraph';
  rare: boolean;
  phase: number;
  implicit?: boolean;
}

export interface LearningPhase {
  id: number;
  name: string;
  graphemes: string[];
  description: string;
}

export interface Syllable {
  id: string;
  text: string;
  type: 'VC' | 'CV' | 'CVC' | 'VCC' | 'other';
  graphemes: string[];
  phase: number;
}

export interface WordItem {
  id: string;
  text: string;
  syllables: string[];
  syllableCount: number;
  graphemes: string[];
  phase: number;
  imageId?: string;
  audioId?: string;
  frequency: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  createdAt: string;
  currentPhase: number;
  knownGraphemes: string[];
  settings: ChildSettings;
}

export interface ExerciseTypeSettings {
  type: ExerciseType;
  enabled: boolean;
  fromPhase: number;
  toPhase: number;
  weight: 'rare' | 'normal' | 'frequent';
  // Csak a letter_recognition-nél értelmezett: ha be van kapcsolva, a
  // válaszlehetőségek közé szándékosan bekerül a célbetű ismert tévesztőpárja
  // (pl. b/d), hogy a gyerek gyakorolja a megkülönböztetést (Meixner-differenciálás).
  // Hiánya (undefined) bekapcsolt állapotot jelent.
  differentiateConfusables?: boolean;
}

export interface ChildSettings {
  uppercaseEnabled: boolean;
  mixedCaseEnabled: boolean;
  enabledPhases: number[];
  exerciseSettings: ExerciseTypeSettings[];
  parentPin: string;
  autoReadInstructions: boolean;
}

export interface MasteryRecord {
  childId: string;
  itemId: string;
  itemType: 'grapheme' | 'syllable' | 'word';
  status: 'locked' | 'new' | 'learning' | 'practicing' | 'stable' | 'needs_review';
  correctCount: number;
  incorrectCount: number;
  lastPracticed: string;
  sessions: number;
  // Csak lokális (a felhő-szinkron nem viszi át): melyik gyakorlási alkalom
  // növelte utoljára a sessions számlálót — alkalmanként legfeljebb egyszer nő.
  lastSessionId?: string;
  // Az utolsó néhány válasz eredménye, a legrégebbitől a legújabbig —
  // '1' = helyes, '0' = hibás. A felhővel is szinkronizálódik (recent_results),
  // hogy eszközváltásnál a friss teljesítmény kövesse a gyereket.
  // A szintlépés ezen a csúszóablakon méri a pontosságot, nem az élettartam-
  // arányon: így egy korai hibasorozat nem zárja el véglegesen a továbblépést,
  // viszont a friss teljesítmény számít. Hossza legfeljebb MAX_WINDOW_LENGTH
  // (progressionConfig); a vágás az írás (updateMasteryRecord) feladata, az
  // olvasó mindig az utolsó N karaktert nézi. Hiányzó/rövid ablak = még nincs
  // elég friss adat, ezért a betű nem számít beérettnek.
  recentResults?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  phase: number;
  targetItem: string;
  options?: string[];
  correctAnswer: string;
  instruction: string;
  imageId?: string;
  audioId?: string;
  sequence?: string[];
  targetInSequence?: string;
  syllableCount?: number;
  syllableParts?: string[];
  acceptedOrders?: string[][];
  displayText?: string;
  question?: string;
  pairs?: { imageId: string; word: string }[];
  // Több-választós feladatokhoz (pl. szóhalászat): az összes helyes válasz.
  correctAnswers?: string[];
  // TÖBB CÉLELEMŰ feladatokhoz (kép-szó párosítás): minden résztvevő elem
  // azonosítója. A kiértékelés mindent vagy semmit, ezért ugyanaz az eredmény
  // íródik mindegyikre — egyetlen elemre könyvelve a többi soha nem kapna
  // adatot, az az egy pedig elnyelné az egész feladat eredményét.
  // Hiányában a `targetItem` az egyetlen célelem.
  targetItems?: string[];
}

export type ExerciseType =
  | 'letter_recognition'
  | 'letter_in_word'
  | 'letter_in_digraph'
  | 'letter_case_pair'
  | 'missing_letter'
  | 'real_word'
  | 'word_length'
  | 'letter_fishing'
  | 'syllable_pair'
  | 'letter_sequence'
  | 'syllable_reading'
  | 'syllable_choice'
  | 'first_sound'
  | 'first_syllable'
  | 'image_word_match'
  | 'word_builder'
  | 'syllable_clapping'
  | 'sentence_order'
  | 'sentence_comprehension'
  | 'direction_tracking'
  | 'image_word_drag'
  | 'sentence_picture_match'
  | 'image_sentence_match';

export interface PracticeSession {
  id: string;
  childId: string;
  startedAt: string;
  completedAt?: string;
  exercises: Exercise[];
  results: ExerciseResult[];
}

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  responseTime: number;
  timestamp: string;
}
