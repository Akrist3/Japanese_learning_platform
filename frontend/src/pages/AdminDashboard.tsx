import React, { useEffect, useState } from 'react';
import { Shield, Plus, Trash2, Users, BookOpen, Layers, Activity, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'vocab' | 'grammar'>('stats');

  // New Vocab Form State
  const [word, setWord] = useState('');
  const [kanji, setKanji] = useState('');
  const [hiragana, setHiragana] = useState('');
  const [romaji, setRomaji] = useState('');
  const [meaning, setMeaning] = useState('');
  const [jlptLevel, setJlptLevel] = useState('N5');
  const [msg, setMsg] = useState<string | null>(null);

  // New Grammar Form State
  const [grammarList, setGrammarList] = useState<any[]>([]);
  const [gPoint, setGPoint] = useState('');
  const [gMeaning, setGMeaning] = useState('');
  const [gFormation, setGFormation] = useState('');
  const [gExplanation, setGExplanation] = useState('');
  const [gJlptLevel, setGJlptLevel] = useState('N5');
  const [gExampleJa, setGExampleJa] = useState('');
  const [gExampleEn, setGExampleEn] = useState('');
  const [gSimilarGrammar, setGSimilarGrammar] = useState('');
  const [gCommonMistakes, setGCommonMistakes] = useState('');
  const [gMsg, setGMsg] = useState<string | null>(null);
  const [gError, setGError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'grammar') {
      fetchGrammarList();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  const fetchGrammarList = async () => {
    try {
      const res = await api.get('/admin/grammar');
      setGrammarList(res.data);
    } catch (err) {
      console.error('Failed to load grammar list', err);
    }
  };

  const handleAddVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/vocabulary', {
        word, kanji, hiragana, romaji, meaning, jlpt_level: jlptLevel, part_of_speech: 'noun', category: 'General'
      });
      setMsg('Vocabulary added successfully!');
      setWord('');
      setKanji('');
      setHiragana('');
      setRomaji('');
      setMeaning('');
      fetchStats();
    } catch (err) {
      console.error('Failed to add vocabulary', err);
    }
  };

  const resetGrammarForm = () => {
    setGPoint('');
    setGMeaning('');
    setGFormation('');
    setGExplanation('');
    setGExampleJa('');
    setGExampleEn('');
    setGSimilarGrammar('');
    setGCommonMistakes('');
  };

  const handleAddGrammar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGMsg(null);
    setGError(null);
    try {
      const payload: Record<string, any> = {
        point: gPoint,
        meaning: gMeaning,
        formation: gFormation,
        explanation: gExplanation,
        jlpt_level: gJlptLevel,
      };
      if (gExampleJa.trim() && gExampleEn.trim()) {
        payload.example_sentences_json = JSON.stringify([{ japanese: gExampleJa, english: gExampleEn }]);
      }
      if (gSimilarGrammar.trim()) payload.similar_grammar = gSimilarGrammar;
      if (gCommonMistakes.trim()) payload.common_mistakes = gCommonMistakes;

      await api.post('/admin/grammar', payload);
      setGMsg('Grammar point added successfully!');
      resetGrammarForm();
      fetchStats();
      fetchGrammarList();
    } catch (err: any) {
      console.error('Failed to add grammar point', err);
      setGError(err?.response?.data?.detail || 'Failed to add grammar point.');
    }
  };

  const handleDeleteGrammar = async (id: number) => {
    try {
      await api.delete(`/admin/grammar/${id}`);
      fetchStats();
      fetchGrammarList();
    } catch (err) {
      console.error('Failed to delete grammar point', err);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-rose-400 font-bold">Access Denied. Admin privileges required.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-amber-400" />
            <span>Admin Content & System Management</span>
          </h1>
          <p className="text-slate-400 text-sm">Manage educational content, add vocabulary/kanji/grammar, and monitor user analytics.</p>
        </div>

        <div className="flex gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'stats' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vocab' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Add Content
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'grammar' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Grammar
          </button>
        </div>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Users</span>
            <div className="text-3xl font-black text-white">{stats.total_users}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Vocabulary Items</span>
            <div className="text-3xl font-black text-rose-400">{stats.total_vocabulary}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Kanji Characters</span>
            <div className="text-3xl font-black text-amber-400">{stats.total_kanji}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Grammar Points</span>
            <div className="text-3xl font-black text-indigo-400">{stats.total_grammar}</div>
          </div>
        </div>
      )}

      {activeTab === 'vocab' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 max-w-xl mx-auto shadow-xl">
          <h3 className="text-xl font-black text-white">Add New Vocabulary Item</h3>

          {msg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold">
              {msg}
            </div>
          )}

          <form onSubmit={handleAddVocab} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">Japanese Word</label>
              <input
                type="text"
                required
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. 食べる"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Hiragana Reading</label>
                <input
                  type="text"
                  required
                  value={hiragana}
                  onChange={(e) => setHiragana(e.target.value)}
                  placeholder="たべる"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Romaji</label>
                <input
                  type="text"
                  required
                  value={romaji}
                  onChange={(e) => setRomaji(e.target.value)}
                  placeholder="taberu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">English Meaning</label>
              <input
                type="text"
                required
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="to eat"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">JLPT Level</label>
              <select
                value={jlptLevel}
                onChange={(e) => setJlptLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold"
              >
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20"
            >
              Add Item to Database
            </button>
          </form>
        </div>
      )}

      {activeTab === 'grammar' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Add New Grammar Point
            </h3>

            {gMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold">
                {gMsg}
              </div>
            )}
            {gError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-bold">
                {gError}
              </div>
            )}

            <form onSubmit={handleAddGrammar} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Grammar Point</label>
                <input
                  type="text"
                  required
                  value={gPoint}
                  onChange={(e) => setGPoint(e.target.value)}
                  placeholder="e.g. 〜ようになる (You ni naru)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Meaning</label>
                <input
                  type="text"
                  required
                  value={gMeaning}
                  onChange={(e) => setGMeaning(e.target.value)}
                  placeholder="To reach the point where..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Formation Structure</label>
                <input
                  type="text"
                  required
                  value={gFormation}
                  onChange={(e) => setGFormation(e.target.value)}
                  placeholder="Verb (potential form) + ようになる"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Explanation</label>
                <textarea
                  required
                  value={gExplanation}
                  onChange={(e) => setGExplanation(e.target.value)}
                  placeholder="Expresses a gradual change resulting in a new state or ability."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">JLPT Level</label>
                <select
                  value={gJlptLevel}
                  onChange={(e) => setGJlptLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold"
                >
                  <option value="N5">N5</option>
                  <option value="N4">N4</option>
                  <option value="N3">N3</option>
                  <option value="N2">N2</option>
                  <option value="N1">N1</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Example (Japanese)</label>
                  <input
                    type="text"
                    value={gExampleJa}
                    onChange={(e) => setGExampleJa(e.target.value)}
                    placeholder="日本語が話せるようになりました。"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Example (English)</label>
                  <input
                    type="text"
                    value={gExampleEn}
                    onChange={(e) => setGExampleEn(e.target.value)}
                    placeholder="I became able to speak Japanese."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Similar Grammar (optional)</label>
                <input
                  type="text"
                  value={gSimilarGrammar}
                  onChange={(e) => setGSimilarGrammar(e.target.value)}
                  placeholder="〜ようにする"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Common Mistakes (optional)</label>
                <textarea
                  value={gCommonMistakes}
                  onChange={(e) => setGCommonMistakes(e.target.value)}
                  placeholder="Confusing ようになる (change of state) with ようにする (deliberate effort)."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Grammar Point
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-xl font-black text-white">Existing Grammar Points ({grammarList.length})</h3>
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {grammarList.map((g) => (
                <div key={g.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">{g.point}</span>
                      <span className="text-[10px] font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full shrink-0">
                        {g.jlpt_level}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs truncate">{g.meaning}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteGrammar(g.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl shrink-0 ml-2"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {grammarList.length === 0 && (
                <p className="text-slate-600 text-xs text-center py-8">No grammar points yet. Add one on the left.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};