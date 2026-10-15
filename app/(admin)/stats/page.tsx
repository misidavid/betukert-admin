'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getStatsAction } from '../../actions/stats';
import type { StatsData, StatsPeriod, StatsResponse } from '../../../lib/stats/types';
import { StatsDashboard } from './_components/StatsDashboard';

const DEFAULT_PERIOD: StatsPeriod = 30;

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeInternal, setIncludeInternal] = useState(false);
  const [period, setPeriod] = useState<StatsPeriod>(DEFAULT_PERIOD);
  // Gyors kapcsolgatásnál csak a legutolsó kérés válasza érvényes.
  const requestId = useRef(0);

  const apply = useCallback((id: number, result: StatsResponse) => {
    if (id !== requestId.current) return;
    if (result.ok) {
      setData(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const id = ++requestId.current;
    getStatsAction({ includeInternal: false, period: DEFAULT_PERIOD }).then(result => apply(id, result));
  }, [apply]);

  // A szerver 5 percig megőrzi a nyers adatot, így az időszak és a szűrő
  // váltása gyors; a Frissítés gomb (fresh) mindig újraolvassa az adatbázist.
  const reload = (next: { includeInternal: boolean; period: StatsPeriod; fresh?: boolean }) => {
    const id = ++requestId.current;
    setLoading(true);
    getStatsAction(next).then(result => apply(id, result));
  };

  return (
    <StatsDashboard
      data={data}
      loading={loading}
      error={error}
      includeInternal={includeInternal}
      onIncludeInternalChange={v => {
        setIncludeInternal(v);
        reload({ includeInternal: v, period });
      }}
      period={period}
      onPeriodChange={p => {
        setPeriod(p);
        reload({ includeInternal, period: p });
      }}
      onRefresh={() => reload({ includeInternal, period, fresh: true })}
    />
  );
}
