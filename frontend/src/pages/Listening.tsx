import React, { useEffect, useState } from 'react';
import { Volume2, Play, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { speakJapanese } from '../services/audio';
import { useGamification } from '../context/GamificationContext';

export const Listening: React.FC = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedEx, setSelectedEx] = useState<any | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [speed, setSpeed] = useState<number>(0.9);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { awardXP } = useGamification();

  useEffect(() => {
    fetchListening();
  }, []);

  const fetchListening = async () => {
    try {
      const res = await api.get('/listening/list');
      setExercises(res.data);
      if (res.data.length > 0) {
        setSelectedEx(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load listening exercises', err);
    }
  };

  const handlePlayAudio = () => {
    if (selectedEx) {
      speakJapanese(selectedEx.audio_text, speed);
    }
  };

  const handleAnswerSubmit = (index: number) => {
    setSelectedOption(index);
    setIsAnswered(true);
    if (selectedEx && index === selectedEx.correct_option) {
      awardXP(30, 'listening_practice');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <Volume2 className="w-7 h-7 text-rose-400" />
          <span>Listening Studio (聴解)</span>
        </h1>
        <p className="text-slate-400 text-sm">Practice native Japanese audio comprehension, dictation, and JLPT conversations.</p>
      </div>

      {selectedEx && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-md">
                {selectedEx.jlpt_level}
              </span>
              <h3 className="text-xl font-black text-white mt-1">{selectedEx.title}</h3>
            </div>

            {/* Speed & Control Toggles */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setSpeed(0.9)}
                className={`px-3 py-1.5 rounded-xl ${speed === 0.9 ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
              >
                Normal (1.0x)
              </button>
              <button
                onClick={() => setSpeed(0.6)}
                className={`px-3 py-1.5 rounded-xl ${speed === 0.6 ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
              >
                Slow (0.6x)
              </button>
            </div>
          </div>

          {/* Big Audio Player Control */}
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-4 shadow-inner">
            <button
              onClick={handlePlayAudio}
              className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-500/30 transition-all hover:scale-110"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
            <div className="text-xs text-slate-400 font-semibold">Click to play Japanese audio passage</div>
          </div>

          {/* Transcript & Translation Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranscript ? 'Hide Transcript' : 'Show Transcript'}</span>
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              <span>{showTranslation ? 'Hide English' : 'Show English'}</span>
            </button>
          </div>

          {showTranscript && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-sm font-semibold text-slate-200 whitespace-pre-line leading-relaxed">
              {selectedEx.transcript}
            </div>
          )}

          {showTranslation && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs text-slate-400 italic whitespace-pre-line leading-relaxed">
              {selectedEx.translation}
            </div>
          )}

          {/* Question & Options */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-base font-bold text-white">{selectedEx.question}</h4>
            
            <div className="space-y-3">
              {selectedEx.options.map((opt: string, idx: number) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === selectedEx.correct_option;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSubmit(idx)}
                    className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                      isAnswered
                        ? isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                          : isSelected
                          ? 'bg-rose-500/10 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
