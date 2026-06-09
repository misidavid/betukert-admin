'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';

export interface WordStat {
  item_id: string;
  item_type: string;
  total_correct: number;
  total_incorrect: number;
  total_sessions: number;
  child_count: number;
  avg_accuracy: number;
}

export interface StatsResult {
  total_users: number;
  total_profiles: number;
  total_sessions: number;
  word_stats: WordStat[];
  error?: string;
}

export async function getStatsAction(): Promise<StatsResult> {
  try {
    await requireAuth();
    const supabase = getSupabaseAdmin();

    const [
      { data: profiles },
      { data: masteryData },
    ] = await Promise.all([
      supabase.from('child_profiles').select('user_id'),
      supabase.from('mastery_records').select('item_id, item_type, correct_count, incorrect_count, sessions'),
    ]);

    const uniqueUsers = new Set((profiles ?? []).map(p => p.user_id)).size;
    const totalProfiles = profiles?.length ?? 0;
    const totalSessions = masteryData?.reduce((sum, r) => sum + r.sessions, 0) ?? 0;

    const wordMap = new Map<string, WordStat>();
    for (const r of masteryData ?? []) {
      const key = `${r.item_type}:${r.item_id}`;
      const existing = wordMap.get(key);
      if (existing) {
        existing.total_correct += r.correct_count;
        existing.total_incorrect += r.incorrect_count;
        existing.total_sessions += r.sessions;
        existing.child_count += 1;
      } else {
        wordMap.set(key, {
          item_id: r.item_id,
          item_type: r.item_type,
          total_correct: r.correct_count,
          total_incorrect: r.incorrect_count,
          total_sessions: r.sessions,
          child_count: 1,
          avg_accuracy: 0,
        });
      }
    }

    const word_stats = Array.from(wordMap.values())
      .map(s => ({
        ...s,
        avg_accuracy: s.total_correct + s.total_incorrect > 0
          ? Math.round((s.total_correct / (s.total_correct + s.total_incorrect)) * 100)
          : 0,
      }))
      .sort((a, b) => b.total_sessions - a.total_sessions);

    return { total_users: uniqueUsers, total_profiles: totalProfiles, total_sessions: totalSessions, word_stats };
  } catch (e: any) {
    return { total_users: 0, total_profiles: 0, total_sessions: 0, word_stats: [], error: e.message };
  }
}
