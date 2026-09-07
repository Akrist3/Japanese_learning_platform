import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Trophy, Activity, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

export const ExamResultPage: React.FC = () => {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Exam result unavailable.</p>
        <Link to="/jlpt" className="text-rose-400 font-bold hover:underline">Return to JLPT Hub</Link>
      </div>
    );
  }

  const isPassed = result.percentage >= 70;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      
      {/* Result Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-xl ${
          isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
        }`}>
          {isPassed ? '🎯' : '📊'}
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Estimated JLPT Performance</span>
          <h1 className="text-4xl font-black text-white mt-1">{result.percentage}% Final Score</h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Score: {result.score} / {result.max_score} questions answered correctly ({Math.floor(result.time_spent_seconds / 60)} minutes spent).
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-slate-950 border border-slate-800">
          <span>Earned:</span>
          <span className="text-amber-400 font-black">+{result.earned_xp} XP</span>
        </div>
      </div>

      {/* Section-by-Section Accuracy Breakdown */}
      {result.section_scores && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span>Section Accuracy Breakdown</span>
          </h2>

          <div className="space-y-3">
            {Object.entries(result.section_scores).map(([sec, pct]: [string, any]) => (
              <div key={sec} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{sec}</span>
                  <span className={pct >= 70 ? 'text-emerald-400' : 'text-rose-400'}>{pct}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 70 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detected Weak Areas & Remedial Recommendation */}
      {result.weak_areas && result.weak_areas.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>Weak Topics Flagged for Review</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {result.weak_areas.map((wa: string, idx: number) => (
              <span key={idx} className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-xl text-xs font-semibold">
                {wa}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/mistakes"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <span>Review Mistakes Log</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="text-center pt-2">
        <Link to="/jlpt" className="text-slate-400 hover:text-white text-xs font-bold">
          ← Back to JLPT Hub
        </Link>
      </div>
    </div>
  );
};
