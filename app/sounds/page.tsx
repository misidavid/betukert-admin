'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, SoundNeed, SoundStatus } from '../../lib/supabase';
import { generateSoundNeedsAction, uploadSoundFileAction, updateSoundNeedStatusAction } from '../actions/soundNeeds';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const MUTED = '#8A8478';
const TRACK = '#F1ECE0';
const display = { fontFamily: 'var(--font-display)' };

const STATUS_LABELS: Record<SoundStatus, string> = {
  missing: 'Hiányzó',
  uploaded: 'Feltöltve',
  pending_review: 'Ellenőrzésre vár',
  approved: 'Jóváhagyva',
  published: 'Publikált',
  rejected: 'Elutasítva',
  needs_regeneration: 'Újragenerálás szükséges',
};

const STATUS_COLORS: Record<SoundStatus, { bg: string; text: string }> = {
  missing: { bg: '#FBE7E5', text: '#8A4A44' },
  uploaded: { bg: '#E3EDF7', text: '#3A5A7A' },
  pending_review: { bg: '#EDE3F5', text: '#6A4A8A' },
  approved: { bg: '#FBF3DD', text: '#8A6A1F' },
  published: { bg: GREEN_LIGHT, text: GREEN_DARK },
  rejected: { bg: TRACK, text: MUTED },
  needs_regeneration: { bg: '#FBE9DC', text: '#8A5A2F' },
};

export default function SoundsPage() {
  const [items, setItems] = useState<SoundNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<SoundStatus | 'all'>('all');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sound_needs')
      .select('*')
      .eq('type', 'instruction')
      .order('created_at', { ascending: true });

    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('');
    const result = await generateSoundNeedsAction();
    if (result.error) {
      setMessage(`❌ Hiba: ${result.error}`);
    } else {
      setMessage(`✅ ${result.inserted} új utasítás generálva, ${result.skipped} már létezett.`);
      loadItems();
    }
    setGenerating(false);
  };

  const handleUpload = async (item: SoundNeed, file: File) => {
    setUploadingId(item.id);
    const result = await uploadSoundFileAction(item.id, file);
    if (result.error) {
      setMessage(`❌ Feltöltési hiba: ${result.error}`);
    } else {
      loadItems();
    }
    setUploadingId(null);
  };

  const handlePlay = async (item: SoundNeed) => {
    if (playingId === item.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (item.file_url) {
      audioRef.current = new Audio(item.file_url);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.play();
      setPlayingId(item.id);
    }
  };

  const handleStatusChange = async (id: string, status: SoundStatus) => {
    const result = await updateSoundNeedStatusAction(id, status);
    if (result.error) setMessage(`❌ Hiba: ${result.error}`);
    else loadItems();
  };

  const filtered = items.filter(item => filter === 'all' || item.status === filter);

  const stats = {
    total: items.length,
    missing: items.filter(i => i.status === 'missing').length,
    pending: items.filter(i => i.status === 'pending_review').length,
    approved: items.filter(i => i.status === 'approved').length,
    published: items.filter(i => i.status === 'published').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>🔊 Hangok</h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Feladatutasítások hangfelvételeinek kezelése
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-5 py-2.5 rounded-2xl text-white transition-colors disabled:opacity-50"
          style={{ ...display, fontWeight: 600, background: GREEN }}
        >
          {generating ? 'Generálás...' : '⚡ Utasítások generálása'}
        </button>
      </div>

      {message && (
        <div className="bg-white rounded-[24px] shadow-sm p-4 text-sm" style={{ color: GREEN_DARK }}>
          {message}
        </div>
      )}

      {/* Statisztikák */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Összes', value: stats.total, bg: '#FFFFFF', color: GREEN_DARK },
          { label: 'Hiányzó', value: stats.missing, bg: STATUS_COLORS.missing.bg, color: STATUS_COLORS.missing.text },
          { label: 'Ellenőrzésre vár', value: stats.pending, bg: STATUS_COLORS.pending_review.bg, color: STATUS_COLORS.pending_review.text },
          { label: 'Jóváhagyva', value: stats.approved, bg: STATUS_COLORS.approved.bg, color: STATUS_COLORS.approved.text },
          { label: 'Publikált', value: stats.published, bg: GREEN_LIGHT, color: GREEN_DARK },
        ].map(stat => (
          <div key={stat.label} className="rounded-[20px] shadow-sm p-4 text-center" style={{ background: stat.bg }}>
            <div className="text-2xl" style={{ ...display, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Szűrő */}
      <div className="flex gap-3 flex-wrap items-center">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as SoundStatus | 'all')}
          className="rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }}
        >
          <option value="all">Minden státusz</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <span className="text-sm" style={{ color: MUTED }}>
          {filtered.length} elem
        </span>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Betöltés...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#B5AE9E' }}>
          Nincs elem. Kattints az "Utasítások generálása" gombra!
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-[24px] shadow-sm p-4 flex items-center gap-4"
            >
              {/* Lejátszás */}
              <button
                onClick={() => handlePlay(item)}
                disabled={!item.file_url}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: !item.file_url ? TRACK : playingId === item.id ? GREEN : GREEN_LIGHT,
                  color: !item.file_url ? '#D8D2C2' : playingId === item.id ? '#FFFFFF' : GREEN_DARK,
                }}
              >
                {playingId === item.id ? '⏸' : '▶'}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 600, color: GREEN_DARK }}>
                    {item.text}
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: STATUS_COLORS[item.status].bg, color: STATUS_COLORS[item.status].text, fontWeight: 600 }}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
              </div>

              {/* Akciók */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        handleUpload(item, e.target.files[0]);
                      }
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

                {item.status === 'pending_review' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(item.id, 'approved')}
                      className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                      style={{ background: STATUS_COLORS.approved.bg, color: STATUS_COLORS.approved.text, fontWeight: 600 }}
                    >
                      ✓ Jóváhagyás
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, 'needs_regeneration')}
                      className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                      style={{ background: STATUS_COLORS.needs_regeneration.bg, color: STATUS_COLORS.needs_regeneration.text, fontWeight: 600 }}
                    >
                      ↺ Újra
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
