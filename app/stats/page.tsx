'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getStatsAction, StatsResult, MasteryStatusItem } from '../actions/stats';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const RED = '#C0473F';
const RED_LIGHT = '#FBE7E5';
const MUTED = '#8A8478';

const STATUS_COLORS: Record<string, string> = {
  locked: '#E5E1D3',
  new: '#93C5FD',
  learning: '#FCD34D',
  practicing: '#6EE7B7',
  stable: GREEN,
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
  if (pct >= 80) return GREEN;
  if (pct >= 60) return '#CA8A04';
  return RED;
}

function accuracyBarColor(pct: number) {
  if (pct >= 80) return GREEN;
  if (pct >= 60) return '#CA8A04';
  return RED;
}

function buildPieData(typeData: MasteryStatusItem) {
  return STATUS_KEYS
    .map(key => ({ name: STATUS_LABELS[key], value: typeData[key as StatusKey] as number, color: STATUS_COLORS[key] }))
    .filter(d => d.value > 0);
}

const cardStyle = 'bg-white rounded-[24px] shadow-sm p-6';
const display = { fontFamily: 'var(--font-display)' };

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
        <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>📊 Statisztikák</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>Felhasználói teljesítmény és tartalom elemzés</p>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Betöltés...</div>
      ) : data?.error ? (
        <div className="rounded-[24px] p-4 text-sm" style={{ background: RED_LIGHT, color: '#8A4A44' }}>❌ {data.error}</div>
      ) : data && (
        <>
          {/* ── KPI kártyák ──────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Gyerekprofilok', value: data.total_profiles },
              { label: 'Aktív szülők', value: data.total_users },
              { label: 'Összesített feladatok', value: data.total_sessions.toLocaleString('hu-HU') },
            ].map(s => (
              <div key={s.label} className={`${cardStyle} text-center`}>
                <div className="text-3xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{s.value}</div>
                <div className="text-sm mt-1" style={{ color: MUTED }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`${cardStyle} text-center`}>
              <div className="text-3xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{data.active_last_7_days}</div>
              <div className="text-sm mt-1" style={{ color: MUTED }}>Aktív gyerek (7 nap)</div>
            </div>
            <div
              className="rounded-[24px] shadow-sm p-6 text-center"
              style={{ background: data.needs_review_total > 0 ? RED_LIGHT : '#FFFFFF' }}
            >
              <div className="text-3xl" style={{ ...display, fontWeight: 700, color: data.needs_review_total > 0 ? RED : GREEN_DARK }}>
                {data.needs_review_total}
              </div>
              <div className="text-sm mt-1" style={{ color: MUTED }}>Ismétlés szükséges</div>
            </div>
            <div className={`${cardStyle} text-center`}>
              <div className="text-3xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{data.stable_ratio}%</div>
              <div className="text-sm mt-1" style={{ color: MUTED }}>Stabil tudás arány</div>
            </div>
          </div>

          {/* ── Fázis eloszlás ───────────────────────────────────────── */}
          {data.phase_distribution.length > 0 ? (
            <div className={cardStyle}>
              <h2 style={{ ...display, fontWeight: 700, color: GREEN_DARK }} className="mb-1">Fázis eloszlás</h2>
              <p className="text-xs mb-4" style={{ color: '#B5AE9E' }}>Hány gyerekprofil van az egyes tanulási fázisokon</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.phase_distribution} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE8D9" />
                  <XAxis dataKey="phase" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={24} />
                  <Tooltip
                    formatter={(v) => [v, 'gyerek']}
                    labelFormatter={(l) => `${l}. fázis`}
                    contentStyle={{ fontSize: 12, borderRadius: 12 }}
                  />
                  <Bar dataKey="count" fill={GREEN} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`${cardStyle} text-center`} style={{ color: '#B5AE9E' }}>Még nincs fázis-adat</div>
          )}

          {/* ── Aktivitás trend ──────────────────────────────────────── */}
          <div className={cardStyle}>
            <h2 style={{ ...display, fontWeight: 700, color: GREEN_DARK }} className="mb-1">Aktivitás – utóbbi 30 nap</h2>
            <p className="text-xs mb-4" style={{ color: '#B5AE9E' }}>Naponta hány különböző gyerekprofil volt aktív</p>
            {data.activity_trend.some(d => d.children > 0) ? (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={data.activity_trend}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE8D9" />
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
                    contentStyle={{ fontSize: 12, borderRadius: 12 }}
                  />
                  <Area type="monotone" dataKey="children" stroke={GREEN} strokeWidth={2} fill="url(#actGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-sm" style={{ color: '#B5AE9E' }}>Még nincs aktivitási adat az utóbbi 30 napból</div>
            )}
          </div>

          {/* ── Mastery megoszlás ────────────────────────────────────── */}
          {data.mastery_status.some(s => s.total > 0) && (
            <div className={cardStyle}>
              <h2 style={{ ...display, fontWeight: 700, color: GREEN_DARK }} className="mb-1">Mastery megoszlás</h2>
              <p className="text-xs mb-6" style={{ color: '#B5AE9E' }}>Tanulási státuszok aránya típusonként</p>
              <div className="grid grid-cols-3 gap-2">
                {data.mastery_status.map(typeData => {
                  const pieData = buildPieData(typeData);
                  return (
                    <div key={typeData.type} className="flex flex-col items-center">
                      <p className="text-sm mb-0" style={{ fontWeight: 700, color: GREEN_DARK }}>
                        {TYPE_LABELS[typeData.type] ?? typeData.type}
                      </p>
                      <p className="text-xs mb-2" style={{ color: '#B5AE9E' }}>{typeData.total} rekord</p>
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
                              contentStyle={{ fontSize: 11, borderRadius: 12 }}
                            />
                            <Legend
                              iconType="circle"
                              iconSize={7}
                              formatter={(v) => <span style={{ fontSize: 10, color: MUTED }}>{v}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-xs py-12" style={{ color: '#D8D2C2' }}>nincs adat</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Elemenkénti táblázat ─────────────────────────────────── */}
          <div className="flex gap-2">
            {[
              { id: 'hardest', label: 'Legnehezebb' },
              { id: 'all', label: `Összes (${data.word_stats.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as 'hardest' | 'all')}
                className="px-5 py-2.5 rounded-2xl text-sm transition-colors"
                style={{
                  ...display,
                  fontWeight: 600,
                  background: tab === t.id ? GREEN : '#FFFFFF',
                  color: tab === t.id ? '#FFFFFF' : GREEN_DARK,
                  border: tab === t.id ? 'none' : '1px solid #E3DCC9',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'hardest' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span style={{ color: MUTED }}>Min. gyerekszám:</span>
                {[1, 2, 3, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setMinChildren(n)}
                    className="px-3 py-1 rounded-full text-xs transition-colors"
                    style={{
                      fontWeight: 600,
                      background: minChildren === n ? GREEN : '#F1ECE0',
                      color: minChildren === n ? '#FFFFFF' : '#5B6E5C',
                    }}
                  >
                    {n}+
                  </button>
                ))}
                <span style={{ color: '#D8D2C2' }}>|</span>
                <span style={{ color: MUTED }}>Típus:</span>
                {(['all', 'grapheme', 'syllable', 'word'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className="px-3 py-1 rounded-full text-xs transition-colors"
                    style={{
                      fontWeight: 600,
                      background: typeFilter === t ? GREEN : '#F1ECE0',
                      color: typeFilter === t ? '#FFFFFF' : '#5B6E5C',
                    }}
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
                  return <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Nincs elegendő adat a szűrőhöz</div>;
                return filtered.map(w => (
                  <div key={`${w.item_type}:${w.item_id}`} className="bg-white rounded-[24px] shadow-sm p-4 flex items-center gap-4">
                    <span className="w-32 truncate" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{w.item_id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}>
                      {TYPE_LABELS[w.item_type] ?? w.item_type}
                    </span>
                    <span className="text-sm" style={{ color: MUTED }}>{w.child_count} gyerek</span>
                    <span className="text-sm" style={{ color: MUTED }}>{w.total_sessions} feladat</span>
                    <div className="flex-1" />
                    <span className="text-sm" style={{ fontWeight: 700, color: accuracyTextColor(w.avg_accuracy) }}>{w.avg_accuracy}%</span>
                    <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: '#F1ECE0' }}>
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
                <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Még nincs adat</div>
              ) : (
                data.word_stats.map(w => (
                  <div key={`${w.item_type}:${w.item_id}`} className="bg-white rounded-[24px] shadow-sm p-4 flex items-center gap-4">
                    <span className="w-32 truncate" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{w.item_id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}>
                      {TYPE_LABELS[w.item_type] ?? w.item_type}
                    </span>
                    <span className="text-sm" style={{ color: MUTED }}>{w.child_count} gyerek</span>
                    <span className="text-sm" style={{ color: MUTED }}>{w.total_sessions} feladat</span>
                    <div className="flex-1" />
                    <span className="text-sm" style={{ fontWeight: 700, color: accuracyTextColor(w.avg_accuracy) }}>{w.avg_accuracy}%</span>
                    <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: '#F1ECE0' }}>
                      <div className="h-full rounded-full" style={{ width: `${w.avg_accuracy}%`, background: GREEN }} />
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
