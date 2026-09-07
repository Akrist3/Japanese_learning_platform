import React, { useEffect, useState } from 'react';
import { Layers, Search, PenTool, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { KanjiItem } from '../types';
import { AudioButton } from '../components/AudioButton';
import { KanjiCanvas } from '../components/KanjiCanvas';
import { useGamification } from '../context/GamificationContext';

export const Kanji: React.FC = () => {
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>([]);
  const [levelFilter, setLevelFilter] = useState('N5');
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);
  const [gameMode, setGameMode] = useState<'catalog' | 'quiz'>('catalog');
  const [quizQuestion, setQuizQuestion] = useState<{ kanji: string; correct: string; options: string[] } | null>(null);
  const [score, setScore] = useState(0);
  const { awardXP } = useGamification();

  useEffect(() => {
    fetchKanji();
  }, [levelFilter]);

  const fetchKanji = async () => {
    try {
      const res = await api.get(`/kanji/list?jlpt_level=${levelFilter}`);
      setKanjiList(res.data);
    } catch (err) {
      console.error('Failed to load kanji', err);
    }
  };

  const startKanjiQuiz = () => {
    if (kanjiList.length < 3) return;
    const target = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    const distractor1 = kanjiList.find(k => k.id !== target.id)?.meaning || 'fire';
    const distractor2 = 'water';
    const options = [target.meaning, distractor1, distractor2].sort(() => Math.random() - 0.5);
    
    setQuizQuestion({ kanji: target.kanji, correct: target.meaning, options });
    setGameMode('quiz');
  };

  const handleAnswer = (option: string) => {
    if (quizQuestion && option === quizQuestion.correct) {
      setScore(prev => prev + 1);
      awardXP(20, 'kanji_quiz');
      startKanjiQuiz();
    } else {
      alert(`Wrong answer! Correct meaning was: ${quizQuestion?.correct}`);
      setGameMode('catalog');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-rose-400" />
            <span>Kanji Studio (漢字)</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Study Onyomi, Kunyomi, mnemonics, and practice stroke drawings.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setGameMode('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              gameMode === 'catalog' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={startKanjiQuiz}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              gameMode === 'quiz' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Speed Challenge
          </button>
        </div>
      </div>

      {gameMode === 'catalog' && (
        <div className="space-y-6">
          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 max-w-xs">
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  levelFilter === lvl ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {kanjiList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedKanji(item)}
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-5 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 group relative shadow-lg"
              >
                <span className="text-4xl font-black text-white group-hover:text-rose-400 transition-colors mb-1">
                  {item.kanji}
                </span>
                <span className="text-xs font-bold text-slate-300">{item.meaning}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{item.onyomi}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speed Challenge Quiz View */}
      {gameMode === 'quiz' && quizQuestion && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md mx-auto text-center space-y-6 shadow-2xl">
          <div className="text-xs font-bold uppercase text-amber-400 tracking-wider">Speed Challenge • Score: {score}</div>
          <div className="text-7xl font-black text-white bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-inner">
            {quizQuestion.kanji}
          </div>
          <p className="text-slate-400 text-sm font-semibold">Select the correct English meaning for this Kanji:</p>

          <div className="space-y-3">
            {quizQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="w-full py-3.5 bg-slate-950 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl border border-slate-800 hover:border-rose-400 transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kanji Detail & Drawing Modal */}
      {selectedKanji && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedKanji(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-5xl font-black text-rose-400">
                {selectedKanji.kanji}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">{selectedKanji.meaning}</h3>
                <div className="text-xs font-semibold text-slate-400">
                  <span>Onyomi: <strong className="text-slate-200">{selectedKanji.onyomi}</strong></span>
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  <span>Kunyomi: <strong className="text-slate-200">{selectedKanji.kunyomi}</strong></span>
                </div>
                <div className="text-[11px] text-slate-500">Strokes: {selectedKanji.stroke_count} • JLPT: {selectedKanji.jlpt_level}</div>
              </div>
            </div>

            {selectedKanji.mnemonic && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase mb-1">Mnemonic Device</h4>
                <p className="text-xs text-slate-300 italic">{selectedKanji.mnemonic}</p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Kanji Writing Practice</h4>
              <KanjiCanvas character={selectedKanji.kanji} onSuccess={() => awardXP(25, 'kanji_writing')} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
