import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { ExamQuestion } from '../types';

export const MockExam: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examDetail, setExamDetail] = useState<any | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600); // seconds
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, examDetail]);

  const fetchExam = async () => {
    try {
      const res = await api.get(`/exams/${examId}`);
      setExamDetail(res.data);
      setTimeLeft(res.data.duration_minutes * 60);
    } catch (err) {
      console.error('Failed to load exam', err);
    }
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setAnswers({ ...answers, [qId.toString()]: optionIdx });
  };

  const handleSubmitExam = async () => {
    if (!examDetail || submitting) return;
    setSubmitting(true);

    try {
      const timeSpent = (examDetail.duration_minutes * 60) - timeLeft;
      const res = await api.post('/exams/submit', {
        mock_exam_id: examDetail.id,
        answers,
        time_spent_seconds: Math.max(1, timeSpent)
      });
      navigate(`/exam-result/${res.data.result_id}`, { state: { result: res.data } });
    } catch (err) {
      console.error('Failed to submit exam', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!examDetail) {
    return <div className="p-8 text-center text-slate-400 font-bold">Loading exam questions...</div>;
  }

  const questions: ExamQuestion[] = examDetail.questions || [];
  const currentQ = questions[currentIdx];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Timer & Progress Bar Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-md">
            JLPT {examDetail.jlpt_level}
          </span>
          <h2 className="text-xl font-black text-white mt-1">{examDetail.title}</h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-rose-400 font-black text-sm">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id.toString()] !== undefined;
          const isCurrent = idx === currentIdx;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-9 h-9 rounded-xl font-bold text-xs shrink-0 transition-all ${
                isCurrent
                  ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                  : isAnswered
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Box */}
      {currentQ && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Section: <strong className="text-slate-300">{currentQ.section}</strong></span>
            <span>Question {currentIdx + 1} of {questions.length}</span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-lg font-bold text-white whitespace-pre-line leading-relaxed">
            {currentQ.question}
          </div>

          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id.toString()] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${

                    isSelected
                      ? 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1 disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={submitting}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-500/20"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
