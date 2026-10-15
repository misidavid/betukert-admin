'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { STATS_PERIODS, type StatsData, type StatsPeriod } from '../../../../lib/stats/types';
import { OverviewTab } from './OverviewTab';
import { LearningTab } from './LearningTab';
import { ContentTab } from './ContentTab';
import { QualityTab } from './QualityTab';
import { BUSINESS_VIEW, ComingSoonTab, RETENTION_VIEW } from './ComingSoonTab';
import { Card, Segmented, Switch } from './ui';
import { C, fmtNum, periodOption } from './theme';

type TabId = 'overview' | 'learning' | 'content' | 'quality' | 'retention' | 'business';

const TABS: { id: TabId; label: string; soon?: boolean; periodAware?: boolean }[] = [
  { id: 'overview', label: 'Áttekintés', periodAware: true },
  { id: 'learning', label: 'Tanulás', periodAware: true },
  { id: 'content', label: 'Tartalom', periodAware: true },
  { id: 'quality', label: 'Adatminőség' },
  { id: 'retention', label: 'Megtartás', soon: true },
  { id: 'business', label: 'Előfizetések', soon: true },
];

export function StatsDashboard({
  data,
  loading,
  error,
  includeInternal,
  onIncludeInternalChange,
  period,
  onPeriodChange,
  onRefresh,
}: {
  data: StatsData | null;
  loading: boolean;
  error: string | null;
  includeInternal: boolean;
  onIncludeInternalChange: (v: boolean) => void;
  period: StatsPeriod;
  onPeriodChange: (p: StatsPeriod) => void;
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<TabId>('overview');
  const warnings = data?.quality.filter(q => q.level === 'warning').length ?? 0;

  const updatedAt = data
    ? new Date(data.generatedAt).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Budapest' })
    : null;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight" style={{ color: C.ink }}>Statisztika</h1>
          <p className="mt-0.5 text-[13.5px]" style={{ color: C.muted }}>
            A mobilapp használata, a gyerekek tanulási haladása és a tananyag teljesítménye
          </p>
        </div>
        <div className="flex items-center gap-3 text-[13px]" style={{ color: C.muted }}>
          {updatedAt && <span>Frissítve {updatedAt}</span>}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-medium hover:bg-[#F6F3EC] disabled:opacity-50"
            style={{ border: `1px solid ${C.border}`, color: C.ink2 }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Frissítés
          </button>
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto" style={{ borderBottom: `1px solid ${C.border}` }} role="tablist">
        {TABS.map(t => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className="-mb-px inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[14px] font-medium transition-colors"
              style={{
                color: active ? C.ink : C.muted,
                borderBottom: `2px solid ${active ? C.accent : 'transparent'}`,
              }}
            >
              {t.label}
              {t.soon && (
                <span className="rounded px-1 py-px text-[10.5px] font-medium" style={{ background: C.subtle, color: C.muted }}>
                  hamarosan
                </span>
              )}
              {t.id === 'quality' && warnings > 0 && (
                <span
                  className="inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-semibold"
                  style={{ background: C.warningSoft, color: C.warning }}
                  aria-label={`${warnings} figyelmeztetés`}
                >
                  {warnings}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {TABS.find(t => t.id === tab)?.periodAware ? (
          <div className="flex items-center gap-2 text-[13px]" style={{ color: C.ink2 }}>
            Időszak
            <Segmented
              ariaLabel="Időszak"
              value={period}
              onChange={onPeriodChange}
              options={STATS_PERIODS.map(p => ({ value: p, label: periodOption(p) }))}
            />
          </div>
        ) : (
          tab === 'quality' && (
            <span className="text-[12.5px]" style={{ color: C.muted }}>Az adatminőség a teljes adatbázisra vonatkozik, időszaktól függetlenül.</span>
          )
        )}
        <Switch
          checked={includeInternal}
          onChange={onIncludeInternalChange}
          label="Belső fiókok is (admin, teszt, demo)"
        />
        {data && !data.includeInternal && data.internal.accounts > 0 && (
          <span className="text-[12.5px]" style={{ color: C.muted }}>
            Kizárva: {fmtNum(data.internal.accounts)} fiók, {fmtNum(data.internal.profiles)} profil, {fmtNum(data.internal.records)} rekord
          </span>
        )}
      </div>

      {error ? (
        <Card className="px-5 py-4">
          <p className="text-[13.5px]" style={{ color: C.critical }}>A statisztika betöltése nem sikerült: {error}</p>
        </Card>
      ) : !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-[118px] animate-pulse rounded-xl" style={{ background: '#EFEBE2' }} />
          ))}
        </div>
      ) : (
        // Újratöltéskor az előző állapot halványan marad — nincs ugrálás, villanás.
        <div className="transition-opacity" style={{ opacity: loading ? 0.55 : 1 }} aria-busy={loading}>
          {tab === 'overview' && <OverviewTab data={data} />}
          {tab === 'learning' && <LearningTab data={data} />}
          {tab === 'content' && <ContentTab data={data} />}
          {tab === 'quality' && <QualityTab data={data} />}
          {tab === 'retention' && <ComingSoonTab view={RETENTION_VIEW} />}
          {tab === 'business' && <ComingSoonTab view={BUSINESS_VIEW} />}
        </div>
      )}
    </div>
  );
}
