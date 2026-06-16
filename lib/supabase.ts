import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ImageStatus = 
  | 'missing' 
  | 'uploaded' 
  | 'approved' 
  | 'published' 
  | 'rejected' 
  | 'needs_replacement';

export type SoundStatus =
  | 'missing'
  | 'uploaded'
  | 'pending_review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'needs_regeneration';

export interface ImageNeed {
  id: string;
  word: string;
  syllables: string[];
  syllable_count: number;
  first_sound: string;
  first_syllable: string;
  phase: number;
  exercise_types: string[];
  image_brief: string;
  ambiguity_notes: string;
  status: ImageStatus;
  file_path?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SentenceImageNeed {
  id: string;
  sentence_id: string;
  source: 'sentence_order' | 'sentence_comprehension';
  sentence_text: string;
  phase: number;
  exercise_type: string;
  image_brief: string;
  status: ImageStatus;
  file_path?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SoundNeed {
  id: string;
  text: string;
  type: 'phoneme' | 'syllable' | 'word' | 'sentence' | 'instruction';
  phase: number;
  pronunciation_note?: string;
  status: SoundStatus;
  file_path?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}
