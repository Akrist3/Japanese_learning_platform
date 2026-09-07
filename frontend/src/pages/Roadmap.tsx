import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Play, Star, MapPin } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const nodes = [
    { id: 'level-0', title: 'LEVEL 0 — Japanese Basics & Sounds', status: 'completed', path: '/hiragana', desc: 'Japanese writing systems, sounds, vowels, double consonants' },
    { id: 'hiragana', title: 'LEVEL 1 — Complete Hiragana Course', status: 'completed', path: '/hiragana', desc: '46 base + dakuten + handakuten + combinations' },
    { id: 'katakana', title: 'LEVEL 2 — Complete Katakana Course', status: 'active', path: '/katakana', desc: 'Foreign loanwords, stroke order & quizzes' },
    { id: 'n5', title: 'LEVEL 3 — JLPT N5 Foundation', status: 'unlocked', path: '/vocabulary?jlpt_level=N5', desc: 'N5 Vocabulary, N5 Kanji, Basic Particles (は vs が)' },
    { id: 'verbs', title: 'LEVEL 4 — Japanese Verb Conjugations', status: 'unlocked', path: '/verbs', desc: 'Godan, Ichidan & Irregular verbs across 15 forms' },
    { id: 'n4', title: 'LEVEL 5 — JLPT N4 Elementary', status: 'locked', path: '/vocabulary?jlpt_level=N4', desc: 'N4 Kanji, complex sentence structures & reading' },
    { id: 'n3', title: 'LEVEL 6 — JLPT N3 Intermediate', status: 'locked', path: '/vocabulary?jlpt_level=N3', desc: 'N3 Grammar points, news reading & dictation' },
    { id: 'n2', title: 'LEVEL 7 — JLPT N2 Advanced', status: 'locked', path: '/vocabulary?jlpt_level=N2', desc: 'Business Japanese & formal grammar' },
    { id: 'n1', title: 'LEVEL 8 — JLPT N1 Mastery', status: 'locked', path: '/vocabulary?jlpt_level=N1', desc: 'Full native proficiency & abstract prose' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white mb-2">Japanese Progression Roadmap</h1>
        <p className="text-slate-400 text-sm">Follow your structured path from absolute zero to JLPT N1.</p>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-6 pl-8 space-y-8">
        {nodes.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isActive = node.status === 'active';
          const isUnlocked = node.status === 'unlocked' || isCompleted || isActive;

          return (
            <div key={node.id} className="relative group">
              {/* Node Badge on Timeline */}
              <div 
                className={`absolute -left-[45px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-lg transition-transform group-hover:scale-110 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                    : isActive 
                    ? 'bg-rose-500 border-rose-400 text-white animate-pulse' 
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>

              {/* Node Card */}
              <div 
                className={`p-6 rounded-3xl border transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-slate-900 to-rose-950/30 border-rose-500/50 shadow-xl shadow-rose-500/10' 
                    : isUnlocked
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/60 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className={`text-lg font-extrabold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    {node.title}
                  </h3>
                  
                  {isUnlocked ? (
                    <Link
                      to={node.path}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isActive ? 'Continue' : 'Start'}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-600 font-bold bg-slate-950 px-3 py-1 rounded-full border border-slate-900">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{node.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
