'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getStatsAction } from '../../actions/stats';
import type { StatsData, StatsResponse } from '../../../lib/stats/types';
import { StatsDashboard } from './_components/StatsDashboard';

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeInternal, setIncludeInternal] = useState(false);
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
    getStatsAction({ includeInternal: false }).then(result => apply(id, result));
  }, [apply]);

  const reload = (internal: boolean) => {
    const id = ++requestId.current;
    setLoading(true);
    getStatsAction({ includeInternal: internal }).then(result => apply(id, result));
  };

  return (
    <StatsDashboard
      data={data}
      loading={loading}
      error={error}
      includeInternal={includeInternal}
      onIncludeInternalChange={v => {
        setIncludeInternal(v);
        reload(v);
      }}
      onRefresh={() => reload(includeInternal)}
    />
  );
}
