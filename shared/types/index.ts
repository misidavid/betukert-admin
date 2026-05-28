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
}

export interface ChildSettings {
  uppercaseEnabled: boolean;
  mixedCaseEnabled: boolean;
  enabledPhases: number[];
  exerciseSettings: ExerciseTypeSettings[];
  parentPin: string;
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
}

export type ExerciseType =
  | 'letter_recognition'
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
  | 'direction_tracking';

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
