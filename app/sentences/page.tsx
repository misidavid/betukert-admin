'use client';

import { useState, useEffect, useTransition } from 'react';
import { Check, X, Pencil, Trash2, Plus, Save, RotateCcw } from 'lucide-react';
import {
  getSentencesAction,
  getComprehensionsAction,
  upsertSentenceAction,
  upsertComprehensionAction,
  deleteSentenceAction,
  deleteComprehensionAction,
  seedSentenceBankAction,
  seedComprehensionBankAction,
  type SentenceRow,
  type ComprehensionRow,
} from '../actions/sentences';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

type Tab = 'mondatrendezes' | 'mondatertes';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const RED_LIGHT = '#FBE7E5';
const RED_TEXT = '#8A4A44';
const MUTED = '#8A8478';
const display = { fontFamily: 'var(--font-display)' };

const maxPhase = Math.max(...GRAPHEMES.filter(g => !g.rare).map(g => g.phase));

function PhaseChip({ phase }: { phase: number }) {
  return (
    <span className="text-xs px-3 py-1 rounded-full shrink-0"
      style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}>
      {phase}. szint
    </span>
  );
}

// --- Mondatrendezés szerkesztő ---
function SentenceEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: SentenceRow;
  onSave: (row: SentenceRow) => void;
  onCancel: () => void;
}) {
  const [words, setWords] = useState(initial.words.join(' '));
  const [phase, setPhase] = useState(initial.phase);

  const handleSave = () => {
    const wordArr = words.trim().split(/\s+/).filter(Boolean);
    if (wordArr.length === 0) return;
    const row: SentenceRow = {
      id: initial.id,
      words: wordArr,
      accepted_orders: [wordArr, [wordArr[wordArr.length - 1], ...wordArr.slice(0, -1)]].filter(
        (o, i, arr) => i === 0 || JSON.stringify(o) !== JSON.stringify(arr[0])
      ),
      phase,
    };
    onSave(row);
  };

  return (
    <div className="space-y-3 mt-3 pt-3 border-t" style={{ borderColor: GREEN_LIGHT }}>
      <div>
        <label className="text-xs font-semibold block mb-1" style={{ color: MUTED }}>Szavak (szóközzel elválasztva)</label>
        <input
          value={words}
          onChange={e => setWords(e.target.value)}
          className="w-full rounded-xl px-3 py-2 text-sm outline-none"
          style={{ border: `1.5px solid ${GREEN_LIGHT}`, color: GREEN_DARK }}
        />
      </div>
      <div className="flex items-center gap-3">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: MUTED }}>Szint</label>
          <input
            type="number"
            min={1}
            max={maxPhase}
            value={phase}
            onChange={e => setPhase(Number(e.target.value))}
            className="w-20 rounded-xl px-3 py-2 text-sm outline-none"
            style={{ border: `1.5px solid ${GREEN_LIGHT}`, color: GREEN_DARK }}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white"
            style={{ ...display, fontWeight: 600, background: GREEN }}>
            <Save size={14} /> Mentés
          </button>
          <button onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
            style={{ ...display, fontWeight: 600, background: '#F1ECE0', color: GREEN_DARK }}>
            <X size={14} /> Mégse
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Mondatértés szerkesztő ---
function ComprehensionEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: ComprehensionRow;
  onSave: (row: ComprehensionRow) => void;
  onCancel: () => void;
}) {
  const [sentence, setSentence] = useState(initial.sentence);
  const [question, setQuestion] = useState(initial.question);
  const [correct, setCorrect] = useState(initial.correct_answer);
  const [wrong, setWrong] = useState(initial.wrong_answers.join(', '));
  const [phase, setPhase] = useState(initial.phase);

  const handleSave = () => {
    const wrongArr = wrong.split(',').map(w => w.trim()).filter(Boolean);
    if (!sentence.trim() || !question.trim() || !correct.trim() || wrongArr.length === 0) return;
    onSave({ id: initial.id, sentence: sentence.trim(), question: question.trim(), correct_answer: correct.trim(), wrong_answers: wrongArr, phase });
  };

  return (
    <div className="space-y-3 mt-3 pt-3 border-t" style={{ borderColor: GREEN_LIGHT }}>
      {[
        { label: 'Mondat', value: sentence, set: setSentence },
        { label: 'Kérdés', value: question, set: setQuestion },
        { label: 'Helyes válasz', value: correct, set: setCorrect },
        { label: 'Helytelen válaszok (vesszővel)', value: wrong, set: setWrong },
      ].map(({ label, value, set }) => (
        <div key={label}>
          <label className="text-xs font-semibold block mb-1" style={{ color: MUTED }}>{label}</label>
          <input value={value} onChange={e => set(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{ border: `1.5px solid ${GREEN_LIGHT}`, color: GREEN_DARK }} />
        </div>
      ))}
      <div className="flex items-center gap-3">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: MUTED }}>Szint</label>
          <input type="number" min={1} max={maxPhase} value={phase}
            onChange={e => setPhase(Number(e.target.value))}
            className="w-20 rounded-xl px-3 py-2 text-sm outline-none"
            style={{ border: `1.5px solid ${GREEN_LIGHT}`, color: GREEN_DARK }} />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white"
            style={{ ...display, fontWeight: 600, background: GREEN }}>
            <Save size={14} /> Mentés
          </button>
          <button onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
            style={{ ...display, fontWeight: 600, background: '#F1ECE0', color: GREEN_DARK }}>
            <X size={14} /> Mégse
          </button>
        </div>
      </div>
    </div>
  );
}

const NEW_SENTENCE_ID_PREFIX = 'new_s_';
const NEW_COMP_ID_PREFIX = 'new_c_';

export default function SentencesPage() {
  const [tab, setTab] = useState<Tab>('mondatrendezes');
  const [phaseFilter, setPhaseFilter] = useState<number>(maxPhase);
  const [search, setSearch] = useState('');
  const [sentences, setSentences] = useState<SentenceRow[]>([]);
  const [comprehensions, setComprehensions] = useState<ComprehensionRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [isPending, startTransition] = useTransition();
  const [seeding, setSeeding] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [sr, cr] = await Promise.all([getSentencesAction(), getComprehensionsAction()]);
    setSentences(sr.data);
    setComprehensions(cr.data);
    setLoaded(true);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSeedSentences = async () => {
    setSeeding(true);
    const r = await seedSentenceBankAction();
    setSeeding(false);
    if (r.error) { showToast(`❌ ${r.error}`); return; }
    showToast(`✅ ${r.inserted} mondat feltöltve`);
    loadAll();
  };

  const handleSeedComprehensions = async () => {
    setSeeding(true);
    const r = await seedComprehensionBankAction();
    setSeeding(false);
    if (r.error) { showToast(`❌ ${r.error}`); return; }
    showToast(`✅ ${r.inserted} értési feladat feltöltve`);
    loadAll();
  };

  const handleSaveSentence = (row: SentenceRow) => {
    startTransition(async () => {
      const finalId = row.id.startsWith(NEW_SENTENCE_ID_PREFIX)
        ? `s${Date.now()}`
        : row.id;
      const result = await upsertSentenceAction({ ...row, id: finalId });
      if (result.error) { showToast(`❌ ${result.error}`); return; }
      showToast('✅ Mentve');
      setEditingId(null);
      loadAll();
    });
  };

  const handleDeleteSentence = (id: string) => {
    if (!confirm('Biztosan törlöd?')) return;
    startTransition(async () => {
      const result = await deleteSentenceAction(id);
      if (result.error) { showToast(`❌ ${result.error}`); return; }
      showToast('🗑️ Törölve');
      loadAll();
    });
  };

  const handleSaveComprehension = (row: ComprehensionRow) => {
    startTransition(async () => {
      const finalId = row.id.startsWith(NEW_COMP_ID_PREFIX)
        ? `c${Date.now()}`
        : row.id;
      const result = await upsertComprehensionAction({ ...row, id: finalId });
      if (result.error) { showToast(`❌ ${result.error}`); return; }
      showToast('✅ Mentve');
      setEditingId(null);
      loadAll();
    });
  };

  const handleDeleteComprehension = (id: string) => {
    if (!confirm('Biztosan törlöd?')) return;
    startTransition(async () => {
      const result = await deleteComprehensionAction(id);
      if (result.error) { showToast(`❌ ${result.error}`); return; }
      showToast('🗑️ Törölve');
      loadAll();
    });
  };

  const addNewSentence = () => {
    const newId = `${NEW_SENTENCE_ID_PREFIX}${Date.now()}`;
    const blank: SentenceRow = { id: newId, words: ['a', 'mondat', 'szavai'], accepted_orders: [['a', 'mondat', 'szavai']], phase: 3 };
    setSentences(prev => [blank, ...prev]);
    setEditingId(newId);
  };

  const addNewComprehension = () => {
    const newId = `${NEW_COMP_ID_PREFIX}${Date.now()}`;
    const blank: ComprehensionRow = { id: newId, sentence: 'A mondat.', question: 'Milyen?', correct_answer: 'válasz', wrong_answers: ['más1', 'más2'], phase: 3 };
    setComprehensions(prev => [blank, ...prev]);
    setEditingId(newId);
  };

  const filteredSentences = sentences
    .filter(s => s.phase <= phaseFilter)
    .filter(s => search === '' || s.words.join(' ').toLowerCase().includes(search.toLowerCase()));

  const filteredComprehensions = comprehensions
    .filter(c => c.phase <= phaseFilter)
    .filter(c => search === '' || c.sentence.toLowerCase().includes(search.toLowerCase()));

  const isEmpty = loaded && (tab === 'mondatrendezes' ? sentences.length === 0 : comprehensions.length === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>📝 Mondatok</h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>Mondatrendezés és mondatértés feladatok szerkesztése</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={handleSeedSentences} disabled={seeding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white disabled:opacity-50"
            style={{ background: GREEN, ...display, fontWeight: 600 }}>
            <RotateCcw size={14} /> {seeding ? '...' : 'Mondatrendezés sync'}
          </button>
          <button onClick={handleSeedComprehensions} disabled={seeding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white disabled:opacity-50"
            style={{ background: GREEN, ...display, fontWeight: 600 }}>
            <RotateCcw size={14} /> {seeding ? '...' : 'Mondatértés sync'}
          </button>
        </div>
      </div>

      {toast && (
        <div className="bg-white rounded-[20px] shadow-sm px-5 py-3 text-sm" style={{ color: GREEN_DARK }}>
          {toast}
        </div>
      )}

      {/* Seed banner — ha üres az adatbázis */}
      {isEmpty && (
        <div className="rounded-[20px] p-5 space-y-3" style={{ background: '#FBF3DD' }}>
          <p className="text-sm" style={{ color: '#8A6A1F', fontWeight: 600 }}>
            Az adatbázis üres. Töltsd fel az alapértelmezett tartalommal:
          </p>
          <div className="flex gap-3">
            <button onClick={handleSeedSentences} disabled={seeding}
              className="px-4 py-2 rounded-xl text-sm text-white disabled:opacity-50"
              style={{ background: GREEN, ...display, fontWeight: 600 }}>
              <RotateCcw size={14} className="inline mr-1.5" />
              {seeding ? 'Feltöltés...' : 'Mondatrendezés feltöltése'}
            </button>
            <button onClick={handleSeedComprehensions} disabled={seeding}
              className="px-4 py-2 rounded-xl text-sm text-white disabled:opacity-50"
              style={{ background: GREEN, ...display, fontWeight: 600 }}>
              <RotateCcw size={14} className="inline mr-1.5" />
              {seeding ? 'Feltöltés...' : 'Mondatértés feltöltése'}
            </button>
          </div>
        </div>
      )}

      {/* Szintcsúszka */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>Szint: {phaseFilter}</label>
          <span className="text-sm" style={{ color: MUTED }}>
            {tab === 'mondatrendezes' ? `${filteredSentences.length} mondat` : `${filteredComprehensions.length} feladat`}
          </span>
        </div>
        <input type="range" min={1} max={maxPhase} value={phaseFilter}
          onChange={e => setPhaseFilter(Number(e.target.value))}
          className="w-full" style={{ accentColor: GREEN }} />
      </div>

      {/* Tabok + kereső + új gomb */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          {[
            { id: 'mondatrendezes' as Tab, label: 'Mondatrendezés' },
            { id: 'mondatertes' as Tab, label: 'Mondatértés' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setEditingId(null); }}
              className="px-5 py-2.5 rounded-2xl text-sm transition-colors"
              style={{ ...display, fontWeight: 600, background: tab === t.id ? GREEN : '#FFFFFF', color: tab === t.id ? '#FFFFFF' : GREEN_DARK, border: tab === t.id ? 'none' : '1px solid #E3DCC9' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input type="text" placeholder="Keresés..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-2xl px-4 py-2.5 text-sm outline-none w-48"
            style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }} />
          <button
            onClick={tab === 'mondatrendezes' ? addNewSentence : addNewComprehension}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm text-white"
            style={{ ...display, fontWeight: 600, background: GREEN }}>
            <Plus size={14} /> Új
          </button>
        </div>
      </div>

      {/* Mondatrendezés lista */}
      {tab === 'mondatrendezes' && (
        <div className="space-y-3">
          {filteredSentences.length === 0 && !isEmpty ? (
            <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Nincs találat.</div>
          ) : (
            filteredSentences.map(s => (
              <div key={s.id} className="bg-white rounded-[24px] shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <span className="text-xs w-10 pt-0.5 shrink-0" style={{ color: '#B5AE9E' }}>{s.id}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-1">
                      {s.words.map((w, i) => (
                        <span key={i} className="px-3.5 py-1.5 rounded-2xl text-sm"
                          style={{ ...display, background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                  <PhaseChip phase={s.phase} />
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                      className="p-2 rounded-xl transition-colors hover:opacity-70"
                      style={{ background: GREEN_LIGHT, color: GREEN_DARK }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDeleteSentence(s.id)}
                      className="p-2 rounded-xl transition-colors hover:opacity-70"
                      style={{ background: RED_LIGHT, color: RED_TEXT }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {editingId === s.id && (
                  <SentenceEditor
                    initial={s}
                    onSave={handleSaveSentence}
                    onCancel={() => {
                      setEditingId(null);
                      if (s.id.startsWith(NEW_SENTENCE_ID_PREFIX)) setSentences(prev => prev.filter(x => x.id !== s.id));
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Mondatértés lista */}
      {tab === 'mondatertes' && (
        <div className="space-y-3">
          {filteredComprehensions.length === 0 && !isEmpty ? (
            <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Nincs találat.</div>
          ) : (
            filteredComprehensions.map(c => (
              <div key={c.id} className="bg-white rounded-[24px] shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <span className="text-xs w-10 pt-0.5 shrink-0" style={{ color: '#B5AE9E' }}>{c.id}</span>
                  <div className="flex-1 space-y-2">
                    <p style={{ ...display, fontWeight: 600, color: GREEN_DARK }}>{c.sentence}</p>
                    <p className="text-sm" style={{ color: MUTED }}>
                      <span style={{ fontWeight: 600, color: GREEN_DARK }}>K:</span> {c.question}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm"
                        style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: GREEN }}>
                          <Check size={12} color="white" strokeWidth={3} />
                        </span>
                        {c.correct_answer}
                      </span>
                      {c.wrong_answers.map((w, i) => (
                        <span key={i} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm"
                          style={{ background: RED_LIGHT, color: RED_TEXT }}>
                          <X size={14} /> {w}
                        </span>
                      ))}
                    </div>
                  </div>
                  <PhaseChip phase={c.phase} />
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditingId(editingId === c.id ? null : c.id)}
                      className="p-2 rounded-xl transition-colors hover:opacity-70"
                      style={{ background: GREEN_LIGHT, color: GREEN_DARK }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDeleteComprehension(c.id)}
                      className="p-2 rounded-xl transition-colors hover:opacity-70"
                      style={{ background: RED_LIGHT, color: RED_TEXT }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {editingId === c.id && (
                  <ComprehensionEditor
                    initial={c}
                    onSave={handleSaveComprehension}
                    onCancel={() => {
                      setEditingId(null);
                      if (c.id.startsWith(NEW_COMP_ID_PREFIX)) setComprehensions(prev => prev.filter(x => x.id !== c.id));
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
