import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, CheckCircle, ArrowRight, ArrowLeft, BookOpen, Volume2 } from 'lucide-react';
import { speakJapanese } from '../services/audio';
import { useGamification } from '../context/GamificationContext';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [slideIdx, setSlideIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { awardXP } = useGamification();

  const sampleLesson = {
    title: 'Japanese Verb Conjugation — The て-form (Te-form)',
    category: 'Grammar',
    jlpt_level: 'N5',
    slides: [
      {
        type: 'explanation',
        heading: 'What is the て-form?',
        content: 'The て-form is one of the most versatile verb conjugations in Japanese. It is used to connect multiple sentences together, request actions (〜てください), ask permission (〜てもいいです), and express ongoing actions (〜ている).'
      },
      {
        type: 'rule',
        heading: 'Godan Verb Rule for う, つ, る',
        content: 'For Godan verbs ending with う, つ, or る: replace the ending character with って (tte).\n\nExamples:\n• 買（か）う → 買（か）って (Buy)\n• 待（ま）つ → 待（ま）って (Wait)\n• 終（お）わる → 終（お）わって (Finish)'
      },
      {
        type: 'example',
        japanese: 'テレビを見て、本を読みます。',
        translation: 'I watch TV and read books.',
        audio: 'テレビを見て、本を読みます。'
      },
      {
        type: 'quiz',
        question: '「食べる」（Ichidan Verb）のて-形（Te-form）はどれですか。',
        options: ['食べて', '食べた', '食べる', '食べます'],
        correct_option: 0,
        explanation: 'Ichidan verbs drop る and add て, yielding 食べて.'
      }
    ]
  };

  const currentSlide = sampleLesson.slides[slideIdx];

  const handleNext = () => {
    if (slideIdx < sampleLesson.slides.length - 1) {
      setSlideIdx(prev => prev + 1);
      setUserChoice(null);
      setIsAnswered(false);
    } else {
      awardXP(100, 'completed_lesson');
      navigate('/dashboard');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      
      {/* Lesson Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex justify-between items-center shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
            {sampleLesson.jlpt_level} • {sampleLesson.category}
          </span>
          <h2 className="text-xl font-black text-white mt-1">{sampleLesson.title}</h2>
        </div>

        <span className="text-xs font-bold text-slate-400">
          Slide {slideIdx + 1} of {sampleLesson.slides.length}
        </span>
      </div>

      {/* Slide Content Box */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl min-h-[360px] flex flex-col justify-between">
        {currentSlide.type === 'explanation' || currentSlide.type === 'rule' ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white">{currentSlide.heading}</h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium">
              {currentSlide.content}
            </p>
          </div>
        ) : currentSlide.type === 'example' ? (
          <div className="space-y-6 text-center py-6">
            <span className="text-xs font-bold text-slate-500 uppercase">Example Sentence</span>
            <div className="text-3xl font-black text-white">{currentSlide.japanese}</div>
            <p className="text-slate-400 text-sm italic">{currentSlide.translation}</p>
            
            <button
              onClick={() => speakJapanese(currentSlide.audio || '')}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl inline-flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Audio</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="text-xs font-bold text-rose-400 uppercase">Interactive Check Question</span>
            <h3 className="text-lg font-bold text-white">{currentSlide.question}</h3>

            <div className="space-y-2">
              {currentSlide.options?.map((opt, idx) => {
                const isSelected = userChoice === idx;
                const isCorrect = idx === currentSlide.correct_option;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => { setUserChoice(idx); setIsAnswered(true); }}
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
        )}

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={() => setSlideIdx(prev => Math.max(0, prev - 1))}
            disabled={slideIdx === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1 disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20"
          >
            <span>{slideIdx === sampleLesson.slides.length - 1 ? 'Finish Lesson' : 'Next Slide'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
