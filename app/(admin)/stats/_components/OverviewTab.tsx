'use client';

import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DailyPoint, StatsData } from '../../../../lib/stats/types';
import { Card, CardHeader, ChartCard, DataTable, KpiTile, LegendItem, TooltipBox } from './ui';
import { C, CATEGORY_LABELS, ORDINAL, fmtLongDate, fmtNum, fmtPct, fmtShortDate, periodPhrase, periodPhraseStart, periodScope } from './theme';

const axisTick = { fontSize: 11, fill: C.muted };

// Hosszú időszaknál (összesen nézet) a napi pontok helyett heti összegek —
// 120 nap fölött a napi vonal már olvashatatlanul fogazott.
const WEEKLY_THRESHOLD = 120;

interface SeriesPoint extends DailyPoint {
  /** Heti bontásnál a hét utolsó napja, napinál azonos a date-tel */
  until: string;
}

const toSeries = (daily: DailyPoint[]): { points: SeriesPoint[]; weekly: boolean } => {
  if (daily.length <= WEEKLY_THRESHOLD) return { points: daily.map(d => ({ ...d, until: d.date })), weekly: false };
  // A heteket a mai naptól visszafelé vágjuk, így az utolsó pont mindig teljes, mai végű hét.
  const points: SeriesPoint[] = [];
  for (let end = daily.length; end > 0; end -= 7) {
    const chunk = daily.slice(Math.max(0, end - 7), end);
    points.unshift({
      date: chunk[0].date,
      until: chunk[chunk.length - 1].date,
      signups: chunk.reduce((s, d) => s + d.signups, 0),
      profiles: chunk.reduce((s, d) => s + d.profiles, 0),
    });
  }
  return { points, weekly: true };
};

const prevNote = (prev: number | null, days: number) => (prev === null ? null : `előző ${days} nap: ${fmtNum(prev)}`);

export function OverviewTab({ data }: { data: StatsData }) {
  const { totals, period } = data;
  const all = period === 'all';
  const days = all ? 0 : period;
  const scope = periodScope(period);

  const { points: series, weekly } = useMemo(() => toSeries(data.daily), [data.daily]);
  const signupsSum = data.daily.reduce((s, d) => s + d.signups, 0);
  const profilesSum = data.daily.reduce((s, d) => s + d.profiles, 0);

  // Az időszakban létrehozott profil nem gyakorolhatott régebben, mint az
  // időszak hossza — a lehetetlen sávokat (pl. 7 napnál „8–30 napja") elhagyjuk.
  const recency = [
    { label: 'Az utolsó 7 napban', value: data.recency.last7, color: ORDINAL[2], minDaysAgo: 0 },
    { label: '8–30 napja', value: data.recency.days8to30, color: ORDINAL[1], minDaysAgo: 7 },
    { label: 'Több mint 30 napja', value: data.recency.over30, color: ORDINAL[0], minDaysAgo: 30 },
    { label: 'Még nem gyakorolt', value: data.recency.never, color: C.neutralFill, minDaysAgo: 0 },
  ].filter(r => all || period > r.minDaysAgo);
  const recencyTotal = recency.reduce((s, r) => s + r.value, 0);

  const funnelMax = Math.max(1, ...data.funnel.map(f => f.value));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiTile
          label={all ? 'Regisztrált fiókok' : 'Új regisztrációk'}
          scope={scope}
          value={fmtNum(totals.accounts)}
          sub={
            all
              ? `${fmtNum(totals.accountsWithProfile)} fiókban van gyerekprofil`
              : [prevNote(totals.accountsPrev, days), `mindösszesen ${fmtNum(totals.accountsTotal)} fiók`].join(' · ')
          }
          info="A szülői fiókok a regisztráció budapesti naptári napja szerint. Az előző időszak az ugyanilyen hosszú, közvetlenül megelőző időszak."
        />
        <KpiTile
          label={all ? 'Gyerekprofilok' : 'Új gyerekprofilok'}
          scope={scope}
          value={fmtNum(totals.profiles)}
          sub={[
            `${fmtNum(totals.practicedProfiles)} már gyakorolt (${fmtPct(totals.practicedProfiles / Math.max(1, totals.profiles))})`,
            all ? null : prevNote(totals.profilesPrev, days),
          ]
            .filter(Boolean)
            .join(' · ')}
          info="A gyerekprofilok a létrehozásuk napja szerint. Gyakorolt: van legalább egy valódi gyakorlási rekordja (a kézi szintugrás seed-rekordjai nem számítanak)."
        />
        <KpiTile
          label={all ? 'Gyakorló gyerekek' : 'Aktív gyerekek'}
          scope={scope}
          value={fmtNum(all ? totals.practicingTotal : totals.activeChildren)}
          sub={
            all
              ? `legalább egyszer gyakoroltak · a profilok ${fmtPct(totals.practicingTotal / Math.max(1, totals.profilesTotal))}-a`
              : `a valaha gyakorló ${fmtNum(totals.practicingTotal)} gyerek ${fmtPct(totals.activeChildren / Math.max(1, totals.practicingTotal))}-a`
          }
          info={
            <>
              Azok a gyerekek, akik {periodPhrase(period)} legalább egy feladatot megoldottak (budapesti naptári nap szerint,
              a mai napot is beleértve). A szabad gyakorlás nem ír rekordot, ezért nem számít bele.
            </>
          }
        />
        <KpiTile
          label="Rögzített válaszok"
          scope="összesen"
          unscoped={!all}
          value={fmtNum(totals.answers)}
          sub={all ? 'helyes + hibás válasz, elemenként' : 'időszakra nem bontható — a naplózás után lesz'}
          info="A mastery-rekordok helyes és hibás számlálóinak összege. Ezek élettartam-számlálók: az adatbázis nem tárolja, mikor érkezett egy válasz, ezért időszakra csak az eseménynapló bevezetése után bontható. Nem is feladatszám: a több célelemű feladatok (pl. szóhúzás) minden elemükre írnak."
        />
        <KpiTile
          label="Betűk friss pontossága"
          scope={scope}
          value={fmtPct(totals.graphemeRecentAccuracy)}
          sub={`élettartam: ${fmtPct(totals.graphemeLifetimeAccuracy)} · szintlépési küszöb: 80%`}
          info={
            <>
              A {all ? 'valaha' : periodPhrase(period)} gyakorolt betűrekordok utolsó (legfeljebb 6) válasza, az összes gyerekre
              összesítve — a mobil szintlépése is ezt az ablakot nézi. Az élettartam-pontosság ugyanezeknek a rekordoknak az
              összes valaha adott válaszából számol.
            </>
          }
        />
        <KpiTile
          label="Ismétlésre szoruló gyerekek"
          scope={scope}
          value={fmtNum(totals.childrenNeedingReview)}
          sub={all ? 'legalább egy elemük „ismétlés kell” státuszú' : 'az időszakban gyakorlók közül, jelenlegi állapot'}
          info="Azok a gyerekek, akiknek legalább egy eleme most „ismétlés kell” státuszú. Az app akkor jelöl így egy elemet, ha legalább 2 körben gyakorolták, és az élettartam-pontossága 50% alatti."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Új regisztrációk és gyerekprofilok"
            description={`${weekly ? 'Hetente' : 'Naponta'}, ${periodPhrase(period)} · ${fmtNum(signupsSum)} fiók, ${fmtNum(profilesSum)} profil`}
            info="Pontos adat: a fiók és a gyerekprofil létrehozásának időpontjából, budapesti naptári nap szerint. 120 napnál hosszabb időszakot heti összegekben mutat."
            table={
              <DataTable
                rows={[...series].reverse()}
                rowKey={r => r.date}
                columns={[
                  {
                    key: 'date',
                    label: weekly ? 'Hét' : 'Nap',
                    render: r => (weekly ? `${fmtLongDate(r.date)} – ${fmtShortDate(r.until)}` : fmtLongDate(r.date)),
                  },
                  { key: 'signups', label: 'Regisztráció', align: 'right', render: r => fmtNum(r.signups) },
                  { key: 'profiles', label: 'Új gyerekprofil', align: 'right', render: r => fmtNum(r.profiles) },
                ]}
              />
            }
          >
            <div className="mb-3 flex gap-4">
              <LegendItem kind="line" color={C.accent} label="Regisztráció" />
              <LegendItem kind="line" color={C.series2} label="Új gyerekprofil" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtShortDate}
                  tick={axisTick}
                  tickLine={false}
                  axisLine={{ stroke: C.axis }}
                  minTickGap={24}
                />
                <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={40} />
                <Tooltip
                  cursor={{ stroke: C.axis, strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    const p = active ? (payload?.[0]?.payload as SeriesPoint | undefined) : undefined;
                    return p ? (
                      <TooltipBox
                        title={weekly ? `${fmtLongDate(p.date)} – ${fmtShortDate(p.until)}` : fmtLongDate(p.date)}
                        rows={[
                          { kind: 'line', color: C.accent, label: 'Regisztráció', value: fmtNum(p.signups) },
                          { kind: 'line', color: C.series2, label: 'Új gyerekprofil', value: fmtNum(p.profiles) },
                        ]}
                      />
                    ) : null;
                  }}
                />
                <Line type="linear" dataKey="signups" stroke={C.accent} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: C.surface, strokeWidth: 2 }} isAnimationActive={false} />
                <Line type="linear" dataKey="profiles" stroke={C.series2} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: C.surface, strokeWidth: 2 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <Card>
          <CardHeader
            title={all ? 'Utolsó gyakorlás' : 'Az új profilok aktivitása'}
            description={
              all
                ? `${fmtNum(recencyTotal)} gyerekprofil, a legutóbbi gyakorlás szerint`
                : `${periodPhraseStart(period)} létrehozott ${fmtNum(recencyTotal)} profil, a legutóbbi gyakorlás szerint`
            }
            info="Profilonként a legfrissebb gyakorlási rekord napja (budapesti idő). Időszakos nézetben az időszakban létrehozott profilokat mutatja: elkezdtek-e gyakorolni, és mikor jártak utoljára az appban."
          />
          <div className="px-5 pb-5 pt-4">
            {recencyTotal === 0 ? (
              <p className="text-[13px]" style={{ color: C.muted }}>Ebben az időszakban nem jött létre gyerekprofil.</p>
            ) : (
              <>
                <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-[4px]" role="img" aria-label="Gyerekprofilok megoszlása az utolsó gyakorlás szerint">
                  {recency.map(r =>
                    r.value > 0 ? (
                      <div
                        key={r.label}
                        title={`${r.label}: ${r.value}`}
                        style={{ width: `${(r.value / recencyTotal) * 100}%`, background: r.color }}
                      />
                    ) : null,
                  )}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {recency.map(r => (
                    <li key={r.label} className="flex items-center justify-between text-[13px]">
                      <LegendItem color={r.color} label={r.label} />
                      <span style={{ color: C.ink, fontVariantNumeric: 'tabular-nums' }}>
                        <span className="font-semibold">{fmtNum(r.value)}</span>
                        <span className="ml-2 inline-block w-10 text-right" style={{ color: C.muted }}>
                          {fmtPct(r.value / recencyTotal)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Aktiválási tölcsér"
            description={all ? 'Minden fiók, lépcsőnként' : `${periodPhraseStart(period)} regisztrált fiókok, lépcsőnként`}
            info="Minden lépcső az előző részhalmaza; a lépcsők a fiókok MOSTANI állapotát mutatják. A szintlépés lépcső gyakorló gyereket kíván, így a szülői kézi léptetés gyakorlás nélkül nem számít bele."
          />
          <div className="space-y-3 px-5 pb-5 pt-4">
            {data.funnel.map((step, i) => {
              const prev = i > 0 ? data.funnel[i - 1].value : null;
              return (
                <div key={step.label} title={step.hint}>
                  <div className="mb-1 flex items-baseline justify-between text-[13px]">
                    <span style={{ color: C.ink2 }}>{step.label}</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                      <span className="font-semibold" style={{ color: C.ink }}>{fmtNum(step.value)}</span>
                      {prev !== null && (
                        <span className="ml-2" style={{ color: C.muted }}>
                          {fmtPct(prev > 0 ? step.value / prev : null)} az előzőből
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-[4px]" style={{ background: C.subtle }}>
                    <div
                      className="h-full rounded-[4px]"
                      style={{ width: `${(step.value / funnelMax) * 100}%`, background: C.accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Tananyag-kategóriák"
            description={all ? 'Valaha gyakorolt elemek' : `${periodPhraseStart(period)} gyakorolt elemek`}
            info="Elemek és gyerekek: akik és amik az időszakban gyakoroltak. A friss pontosság az utolsó (legfeljebb 6) válaszból számol; az élettartam-pontosság ugyanezeknek a rekordoknak az összes válaszából. A mondatos (s…) és szövegértési (c…) feladatok külön kategóriában vannak."
          />
          <div className="px-2 pb-3 pt-2">
            <DataTable
              rows={data.categories}
              rowKey={r => r.category}
              columns={[
                { key: 'cat', label: 'Kategória', render: r => CATEGORY_LABELS[r.category] },
                { key: 'items', label: 'Elemek', align: 'right', render: r => fmtNum(r.items) },
                { key: 'children', label: 'Gyerekek', align: 'right', render: r => fmtNum(r.children) },
                { key: 'recent', label: 'Friss', align: 'right', render: r => fmtPct(r.recentAccuracy) },
                { key: 'acc', label: 'Élettartam', align: 'right', render: r => fmtPct(r.accuracy) },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
