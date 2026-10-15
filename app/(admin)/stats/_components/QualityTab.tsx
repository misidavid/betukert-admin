'use client';

import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { QualityLevel, StatsData } from '../../../../lib/stats/types';
import { Card, CardHeader } from './ui';
import { C } from './theme';

const LEVEL = {
  ok: { icon: CheckCircle2, color: C.goodText, label: 'Rendben' },
  info: { icon: Info, color: C.info, label: 'Tájékoztató' },
  warning: { icon: AlertTriangle, color: C.warning, label: 'Figyelmet igényel' },
} satisfies Record<QualityLevel, unknown>;

export function QualityTab({ data }: { data: StatsData }) {
  const warnings = data.quality.filter(q => q.level === 'warning').length;
  return (
    <Card>
      <CardHeader
        title="Adatminőség"
        description={
          warnings > 0
            ? `${warnings} tétel igényel figyelmet · a teljes adatbázison, a szűrőktől függetlenül`
            : 'Nincs figyelmet igénylő tétel · a teljes adatbázison, a szűrőktől függetlenül'
        }
        info="Ezek az ellenőrzések mutatják, mennyire lehet megbízni a többi fül számaiban, és mit korrigál a számítás (összevonás, kizárás)."
      />
      <ul className="mt-3">
        {data.quality.map(q => {
          const { icon: Icon, color, label } = LEVEL[q.level];
          return (
            <li key={q.id} className="flex gap-3 px-5 py-3.5" style={{ borderTop: `1px solid ${C.grid}` }}>
              <Icon size={18} className="mt-0.5 shrink-0" style={{ color }} aria-label={label} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-[14px] font-medium" style={{ color: C.ink }}>{q.label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{q.value}</span>
                </div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed" style={{ color: C.muted }}>{q.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
