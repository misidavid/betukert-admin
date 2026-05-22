'use client';

import { useState, useEffect } from 'react';
import { supabase, ImageNeed, ImageStatus } from '../../lib/supabase';
import { generateImageNeeds } from '../../lib/generateImageNeeds';

const STATUS_LABELS: Record<ImageStatus, string> = {
  missing: 'Hiányzó',
  uploaded: 'Feltöltve',
  approved: 'Jóváhagyva',
  published: 'Publikált',
  rejected: 'Elutasítva',
  needs_replacement: 'Csere szükséges',
};

const STATUS_COLORS: Record<ImageStatus, string> = {
  missing: 'bg-red-100 text-red-700',
  uploaded: 'bg-blue-100 text-blue-700',
  approved: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-100 text-gray-700',
  needs_replacement: 'bg-orange-100 text-orange-700',
};

export default function ImagesPage() {
  const [items, setItems] = useState<ImageNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<ImageStatus | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('image_needs')
      .select('*')
      .order('phase', { ascending: true });

    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const result = await generateImageNeeds();
      setMessage(`✅ ${result.inserted} új képszükséglet generálva, ${result.skipped} már létezett.`);
      loadItems();
    } catch (e: any) {
      setMessage(`❌ Hiba: ${e.message}`);
    }
    setGenerating(false);
  };

  const handleUpload = async (item: ImageNeed, file: File) => {
    setUploadingId(item.id);
    try {
      const ext = file.name.split('.').pop();
      const path = `${item.phase}/${item.word}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(path);

      await supabase
        .from('image_needs')
        .update({
          status: 'uploaded',
          file_path: path,
          file_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      loadItems();
    } catch (e: any) {
      setMessage(`❌ Feltöltési hiba: ${e.message}`);
    }
    setUploadingId(null);
  };

  const handleStatusChange = async (id: string, status: ImageStatus) => {
    await supabase
      .from('image_needs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    loadItems();
  };

  const filtered = items.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (phaseFilter !== 'all' && item.phase !== phaseFilter) return false;
    return true;
  });

  const phases = [...new Set(items.map(i => i.phase))].sort((a, b) => a - b);

  const stats = {
    total: items.length,
    missing: items.filter(i => i.status === 'missing').length,
    uploaded: items.filter(i => i.status === 'uploaded').length,
    approved: items.filter(i => i.status === 'approved').length,
    published: items.filter(i => i.status === 'published').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5A27]">🖼️ Képek</h1>
          <p className="text-gray-500 text-sm mt-1">
            Képszükségletek kezelése és feltöltése
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-[#2D5A27] text-white px-4 py-2 rounded-lg hover:bg-[#4A7C42] transition-colors disabled:opacity-50"
        >
          {generating ? 'Generálás...' : '⚡ Képszükségletek generálása'}
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
          { label: 'Feltöltve', value: stats.uploaded, color: 'bg-blue-50' },
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
          onChange={e => setFilter(e.target.value as ImageStatus | 'all')}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Minden státusz</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
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
          Nincs elem. Kattints a "Képszükségletek generálása" gombra!
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border p-4 flex items-center gap-4"
            >
              {/* Kép előnézet */}
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.file_url ? (
                  <img
                    src={item.file_url}
                    alt={item.word}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🖼️</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2D5A27] text-lg">
                    {item.word}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.phase}. szint
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Szótagok: {item.syllables?.join('-')} • 
                  Első hang: {item.first_sound} • 
                  Első szótag: {item.first_syllable}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {item.image_brief}
                </div>
              </div>

              {/* Akciók */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Feltöltés */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
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

                {/* Státusz változtatás */}
                {item.status === 'uploaded' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(item.id, 'approved')}
                      className="bg-yellow-50 text-yellow-700 text-xs px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      ✓ Jóváhagyás
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, 'rejected')}
                      className="bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      ✕ Elutasítás
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
