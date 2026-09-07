import React, { useEffect, useState } from 'react';
import { RotateCw, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { VerbItem } from '../types';
import { useGamification } from '../context/GamificationContext';

export const VerbTrainer: React.FC = () => {
  const [verbs, setVerbs] = useState<VerbItem[]>([]);
  const [currentVerb, setCurrentVerb] = useState<VerbItem | null>(null);
  const [targetForm, setTargetForm] = useState<string>('te');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<any | null>(null);
  const [streak, setStreak] = useState(0);
  const { awardXP } = useGamification();

  const formsList = [
    { label: 'Polite (ます)', value: 'masu' },
    { label: 'Plain Negative (ない)', value: 'nai' },
    { label: 'Te-form (て)', value: 'te' },
    { label: 'Plain Past (た)', value: 'ta' },
    { label: 'Potential (られる/える)', value: 'potential' },
    { label: 'Passive (られる)', value: 'passive' },
    { label: 'Causative (させる)', value: 'causative' },
    { label: 'Volitional (よう/おう)', value: 'volitional' },
    { label: 'Conditional (ば)', value: 'conditional_ba' },
    { label: 'Imperative', value: 'imperative' }
  ];

  useEffect(() => {
    fetchVerbs();
  }, []);

  const fetchVerbs = async () => {
    try {
      const res = await api.get('/verbs/list?jlpt_level=N5');
      setVerbs(res.data);
      if (res.data.length > 0) {
        pickRandomPrompt(res.data);
      }
    } catch (err) {
      console.error('Failed to load verbs', err);
    }
  };

  const pickRandomPrompt = (verbArray: VerbItem[]) => {
    const v = verbArray[Math.floor(Math.random() * verbArray.length)];
    const f = formsList[Math.floor(Math.random() * formsList.length)].value;
    setCurrentVerb(v);
    setTargetForm(f);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVerb) return;

    try {
      const res = await api.post('/verbs/practice/check', {
        dictionary_form: currentVerb.dictionary_form,
        target_form: targetForm,
        user_answer: userAnswer.trim()
      });

      setFeedback(res.data);
      if (res.data.correct) {
        setStreak(prev => prev + 1);
        awardXP(20, 'verb_conjugation');
      } else {
        setStreak(0);
      }
    } catch (err) {
      console.error('Failed to check conjugation', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Interactive Conjugation Engine</span>
        </div>
        <h1 className="text-3xl font-black text-white">Verb Conjugation Trainer</h1>
        <p className="text-slate-400 text-sm">Master Godan, Ichidan, and Irregular verb forms with instant grading.</p>
      </div>

      {currentVerb && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
          {/* Streak Counter */}
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500">Verb Group: <strong className="text-rose-400 uppercase">{currentVerb.verb_group}</strong></span>
            <span className="text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">🔥 Streak: {streak}</span>
          </div>

          {/* Verb Prompt */}
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-2 shadow-inner">
            <div className="text-xs uppercase font-bold text-slate-500 tracking-widest">Dictionary Form</div>
            <div className="text-5xl font-black text-white">{currentVerb.dictionary_form}</div>
            <div className="text-sm font-semibold text-slate-400">"{currentVerb.meaning}"</div>
          </div>

          {/* Form Requirement */}
          <div className="text-center">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Target Form Required</span>
            <span className="text-xl font-black text-rose-400 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-2xl inline-block">
              {formsList.find(f => f.value === targetForm)?.label}
            </span>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type conjugated Japanese verb (e.g. 食べます)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-center text-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-bold"
            />

            {!feedback ? (
              <button
                type="submit"
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
              >
                Check Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={() => pickRandomPrompt(verbs)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-indigo-600/20"
              >
                <span>Next Verb</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Feedback Display */}
          {feedback && (
            <div className={`p-4 rounded-2xl border text-sm font-bold flex items-start gap-3 ${
              feedback.correct
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {feedback.correct ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <div>
                <div>{feedback.correct ? 'Correct! Excellent conjugation.' : `Incorrect. Expected answer was: "${feedback.expected}"`}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
