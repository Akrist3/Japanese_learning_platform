import React, { useEffect, useState } from 'react';
import { Shield, Plus, Trash2, Users, BookOpen, Layers, Activity } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'vocab' | 'kanji'>('stats');

  // New Vocab Form State
  const [word, setWord] = useState('');
  const [kanji, setKanji] = useState('');
  const [hiragana, setHiragana] = useState('');
  const [romaji, setRomaji] = useState('');
  const [meaning, setMeaning] = useState('');
  const [jlptLevel, setJlptLevel] = useState('N5');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
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
          <p className="text-slate-400 text-sm">Manage educational content, add vocabulary/kanji, and monitor user analytics.</p>
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

    </div>
  );
};
