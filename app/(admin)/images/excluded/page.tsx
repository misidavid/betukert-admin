'use client';

import { useState, useEffect } from 'react';
import { ImageNeed } from '../../../lib/supabase';
import { fetchImageNeedsAction, toggleImageNeedExerciseTypeAction, bulkRestoreImageExerciseTypesAction } from '../../actions/imageNeeds';
import { ExerciseTypeConfig } from '../../actions/exerciseTypeConfig';
import Link from 'next/link';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const MUTED = '#8A8478';
const TRACK = '#F1ECE0';
const display = { fontFamily: 'var(--font-display)' };

export default function ExcludedWordsPage() {
  const [items, setItems] = useState<ImageNeed[]>([]);
  const [configs, setConfigs] = useState<ExerciseTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    const { items: imageData, configs: configData } = await fetchImageNeedsAction();
    setItems(imageData);
    setConfigs(configData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const imageRequiredTypes = configs.map(c => c.id);

  // Kizárt: egyetlen képköteles feladattípushoz sem tartozik
  const excludedItems = items.filter(item =>
    !item.exercise_types?.some(t => imageRequiredTypes.includes(t))
  );

  const searchTerm = search.trim().toLowerCase();
  const filtered = excludedItems.filter(item =>
    !searchTerm || item.word.toLowerCase().includes(searchTerm)
  );

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allIds = filtered.map(i => i.id);
    const allSelected = allIds.every(id => selected.has(id));
    setSelected(allSelected ? new Set() : new Set(allIds));
  };

  const handleBulkRestore = async () => {
    setBulkWorking(true);
    const ids = filtered.filter(i => selected.has(i.id)).map(i => i.id);
    const result = await bulkRestoreImageExerciseTypesAction(ids);
    if (result.error) {
      setMessage(`❌ Hiba: ${result.error}`);
    } else {
      setMessage(`✅ ${result.updated} szó visszakerült a képköteles feladattípusokba.`);
    }
    setSelected(new Set());
    setBulkWorking(false);
    loadData();
  };

  const handleToggleType = async (id: string, type: string, included: boolean) => {
    const result = await toggleImageNeedExerciseTypeAction(id, type, included);
    if (result.error) setMessage(`❌ Hiba: ${result.error}`);
    else loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/images" className="text-sm hover:underline" style={{ color: GREEN }}>
              ← Vissza a képekhez
            </Link>
          </div>
          <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
            🚫 Kizárt szavak
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Szavak, amelyek egyetlen képköteles feladattípushoz sem tartoznak. A szóbankban továbbra is szerepelnek.
          </p>
        </div>
      </div>

      {message && (
        <div className="bg-white rounded-[24px] shadow-sm p-4 text-sm" style={{ color: GREEN_DARK }}>{message}</div>
      )}

      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="search"
          placeholder="Keresés szóra..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK, minWidth: 180 }}
        />
        <label className="flex items-center gap-2 cursor-pointer self-center ml-auto">
          <input
            type="checkbox"
            checked={filtered.length > 0 && filtered.every(i => selected.has(i.id))}
            onChange={toggleSelectAll}
            className="w-4 h-4 cursor-pointer"
            style={{ accentColor: GREEN }}
          />
          <span className="text-sm" style={{ color: MUTED }}>
            {selected.size > 0 ? `${selected.size} / ${filtered.length} kijelölve` : `${filtered.length} elem`}
          </span>
        </label>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 flex-wrap rounded-[24px] px-4 py-3" style={{ background: GREEN_LIGHT }}>
          <span className="text-sm mr-1" style={{ fontWeight: 700, color: GREEN_DARK }}>{selected.size} kijelölve</span>
          <button
            onClick={handleBulkRestore}
            disabled={bulkWorking}
            className="text-xs px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            style={{ background: '#FFFFFF', color: GREEN_DARK, fontWeight: 600 }}
          >
            {bulkWorking ? 'Visszavétel...' : '↩️ Visszavétel a képköteles típusokba'}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs px-3 py-1.5 rounded-xl transition-colors ml-auto"
            style={{ color: GREEN_DARK }}
          >
            Kijelölés törlése
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Betöltés...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#B5AE9E' }}>
          {excludedItems.length === 0 ? 'Nincs kizárt szó.' : 'Nincs találat.'}
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden divide-y" style={{ borderColor: TRACK }}>
          {filtered.map(item => (
            <div key={item.id} className="p-4 flex items-center gap-4" style={{ borderColor: '#F1ECE0' }}>
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="w-4 h-4 flex-shrink-0 cursor-pointer"
                style={{ accentColor: GREEN }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{item.word}</span>
                  <span className="text-xs" style={{ color: '#B5AE9E' }}>{item.phase}. szint</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#B5AE9E' }}>
                  {item.syllables?.join('-')} • Első hang: {item.first_sound}
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {configs.map(c => {
                    const included = item.exercise_types?.includes(c.id) ?? false;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleToggleType(item.id, c.id, !included)}
                        title={included ? `Kizárás innen: ${c.label}` : `Visszavétel ide: ${c.label}`}
                        className="text-[11px] px-2 py-0.5 rounded-full transition-colors"
                        style={included
                          ? { background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }
                          : { background: TRACK, color: '#B5AE9E', fontWeight: 500 }}
                      >
                        {included ? '✓ ' : '+ '}{c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
