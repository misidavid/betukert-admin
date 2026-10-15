'use client';

import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { StatsData } from '../../../../lib/stats/types';
import { Card, CardHeader, ChartCard, DataTable, KpiTile, LegendItem, TooltipBox } from './ui';
import { C, CATEGORY_LABELS, ORDINAL, fmtLongDate, fmtNum, fmtPct, fmtShortDate } from './theme';

const axisTick = { fontSize: 11, fill: C.muted };

export function OverviewTab({ data, period }: { data: StatsData; period: number }) {
  const { totals } = data;

  const series = useMemo(() => data.daily.slice(-period), [data.daily, period]);
  const previous = useMemo(() => data.daily.slice(-2 * period, -period), [data.daily, period]);
  const signupsNow = series.reduce((s, d) => s + d.signups, 0);
  const signupsPrev = previous.reduce((s, d) => s + d.signups, 0);
  const profilesNow = series.reduce((s, d) => s + d.profiles, 0);

  const practicing = data.practiceRecency.length;
  const activeInPeriod = data.practiceRecency.filter(d => d < period).length;

  const recency = useMemo(() => {
    const r = data.practiceRecency;
    const neverPracticed = Math.max(0, totals.profiles - totals.practicedProfiles);
    return [
      { label: 'Az utolsó 7 napban', value: r.filter(d => d < 7).length, color: ORDINAL[2] },
      { label: '8–30 napja', value: r.filter(d => d >= 7 && d < 30).length, color: ORDINAL[1] },
      { label: 'Több mint 30 napja', value: r.filter(d => d >= 30).length, color: ORDINAL[0] },
      { label: 'Még nem gyakorolt', value: neverPracticed, color: C.neutralFill },
    ];
  }, [data.practiceRecency, totals.profiles, totals.practicedProfiles]);
  const recencyTotal = recency.reduce((s, r) => s + r.value, 0);

  const funnelMax = Math.max(1, ...data.funnel.map(f => f.value));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiTile
          label="Regisztrált fiókok"
          scope="összesen"
          value={fmtNum(totals.accounts)}
          sub={
            <>
              <span style={{ color: C.goodText, fontWeight: 600 }}>+{fmtNum(signupsNow)}</span> az utolsó {period} napban
              {' · '}előtte: {fmtNum(signupsPrev)}
            </>
          }
          info="A Supabase Auth összes fiókja (szülők). Az időszakos szám a regisztráció budapesti naptári napja szerint számol."
        />
        <KpiTile
          label="Gyerekprofilok"
          scope="összesen"
          value={fmtNum(totals.profiles)}
          sub={`${fmtNum(totals.practicedProfiles)} már gyakorolt (${fmtPct(totals.practicedProfiles / Math.max(1, totals.profiles))}) · ${fmtNum(totals.accountsWithProfile)} fiókban`}
          info="A gyakorolt profilnak van legalább egy valódi gyakorlási rekordja. A kézi szintugrás seed-rekordjai nem számítanak gyakorlásnak."
        />
        <KpiTile
          label="Aktív gyerekek"
          scope={`utolsó ${period} nap`}
          value={fmtNum(activeInPeriod)}
          sub={`a gyakorló gyerekek ${fmtPct(activeInPeriod / Math.max(1, practicing))}-a`}
          info={
            <>
              Azok a gyerekek, akik az utolsó {period} naptári napban (a mai napot is beleértve, budapesti idő szerint)
              legalább egy feladatot megoldottak. A szabad gyakorlás nem ír rekordot, ezért nem számít bele.
            </>
          }
        />
        <KpiTile
          label="Rögzített válaszok"
          scope="összesen"
          value={fmtNum(totals.answers)}
          sub="helyes + hibás válasz, elemenként"
          info="A mastery-rekordok helyes és hibás számlálóinak összege. Nem feladatszám: a több célelemű feladatok (pl. szóhúzás) minden elemükre írnak. Pontos feladatszámhoz eseménynapló kell."
        />
        <KpiTile
          label="Betűk friss pontossága"
          scope="jelenlegi"
          value={fmtPct(totals.graphemeRecentAccuracy)}
          sub={`élettartam: ${fmtPct(totals.graphemeLifetimeAccuracy)} · szintlépési küszöb: 80%`}
          info="Betűrekordonként az utolsó legfeljebb 6 válasz (a mobil szintlépése is ezt az ablakot nézi), az összes gyerekre összesítve. Az élettartam-pontosság az összes valaha adott válaszból számol."
        />
        <KpiTile
          label="Ismétlésre szoruló gyerekek"
          scope="jelenlegi"
          value={fmtNum(totals.childrenNeedingReview)}
          sub="legalább egy elemük „ismétlés kell” státuszú"
          info="Az app akkor jelöl egy elemet „ismétlés kell” státuszúnak, ha legalább 2 körben gyakorolták, és az élettartam-pontosság 50% alatti."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Új regisztrációk és gyerekprofilok"
            description={`Naponta, az utolsó ${period} napban · ${fmtNum(signupsNow)} fiók, ${fmtNum(profilesNow)} profil`}
            info="Pontos adat: a fiók és a gyerekprofil létrehozásának időpontjából, budapesti naptári nap szerint."
            table={
              <DataTable
                rows={[...series].reverse()}
                rowKey={r => r.date}
                columns={[
                  { key: 'date', label: 'Nap', render: r => fmtLongDate(r.date) },
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
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <TooltipBox
                        title={fmtLongDate(String(label))}
                        rows={[
                          { kind: 'line', color: C.accent, label: 'Regisztráció', value: fmtNum(Number(payload[0]?.payload.signups ?? 0)) },
                          { kind: 'line', color: C.series2, label: 'Új gyerekprofil', value: fmtNum(Number(payload[0]?.payload.profiles ?? 0)) },
                        ]}
                      />
                    ) : null
                  }
                />
                <Line type="linear" dataKey="signups" stroke={C.accent} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: C.surface, strokeWidth: 2 }} isAnimationActive={false} />
                <Line type="linear" dataKey="profiles" stroke={C.series2} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: C.surface, strokeWidth: 2 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <Card>
          <CardHeader
            title="Utolsó gyakorlás"
            description={`${fmtNum(recencyTotal)} gyerekprofil, a legutóbbi gyakorlás szerint`}
            info="Gyerekenként a legfrissebb gyakorlási rekord napja (budapesti idő). Ez pontos — a napi aktivitás idősorához viszont eseménynapló kell, mert a rekord csak az utolsó gyakorlást őrzi."
          />
          <div className="px-5 pb-5 pt-4">
            <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-[4px]" role="img" aria-label="Gyerekprofilok megoszlása az utolsó gyakorlás szerint">
              {recency.map(r =>
                r.value > 0 ? (
                  <div
                    key={r.label}
                    title={`${r.label}: ${r.value}`}
                    style={{ width: `${(r.value / Math.max(1, recencyTotal)) * 100}%`, background: r.color }}
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
                      {fmtPct(r.value / Math.max(1, recencyTotal))}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Aktiválási tölcsér"
            description="Fiókok, lépcsőnként"
            info="Minden lépcső az előző részhalmaza. A szintlépés lépcső gyakorló gyereket kíván, így a szülői kézi léptetés gyakorlás nélkül nem számít bele."
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
            description="Gyakorolt elemek és pontosság, összesen"
            info="A „Szó” típusú rekordokból a mondatos (s…) és szövegértési (c…) feladatok külön kategóriába kerültek; a régi, előtag nélküli szóazonosítók össze vannak vonva az újjal."
          />
          <div className="px-2 pb-3 pt-2">
            <DataTable
              rows={data.categories}
              rowKey={r => r.category}
              columns={[
                { key: 'cat', label: 'Kategória', render: r => CATEGORY_LABELS[r.category] },
                { key: 'items', label: 'Elemek', align: 'right', render: r => fmtNum(r.items) },
                { key: 'children', label: 'Gyerekek', align: 'right', render: r => fmtNum(r.children) },
                { key: 'answers', label: 'Válaszok', align: 'right', render: r => fmtNum(r.answers) },
                { key: 'acc', label: 'Pontosság', align: 'right', render: r => fmtPct(r.accuracy) },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
