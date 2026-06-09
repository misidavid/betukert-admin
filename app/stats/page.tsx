'use client';

import { useState, useEffect } from 'react';
import { getStatsAction, StatsResult } from '../actions/stats';

export default function StatsPage() {
  const [data, setData] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'words'>('overview');

  useEffect(() => {
    getStatsAction().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  const accuracyColor = (pct: number) => {
    if (pct >= 80) return 'text-green-600';
    if (pct >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D5A27]">📊 Statisztikák</h1>
        <p className="text-gray-500 text-sm mt-1">Felhasználói teljesítmény és tartalom elemzés</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Betöltés...</div>
      ) : data?.error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">❌ {data.error}</div>
      ) : data && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Gyerekprofilok', value: data.total_profiles },
              { label: 'Aktív szülők', value: data.total_users },
              { label: 'Összesített feladatok', value: data.total_sessions.toLocaleString('hu-HU') },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border p-6 text-center">
                <div className="text-3xl font-bold text-[#2D5A27]">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-b">
            {[
              { id: 'overview', label: 'Típus szerint' },
              { id: 'words', label: `Elemenkénti (${data.word_stats.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-[#2D5A27] text-[#2D5A27]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-[#2D5A27] mb-4">Típus szerinti bontás</h2>
              {(['grapheme', 'syllable', 'word'] as const).map(type => {
                const items = data.word_stats.filter(w => w.item_type === type);
                if (!items.length) return null;
                const totalSessions = items.reduce((s, i) => s + i.total_sessions, 0);
                const avgAcc = Math.round(items.reduce((s, i) => s + i.avg_accuracy, 0) / items.length);
                const labels: Record<string, string> = { grapheme: 'Betű', syllable: 'Szótag', word: 'Szó' };
                return (
                  <div key={type} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <span className="w-24 font-medium text-gray-700">{labels[type]}</span>
                    <span className="text-sm text-gray-500">{items.length} elem</span>
                    <span className="text-sm text-gray-500">{totalSessions.toLocaleString('hu-HU')} feladat</span>
                    <span className={`ml-auto font-bold ${accuracyColor(avgAcc)}`}>{avgAcc}% pontosság</span>
                  </div>
                );
              })}
              {data.word_stats.length === 0 && (
                <p className="text-gray-400 text-center py-8">Még nincs elegendő adat</p>
              )}
            </div>
          )}

          {tab === 'words' && (
            <div className="space-y-2">
              {data.word_stats.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Még nincs adat</div>
              ) : (
                data.word_stats.map(w => (
                  <div key={`${w.item_type}:${w.item_id}`} className="bg-white rounded-xl border p-3 flex items-center gap-4">
                    <span className="font-bold text-[#2D5A27] w-32 truncate">{w.item_id}</span>
                    <span className="text-xs bg-[#E8F0E5] text-[#2D5A27] px-2 py-0.5 rounded-full">{w.item_type}</span>
                    <span className="text-sm text-gray-500">{w.child_count} gyerek</span>
                    <span className="text-sm text-gray-500">{w.total_sessions} feladat</span>
                    <div className="flex-1" />
                    <span className={`font-bold text-sm ${accuracyColor(w.avg_accuracy)}`}>{w.avg_accuracy}%</span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2D5A27] rounded-full" style={{ width: `${w.avg_accuracy}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
