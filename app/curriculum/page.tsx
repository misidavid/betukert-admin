'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, RotateCcw, Trash2 } from 'lucide-react';
import { seedWordsAction, deleteWordAction, toggleWordEnabledAction, addWordAction, getExcludedWordsAction, restoreExcludedWordAction, fetchWordsAction, WordItem } from '../actions/words';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';
import { generateSyllables } from '../../shared/curriculum/syllableGenerator';

type Tab = 'graphemes' | 'syllables' | 'words';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const RED_LIGHT = '#FBE7E5';
const RED_TEXT = '#8A4A44';
const MUTED = '#8A8478';
const TRACK = '#F1ECE0';
const display = { fontFamily: 'var(--font-display)' };

function PhaseChip({ phase }: { phase: number }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full shrink-0"
      style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}
    >
      {phase}. szint
    </span>
  );
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
    const { words: data } = await fetchWordsAction(phaseFilter, sortBy, sortDir);
    setWords(data);
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
        <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>📚 Curriculum</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Betűk, szótagok és szavak áttekintése szint szerint
        </p>
      </div>

      {message && (
        <div className="bg-white rounded-[24px] shadow-sm p-4 text-sm" style={{ color: GREEN_DARK }}>{message}</div>
      )}

      {/* Szintcsúszka */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>Szint: {phaseFilter}</label>
          <span className="text-sm" style={{ color: MUTED }}>{graphemes.length} betű elérhető</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxPhase}
          value={phaseFilter}
          onChange={e => setPhaseFilter(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: GREEN }}
        />
        <div className="flex flex-wrap gap-2 pt-2">
          {graphemes.map(g => (
            <span key={g.id} className="px-3 py-1 rounded-xl text-sm" style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}>
              {g.display}
            </span>
          ))}
        </div>
      </div>

      {/* Tabok */}
      <div className="flex gap-2">
        {[
          { id: 'graphemes' as Tab, label: `Betűk (${graphemes.length})` },
          { id: 'syllables' as Tab, label: `Szótagok (${syllables.length})` },
          { id: 'words' as Tab, label: `Szavak` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-5 py-2.5 rounded-2xl text-sm transition-colors"
            style={{
              ...display,
              fontWeight: 600,
              background: tab === t.id ? GREEN : '#FFFFFF',
              color: tab === t.id ? '#FFFFFF' : GREEN_DARK,
              border: tab === t.id ? 'none' : '1px solid #E3DCC9',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Betűk tab */}
      {tab === 'graphemes' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {graphemes.map(g => (
            <div key={g.id} className="bg-white rounded-[24px] shadow-sm p-4 text-center">
              <div className="text-4xl mb-2" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{g.display}</div>
              <div className="text-xs" style={{ color: MUTED }}>{g.type}</div>
              <div className="text-xs" style={{ color: '#B5AE9E' }}>{g.phase}. szint</div>
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
                <h3 className="mb-2" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
                  {type} típus ({typeSyllables.length} db)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typeSyllables.map(s => (
                    <span key={s.id} className="bg-white rounded-xl px-3 py-1.5 text-sm shadow-sm" style={{ fontWeight: 600, color: GREEN_DARK }}>
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
          <div className="bg-white rounded-[24px] shadow-sm p-4 flex gap-2">
            <input
              type="text"
              placeholder="Új szó hozzáadása..."
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddWord()}
              className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none"
              style={{ background: TRACK, color: GREEN_DARK }}
            />
            <button
              onClick={handleAddWord}
              disabled={addingWord || !newWord.trim()}
              className="rounded-2xl px-4 py-2.5 text-sm text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
              style={{ ...display, fontWeight: 600, background: GREEN }}
            >
              <Plus size={16} /> {addingWord ? 'Hozzáadás...' : 'Hozzáadás'}
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-3 items-center flex-wrap">
              <div className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm w-48">
                <Search size={16} color={MUTED} />
                <input
                  type="text"
                  placeholder="Keresés..."
                  value={searchWord}
                  onChange={e => setSearchWord(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ color: GREEN_DARK }}
                />
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="rounded-2xl px-4 py-2.5 text-sm outline-none"
                style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }}
              >
                <option value="phase">Szint szerint</option>
                <option value="text">ABC szerint</option>
                <option value="created_at">Hozzáadás szerint</option>
              </select>
              <button
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                className="rounded-2xl px-4 py-2.5 text-sm transition-colors"
                style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }}
              >
                {sortDir === 'asc' ? '↑ Növekvő' : '↓ Csökkenő'}
              </button>
              <span className="text-sm" style={{ color: MUTED }}>
                {filteredWords.length} szó
              </span>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="rounded-2xl px-4 py-2.5 text-white text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              style={{ ...display, fontWeight: 600, background: GREEN }}
            >
              <RotateCcw size={14} /> {seeding ? 'Visszaállítás...' : 'Alap szóbank visszaállítása'}
            </button>
          </div>

          {loadingWords ? (
            <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Betöltés...</div>
          ) : filteredWords.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#B5AE9E' }}>
              Nincs szó. Kattints a "Szóbank feltöltése" gombra!
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWords.map(w => (
                <div
                  key={w.id}
                  className="bg-white rounded-[24px] shadow-sm p-4 flex items-center gap-4"
                  style={{ opacity: w.enabled ? 1 : 0.5 }}
                >
                  <span className="w-32" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>{w.text}</span>
                  <span className="text-sm" style={{ color: MUTED }}>{w.syllables.join('-')}</span>
                  <span className="text-xs" style={{ color: '#B5AE9E' }}>{w.syllable_count} szótag</span>
                  <PhaseChip phase={w.phase} />
                  <div className="flex-1" />
                  <button
                    onClick={() => handleToggleEnabled(w.id, w.enabled)}
                    className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                    style={w.enabled
                      ? { background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }
                      : { background: TRACK, color: MUTED, fontWeight: 600 }}
                  >
                    {w.enabled ? '✓ Aktív' : '✕ Letiltva'}
                  </button>
                  <button
                    onClick={() => handleDelete(w.id, w.text)}
                    disabled={deletingId === w.id}
                    className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                    style={{ background: RED_LIGHT, color: RED_TEXT, fontWeight: 600 }}
                  >
                    {deletingId === w.id ? '...' : <Trash2 size={14} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {excludedWords.length > 0 && (
            <div className="bg-white rounded-[24px] shadow-sm p-4">
              <button
                onClick={() => setShowExcluded(s => !s)}
                className="text-sm transition-colors"
                style={{ fontWeight: 600, color: MUTED }}
              >
                {showExcluded ? '▾' : '▸'} Kizárt szavak ({excludedWords.length}) — ezeket az "Alap szóbank visszaállítása" nem hozza vissza
              </button>
              {showExcluded && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {excludedWords.map(text => (
                    <span
                      key={text}
                      className="flex items-center gap-2 rounded-2xl px-3 py-1.5 text-sm"
                      style={{ background: TRACK, color: GREEN_DARK }}
                    >
                      {text}
                      <button
                        onClick={() => handleRestoreExcluded(text)}
                        disabled={restoringText === text}
                        className="flex items-center gap-1 text-xs hover:underline"
                        style={{ color: GREEN }}
                      >
                        <RotateCcw size={12} /> {restoringText === text ? '...' : 'visszaállít'}
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
