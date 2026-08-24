import { ExerciseTypeSettings } from '../types';

// ============================================
// BETŰKERT — Alapértelmezett feladattípus beállítások
// Meixner-elvek szerint:
// - korai szintban csak betűfelismerés
// - fokozatosan jelennek meg az összetettebb típusok
// ============================================

export const DEFAULT_EXERCISE_SETTINGS: ExerciseTypeSettings[] = [
  {
    type: 'letter_recognition',
    enabled: true,
    fromPhase: 1,
    toPhase: 45,
    weight: 'frequent',
    differentiateConfusables: true,
  },
  {
    type: 'letter_sequence',
    enabled: true,
    fromPhase: 1,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'letter_in_word',
    enabled: true,
    fromPhase: 12,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'first_sound',
    enabled: true,
    fromPhase: 3,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'missing_letter',
    enabled: true,
    fromPhase: 4,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'syllable_choice',
    enabled: true,
    fromPhase: 4,
    toPhase: 45,
    weight: 'frequent',
  },
  {
    type: 'syllable_reading',
    enabled: true,
    fromPhase: 4,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'syllable_clapping',
    enabled: true,
    fromPhase: 4,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'image_word_match',
    enabled: true,
    fromPhase: 4,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'word_builder',
    enabled: true,
    fromPhase: 6,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'real_word',
    enabled: true,
    fromPhase: 6,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'word_length',
    enabled: true,
    fromPhase: 8,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'letter_fishing',
    enabled: true,
    fromPhase: 4,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'syllable_pair',
    enabled: true,
    fromPhase: 6,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'sentence_order',
    enabled: true,
    fromPhase: 10,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'sentence_comprehension',
    enabled: true,
    fromPhase: 10,
    toPhase: 45,
    weight: 'rare',
  },
  {
    type: 'direction_tracking',
    enabled: true,
    fromPhase: 1,
    toPhase: 10,
    weight: 'rare',
  },
  {
    type: 'image_word_drag',
    enabled: true,
    fromPhase: 4,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'sentence_picture_match',
    enabled: true,
    fromPhase: 10,
    toPhase: 45,
    weight: 'normal',
  },
  {
    type: 'image_sentence_match',
    enabled: true,
    fromPhase: 10,
    toPhase: 45,
    weight: 'normal',
  },
];

export const EXERCISE_TYPE_LABELS: Record<string, string> = {
  letter_recognition: 'Betűfelismerés',
  letter_in_word: 'Betű a szóban',
  letter_sequence: 'Betűsor olvasás',
  first_sound: 'Első hang felismerés',
  missing_letter: 'Hiányzó betű',
  syllable_choice: 'Szótagfelismerés',
  syllable_reading: 'Szótag memória',
  syllable_clapping: 'Szótagszám felismerés',
  image_word_match: 'Szófelismerés',
  word_builder: 'Szóépítés',
  real_word: 'Igazi szó',
  word_length: 'Rövid vagy hosszú?',
  letter_fishing: 'Szóhalászat',
  syllable_pair: 'Szótagpárosítás',
  sentence_order: 'Mondat rendezés',
  sentence_comprehension: 'Mondatértés',
  direction_tracking: 'Irányvonal követés',
  image_word_drag: 'Kép-szó párosítás',
  sentence_picture_match: 'Mondat-kép párosítás',
  image_sentence_match: 'Mi történik a képen',
};

export const WEIGHT_LABELS: Record<string, string> = {
  rare: 'Ritka',
  normal: 'Normál',
  frequent: 'Gyakori',
};
