'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getStatsAction, StatsResult, MasteryStatusItem } from '../actions/stats';

const STATUS_COLORS: Record<string, string> = {
  locked: '#E5E7EB',
  new: '#93C5FD',
  learning: '#FCD34D',
  practicing: '#6EE7B7',
  stable: '#2D5A27',
  needs_review: '#F87171',
};

const STATUS_LABELS: Record<string, string> = {
  locked: 'Zárolt',
  new: 'Új',
  learning: 'Tanulás',
  practicing: 'Gyakorlás',
  stable: 'Stabil',
  needs_review: 'Ismétlés kell',
};

const TYPE_LABELS: Record<string, string> = {
  grapheme: 'Betű',
  syllable: 'Szótag',
  word: 'Szó',
};

const STATUS_KEYS = ['locked', 'new', 'learning', 'practicing', 'stable', 'needs_review'] as const;
type StatusKey = typeof STATUS_KEYS[number];

function accuracyTextColor(pct: number) {
  if (pct >= 80) return 'text-green-600';
  if (pct >= 60) return 'text-yellow-600';
  return 'text-red-500';
}

function accuracyBarColor(pct: number) {
  if (pct >= 80) return '#2D5A27';
  if (pct >= 60) return '#CA8A04';
  return '#DC2626';
}

function buildPieData(typeData: MasteryStatusItem) {
  return STATUS_KEYS
    .map(key => ({ name: STATUS_LABELS[key], value: typeData[key as StatusKey] as number, color: STATUS_COLORS[key] }))
    .filter(d => d.value > 0);
}

export default function StatsPage() {
  const [data, setData] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'hardest' | 'all'>('hardest');
  const [minChildren, setMinChildren] = useState(1);
  const [typeFilter, setTypeFilter] = useState<'all' | 'grapheme' | 'syllable' | 'word'>('all');

  useEffect(() => {
    getStatsAction().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

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
          {/* ── KPI kártyák ──────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Gyerekprofilok', value: data.total_profiles },
              { label: 'Aktív szülők', value: data.total_users },
              { label: 'Összesített feladatok', value: data.total_sessions.toLocaleString('hu-HU') },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border p-6 text-center">
                <div className="text-3xl font-bold text-[#2D5A27]">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border p-6 text-center">
              <div className="text-3xl font-bold text-[#2D5A27]">{data.active_last_7_days}</div>
              <div className="text-sm text-gray-500 mt-1">Aktív gyerek (7 nap)</div>
            </div>
            <div className={`rounded-xl border p-6 text-center ${data.needs_review_total > 0 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
              <div className={`text-3xl font-bold ${data.needs_review_total > 0 ? 'text-red-600' : 'text-[#2D5A27]'}`}>
                {data.needs_review_total}
              </div>
              <div className="text-sm text-gray-500 mt-1">Ismétlés szükséges</div>
            </div>
            <div className="bg-white rounded-xl border p-6 text-center">
              <div className="text-3xl font-bold text-[#2D5A27]">{data.stable_ratio}%</div>
              <div className="text-sm text-gray-500 mt-1">Stabil tudás arány</div>
            </div>
          </div>

          {/* ── Fázis eloszlás ───────────────────────────────────────── */}
          {data.phase_distribution.length > 0 ? (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-[#2D5A27] mb-1">Fázis eloszlás</h2>
              <p className="text-xs text-gray-400 mb-4">Hány gyerekprofil van az egyes tanulási fázisokon</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.phase_distribution} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="phase" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={24} />
                  <Tooltip
                    formatter={(v) => [v, 'gyerek']}
                    labelFormatter={(l) => `${l}. fázis`}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Bar dataKey="count" fill="#2D5A27" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-6 text-center text-gray-400 text-sm">Még nincs fázis-adat</div>
          )}

          {/* ── Aktivitás trend ──────────────────────────────────────── */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-[#2D5A27] mb-1">Aktivitás – utóbbi 30 nap</h2>
            <p className="text-xs text-gray-400 mb-4">Naponta hány különböző gyerekprofil volt aktív</p>
            {data.activity_trend.some(d => d.children > 0) ? (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={data.activity_trend}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A27" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2D5A27" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    interval={6}
                    tickFormatter={(v: string) => v.slice(5).replace('-', '.')}
                  />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={24} />
                  <Tooltip
                    labelFormatter={(v) => String(v).replace(/-/g, '.')}
                    formatter={(v) => [v, 'aktív gyerek']}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Area type="monotone" dataKey="children" stroke="#2D5A27" strokeWidth={2} fill="url(#actGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">Még nincs aktivitási adat az utóbbi 30 napból</div>
            )}
          </div>

          {/* ── Mastery megoszlás ────────────────────────────────────── */}
          {data.mastery_status.some(s => s.total > 0) && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-[#2D5A27] mb-1">Mastery megoszlás</h2>
              <p className="text-xs text-gray-400 mb-6">Tanulási státuszok aránya típusonként</p>
              <div className="grid grid-cols-3 gap-2">
                {data.mastery_status.map(typeData => {
                  const pieData = buildPieData(typeData);
                  return (
                    <div key={typeData.type} className="flex flex-col items-center">
                      <p className="text-sm font-semibold text-gray-700 mb-0">
                        {TYPE_LABELS[typeData.type] ?? typeData.type}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">{typeData.total} rekord</p>
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="45%"
                              innerRadius="45%"
                              outerRadius="65%"
                              dataKey="value"
                              paddingAngle={2}
                            >
                              {pieData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(v, n) => [v, n]}
                              contentStyle={{ fontSize: 11, borderRadius: 8 }}
                            />
                            <Legend
                              iconType="circle"
                              iconSize={7}
                              formatter={(v) => <span style={{ fontSize: 10, color: '#6B7280' }}>{v}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-300 text-xs py-12">nincs adat</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Elemenkénti táblázat ─────────────────────────────────── */}
          <div className="flex gap-2 border-b">
            {[
              { id: 'hardest', label: 'Legnehezebb' },
              { id: 'all', label: `Összes (${data.word_stats.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as 'hardest' | 'all')}
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

          {tab === 'hardest' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-gray-500">Min. gyerekszám:</span>
                {[1, 2, 3, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setMinChildren(n)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      minChildren === n ? 'bg-[#2D5A27] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {n}+
                  </button>
                ))}
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">Típus:</span>
                {(['all', 'grapheme', 'syllable', 'word'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      typeFilter === t ? 'bg-[#2D5A27] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t === 'all' ? 'Mind' : TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              {(() => {
                const filtered = data.word_stats
                  .filter(w => w.child_count >= minChildren && (typeFilter === 'all' || w.item_type === typeFilter))
                  .sort((a, b) => a.avg_accuracy - b.avg_accuracy)
                  .slice(0, 30);
                if (!filtered.length)
                  return <div className="text-center py-12 text-gray-400">Nincs elegendő adat a szűrőhöz</div>;
                return filtered.map(w => (
                  <div key={`${w.item_type}:${w.item_id}`} className="bg-white rounded-xl border p-3 flex items-center gap-4">
                    <span className="font-bold text-[#2D5A27] w-32 truncate">{w.item_id}</span>
                    <span className="text-xs bg-[#E8F0E5] text-[#2D5A27] px-2 py-0.5 rounded-full">
                      {TYPE_LABELS[w.item_type] ?? w.item_type}
                    </span>
                    <span className="text-sm text-gray-500">{w.child_count} gyerek</span>
                    <span className="text-sm text-gray-500">{w.total_sessions} feladat</span>
                    <div className="flex-1" />
                    <span className={`font-bold text-sm ${accuracyTextColor(w.avg_accuracy)}`}>{w.avg_accuracy}%</span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${w.avg_accuracy}%`, backgroundColor: accuracyBarColor(w.avg_accuracy) }}
                      />
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {tab === 'all' && (
            <div className="space-y-2">
              {data.word_stats.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Még nincs adat</div>
              ) : (
                data.word_stats.map(w => (
                  <div key={`${w.item_type}:${w.item_id}`} className="bg-white rounded-xl border p-3 flex items-center gap-4">
                    <span className="font-bold text-[#2D5A27] w-32 truncate">{w.item_id}</span>
                    <span className="text-xs bg-[#E8F0E5] text-[#2D5A27] px-2 py-0.5 rounded-full">
                      {TYPE_LABELS[w.item_type] ?? w.item_type}
                    </span>
                    <span className="text-sm text-gray-500">{w.child_count} gyerek</span>
                    <span className="text-sm text-gray-500">{w.total_sessions} feladat</span>
                    <div className="flex-1" />
                    <span className={`font-bold text-sm ${accuracyTextColor(w.avg_accuracy)}`}>{w.avg_accuracy}%</span>
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
