'use client';

import { useState, useEffect } from 'react';
import { supabase, ImageNeed, ImageStatus } from '../../lib/supabase';
import { generateImageNeedsAction, uploadImageFileAction, updateImageNeedStatusAction } from '../actions/imageNeeds';
import Link from 'next/link';

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

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
    .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
    .replace(/[^a-z0-9]/g, '_');
};

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
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

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

  const loadData = async () => {
    setLoading(true);

    const [{ data: imageData }, { data: configData }] = await Promise.all([
      supabase.from('image_needs').select('*').order('phase', { ascending: true }),
      supabase.from('exercise_type_config').select('*').eq('requires_image', true),
    ]);

    if (imageData) setItems(imageData);
    if (configData) setConfigs(configData);
    setLoading(false);
  };

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
    const result = await uploadImageFileAction(item.id, item.phase, item.word, file);
    if (result.error) {
      setMessage(`❌ Feltöltési hiba: ${result.error}`);
    } else {
      loadData();
    }
    setUploadingId(null);
  };

  const handleStatusChange = async (id: string, status: ImageStatus) => {
    const result = await updateImageNeedStatusAction(id, status);
    if (result.error) setMessage(`❌ Hiba: ${result.error}`);
    else loadData();
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

  const filtered = relevantItems.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (phaseFilter !== 'all' && item.phase !== phaseFilter) return false;
    if (typeFilter !== 'all' && !item.exercise_types?.includes(typeFilter)) return false;
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
    <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {item.file_url ? (
          <img src={item.file_url} alt={item.word} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🖼️</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#2D5A27] text-lg">{item.word}</span>
          <span className="text-xs text-gray-400">{item.phase}. szint</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {item.syllables?.join('-')} • Első hang: {item.first_sound}
        </div>
        <div className="text-xs text-gray-400 mt-1">{item.image_brief}</div>
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
          <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
            {uploadingId === item.id ? 'Feltöltés...' : '⬆️ Feltöltés'}
          </span>
        </label>

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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5A27]">🖼️ Képek</h1>
          <p className="text-gray-500 text-sm mt-1">
            Csak képköteles feladattípusokhoz tartozó szavak
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/images/settings"
            className="border border-[#2D5A27] text-[#2D5A27] px-4 py-2 rounded-lg hover:bg-[#E8F0E5] transition-colors text-sm"
          >
            ⚙️ Beállítások
          </Link>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-[#2D5A27] text-white px-4 py-2 rounded-lg hover:bg-[#4A7C42] transition-colors disabled:opacity-50"
          >
            {generating ? 'Generálás...' : '⚡ Generálás'}
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-white border rounded-lg p-4 text-sm">{message}</div>
      )}

      {/* Statisztikák */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Releváns', value: stats.total, color: 'bg-white' },
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

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Minden feladattípus</option>
          {configs.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <span className="text-sm text-gray-500 self-center">
          {filtered.length} elem
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Betöltés...</div>
      ) : configs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          Nincs képköteles feladattípus beállítva.{' '}
          <Link href="/images/settings" className="text-[#2D5A27] underline">
            Beállítások
          </Link>
        </div>
      ) : typeFilter !== 'all' ? (
        // Szűrt nézet
        <div className="space-y-3">
          {filtered.map(renderItem)}
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
              <div key={config.id} className="bg-white rounded-xl border overflow-hidden">
                <button
                  onClick={() => toggleSection(config.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#2D5A27]">{config.label}</span>
                    <span className="text-sm text-gray-400">{filteredGroup.length} szó</span>
                    {missingCount > 0 && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                        {missingCount} hiányzó
                      </span>
                    )}
                    {publishedCount > 0 && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        {publishedCount} publikált
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-lg">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t divide-y">
                    {filteredGroup.map(item => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.file_url ? (
                            <img src={item.file_url} alt={item.word} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">🖼️</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2D5A27]">{item.word}</span>
                            <span className="text-xs text-gray-400">{item.phase}. szint</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
                              {STATUS_LABELS[item.status]}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
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
                            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                              {uploadingId === item.id ? 'Feltöltés...' : '⬆️ Feltöltés'}
                            </span>
                          </label>

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
                                ✕
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
          })}
        </div>
      )}
    </div>
  );
}
