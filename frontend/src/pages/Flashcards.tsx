import React, { useEffect, useState } from 'react';
import { Layers, RotateCcw, Check, Volume2, Sparkles, Trophy } from 'lucide-react';
import api from '../services/api';
import { FlashcardItem } from '../types';
import { AudioButton } from '../components/AudioButton';
import { useGamification } from '../context/GamificationContext';

export const Flashcards: React.FC = () => {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const { awardXP } = useGamification();

  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    try {
      const res = await api.get('/flashcards/due');
      setCards(res.data);
    } catch (err) {
      console.error('Failed to load flashcards', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (quality: number) => {
    if (cards.length === 0) return;
    const current = cards[currentIndex];

    try {
      const res = await api.post('/flashcards/review', {
        item_type: current.item_type,
        item_id: current.item_id,
        quality
      });

      awardXP(res.data.earned_xp, 'srs_review');

      setIsFlipped(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Finished deck
        fetchDueCards();
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to submit card review', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-bold">Loading SM-2 Spaced Repetition deck...</div>;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>SuperMemo SM-2 SRS Engine</span>
        </div>
        <h1 className="text-2xl font-black text-white">Smart Flashcards Review</h1>
        <p className="text-xs text-slate-400">
          {cards.length > 0 ? `Card ${currentIndex + 1} of ${cards.length} due today` : 'No cards due right now!'}
        </p>
      </div>

      {cards.length > 0 && currentCard ? (
        <div className="space-y-6">
          
          {/* Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-slate-900 border-2 border-slate-800 hover:border-slate-700 min-h-[300px] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-2xl relative select-none"
          >
            <span className="absolute top-4 left-4 text-[10px] uppercase font-extrabold text-slate-500 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {currentCard.item_type} • Rep {currentCard.repetition}
            </span>

            {/* Front Side */}
            {!isFlipped ? (
              <div className="space-y-4">
                <div className="text-5xl font-black text-white">
                  {currentCard.details.word || currentCard.details.kanji}
                </div>
                {currentCard.details.hiragana && (
                  <div className="text-lg font-bold text-rose-400">{currentCard.details.hiragana}</div>
                )}
                {currentCard.details.romaji && (
                  <div className="text-xs text-slate-500 font-medium">{currentCard.details.romaji}</div>
                )}
                <div className="text-xs text-slate-400 italic pt-4">Click anywhere to flip card</div>
              </div>
            ) : (
              /* Back Side */
              <div className="space-y-4">
                <div className="text-3xl font-black text-emerald-400">
                  {currentCard.details.meaning}
                </div>

                {currentCard.details.example && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1 max-w-md">
                    <p className="font-bold text-slate-200">{currentCard.details.example}</p>
                    <p className="text-slate-400 italic">{currentCard.details.translation}</p>
                  </div>
                )}

                {currentCard.details.mnemonic && (
                  <p className="text-xs text-amber-300 italic">Mnemonic: {currentCard.details.mnemonic}</p>
                )}

                <div className="pt-2">
                  <AudioButton text={currentCard.details.word || currentCard.details.kanji || ''} />
                </div>
              </div>
            )}
          </div>

          {/* SM-2 SRS Quality Rating Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleRating(0)}
                className="py-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold rounded-2xl text-xs flex flex-col items-center transition-all"
              >
                <span>Again</span>
                <span className="text-[10px] text-rose-300 font-normal">1 Day</span>
              </button>

              <button
                onClick={() => handleRating(3)}
                className="py-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold rounded-2xl text-xs flex flex-col items-center transition-all"
              >
                <span>Hard</span>
                <span className="text-[10px] text-amber-200 font-normal">3 Days</span>
              </button>

              <button
                onClick={() => handleRating(4)}
                className="py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold rounded-2xl text-xs flex flex-col items-center transition-all"
              >
                <span>Good</span>
                <span className="text-[10px] text-indigo-200 font-normal">6 Days</span>
              </button>

              <button
                onClick={() => handleRating(5)}
                className="py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl text-xs flex flex-col items-center transition-all"
              >
                <span>Easy</span>
                <span className="text-[10px] text-emerald-300 font-normal">12 Days</span>
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-bold text-white">All Due Cards Reviewed!</h2>
          <p className="text-xs text-slate-400">Great job! Return tomorrow or learn new vocabulary to add cards to your deck.</p>
        </div>
      )}
    </div>
  );
};
