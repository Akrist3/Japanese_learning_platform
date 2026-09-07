import React, { useEffect, useState } from 'react';
import { FileText, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useGamification } from '../context/GamificationContext';

export const Reading: React.FC = () => {
  const [passages, setPassages] = useState<any[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<any | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const { awardXP } = useGamification();

  useEffect(() => {
    fetchReading();
  }, []);

  const fetchReading = async () => {
    try {
      const res = await api.get('/reading/list');
      setPassages(res.data);
      if (res.data.length > 0) {
        setSelectedPassage(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load reading passages', err);
    }
  };

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    setUserAnswers({ ...userAnswers, [qIdx]: optionIdx });
    const q = selectedPassage.questions[qIdx];
    if (q && optionIdx === q.correct_option) {
      awardXP(25, 'reading_comprehension');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-rose-400" />
          <span>Reading Studio (読解)</span>
        </h1>
        <p className="text-slate-400 text-sm">Graded reading passages from N5 to N1 with vocabulary highlights and JLPT questions.</p>
      </div>

      {selectedPassage && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-md">
                {selectedPassage.jlpt_level}
              </span>
              <h3 className="text-2xl font-black text-white mt-1">{selectedPassage.title}</h3>
            </div>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranslation ? 'Hide English' : 'Show English Translation'}</span>
            </button>
          </div>

          {/* Passage Japanese Text */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <p className="text-lg font-bold text-white leading-relaxed tracking-wide">
              {selectedPassage.passage_japanese}
            </p>

            {showTranslation && (
              <div className="border-t border-slate-800/80 pt-3 text-xs text-slate-400 italic leading-relaxed">
                {selectedPassage.passage_translation}
              </div>
            )}
          </div>

          {/* Vocabulary Highlights */}
          {selectedPassage.vocab_highlights && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Key Vocabulary in Passage</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPassage.vocab_highlights.map((v: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                    <span className="font-bold text-rose-400">{v.word} ({v.reading})</span>
                    <span className="text-slate-400">— {v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comprehension Questions */}
          <div className="space-y-6 pt-4 border-t border-slate-800">
            <h4 className="text-base font-bold text-white">Comprehension Questions</h4>

            {selectedPassage.questions.map((q: any, qIdx: number) => (
              <div key={qIdx} className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <p className="text-sm font-bold text-slate-200">{qIdx + 1}. {q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = userAnswers[qIdx] === optIdx;
                    const isCorrect = optIdx === q.correct_option;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition-all flex items-center justify-between ${
                          userAnswers[qIdx] !== undefined
                            ? isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                              : isSelected
                              ? 'bg-rose-500/10 border-rose-500 text-rose-300'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {userAnswers[qIdx] !== undefined && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
