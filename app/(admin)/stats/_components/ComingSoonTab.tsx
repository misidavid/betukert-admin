'use client';

import { Database } from 'lucide-react';
import { Badge, Card, CardHeader } from './ui';
import { C } from './theme';

export interface PlannedView {
  title: string;
  description: string;
  metrics: string[];
  source: string;
  sourceNote: string;
}

export const RETENTION_VIEW: PlannedView = {
  title: 'Megtartás és használat',
  description:
    'Mennyien térnek vissza, milyen gyakran és mennyi ideig gyakorolnak. A mostani adatbázis csak az elemek utolsó állapotát őrzi, a köröket nem, ezért ez a nézet még nem számolható.',
  metrics: [
    'Napi, heti és havi aktív gyerekek, ragadósság (napi / havi arány)',
    'Heti kohorszok megtartása: visszatér-e másnap, egy hét és egy hónap múlva',
    'Körök száma naponta, körhossz eloszlása, félbehagyott körök',
    'Napszak × hét napja hőtérkép',
    'Szabad gyakorlás használata (ma egyáltalán nem rögzül)',
    'Platform és app-verzió szerinti bontás',
  ],
  source: 'practice_sessions',
  sourceNote: 'Körönként egy sor a mobil app kör végi szinkronjából.',
};

export const BUSINESS_VIEW: PlannedView = {
  title: 'Előfizetések',
  description: 'Próbaidő, konverzió és lemondás. Az előfizetési adatok a RevenueCatben vannak, az adminba még nem jutnak el.',
  metrics: [
    'Próbaidőből fizetős előfizetésbe váltók aránya',
    'Aktív előfizetők, lemondások, havi visszatérő bevétel',
    'Paywall-megjelenés → vásárlás arány',
    'Ingyenes és előfizetős gyerekek tanulási haladásának összevetése',
  ],
  source: 'subscription_events',
  sourceNote: 'A RevenueCat webhook (szerver–szerver értesítés) írná.',
};

export function ComingSoonTab({ view }: { view: PlannedView }) {
  return (
    <Card>
      <CardHeader title={view.title} description={view.description} actions={<Badge tone="warning">Adatgyűjtés szükséges</Badge>} />
      <div className="grid grid-cols-1 gap-6 px-5 pb-6 pt-5 md:grid-cols-[1fr_280px]">
        <div>
          <h4 className="mb-2 text-[12px] font-medium uppercase tracking-wide" style={{ color: C.muted }}>
            Tervezett mutatók
          </h4>
          <ul className="space-y-2">
            {view.metrics.map(m => (
              <li key={m} className="flex gap-2.5 text-[13.5px]" style={{ color: C.ink2 }}>
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.axis }} />
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg p-4" style={{ background: C.subtle }}>
          <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: C.ink }}>
            <Database size={15} style={{ color: C.muted }} />
            Adatforrás
          </div>
          <code className="mt-2 block text-[13px]" style={{ color: C.ink }}>{view.source}</code>
          <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: C.muted }}>{view.sourceNote}</p>
        </div>
      </div>
    </Card>
  );
}
