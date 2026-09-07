import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { MockExamItem } from '../types';

export const JLPTPrep: React.FC = () => {
  const [exams, setExams] = useState<MockExamItem[]>([]);
  const [studyPlan, setStudyPlan] = useState<any | null>(null);

  useEffect(() => {
    fetchExams();
    fetchStudyPlan();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams/list');
      setExams(res.data);
    } catch (err) {
      console.error('Failed to load exams', err);
    }
  };

  const fetchStudyPlan = async () => {
    try {
      const res = await api.get('/jlpt/study-plan');
      setStudyPlan(res.data);
    } catch (err) {
      console.error('Failed to load study plan', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 rounded-3xl space-y-2 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>JLPT Official Preparation Hub</span>
        </div>
        <h1 className="text-3xl font-black text-white">JLPT Preparation & Mock Exams</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Simulated JLPT practice exams matching authentic test structures, section timings, and automated weak topic diagnosis.
        </p>
      </div>

      {/* Available Mock Exams */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Full-Length JLPT Mock Exams</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-md">
                    {exam.jlpt_level}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{exam.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{exam.duration_minutes} Mins</span>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Includes Vocabulary, Grammar, Reading, and Listening section questions.
              </div>

              <Link
                to={`/exam/${exam.id}`}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Take Mock Exam</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Study Planner Schedule */}
      {studyPlan && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Personalized {studyPlan.target_level} Study Schedule</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">Daily Goal: {studyPlan.daily_goal_minutes} mins</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studyPlan.weekly_schedule.map((item: any) => (
              <div key={item.week} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs font-extrabold text-indigo-400">
                  <span>WEEK {item.week}</span>
                  <span>{item.daily_minutes} mins/day</span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.topic}</h4>
                <p className="text-xs text-slate-400">Focus: {item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
