import React, { useState } from 'react';
import { Bot, Send, Sparkles, MessageSquare, CheckSquare } from 'lucide-react';
import api from '../services/api';

export const AITutorPage: React.FC = () => {
  const [mode, setMode] = useState<'explain' | 'check_sentence' | 'roleplay'>('explain');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Konnichiwa! I am your AI Japanese Grammar Tutor. Ask me any question, ask me to check a Japanese sentence, or start a scenario roleplay!' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/tutor', {
        query: userText,
        mode: mode
      });

      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (err) {
      console.error('AI Tutor request failed', err);
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an issue processing that query. Please try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-indigo-400" />
            <span>AI Japanese Tutor & Roleplay</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Get instant grammar explanations, sentence analysis, and conversation simulations.</p>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setMode('explain')}
            className={`px-3 py-1.5 rounded-xl ${mode === 'explain' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Grammar Q&A
          </button>
          <button
            onClick={() => setMode('check_sentence')}
            className={`px-3 py-1.5 rounded-xl ${mode === 'check_sentence' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Sentence Checker
          </button>
          <button
            onClick={() => setMode('roleplay')}
            className={`px-3 py-1.5 rounded-xl ${mode === 'roleplay' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Roleplay
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[480px] flex flex-col shadow-xl">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-4 rounded-3xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-rose-500 text-white rounded-br-none font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none whitespace-pre-line'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-xs text-indigo-400 font-bold animate-pulse">AI Tutor is thinking...</div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === 'explain' ? "Ask e.g. 'Why is は used here instead of が?'..." :
              mode === 'check_sentence' ? "Type Japanese sentence e.g. '私は日本に行きました'..." :
              "Respond in Japanese for restaurant roleplay..."
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-semibold"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
