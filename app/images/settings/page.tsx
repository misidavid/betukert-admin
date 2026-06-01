'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toggleRequiresImageAction } from '../../actions/exerciseTypeConfig';
import Link from 'next/link';

interface ExerciseTypeConfig {
  id: string;
  label: string;
  requires_image: boolean;
  updated_at: string;
}

export default function ImageSettingsPage() {
  const [configs, setConfigs] = useState<ExerciseTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exercise_type_config')
      .select('*')
      .order('id');
    if (!error && data) setConfigs(data);
    setLoading(false);
  };

  const handleToggle = async (id: string, value: boolean) => {
    setSaving(id);
    await toggleRequiresImageAction(id, value);
    await loadConfigs();
    setMessage('✅ Mentve');
    setTimeout(() => setMessage(''), 2000);
    setSaving(null);
  };

  const imageRequired = configs.filter(c => c.requires_image);
  const imageNotRequired = configs.filter(c => !c.requires_image);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/images" className="text-[#4A7C42] hover:underline text-sm">
              Vissza a kepekhez
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#2D5A27]">
            Kepkoteles feladattipusok
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Allitsd be melyik feladattipusokhoz szukseges kep
          </p>
        </div>
        {message && (
          <span className="text-sm text-green-600">{message}</span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Betoltes...</div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="font-bold text-[#2D5A27]">
              Kepet igenyo feladatok ({imageRequired.length})
            </h2>
            {imageRequired.map(config => (
              <div key={config.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="font-medium text-gray-700">{config.label}</span>
                <button
                  onClick={() => handleToggle(config.id, false)}
                  disabled={saving === config.id}
                  className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                >
                  {saving === config.id ? '...' : 'Kepkoteles - kattints a kikapcsolashoz'}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="font-bold text-gray-500">
              Nem igenyli a kepet ({imageNotRequired.length})
            </h2>
            {imageNotRequired.map(config => (
              <div key={config.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-gray-500">{config.label}</span>
                <button
                  onClick={() => handleToggle(config.id, true)}
                  disabled={saving === config.id}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {saving === config.id ? '...' : 'Kepkotelessze tesz'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
