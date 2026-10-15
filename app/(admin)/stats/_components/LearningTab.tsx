'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from 'recharts';
import type { StatsData } from '../../../../lib/stats/types';
import { Card, CardHeader, ChartCard, DataTable, EmptyState, LegendItem, TooltipBox } from './ui';
import {
  C,
  CATEGORY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_ORDER,
  fmtDaysAgo,
  fmtNum,
  fmtPct,
  periodPhrase,
  periodPhraseStart,
} from './theme';
import { AlertTriangle } from 'lucide-react';

const axisTick = { fontSize: 11, fill: C.muted };
const THRESHOLD = 0.8;

export function LearningTab({ data }: { data: StatsData }) {
  const all = data.period === 'all';
  const activeLabel = all ? 'Gyakorolt' : `Gyakorolt ${periodPhrase(data.period)}`;
  const inactiveLabel = all ? 'Még nem gyakorolt' : 'Nem gyakorolt az időszakban';
  const phaseTicks = useMemo(
    () => data.phases.map(p => p.phase).filter(p => p === 1 || p % 5 === 0),
    [data.phases],
  );

  const graphemes = useMemo(
    () =>
      data.items
        .filter(i => i.category === 'grapheme' && i.answers > 0)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data.items],
  );
  const graphemeChart = graphemes
    .filter(g => g.recentAccuracy !== null)
    .map(g => ({ key: g.key, label: g.label, phase: g.phase, value: Math.round((g.recentAccuracy ?? 0) * 100), children: g.children }));
  const belowThreshold = graphemeChart.filter(g => g.value < THRESHOLD * 100).length;

  const statusRows = data.statusByCategory.filter(s => s.total > 0);

  return (
    <div className="space-y-5">
      <ChartCard
        title="Fázis-eloszlás"
        description={`Minden gyerekprofil az aktuális fázisa szerint · ${all ? 'gyakorolt / még nem gyakorolt' : 'aktív / nem aktív az időszakban'}`}
        info="Minden fázis szerepel a tengelyen, az üresek is, így a távolságok valósak. A fázis a profil MOSTANI állapota; az időszak azt dönti el, melyik színnel látszik: gyakorolt-e a gyerek az időszakban. Összesen nézetben a soha nem gyakorolt profilok válnak el — ezek többsége az 1. fázison áll, mert még el sem kezdte."
        table={
          <DataTable
            rows={data.phases.filter(p => p.active + p.inactive > 0)}
            rowKey={r => String(r.phase)}
            columns={[
              { key: 'phase', label: 'Fázis', render: r => `${r.phase}.` },
              { key: 'active', label: activeLabel, align: 'right', render: r => fmtNum(r.active) },
              { key: 'inactive', label: inactiveLabel, align: 'right', render: r => fmtNum(r.inactive) },
              { key: 'total', label: 'Összesen', align: 'right', render: r => fmtNum(r.active + r.inactive) },
            ]}
          />
        }
      >
        <div className="mb-3 flex gap-4">
          <LegendItem color={C.accent} label={activeLabel} />
          <LegendItem color={C.neutralFill} label={inactiveLabel} />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.phases} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barCategoryGap="18%">
            <CartesianGrid vertical={false} stroke={C.grid} />
            <XAxis
              dataKey="phase"
              ticks={phaseTicks}
              interval={0}
              tick={axisTick}
              tickLine={false}
              axisLine={{ stroke: C.axis }}
              tickFormatter={v => `${v}.`}
            />
            <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              cursor={{ fill: C.subtle }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <TooltipBox
                    title={`${label}. fázis`}
                    rows={[
                      { color: C.accent, label: activeLabel, value: fmtNum(Number(payload[0]?.payload.active ?? 0)) },
                      { color: C.neutralFill, label: inactiveLabel, value: fmtNum(Number(payload[0]?.payload.inactive ?? 0)) },
                    ]}
                  />
                ) : null
              }
            />
            <Bar
              dataKey="active"
              stackId="p"
              fill={C.accent}
              maxBarSize={24}
              stroke={C.surface}
              strokeWidth={1}
              isAnimationActive={false}
              shape={(props: BarShapeProps) => (
                <Rectangle {...props} radius={(props.payload as { inactive: number }).inactive > 0 ? 0 : [4, 4, 0, 0]} />
              )}
            />
            <Bar
              dataKey="inactive"
              stackId="p"
              fill={C.neutralFill}
              maxBarSize={24}
              stroke={C.surface}
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Elemek státusza kategóriánként"
        description={all ? 'Gyerek × elem rekordok megoszlása' : `${periodPhraseStart(data.period)} gyakorolt gyerek × elem rekordok jelenlegi státusza`}
        info={
          <>
            Az app által tárolt státusz. Az élettartam-pontosságon és a gyakorlási körök számán alapul (stabil: ≥ 5 kör és
            ≥ 90%), ezért NEM azonos a szintlépési feltétellel, ami az utolsó válaszok ablakát nézi. A szavak és mondatok
            ritkán ismétlődnek ötször, így náluk a „stabil” arány eleve alacsony.
          </>
        }
        table={
          <DataTable
            rows={statusRows}
            rowKey={r => r.category}
            columns={[
              { key: 'cat', label: 'Kategória', render: r => CATEGORY_LABELS[r.category] },
              ...STATUS_ORDER.map(s => ({
                key: s,
                label: STATUS_LABELS[s],
                align: 'right' as const,
                render: (r: (typeof statusRows)[number]) => fmtNum(r[s]),
              })),
              { key: 'total', label: 'Összesen', align: 'right', render: r => fmtNum(r.total) },
            ]}
          />
        }
      >
        {statusRows.length === 0 ? (
          <EmptyState>Még nincs gyakorlási rekord</EmptyState>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5">
              {STATUS_ORDER.map(s => (
                <LegendItem
                  key={s}
                  color={STATUS_COLORS[s]}
                  label={
                    s === 'needs_review' ? (
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle size={12} style={{ color: C.critical }} />
                        {STATUS_LABELS[s]}
                      </span>
                    ) : (
                      STATUS_LABELS[s]
                    )
                  }
                />
              ))}
            </div>
            <div className="space-y-3">
              {statusRows.map(row => (
                <div key={row.category} className="grid grid-cols-[96px_1fr_72px] items-center gap-3 text-[13px]">
                  <span style={{ color: C.ink2 }}>{CATEGORY_LABELS[row.category]}</span>
                  <div className="flex h-5 w-full gap-[2px] overflow-hidden rounded-[4px]">
                    {STATUS_ORDER.map(s =>
                      row[s] > 0 ? (
                        <div
                          key={s}
                          title={`${STATUS_LABELS[s]}: ${fmtNum(row[s])} (${fmtPct(row[s] / row.total)})`}
                          style={{ width: `${(row[s] / row.total) * 100}%`, background: STATUS_COLORS[s] }}
                        />
                      ) : null,
                    )}
                  </div>
                  <span className="text-right" style={{ color: C.muted, fontVariantNumeric: 'tabular-nums' }}>
                    {fmtNum(row.total)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </ChartCard>

      <ChartCard
        title="Betűk friss pontossága"
        description={`A tanmenet sorrendjében · ${graphemeChart.length} betű ${all ? 'valaha' : periodPhrase(data.period)} gyakorolva, ebből ${belowThreshold} a 80%-os küszöb alatt`}
        info="Betűnként az időszakban gyakorló gyerekek utolsó (legfeljebb 6) válaszából. A szintlépés ugyanezt az ablakot nézi, 80%-os küszöbbel. A táblázatban az élettartam-pontosság (ugyanezen gyerekek összes válasza) és a gyerekenkénti átlag is látszik."
        table={
          <DataTable
            rows={graphemes}
            rowKey={r => r.key}
            columns={[
              { key: 'label', label: 'Betű', render: r => <span className="font-semibold">{r.label}</span> },
              { key: 'phase', label: 'Fázis', align: 'right', render: r => (r.phase ? `${r.phase}.` : '–') },
              { key: 'children', label: 'Gyerekek', align: 'right', render: r => fmtNum(r.children) },
              { key: 'answers', label: 'Válaszok', align: 'right', render: r => fmtNum(r.answers) },
              { key: 'recent', label: 'Friss', align: 'right', render: r => fmtPct(r.recentAccuracy) },
              { key: 'acc', label: 'Élettartam', align: 'right', render: r => fmtPct(r.accuracy) },
              { key: 'mean', label: 'Gyerekátlag', align: 'right', render: r => fmtPct(r.childMeanAccuracy) },
              { key: 'last', label: 'Utoljára', align: 'right', render: r => fmtDaysAgo(r.lastPracticedDaysAgo) },
            ]}
          />
        }
      >
        {graphemeChart.length === 0 ? (
          <EmptyState>Még nincs betűgyakorlás friss válaszablakkal</EmptyState>
        ) : (
          <>
            <div className="mb-3 flex gap-4">
              <LegendItem color={C.accent} label="80% vagy felette" />
              <LegendItem kind="line" color={C.ink2} label="szintlépési küszöb (80%)" />
              <LegendItem
                color={C.critical}
                label={
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle size={12} style={{ color: C.critical }} />
                    80% alatt
                  </span>
                }
              />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={graphemeChart} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis dataKey="label" interval={0} tick={{ ...axisTick, fontSize: 10 }} tickLine={false} axisLine={{ stroke: C.axis }} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={v => `${v}%`} tick={axisTick} tickLine={false} axisLine={false} width={48} />
                <ReferenceLine y={THRESHOLD * 100} stroke={C.ink2} strokeWidth={1} />
                <Tooltip
                  cursor={{ fill: C.subtle }}
                  content={({ active, payload }) => {
                    const p = active ? payload?.[0]?.payload : null;
                    return p ? (
                      <TooltipBox
                        title={`„${p.label}” · ${p.phase ?? '–'}. fázis`}
                        rows={[
                          { color: p.value < 80 ? C.critical : C.accent, label: 'Friss pontosság', value: `${p.value}%` },
                          { color: C.neutralFill, label: 'Gyerekek', value: fmtNum(p.children) },
                        ]}
                      />
                    ) : null;
                  }}
                />
                <Bar dataKey="value" maxBarSize={24} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {graphemeChart.map(g => (
                    <Cell key={g.key} fill={g.value < THRESHOLD * 100 ? C.critical : C.accent} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </ChartCard>

      <Card>
        <CardHeader
          title="Következő lépés: haladási idő"
          description="Eseménynaplóval (phase_events) ide kerül: fázisonként hány kör és nap kell a továbblépéshez, a szintlépés oka (automatikus / biztonsági háló / szülői), és hol morzsolódnak le a gyerekek."
        />
        <div className="pb-4" />
      </Card>
    </div>
  );
}
