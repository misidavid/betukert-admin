'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, ImageNeed, ImageStatus } from '../../lib/supabase';
import { generateImageNeedsAction, uploadImageFileAction, updateImageNeedStatusAction, deleteImageFileAction } from '../actions/imageNeeds';
import Link from 'next/link';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const MUTED = '#8A8478';
const TRACK = '#F1ECE0';
const RED_LIGHT = '#FBE7E5';
const RED_TEXT = '#8A4A44';
const display = { fontFamily: 'var(--font-display)' };

const STATUS_LABELS: Record<ImageStatus, string> = {
  missing: 'Hiányzó',
  uploaded: 'Feltöltve',
  approved: 'Jóváhagyva',
  published: 'Publikált',
  rejected: 'Elutasítva',
  needs_replacement: 'Csere szükséges',
};

const STATUS_COLORS: Record<ImageStatus, { bg: string; text: string }> = {
  missing: { bg: RED_LIGHT, text: RED_TEXT },
  uploaded: { bg: '#E3EDF7', text: '#3A5A7A' },
  approved: { bg: '#FBF3DD', text: '#8A6A1F' },
  published: { bg: GREEN_LIGHT, text: GREEN_DARK },
  rejected: { bg: TRACK, text: MUTED },
  needs_replacement: { bg: '#FBE9DC', text: '#8A5A2F' },
};

function StatusChip({ status }: { status: ImageStatus }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full"
      style={{ background: STATUS_COLORS[status].bg, color: STATUS_COLORS[status].text, fontWeight: 600 }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface ExerciseTypeConfig {
  id: string;
  label: string;
  requires_image: boolean;
}

export default function ImagesPage() {
  const [items, setItems] = useState<ImageNeed[]>([]);
  const [configs, setConfigs] = useState<ExerciseTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<ImageStatus | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; word: string } | null>(null);
  const [replaceConfirm, setReplaceConfirm] = useState<ImageNeed | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const savedScrollY = useRef<number | null>(null);

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSelected(new Set());
  }, [filter, phaseFilter, typeFilter]);

  const loadData = async (preserveScroll = false) => {
    if (preserveScroll) {
      savedScrollY.current = window.scrollY;
    }
    setLoading(true);

    const [{ data: imageData }, { data: configData }] = await Promise.all([
      supabase.from('image_needs').select('*').order('phase', { ascending: true }),
      supabase.from('exercise_type_config').select('*').eq('requires_image', true),
    ]);

    if (imageData) setItems(imageData);
    if (configData) setConfigs(configData);
    setLoading(false);
  };

  useEffect(() => {
    if (savedScrollY.current !== null) {
      const y = savedScrollY.current;
      savedScrollY.current = null;
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }));
    }
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('');
    const result = await generateImageNeedsAction();
    if (result.error) {
      setMessage(`❌ Hiba: ${result.error}`);
    } else {
      setMessage(`✅ ${result.inserted} új képszükséglet generálva, ${result.skipped} már létezett.`);
      loadData();
    }
    setGenerating(false);
  };

  const handleUpload = async (item: ImageNeed, file: File) => {
    setUploadingId(item.id);
    try {
      const fd = new FormData();
      fd.append('id', item.id);
      fd.append('phase', String(item.phase));
      fd.append('word', item.word);
      fd.append('file', file);
      const result = await uploadImageFileAction(fd);
      if (result.error) {
        setMessage(`❌ Feltöltési hiba: ${result.error}`);
      } else {
        loadData(true);
      }
    } catch (e: any) {
      setMessage(`❌ Feltöltési hiba: ${e?.message ?? 'Ismeretlen hiba'}`);
    }
    setUploadingId(null);
  };

  const handleDelete = async (item: ImageNeed) => {
    if (!item.file_path) return;
    setDeletingId(item.id);
    try {
      const result = await deleteImageFileAction(item.id);
      if (result.error) setMessage(`❌ Törlési hiba: ${result.error}`);
      else loadData(true);
    } catch (e: any) {
      setMessage(`❌ Törlési hiba: ${e?.message ?? 'Ismeretlen hiba'}`);
    }
    setDeletingId(null);
  };

  const handleStatusChange = async (id: string, status: ImageStatus) => {
    const result = await updateImageNeedStatusAction(id, status);
    if (result.error) setMessage(`❌ Hiba: ${result.error}`);
    else loadData(true);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (items: ImageNeed[]) => {
    const allIds = items.map(i => i.id);
    const allSelected = allIds.every(id => selected.has(id));
    setSelected(allSelected ? new Set() : new Set(allIds));
  };

  const handleBulkStatusChange = async (status: ImageStatus) => {
    setBulkWorking(true);
    const selectedItems = filtered.filter(i => selected.has(i.id));
    await Promise.all(selectedItems.map(item => updateImageNeedStatusAction(item.id, status)));
    setSelected(new Set());
    setBulkWorking(false);
    loadData(true);
  };

  const handleBulkDelete = async () => {
    setBulkWorking(true);
    const selectedItems = filtered.filter(i => selected.has(i.id));
    const toDelete = selectedItems.filter(i => i.file_path && i.status !== 'published');
    const toReplace = selectedItems.filter(i => i.status === 'published');
    await Promise.all([
      ...toDelete.map(item => deleteImageFileAction(item.id)),
      ...toReplace.map(item => updateImageNeedStatusAction(item.id, 'needs_replacement')),
    ]);
    setSelected(new Set());
    setBulkWorking(false);
    loadData(true);
  };

  // Csak képköteles feladattípusokhoz tartozó szavak
  const imageRequiredTypes = configs.map(c => c.id);

  const relevantItems = items.filter(item =>
    item.exercise_types?.some(t => imageRequiredTypes.includes(t))
  );

  // Feladattípusonként csoportosítás
  const groupedByType: Record<string, { config: ExerciseTypeConfig; items: ImageNeed[] }> = {};
  for (const config of configs) {
    const typeItems = relevantItems.filter(item =>
      item.exercise_types?.includes(config.id)
    );
    if (typeItems.length > 0) {
      groupedByType[config.id] = { config, items: typeItems };
    }
  }

  const searchTerm = search.trim().toLowerCase();

  const filtered = relevantItems.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (phaseFilter !== 'all' && item.phase !== phaseFilter) return false;
    if (typeFilter !== 'all' && !item.exercise_types?.includes(typeFilter)) return false;
    if (searchTerm && !item.word.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  const phases = [...new Set(relevantItems.map(i => i.phase))].sort((a, b) => a - b);

  const stats = {
    total: relevantItems.length,
    missing: relevantItems.filter(i => i.status === 'missing').length,
    uploaded: relevantItems.filter(i => i.status === 'uploaded').length,
    approved: relevantItems.filter(i => i.status === 'approved').length,
    published: relevantItems.filter(i => i.status === 'published').length,
  };

  const renderItem = (item: ImageNeed) => (
    <div key={item.id} className="bg-white rounded-[24px] shadow-sm p-4 flex items-center gap-4">
      <input
        type="checkbox"
        checked={selected.has(item.id)}
        onChange={() => toggleSelect(item.id)}
        className="w-4 h-4 flex-shrink-0 cursor-pointer"
        style={{ accentColor: GREEN }}
      />
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: TRACK }}>
        {item.file_url ? (
          <img
            src={item.file_url}
            alt={item.word}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setLightbox({ url: item.file_url!, word: item.word })}
          />
        ) : (
          <span className="text-2xl">🖼️</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{item.word}</span>
          <span className="text-xs" style={{ color: '#B5AE9E' }}>{item.phase}. szint</span>
          <StatusChip status={item.status} />
        </div>
        <div className="text-sm mt-1" style={{ color: MUTED }}>
          {item.syllables?.join('-')} • Első hang: {item.first_sound}
        </div>
        <div className="text-xs mt-1" style={{ color: '#B5AE9E' }}>{item.image_brief}</div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              if (e.target.files?.[0]) handleUpload(item, e.target.files[0]);
            }}
            disabled={uploadingId === item.id}
          />
          <span
            className="text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            style={{ background: STATUS_COLORS.uploaded.bg, color: STATUS_COLORS.uploaded.text, fontWeight: 600 }}
          >
            {uploadingId === item.id ? 'Feltöltés...' : '⬆️ Feltöltés'}
          </span>
        </label>

        {item.status === 'uploaded' && (
          <>
            <button
              onClick={() => handleStatusChange(item.id, 'approved')}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: STATUS_COLORS.approved.bg, color: STATUS_COLORS.approved.text, fontWeight: 600 }}
            >
              ✓ Jóváhagyás
            </button>
            <button
              onClick={() => handleStatusChange(item.id, 'rejected')}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: TRACK, color: MUTED, fontWeight: 600 }}
            >
              ✕ Elutasítás
            </button>
          </>
        )}
        {item.status === 'approved' && (
          <button
            onClick={() => handleStatusChange(item.id, 'published')}
            className="text-xs px-3 py-1.5 rounded-xl transition-colors"
            style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }}
          >
            🚀 Publikálás
          </button>
        )}
        {item.file_path && (
          item.status === 'published' ? (
            <button
              onClick={() => setReplaceConfirm(item)}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: STATUS_COLORS.needs_replacement.bg, color: STATUS_COLORS.needs_replacement.text, fontWeight: 600 }}
            >
              🔄 Csere
            </button>
          ) : (
            <button
              onClick={() => handleDelete(item)}
              disabled={deletingId === item.id}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
              style={{ background: RED_LIGHT, color: RED_TEXT, fontWeight: 600 }}
            >
              {deletingId === item.id ? '...' : '🗑️'}
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <>
    {lightbox && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        onClick={() => setLightbox(null)}
      >
        <div className="relative max-w-3xl max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
          <img
            src={lightbox.url}
            alt={lightbox.word}
            className="max-w-full max-h-[80vh] rounded-[24px] object-contain shadow-2xl"
          />
          <div className="text-center text-white mt-2 text-lg" style={{ ...display, fontWeight: 700 }}>{lightbox.word}</div>
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    )}
    {replaceConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-[24px] p-6 max-w-md mx-4 shadow-xl">
          <h3 className="text-lg mb-2" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>Publikált kép cseréje</h3>
          <p className="text-sm mb-4" style={{ color: MUTED }}>
            A <strong style={{ color: GREEN_DARK }}>{replaceConfirm.word}</strong> képe jelenleg él a mobilalkalmazásban.
            Közvetlen törlés helyett <strong style={{ color: GREEN_DARK }}>„Csere szükséges"</strong> státuszra állítjuk:
            a régi kép elérhető marad az appban, amíg feltöltesz egy újat és újra publikálsz.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setReplaceConfirm(null)}
              className="text-sm px-4 py-2 rounded-2xl transition-colors"
              style={{ color: MUTED, background: TRACK }}
            >
              Mégse
            </button>
            <button
              onClick={() => {
                const item = replaceConfirm;
                setReplaceConfirm(null);
                handleStatusChange(item.id, 'needs_replacement');
              }}
              className="text-white text-sm px-4 py-2 rounded-2xl transition-colors"
              style={{ ...display, fontWeight: 600, background: '#C97B3E' }}
            >
              Csere szükségesre állítás
            </button>
          </div>
        </div>
      </div>
    )}
    {bulkDeleteConfirm && (() => {
      const selectedItems = filtered.filter(i => selected.has(i.id));
      const toDelete = selectedItems.filter(i => i.file_path && i.status !== 'published');
      const toReplace = selectedItems.filter(i => i.status === 'published');
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[24px] p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg mb-3" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>Tömeges törlés megerősítése</h3>
            <ul className="text-sm mb-4 space-y-1" style={{ color: MUTED }}>
              {toDelete.length > 0 && (
                <li>• <strong style={{ color: GREEN_DARK }}>{toDelete.length} kép</strong> törlésre kerül a storage-ból (státusz: hiányzó)</li>
              )}
              {toReplace.length > 0 && (
                <li>• <strong style={{ color: GREEN_DARK }}>{toReplace.length} publikált kép</strong> „Csere szükséges" státuszra kerül — a fájl megmarad az appban</li>
              )}
            </ul>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setBulkDeleteConfirm(false)}
                className="text-sm px-4 py-2 rounded-2xl transition-colors"
                style={{ color: MUTED, background: TRACK }}
              >
                Mégse
              </button>
              <button
                onClick={() => { setBulkDeleteConfirm(false); handleBulkDelete(); }}
                className="text-white text-sm px-4 py-2 rounded-2xl transition-colors"
                style={{ ...display, fontWeight: 600, background: '#C0473F' }}
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      );
    })()}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>🖼️ Képek</h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Csak képköteles feladattípusokhoz tartozó szavak
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/images/settings"
            className="px-4 py-2.5 rounded-2xl text-sm transition-colors"
            style={{ ...display, fontWeight: 600, color: GREEN_DARK, background: '#FFFFFF', border: `1px solid ${GREEN}` }}
          >
            ⚙️ Beállítások
          </Link>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2.5 rounded-2xl text-white transition-colors disabled:opacity-50"
            style={{ ...display, fontWeight: 600, background: GREEN }}
          >
            {generating ? 'Generálás...' : '⚡ Generálás'}
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-white rounded-[24px] shadow-sm p-4 text-sm" style={{ color: GREEN_DARK }}>{message}</div>
      )}

      {/* Statisztikák */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Releváns', value: stats.total, bg: '#FFFFFF', color: GREEN_DARK },
          { label: 'Hiányzó', value: stats.missing, bg: STATUS_COLORS.missing.bg, color: STATUS_COLORS.missing.text },
          { label: 'Feltöltve', value: stats.uploaded, bg: STATUS_COLORS.uploaded.bg, color: STATUS_COLORS.uploaded.text },
          { label: 'Jóváhagyva', value: stats.approved, bg: STATUS_COLORS.approved.bg, color: STATUS_COLORS.approved.text },
          { label: 'Publikált', value: stats.published, bg: GREEN_LIGHT, color: GREEN_DARK },
        ].map(stat => (
          <div key={stat.label} className="rounded-[20px] shadow-sm p-4 text-center" style={{ background: stat.bg }}>
            <div className="text-2xl" style={{ ...display, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Szűrők */}
      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="search"
          placeholder="Keresés szóra..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK, minWidth: 180 }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as ImageStatus | 'all')}
          className="rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }}
        >
          <option value="all">Minden státusz</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={phaseFilter}
          onChange={e => setPhaseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }}
        >
          <option value="all">Minden szint</option>
          {phases.map(phase => (
            <option key={phase} value={phase}>{phase}. szint</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }}
        >
          <option value="all">Minden feladattípus</option>
          {configs.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer self-center ml-auto">
          <input
            type="checkbox"
            checked={filtered.length > 0 && filtered.every(i => selected.has(i.id))}
            onChange={() => toggleSelectAll(filtered)}
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
          {filter === 'uploaded' && (
            <button
              onClick={() => handleBulkStatusChange('approved')}
              disabled={bulkWorking}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
              style={{ background: STATUS_COLORS.approved.bg, color: STATUS_COLORS.approved.text, fontWeight: 600 }}
            >
              ✓ Jóváhagyás
            </button>
          )}
          {filter === 'approved' && (
            <button
              onClick={() => handleBulkStatusChange('published')}
              disabled={bulkWorking}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
              style={{ background: '#FFFFFF', color: GREEN_DARK, fontWeight: 600 }}
            >
              🚀 Publikálás
            </button>
          )}
          {filter === 'published' && (
            <button
              onClick={() => handleBulkStatusChange('needs_replacement')}
              disabled={bulkWorking}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
              style={{ background: STATUS_COLORS.needs_replacement.bg, color: STATUS_COLORS.needs_replacement.text, fontWeight: 600 }}
            >
              🔄 Csere szükséges
            </button>
          )}
          <button
            onClick={() => setBulkDeleteConfirm(true)}
            disabled={bulkWorking}
            className="text-xs px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            style={{ background: RED_LIGHT, color: RED_TEXT, fontWeight: 600 }}
          >
            🗑️ Törlés
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
      ) : configs.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#B5AE9E' }}>
          Nincs képköteles feladattípus beállítva.{' '}
          <Link href="/images/settings" style={{ color: GREEN, textDecoration: 'underline' }}>
            Beállítások
          </Link>
        </div>
      ) : typeFilter !== 'all' || searchTerm ? (
        // Szűrt nézet (feladattípus-szűrő vagy keresés aktív)
        <div className="space-y-3">
          {filtered.length === 0
            ? <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Nincs találat.</div>
            : filtered.map(renderItem)
          }
        </div>
      ) : (
        // Feladattípusonként csoportosítva — akkordion
        <div className="space-y-3">
          {Object.values(groupedByType).map(({ config, items: groupItems }) => {
            const filteredGroup = groupItems.filter(item => {
              if (filter !== 'all' && item.status !== filter) return false;
              if (phaseFilter !== 'all' && item.phase !== phaseFilter) return false;
              return true;
            });

            if (filteredGroup.length === 0) return null;

            const isOpen = openSections.has(config.id);
            const missingCount = filteredGroup.filter(i => i.status === 'missing').length;
            const publishedCount = filteredGroup.filter(i => i.status === 'published').length;

            return (
              <div key={config.id} className="bg-white rounded-[24px] shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection(config.id)}
                  className="w-full flex items-center justify-between p-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{config.label}</span>
                    <span className="text-sm" style={{ color: '#B5AE9E' }}>{filteredGroup.length} szó</span>
                    {missingCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: RED_LIGHT, color: RED_TEXT, fontWeight: 600 }}>
                        {missingCount} hiányzó
                      </span>
                    )}
                    {publishedCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }}>
                        {publishedCount} publikált
                      </span>
                    )}
                  </div>
                  <span className="text-lg" style={{ color: '#B5AE9E' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div className="divide-y" style={{ borderTop: '1px solid #F1ECE0' }}>
                    {filteredGroup.map(item => (
                      <div key={item.id} className="p-4 flex items-center gap-4" style={{ borderColor: '#F1ECE0' }}>
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 flex-shrink-0 cursor-pointer"
                          style={{ accentColor: GREEN }}
                        />
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: TRACK }}>
                          {item.file_url ? (
                            <img
                              src={item.file_url}
                              alt={item.word}
                              className="w-full h-full object-cover cursor-zoom-in"
                              onClick={() => setLightbox({ url: item.file_url!, word: item.word })}
                            />
                          ) : (
                            <span className="text-xl">🖼️</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{item.word}</span>
                            <span className="text-xs" style={{ color: '#B5AE9E' }}>{item.phase}. szint</span>
                            <StatusChip status={item.status} />
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: '#B5AE9E' }}>
                            {item.syllables?.join('-')} • {item.image_brief}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files?.[0]) handleUpload(item, e.target.files[0]);
                              }}
                              disabled={uploadingId === item.id}
                            />
                            <span
                              className="text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                              style={{ background: STATUS_COLORS.uploaded.bg, color: STATUS_COLORS.uploaded.text, fontWeight: 600 }}
                            >
                              {uploadingId === item.id ? 'Feltöltés...' : '⬆️ Feltöltés'}
                            </span>
                          </label>

                          {item.status === 'uploaded' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(item.id, 'approved')}
                                className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                                style={{ background: STATUS_COLORS.approved.bg, color: STATUS_COLORS.approved.text, fontWeight: 600 }}
                              >
                                ✓ Jóváhagyás
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'rejected')}
                                className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                                style={{ background: TRACK, color: MUTED, fontWeight: 600 }}
                              >
                                ✕
                              </button>
                            </>
                          )}
                          {item.status === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'published')}
                              className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                              style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }}
                            >
                              🚀 Publikálás
                            </button>
                          )}
                          {item.file_path && (
                            item.status === 'published' ? (
                              <button
                                onClick={() => setReplaceConfirm(item)}
                                className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                                style={{ background: STATUS_COLORS.needs_replacement.bg, color: STATUS_COLORS.needs_replacement.text, fontWeight: 600 }}
                              >
                                🔄 Csere
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDelete(item)}
                                disabled={deletingId === item.id}
                                className="text-xs px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                                style={{ background: RED_LIGHT, color: RED_TEXT, fontWeight: 600 }}
                              >
                                {deletingId === item.id ? '...' : '🗑️'}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}
