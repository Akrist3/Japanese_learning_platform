import React, { useEffect, useState } from 'react';
import { Play, Volume2, PenTool, Award, RotateCcw, Check, Sparkles } from 'lucide-react';
import api from '../services/api';
import { Kana } from '../types';
import { AudioButton } from '../components/AudioButton';
import { KanjiCanvas } from '../components/KanjiCanvas';
import { useGamification } from '../context/GamificationContext';

export const Hiragana: React.FC = () => {
  const [kanaList, setKanaList] = useState<Kana[]>([]);
  const [activeTab, setActiveTab] = useState<'chart' | 'practice' | 'game'>('chart');
  const [categoryFilter, setCategoryFilter] = useState<'base' | 'dakuten' | 'handakuten' | 'combination'>('base');
  const [selectedKana, setSelectedKana] = useState<Kana | null>(null);

  // Memory Game State
  const [cards, setCards] = useState<{ id: number; text: string; matchId: number; isFlipped: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const { awardXP } = useGamification();

  useEffect(() => {
    fetchKana();
  }, []);

  const fetchKana = async () => {
    try {
      const res = await api.get('/kana/list?type=hiragana');
      setKanaList(res.data);
    } catch (err) {
      console.error('Failed to load hiragana', err);
    }
  };

  const filteredKana = kanaList.filter(k => k.category === categoryFilter);

  // Setup Memory Game
  const startMemoryGame = () => {
    const subset = kanaList.filter(k => k.category === 'base').slice(0, 6);
    let gameCards: any[] = [];
    subset.forEach((k, idx) => {
      gameCards.push({ id: idx * 2, text: k.character, matchId: idx, isFlipped: false });
      gameCards.push({ id: idx * 2 + 1, text: k.romaji, matchId: idx, isFlipped: false });
    });
    // Shuffle
    gameCards.sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setActiveTab('game');
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const idx1 = newFlipped[0];
      const idx2 = newFlipped[1];

      if (cards[idx1].matchId === cards[idx2].matchId) {
        setMatchedPairs(prev => {
          const updated = prev + 1;
          if (updated === 6) {
            awardXP(50, 'hiragana_game');
          }
          return updated;
        });
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[idx1].isFlipped = false;
          resetCards[idx2].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <span>Hiragana Course (ひらがな)</span>
            <Sparkles className="w-6 h-6 text-rose-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">Master all 46 basic characters + Dakuten + Combinations.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chart' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Character Chart
          </button>
          <button
            onClick={startMemoryGame}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'game' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Memory Game
          </button>
        </div>
      </div>

      {/* Chart View */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          {/* Sub Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Basic 46 (あ)', value: 'base' },
              { label: 'Dakuten (が)', value: 'dakuten' },
              { label: 'Handakuten (ぱ)', value: 'handakuten' },
              { label: 'Combinations (きゃ)', value: 'combination' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat.value
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredKana.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedKana(item)}
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 group relative shadow-md"
              >
                <span className="text-3xl font-black text-white group-hover:text-rose-400 transition-colors">
                  {item.character}
                </span>
                <span className="text-xs font-medium text-slate-400 mt-1">{item.romaji}</span>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AudioButton text={item.character} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Matching Game View */}
      {activeTab === 'game' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-center">
          <div>
            <h2 className="text-xl font-black text-white">Hiragana Memory Matching</h2>
            <p className="text-xs text-slate-400">Match the Hiragana character to its correct Romaji pronunciation.</p>
          </div>

          {matchedPairs === 6 && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl font-bold animate-bounce">
              🎉 Congratulations! You cleared the game and earned +50 XP!
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`h-24 rounded-2xl border flex items-center justify-center text-2xl font-black cursor-pointer transition-all ${
                  card.isFlipped
                    ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-slate-950 border-slate-800 text-transparent hover:border-slate-700'
                }`}
              >
                {card.isFlipped ? card.text : '🇯🇵'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kana Detail Modal */}
      {selectedKana && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedKana(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-4xl font-black text-rose-400">
                {selectedKana.character}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{selectedKana.romaji}</h3>
                <span className="text-xs font-semibold text-slate-400">Strokes: {selectedKana.stroke_count}</span>
                <div className="mt-1">
                  <AudioButton text={selectedKana.character} size="sm" />
                </div>
              </div>
            </div>

            {selectedKana.mnemonic && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase mb-1">Mnemonic Helper</h4>
                <p className="text-xs text-slate-300 italic">{selectedKana.mnemonic}</p>
              </div>
            )}

            {/* Kanji Canvas Stroke Practice Pad */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Writing Practice Pad</h4>
              <KanjiCanvas character={selectedKana.character} onSuccess={() => awardXP(15, 'hiragana_writing')} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
