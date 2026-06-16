'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { seedWordsAction, deleteWordAction, toggleWordEnabledAction, addWordAction, getExcludedWordsAction, restoreExcludedWordAction } from '../actions/words';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';
import { generateSyllables } from '../../shared/curriculum/syllableGenerator';

type Tab = 'graphemes' | 'syllables' | 'words';

interface WordItem {
  id: string;
  text: string;
  syllables: string[];
  syllable_count: number;
  phase: number;
  difficulty: number;
  enabled: boolean;
}

export default function CurriculumPage() {
  const [tab, setTab] = useState<Tab>('graphemes');
  const [phaseFilter, setPhaseFilter] = useState<number>(1);
  const [words, setWords] = useState<WordItem[]>([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newWord, setNewWord] = useState('');
  const [addingWord, setAddingWord] = useState(false);
  const [sortBy, setSortBy] = useState<'created_at' | 'text' | 'phase'>('phase');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [excludedWords, setExcludedWords] = useState<string[]>([]);
  const [showExcluded, setShowExcluded] = useState(false);
  const [restoringText, setRestoringText] = useState<string | null>(null);

  const graphemes = GRAPHEMES.filter(g => !g.rare && g.phase <= phaseFilter);
  const syllables = generateSyllables(phaseFilter).slice(0, 100);
  const maxPhase = Math.max(...GRAPHEMES.filter(g => !g.rare).map(g => g.phase));

  useEffect(() => {
    if (tab === 'words') {
      loadWords();
      loadExcludedWords();
    }
  }, [tab, phaseFilter, sortBy, sortDir]);

  const loadWords = async () => {
    setLoadingWords(true);
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .lte('phase', phaseFilter)
      .order(sortBy, { ascending: sortDir === 'asc' });

    if (!error && data) setWords(data);
    setLoadingWords(false);
  };

  const loadExcludedWords = async () => {
    const result = await getExcludedWordsAction();
    if (!result.error) setExcludedWords(result.words.map(w => w.text));
  };

  const handleRestoreExcluded = async (text: string) => {
    setRestoringText(text);
    const result = await restoreExcludedWordAction(text);
    if (result.error) setMessage(`❌ Hiba: ${result.error}`);
    else setExcludedWords(prev => prev.filter(t => t !== text));
    setRestoringText(null);
  };

  const handleSeed = async () => {
    if (!confirm('Ez törli az összes jelenlegi szót és az alap szóbankkal tölti fel újra az adatbázist. Folytatod?')) return;
    setSeeding(true);
    setMessage('');
    const result = await seedWordsAction();
    if (result.error) {
      setMessage(`❌ Hiba: ${result.error}`);
    } else {
      setMessage(`✅ ${result.inserted} szó visszaállítva, ${result.skipped} már létezett.`);
      loadWords();
    }
    setSeeding(false);
  };

  const handleDelete = async (id: string, text: string) => {
    if (!confirm(`Biztosan törlöd: "${text}"?`)) return;
    setDeletingId(id);
    const result = await deleteWordAction(id);
    if (result.error) setMessage(`❌ Hiba: ${result.error}`);
    else {
      setWords(prev => prev.filter(w => w.id !== id));
      setExcludedWords(prev => [...prev, text].sort());
    }
    setDeletingId(null);
  };

  const handleAddWord = async () => {
    if (!newWord.trim()) return;
    setAddingWord(true);
    setMessage('');
    const result = await addWordAction(newWord);
    if (result.error) {
      setMessage(`❌ Hiba: ${result.error}`);
    } else {
      setNewWord('');
      setMessage(`✅ "${newWord.trim()}" hozzáadva.`);
      loadWords();
    }
    setAddingWord(false);
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    const result = await toggleWordEnabledAction(id, enabled);
    if (result.error) setMessage(`❌ Hiba: ${result.error}`);
    else setWords(prev => prev.map(w => w.id === id ? { ...w, enabled: !enabled } : w));
  };

  const filteredWords = words.filter(w =>
    w.text.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D5A27]">📚 Curriculum</h1>
        <p className="text-gray-500 text-sm mt-1">
          Betűk, szótagok és szavak áttekintése szint szerint
        </p>
      </div>

      {message && (
        <div className="bg-white border rounded-lg p-4 text-sm">{message}</div>
      )}

      {/* Szintcsúszka */}
      <div className="bg-white rounded-xl border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-[#2D5A27]">Szint: {phaseFilter}</label>
          <span className="text-sm text-gray-500">{graphemes.length} betű elérhető</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxPhase}
          value={phaseFilter}
          onChange={e => setPhaseFilter(Number(e.target.value))}
          className="w-full accent-[#2D5A27]"
        />
        <div className="flex flex-wrap gap-2 pt-2">
          {graphemes.map(g => (
            <span key={g.id} className="bg-[#E8F0E5] text-[#2D5A27] font-bold px-3 py-1 rounded-lg text-sm">
              {g.display}
            </span>
          ))}
        </div>
      </div>

      {/* Tabok */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'graphemes', label: `Betűk (${graphemes.length})` },
          { id: 'syllables', label: `Szótagok (${syllables.length})` },
          { id: 'words', label: `Szavak` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-[#2D5A27] text-[#2D5A27]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Betűk tab */}
      {tab === 'graphemes' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {graphemes.map(g => (
            <div key={g.id} className="bg-white rounded-xl border p-4 text-center">
              <div className="text-4xl font-bold text-[#2D5A27] mb-2">{g.display}</div>
              <div className="text-xs text-gray-500">{g.type}</div>
              <div className="text-xs text-gray-400">{g.phase}. szint</div>
            </div>
          ))}
        </div>
      )}

      {/* Szótagok tab */}
      {tab === 'syllables' && (
        <div className="space-y-4">
          {['VC', 'CV', 'CVC'].map(type => {
            const typeSyllables = syllables.filter(s => s.type === type);
            if (typeSyllables.length === 0) return null;
            return (
              <div key={type}>
                <h3 className="font-bold text-[#2D5A27] mb-2">
                  {type} típus ({typeSyllables.length} db)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typeSyllables.map(s => (
                    <span key={s.id} className="bg-white border rounded-lg px-3 py-1 text-sm font-medium text-[#2D5A27]">
                      {s.text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Szavak tab */}
      {tab === 'words' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Új szó hozzáadása..."
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddWord()}
              className="border rounded-lg px-3 py-2 text-sm bg-white flex-1"
            />
            <button
              onClick={handleAddWord}
              disabled={addingWord || !newWord.trim()}
              className="bg-[#2D5A27] text-white px-4 py-2 rounded-lg hover:bg-[#4A7C42] transition-colors disabled:opacity-50 text-sm"
            >
              {addingWord ? 'Hozzáadás...' : '+ Szó hozzáadása'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Keresés..."
                value={searchWord}
                onChange={e => setSearchWord(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white w-48"
              />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="phase">Szint szerint</option>
                <option value="text">ABC szerint</option>
                <option value="created_at">Hozzáadás szerint</option>
              </select>
              <button
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                className="border rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50"
              >
                {sortDir === 'asc' ? '↑ Növekvő' : '↓ Csökkenő'}
              </button>
              <span className="text-sm text-gray-500 self-center">
                {filteredWords.length} szó
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="bg-[#2D5A27] text-white px-4 py-2 rounded-lg hover:bg-[#4A7C42] transition-colors disabled:opacity-50 text-sm"
              >
                {seeding ? 'Visszaállítás...' : '↩ Alap szóbank visszaállítása'}
              </button>
            </div>
          </div>

          {loadingWords ? (
            <div className="text-center py-12 text-gray-400">Betöltés...</div>
          ) : filteredWords.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Nincs szó. Kattints a "Szóbank feltöltése" gombra!
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWords.map(w => (
                <div
                  key={w.id}
                  className={`bg-white rounded-xl border p-3 flex items-center gap-4 ${!w.enabled ? 'opacity-50' : ''}`}
                >
                  <span className="font-bold text-[#2D5A27] w-32">{w.text}</span>
                  <span className="text-sm text-gray-500">{w.syllables.join('-')}</span>
                  <span className="text-xs text-gray-400">{w.syllable_count} szótag</span>
                  <span className="text-xs bg-[#E8F0E5] text-[#2D5A27] px-2 py-0.5 rounded-full">
                    {w.phase}. szint
                  </span>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleToggleEnabled(w.id, w.enabled)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      w.enabled
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {w.enabled ? '✓ Aktív' : '✕ Letiltva'}
                  </button>
                  <button
                    onClick={() => handleDelete(w.id, w.text)}
                    disabled={deletingId === w.id}
                    className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    {deletingId === w.id ? '...' : '🗑 Törlés'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {excludedWords.length > 0 && (
            <div className="bg-white rounded-xl border p-4">
              <button
                onClick={() => setShowExcluded(s => !s)}
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                {showExcluded ? '▾' : '▸'} Kizárt szavak ({excludedWords.length}) — ezeket az "Alap szóbank visszaállítása" nem hozza vissza
              </button>
              {showExcluded && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {excludedWords.map(text => (
                    <span
                      key={text}
                      className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-1 text-sm"
                    >
                      {text}
                      <button
                        onClick={() => handleRestoreExcluded(text)}
                        disabled={restoringText === text}
                        className="text-[#2D5A27] hover:underline text-xs"
                      >
                        {restoringText === text ? '...' : 'visszaállít'}
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
