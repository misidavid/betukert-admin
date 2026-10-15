'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import type { ItemCategory, ItemStat, StatsData } from '../../../../lib/stats/types';
import { Card, CardHeader, DataTable, EmptyState, Segmented } from './ui';
import { C, CATEGORY_LABELS, fmtDaysAgo, fmtNum, fmtPct, periodPhrase, periodPhraseStart } from './theme';

type SortKey = 'hardest' | 'easiest' | 'answers' | 'children' | 'stale';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'hardest', label: 'Legnehezebb (megbízható)' },
  { value: 'easiest', label: 'Legkönnyebb (megbízható)' },
  { value: 'answers', label: 'Legtöbb válasz' },
  { value: 'children', label: 'Legtöbb gyerek' },
  { value: 'stale', label: 'Legrégebben gyakorolt' },
];

// A „megbízható” rendezés a Wilson-intervallum szélét használja: a legnehezebb
// az, amelyiknél még a felső határ is alacsony — így 1 válasz 0%-a nem kerül
// a lista élére, 20 válasz 10%-a viszont igen.
const SORTERS: Record<SortKey, (a: ItemStat, b: ItemStat) => number> = {
  hardest: (a, b) => (a.ciHigh ?? 1) - (b.ciHigh ?? 1) || b.answers - a.answers,
  easiest: (a, b) => (b.ciLow ?? 0) - (a.ciLow ?? 0) || b.answers - a.answers,
  answers: (a, b) => b.answers - a.answers,
  children: (a, b) => b.children - a.children || b.answers - a.answers,
  stale: (a, b) => b.lastPracticedDaysAgo - a.lastPracticedDaysAgo,
};

const PAGE_SIZE = 25;
// A konfidencia-sáv: a pontosság-jelölő világosabb, de a sávon jól látható tónusa
const CI_BAND = '#B9D8C0';
const CATEGORIES: (ItemCategory | 'all')[] = ['all', 'grapheme', 'syllable', 'word', 'sentence', 'comprehension'];

function AccuracyCell({ item }: { item: ItemStat }) {
  if (item.accuracy === null) return <span style={{ color: C.muted }}>–</span>;
  const lo = (item.ciLow ?? 0) * 100;
  const hi = (item.ciHigh ?? 1) * 100;
  const p = item.accuracy * 100;
  return (
    <div
      className="flex items-center justify-end gap-2.5"
      title={`${fmtPct(item.accuracy)} · 95%-os intervallum: ${fmtPct(item.ciLow)}–${fmtPct(item.ciHigh)}`}
    >
      <div className="relative h-2 w-20 rounded-full" style={{ background: C.subtle }} aria-hidden>
        <div className="absolute top-0 h-2 rounded-full" style={{ left: `${lo}%`, width: `${Math.max(2, hi - lo)}%`, background: CI_BAND }} />
        <div className="absolute top-[-2px] h-3 w-[3px] rounded-full" style={{ left: `calc(${p}% - 1.5px)`, background: C.accent }} />
      </div>
      <span className="w-10 font-semibold">{fmtPct(item.accuracy)}</span>
    </div>
  );
}

const csvCell = (v: string | number | null) => {
  const s = v === null ? '' : String(v);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function downloadCsv(items: ItemStat[]) {
  const header = ['kategória', 'elem', 'azonosító', 'fázis', 'gyerekek', 'válaszok', 'helyes', 'pontosság', 'ci_alsó', 'ci_felső', 'gyerekátlag', 'friss', 'utoljára_napja'];
  const pct = (v: number | null) => (v === null ? null : (v * 100).toFixed(1).replace('.', ','));
  const lines = items.map(i =>
    [
      CATEGORY_LABELS[i.category],
      i.label,
      i.id,
      i.phase,
      i.children,
      i.answers,
      i.correct,
      pct(i.accuracy),
      pct(i.ciLow),
      pct(i.ciHigh),
      pct(i.childMeanAccuracy),
      pct(i.recentAccuracy),
      i.lastPracticedDaysAgo,
    ]
      .map(csvCell)
      .join(';'),
  );
  // BOM: az Excel így ismeri fel az UTF-8 ékezeteket
  const blob = new Blob(['﻿' + [header.join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `betukert-elemek-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ContentTab({ data }: { data: StatsData }) {
  const [category, setCategory] = useState<ItemCategory | 'all'>('all');
  const [minAnswers, setMinAnswers] = useState(5);
  const [sort, setSort] = useState<SortKey>('hardest');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const counts = useMemo(() => {
    const m = new Map<ItemCategory | 'all', number>([['all', data.items.length]]);
    for (const i of data.items) m.set(i.category, (m.get(i.category) ?? 0) + 1);
    return m;
  }, [data.items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.items
      .filter(i => (category === 'all' || i.category === category) && i.answers >= minAnswers)
      .filter(i => !q || i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
      .sort(SORTERS[sort]);
  }, [data.items, category, minAnswers, sort, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const reset = () => setPage(0);

  const selectStyle = { border: `1px solid ${C.border}`, color: C.ink, background: C.surface };

  return (
    <Card>
      <CardHeader
        title="Elemenkénti teljesítmény"
        description={`${data.period === 'all' ? 'A valaha' : periodPhraseStart(data.period)} gyakorolt betűk, szótagok, szavak és mondatok — gyerekenként összevonva`}
        info={
          <>
            Az elem akkor szerepel, ha {data.period === 'all' ? 'valaha' : periodPhrase(data.period)} legalább egy gyerek
            gyakorolta. A válaszszám és a pontosság élettartam-számláló: ezeknek a gyerekeknek az összes válasza az elemre —
            napokra csak az eseménynapló után bontható. A sáv a 95%-os Wilson-intervallum: kevés válasznál széles.
            Gyerekátlag: a gyerekenkénti pontosságok átlaga, így egy sokat gyakorló gyerek nem nyomja el a többit. Friss: az
            utolsó legfeljebb 6 válasz gyerekenként.
          </>
        }
        actions={
          <button
            type="button"
            onClick={() => downloadCsv(filtered)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium hover:bg-[#F6F3EC]"
            style={{ border: `1px solid ${C.border}`, color: C.ink2 }}
          >
            <Download size={14} /> CSV ({fmtNum(filtered.length)})
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 px-5 pt-4">
        <Segmented
          ariaLabel="Kategória"
          value={category}
          onChange={v => {
            setCategory(v);
            reset();
          }}
          options={CATEGORIES.map(c => ({
            value: c,
            label: (
              <>
                {c === 'all' ? 'Mind' : CATEGORY_LABELS[c]}
                <span className="ml-1" style={{ color: C.muted }}>{fmtNum(counts.get(c) ?? 0)}</span>
              </>
            ),
          }))}
        />
        <label className="flex items-center gap-2 text-[13px]" style={{ color: C.ink2 }}>
          Min. válasz
          <select
            value={minAnswers}
            onChange={e => {
              setMinAnswers(Number(e.target.value));
              reset();
            }}
            className="rounded-lg px-2 py-1 text-[13px]"
            style={selectStyle}
          >
            {[1, 5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px]" style={{ color: C.ink2 }}>
          Rendezés
          <select
            value={sort}
            onChange={e => {
              setSort(e.target.value as SortKey);
              reset();
            }}
            className="rounded-lg px-2 py-1 text-[13px]"
            style={selectStyle}
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
          <input
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              reset();
            }}
            placeholder="Keresés…"
            className="w-48 rounded-lg py-1.5 pl-8 pr-3 text-[13px] outline-none focus:ring-2"
            style={selectStyle}
          />
        </div>
      </div>

      <div className="px-2 pb-2 pt-3">
        {rows.length === 0 ? (
          <div className="px-3 pb-3">
            <EmptyState>Nincs a szűrőknek megfelelő elem</EmptyState>
          </div>
        ) : (
          <DataTable
            rows={rows}
            rowKey={r => r.key}
            columns={[
              {
                key: 'label',
                label: 'Elem',
                render: r => (
                  <div className="min-w-0 max-w-[280px]">
                    <div className="truncate font-semibold" title={r.label}>{r.label}</div>
                    <div className="truncate text-[11.5px]" style={{ color: C.muted }}>
                      {r.id}
                      {r.note && ` · ${r.note}`}
                    </div>
                  </div>
                ),
              },
              { key: 'cat', label: 'Kategória', render: r => <span style={{ color: C.ink2 }}>{CATEGORY_LABELS[r.category]}</span> },
              { key: 'phase', label: 'Fázis', align: 'right', render: r => (r.phase ? `${r.phase}.` : '–') },
              { key: 'children', label: 'Gyerekek', align: 'right', render: r => fmtNum(r.children) },
              { key: 'answers', label: 'Válaszok', align: 'right', render: r => fmtNum(r.answers) },
              { key: 'acc', label: 'Pontosság', align: 'right', render: r => <AccuracyCell item={r} />, width: '170px' },
              { key: 'mean', label: 'Gyerekátlag', align: 'right', render: r => fmtPct(r.childMeanAccuracy) },
              { key: 'recent', label: 'Friss', align: 'right', render: r => fmtPct(r.recentAccuracy) },
              { key: 'last', label: 'Utoljára', align: 'right', render: r => <span style={{ color: C.ink2 }}>{fmtDaysAgo(r.lastPracticedDaysAgo)}</span> },
            ]}
          />
        )}
      </div>

      <div className="flex items-center justify-between px-5 pb-4 text-[13px]" style={{ color: C.muted }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {filtered.length === 0
            ? '0 elem'
            : `${fmtNum(safePage * PAGE_SIZE + 1)}–${fmtNum(Math.min(filtered.length, (safePage + 1) * PAGE_SIZE))} / ${fmtNum(filtered.length)} elem`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Előző oldal"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
            className="rounded-md p-1.5 hover:bg-[#F6F3EC] disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            aria-label="Következő oldal"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(safePage + 1)}
            className="rounded-md p-1.5 hover:bg-[#F6F3EC] disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
