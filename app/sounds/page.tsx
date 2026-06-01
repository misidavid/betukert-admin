'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, SoundNeed, SoundStatus } from '../../lib/supabase';
import { generateSoundNeedsAction, updateSoundNeedFileAction, updateSoundNeedStatusAction } from '../actions/soundNeeds';

const STATUS_LABELS: Record<SoundStatus, string> = {
  missing: 'Hiányzó',
  uploaded: 'Feltöltve',
  pending_review: 'Ellenőrzésre vár',
  approved: 'Jóváhagyva',
  published: 'Publikált',
  rejected: 'Elutasítva',
  needs_regeneration: 'Újragenerálás szükséges',
};

const STATUS_COLORS: Record<SoundStatus, string> = {
  missing: 'bg-red-100 text-red-700',
  uploaded: 'bg-blue-100 text-blue-700',
  pending_review: 'bg-purple-100 text-purple-700',
  approved: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-100 text-gray-700',
  needs_regeneration: 'bg-orange-100 text-orange-700',
};

const TYPE_LABELS: Record<string, string> = {
  phoneme: 'Fonéma',
  syllable: 'Szótag',
  word: 'Szó',
  sentence: 'Mondat',
  instruction: 'Utasítás',
};

export default function SoundsPage() {
  const [items, setItems] = useState<SoundNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<SoundStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');
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
      .order('phase', { ascending: true });

    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const result = await generateSoundNeedsAction();
      setMessage(`✅ ${result.inserted} új hangszükséglet generálva, ${result.skipped} már létezett.`);
      loadItems();
    } catch (e: any) {
      setMessage(`❌ Hiba: ${e.message}`);
    }
    setGenerating(false);
  };

  const handleUpload = async (item: SoundNeed, file: File) => {
    setUploadingId(item.id);
    try {
      const ext = file.name.split('.').pop();
      const path = `${item.type}/${item.phase}/${item.text}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('sounds')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('sounds')
        .getPublicUrl(path);

      await updateSoundNeedFileAction(item.id, path, urlData.publicUrl);

      loadItems();
    } catch (e: any) {
      setMessage(`❌ Feltöltési hiba: ${e.message}`);
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
    await updateSoundNeedStatusAction(id, status);
    loadItems();
  };

  const filtered = items.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (phaseFilter !== 'all' && item.phase !== phaseFilter) return false;
    return true;
  });

  const phases = [...new Set(items.map(i => i.phase))].sort((a, b) => a - b);

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
          <h1 className="text-2xl font-bold text-[#2D5A27]">🔊 Hangok</h1>
          <p className="text-gray-500 text-sm mt-1">
            Hangszükségletek kezelése és feltöltése
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-[#2D5A27] text-white px-4 py-2 rounded-lg hover:bg-[#4A7C42] transition-colors disabled:opacity-50"
        >
          {generating ? 'Generálás...' : '⚡ Hangszükségletek generálása'}
        </button>
      </div>

      {message && (
        <div className="bg-white border rounded-lg p-4 text-sm">
          {message}
        </div>
      )}

      {/* Statisztikák */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Összes', value: stats.total, color: 'bg-white' },
          { label: 'Hiányzó', value: stats.missing, color: 'bg-red-50' },
          { label: 'Ellenőrzésre vár', value: stats.pending, color: 'bg-purple-50' },
          { label: 'Jóváhagyva', value: stats.approved, color: 'bg-yellow-50' },
          { label: 'Publikált', value: stats.published, color: 'bg-green-50' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-3 border text-center`}>
            <div className="text-2xl font-bold text-[#2D5A27]">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Szűrők */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as SoundStatus | 'all')}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Minden státusz</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Minden típus</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={phaseFilter}
          onChange={e => setPhaseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Minden szint</option>
          {phases.map(phase => (
            <option key={phase} value={phase}>{phase}. szint</option>
          ))}
        </select>

        <span className="text-sm text-gray-500 self-center">
          {filtered.length} elem
        </span>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Betöltés...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          Nincs elem. Kattints a "Hangszükségletek generálása" gombra!
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border p-4 flex items-center gap-4"
            >
              {/* Lejátszás */}
              <button
                onClick={() => handlePlay(item)}
                disabled={!item.file_url}
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.file_url
                    ? playingId === item.id
                      ? 'bg-[#2D5A27] text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-300'
                }`}
              >
                {playingId === item.id ? '⏸' : '▶'}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2D5A27] text-lg">
                    {item.text}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[item.type]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.phase}. szint
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
                {item.pronunciation_note && (
                  <div className="text-xs text-gray-400 mt-1">
                    💡 {item.pronunciation_note}
                  </div>
                )}
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
                  <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    {uploadingId === item.id ? 'Feltöltés...' : '⬆️ Feltöltés'}
                  </span>
                </label>

                {item.status === 'pending_review' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(item.id, 'approved')}
                      className="bg-yellow-50 text-yellow-700 text-xs px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      ✓ Jóváhagyás
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, 'needs_regeneration')}
                      className="bg-orange-50 text-orange-700 text-xs px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      ↺ Újra
                    </button>
                  </>
                )}
                {item.status === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(item.id, 'published')}
                    className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
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
