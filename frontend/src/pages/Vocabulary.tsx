import React, { useEffect, useState } from 'react';
import { Search, Filter, Volume2, BookOpen } from 'lucide-react';
import api from '../services/api';
import { Vocabulary as VocabType } from '../types';
import { FuriganaText } from '../components/FuriganaText';
import { AudioButton } from '../components/AudioButton';

export const Vocabulary: React.FC = () => {
  const [vocabList, setVocabList] = useState<VocabType[]>([]);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('N5');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    fetchVocab();
  }, [levelFilter, categoryFilter, search]);

  const fetchVocab = async () => {
    try {
      let url = `/vocabulary/list?jlpt_level=${levelFilter}`;
      if (categoryFilter !== 'All') url += `&category=${categoryFilter}`;
      if (search) url += `&search=${search}`;

      const res = await api.get(url);
      setVocabList(res.data);
    } catch (err) {
      console.error('Failed to load vocabulary', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-rose-400" />
            <span>Vocabulary Bank</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Explore authentic JLPT vocabulary with readings, audio, and example sentences.</p>
        </div>

        {/* Search & Level Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by word, kanji, hiragana, or meaning..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  levelFilter === lvl
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vocabulary List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vocabList.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-3xl flex flex-col justify-between space-y-4 shadow-lg transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <FuriganaText
                  japanese={item.word}
                  furigana={item.kanji ? item.hiragana : undefined}
                  romaji={item.romaji}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-lg">
                  {item.jlpt_level}
                </span>
                <AudioButton text={item.word} size="sm" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                {item.part_of_speech} • {item.category}
              </span>
              <p className="text-base font-extrabold text-white">{item.meaning}</p>
            </div>

            {item.example_sentence && (
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-1">
                <p className="font-bold text-slate-200">{item.example_sentence}</p>
                <p className="text-slate-400 italic">{item.example_translation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
