import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { speakJapanese } from '../services/audio';
import { useGamification } from '../context/GamificationContext';

export const Speaking: React.FC = () => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const { awardXP } = useGamification();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await api.get('/speaking/prompts');
      setPrompts(res.data);
      if (res.data.length > 0) {
        setSelectedPrompt(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load speaking prompts', err);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser speech recognition is not supported in this browser. Try Chrome or Edge!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
      setEvalResult(null);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      evaluateSpeech(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const evaluateSpeech = async (userText: string) => {
    if (!selectedPrompt) return;
    try {
      const res = await api.post('/speaking/evaluate', {
        target_sentence: selectedPrompt.target_japanese,
        user_transcript: userText
      });
      setEvalResult(res.data);
      if (res.data.accuracy_score >= 70) {
        awardXP(30, 'speaking_practice');
      }
    } catch (err) {
      console.error('Failed to evaluate speaking', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <Mic className="w-7 h-7 text-rose-400" />
          <span>Speaking Practice (発音)</span>
        </h1>
        <p className="text-slate-400 text-sm">Real-time Japanese speech-to-text recognition & pronunciation feedback.</p>
      </div>

      {selectedPrompt && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl text-center">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500">Prompt Topic: {selectedPrompt.prompt}</span>
            <div className="text-3xl font-black text-white mt-2 mb-1">{selectedPrompt.target_japanese}</div>
            <div className="text-xs text-slate-400 italic font-medium">"{selectedPrompt.english}"</div>
          </div>

          {/* Listen Button */}
          <button
            onClick={() => speakJapanese(selectedPrompt.target_japanese)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>Listen to Reference Audio</span>
          </button>

          {/* Microphone Recording Button */}
          <div className="py-4">
            <button
              onClick={startListening}
              disabled={isRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-ping'
                  : 'bg-gradient-to-tr from-rose-500 to-pink-600 hover:scale-110 text-white shadow-rose-500/30'
              }`}
            >
              <Mic className="w-10 h-10" />
            </button>
            <div className="text-xs font-bold text-slate-400 mt-3">
              {isRecording ? 'Listening... Speak Japanese now!' : 'Click microphone & speak aloud'}
            </div>
          </div>

          {/* Transcript & Evaluation Scorecard */}
          {transcript && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 max-w-md mx-auto text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Recognized Japanese Speech:</span>
                <p className="text-base font-bold text-white">{transcript}</p>
              </div>

              {evalResult && (
                <div className="border-t border-slate-800/80 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Accuracy Score:</span>
                    <span className="text-lg font-black text-emerald-400">{evalResult.accuracy_score}%</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">{evalResult.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
