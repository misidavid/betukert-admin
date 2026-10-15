'use client';

import { useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { C } from './theme';

// A statisztika modul építőelemei. Minden nézet ezekből épül, hogy az új
// (eseménynaplós) nézetek is ugyanúgy nézzenek ki és viselkedjenek.

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-xl bg-white ${className}`}
      style={{ border: `1px solid ${C.border}` }}
    >
      {children}
    </section>
  );
}

export function InfoTip({ text, align = 'left' }: { text: ReactNode; align?: 'left' | 'right' }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label="Hogyan számoljuk?"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full outline-none focus-visible:ring-2"
        style={{ color: C.muted }}
      >
        <Info size={14} strokeWidth={2} />
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none invisible absolute top-6 z-30 w-72 rounded-lg px-3 py-2.5 text-xs leading-relaxed opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${align === 'right' ? 'right-0' : 'left-0'}`}
        style={{ background: C.ink, color: '#F4F2EC', fontWeight: 400 }}
      >
        {text}
      </span>
    </span>
  );
}

export function CardHeader({
  title,
  description,
  info,
  actions,
}: {
  title: string;
  description?: ReactNode;
  info?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-5 pt-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[15px] font-semibold" style={{ color: C.ink }}>{title}</h3>
          {info && <InfoTip text={info} />}
        </div>
        {description && <p className="mt-0.5 text-[13px]" style={{ color: C.muted }}>{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex rounded-lg p-0.5" style={{ background: C.subtle }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className="rounded-md px-3 py-1 text-[13px] font-medium transition-colors"
            style={{
              background: active ? C.surface : 'transparent',
              color: active ? C.ink : C.ink2,
              boxShadow: active ? '0 1px 2px rgba(29,33,28,0.12)' : 'none',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[13px]" style={{ color: C.ink2 }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative h-5 w-9 rounded-full transition-colors outline-none focus-visible:ring-2"
        style={{ background: checked ? C.accent : C.axis }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? 18 : 2 }}
        />
      </button>
      {label}
    </label>
  );
}

export function KpiTile({
  label,
  value,
  sub,
  info,
  scope,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  info?: ReactNode;
  /** A mutató érvényességi köre, pl. „utolsó 30 nap" vagy „összesen" */
  scope: string;
}) {
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium" style={{ color: C.ink2 }}>{label}</span>
          {info && <InfoTip text={info} />}
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.muted }}>{scope}</span>
      </div>
      <div className="mt-2 text-[28px] font-semibold leading-tight" style={{ color: C.ink }}>{value}</div>
      {sub && <div className="mt-1 text-[12.5px]" style={{ color: C.muted }}>{sub}</div>}
    </Card>
  );
}

/**
 * Diagram kártya táblázatos nézettel. A tooltip csak kiegészít: minden érték
 * a táblázatból is kiolvasható (akadálymentesség, pontos számok).
 */
export function ChartCard({
  title,
  description,
  info,
  table,
  actions,
  children,
}: {
  title: string;
  description?: ReactNode;
  info?: ReactNode;
  table?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  return (
    <Card>
      <CardHeader
        title={title}
        description={description}
        info={info}
        actions={
          <>
            {actions}
            {table && (
              <Segmented
                ariaLabel="Nézet"
                value={view}
                onChange={setView}
                options={[
                  { value: 'chart', label: 'Diagram' },
                  { value: 'table', label: 'Táblázat' },
                ]}
              />
            )}
          </>
        }
      />
      <div className="px-5 pb-5 pt-4">{view === 'table' && table ? <div className="max-h-[420px] overflow-auto">{table}</div> : children}</div>
    </Card>
  );
}

export interface Column<T> {
  key: string;
  label: ReactNode;
  align?: 'left' | 'right';
  render: (row: T) => ReactNode;
  width?: string;
}

export function DataTable<T>({ columns, rows, rowKey }: { columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string }) {
  return (
    <table className="w-full border-collapse text-[13px]" style={{ fontVariantNumeric: 'tabular-nums' }}>
      <thead className="sticky top-0 z-10 bg-white">
        <tr>
          {columns.map(c => (
            <th
              key={c.key}
              className={`whitespace-nowrap px-3 py-2 text-[12px] font-medium ${c.align === 'right' ? 'text-right' : 'text-left'}`}
              style={{ color: C.muted, borderBottom: `1px solid ${C.grid}`, width: c.width }}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={rowKey(row)} className="hover:bg-[#FAF8F3]">
            {columns.map(c => (
              <td
                key={c.key}
                className={`px-3 py-2 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                style={{ color: C.ink, borderBottom: `1px solid ${C.grid}` }}
              >
                {c.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function LegendItem({ color, label, kind = 'rect' }: { color: string; label: ReactNode; kind?: 'rect' | 'line' }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: C.ink2 }}>
      {kind === 'line' ? (
        <span className="inline-block h-0.5 w-3.5 rounded-full" style={{ background: color }} />
      ) : (
        <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: color }} />
      )}
      {label}
    </span>
  );
}

/** Egységes tooltip a recharts diagramokhoz: az érték az erős elem, a név másodlagos. */
export function TooltipBox({
  title,
  rows,
}: {
  title: ReactNode;
  rows: { color: string; label: ReactNode; value: ReactNode; kind?: 'rect' | 'line' }[];
}) {
  return (
    <div
      className="min-w-[160px] rounded-lg bg-white px-3 py-2 text-[12.5px] shadow-lg"
      style={{ border: `1px solid ${C.border}` }}
    >
      <div className="mb-1 font-medium" style={{ color: C.ink2 }}>{title}</div>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <LegendItem color={r.color} label={r.label} kind={r.kind} />
          <span className="font-semibold" style={{ color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-lg text-[13px]" style={{ background: C.subtle, color: C.muted }}>
      {children}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'warning' | 'critical' }) {
  const styles = {
    neutral: { background: C.subtle, color: C.ink2 },
    accent: { background: C.accentSoft, color: C.goodText },
    warning: { background: C.warningSoft, color: C.warning },
    critical: { background: C.criticalSoft, color: C.critical },
  }[tone];
  return (
    <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[11.5px] font-medium" style={styles}>
      {children}
    </span>
  );
}
