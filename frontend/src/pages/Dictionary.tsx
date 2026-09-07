import React, { useState } from 'react';
import { Search, BookOpen, Layers, Volume2 } from 'lucide-react';
import api from '../services/api';
import { AudioButton } from '../components/AudioButton';
import { FuriganaText } from '../components/FuriganaText';

export const Dictionary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await api.get(`/dictionary/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      console.error('Dictionary search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl text-center">
        <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-rose-400" />
          <span>Japanese Dictionary & Search</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Search English meanings, Kanji readings, Hiragana, or Romaji keywords.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative flex items-center">
          <Search className="w-5 h-5 text-slate-500 absolute left-4" />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type Japanese word, Kanji (e.g. 食べる), or English (e.g. eat)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-semibold"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-6">
          
          {/* Vocabulary Matches */}
          {results.vocabulary_results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-400" />
                <span>Vocabulary Results ({results.vocabulary_count})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.vocabulary_results.map((item: any) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-lg">
                    <div className="flex justify-between items-start">
                      <FuriganaText
                        japanese={item.word}
                        furigana={item.kanji ? item.hiragana : undefined}
                        romaji={item.romaji}
                      />
                      <AudioButton text={item.word} size="sm" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">{item.part_of_speech} • {item.jlpt_level}</span>
                      <p className="text-base font-extrabold text-white">{item.meaning}</p>
                    </div>

                    {item.example_sentence && (
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                        <p className="font-bold text-slate-200">{item.example_sentence}</p>
                        <p className="text-slate-400 italic">{item.example_translation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kanji Matches */}
          {results.kanji_results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Kanji Breakdown Results ({results.kanji_count})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.kanji_results.map((k: any) => (
                  <div key={k.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center gap-4 shadow-lg">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl font-black text-rose-400 shrink-0">
                      {k.kanji}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{k.meaning}</h4>
                      <div className="text-xs text-slate-400">Onyomi: <strong className="text-slate-200">{k.onyomi}</strong></div>
                      <div className="text-xs text-slate-400">Kunyomi: <strong className="text-slate-200">{k.kunyomi}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
