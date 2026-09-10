import React, { useState } from 'react';
import { Play, Volume2, Sparkles, CheckCircle } from 'lucide-react';

interface CherryBlossomSceneProps {
  onContinue?: () => void;
}

const CherryBlossomScene: React.FC<CherryBlossomSceneProps> = ({
  onContinue,
}) => {
  const [watched, setWatched] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const correctAnswer = 'こんにちは';

  const options = [
    'こんにちは',
    'ありがとう',
    'さようなら',
    'おやすみ',
  ];

  const isCorrect = selected === correctAnswer;

  const speak = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance('こんにちは');
    speech.lang = 'ja-JP';
    speech.rate = 0.8;

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="space-y-6">

      {/* Scene intro */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Japan in Spring
        </div>

        <h2 className="mt-4 text-3xl md:text-4xl font-black text-white">
          🌸 A Day Under the Sakura
        </h2>

        <p className="mt-2 text-slate-400">
          Watch the scene and listen carefully.
        </p>
      </div>

      {/* Video */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">

        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/kZN2yTa1HcY"
            title="Cherry blossoms in Japan"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setWatched(true)}
          />
        </div>

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
            🌸 Sakura Scene
          </span>
        </div>
      </div>

      {/* Japanese phrase */}
      <div className="relative rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent p-6 text-center">

        <p className="text-xs uppercase tracking-[0.25em] text-pink-300 font-bold">
          Listen for this
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">

          <span className="text-4xl md:text-5xl font-black text-white">
            こんにちは
          </span>

          <button
            type="button"
            onClick={speak}
            className="w-11 h-11 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/20 flex items-center justify-center transition"
            aria-label="Listen to Japanese pronunciation"
          >
            <Volume2 className="w-5 h-5 text-pink-300" />
          </button>

        </div>

        <p className="mt-2 text-slate-400">
          Konnichiwa · Hello / Good afternoon
        </p>
      </div>

      {/* Interactive question */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">

        <div className="mb-5">
          <p className="text-sm text-slate-500 font-semibold">
            SCENE CHECK
          </p>

          <h3 className="mt-1 text-xl font-bold text-white">
            What greeting did you hear?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {options.map((option) => {
            const selectedOption = selected === option;
            const correct = option === correctAnswer;

            let style =
              'border-white/10 bg-slate-800/70 hover:bg-slate-800 text-white';

            if (selectedOption && correct) {
              style =
                'border-emerald-400/50 bg-emerald-400/10 text-emerald-300';
            }

            if (selectedOption && !correct) {
              style =
                'border-red-400/50 bg-red-400/10 text-red-300';
            }

            return (
              <button
                key={option}
                type="button"
                disabled={Boolean(selected)}
                onClick={() => setSelected(option)}
                className={`min-h-[58px] rounded-2xl border px-5 text-left font-bold transition ${style}`}
              >
                <span className="flex items-center justify-between">

                  {option}

                  {selectedOption && correct && (
                    <CheckCircle className="w-5 h-5" />
                  )}

                </span>
              </button>
            );
          })}

        </div>

        {/* Result */}
        {selected && (
          <div
            className={`mt-5 rounded-2xl p-4 border ${
              isCorrect
                ? 'border-emerald-400/20 bg-emerald-400/10'
                : 'border-red-400/20 bg-red-400/10'
            }`}
          >
            {isCorrect ? (
              <>
                <p className="font-bold text-emerald-300">
                  ✓ Great listening!
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  こんにちは is a common daytime greeting.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-red-300">
                  Not quite.
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Listen again and notice the greeting:
                  <span className="ml-1 text-white font-bold">
                    こんにちは
                  </span>
                </p>
              </>
            )}
          </div>
        )}

      </div>

      {/* Continue */}
      {isCorrect && (
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black transition shadow-lg shadow-pink-500/20"
        >
          Continue the Mission →
        </button>
      )}

    </div>
  );
};

export default CherryBlossomScene;