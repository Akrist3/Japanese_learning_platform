import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Headphones,
  Lightbulb,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  X,
  BookOpen,
  Languages,
  PenLine,
} from "lucide-react";
import { speakJapanese } from "../services/audio";

interface ListeningExercise {
  id: number;
  title: string;
  jlpt_level: string;
  topic: string;
  audio_text: string;
  transcript: string;
  translation: string;
  question: string;
  options: string[];
  correct_option: number;
  dictation_answer: string;
  hint: string;
}

interface ListeningAttemptResponse {
  attempt_id: number;
  exercise_id: number;
  correct: boolean;
  correct_option: number;
  dictation_correct: boolean;
  xp_earned: number;
  replay_count: number;
  first_attempt: boolean;
}

const SESSION_SIZE = 10;

export function Listening() {
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dictation, setDictation] = useState("");

  const [questionAttempted, setQuestionAttempted] = useState(false);
  const [questionCorrect, setQuestionCorrect] = useState(false);

  const [dictationChecked, setDictationChecked] = useState(false);
  const [dictationCorrect, setDictationCorrect] = useState(false);

  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [speed, setSpeed] = useState(1);
  const [replayCount, setReplayCount] = useState(0);

  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);

  const [sessionFinished, setSessionFinished] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] =
    useState<ListeningAttemptResponse | null>(null);

  // ============================================================
  // LOAD LISTENING EXERCISES
  // ============================================================

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8000/listening/list?jlpt_level=N5"
        );

        if (!response.ok) {
          throw new Error("Failed to load listening exercises.");
        }

        const data: ListeningExercise[] = await response.json();

        if (!data.length) {
          throw new Error("No listening exercises are available.");
        }

        const shuffled = [...data].sort(() => Math.random() - 0.5);

        setExercises(shuffled.slice(0, SESSION_SIZE));
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load listening practice. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const currentExercise = exercises[currentIndex];

  // ============================================================
  // PROGRESS
  // ============================================================

  const progress = useMemo(() => {
    if (!exercises.length) return 0;

    return ((currentIndex + 1) / exercises.length) * 100;
  }, [currentIndex, exercises.length]);

  // ============================================================
  // AUDIO
  // ============================================================

  const playAudio = () => {
    if (!currentExercise) return;

    speakJapanese(currentExercise.audio_text, speed);

    setReplayCount((prev) => prev + 1);
  };

  // ============================================================
  // SUBMIT ANSWER TO BACKEND
  // ============================================================

  const checkAnswer = async () => {
    if (
      !currentExercise ||
      selectedOption === null ||
      submitting
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      /*
       * Temporary fallback user ID.
       *
       * Later this will come from the authenticated user.
       */
      const userId = Number(
        localStorage.getItem("user_id") || "1"
      );

      const response = await fetch(
        "http://localhost:8000/listening/attempt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exercise_id: currentExercise.id,
            selected_option: selectedOption,
            replay_count: replayCount,
            dictation_answer: dictation.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to submit listening attempt."
        );
      }

      const result: ListeningAttemptResponse =
        await response.json();

      // Save backend result
      setAttemptResult(result);

      // Update question state
      setQuestionAttempted(true);
      setQuestionCorrect(result.correct);

      // Update session statistics
      if (result.correct) {
        setCorrectAnswers((prev) => prev + 1);
      }

      if (result.first_attempt && result.correct) {
        setFirstTryCorrect((prev) => prev + 1);
      }

      // XP comes ONLY from backend
      setScore((prev) => prev + result.xp_earned);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // CHECK DICTATION
  // ============================================================

  const checkDictation = () => {
    if (!currentExercise || !dictation.trim()) {
      return;
    }

    const normalize = (text: string) =>
      text
        .trim()
        .replace(/[。、！？!?]/g, "")
        .replace(/\s+/g, "");

    const isCorrect =
      normalize(dictation) ===
      normalize(currentExercise.dictation_answer);

    setDictationChecked(true);
    setDictationCorrect(isCorrect);

    /*
     * IMPORTANT:
     * Do NOT add XP here.
     *
     * XP is controlled by the backend.
     *
     * In Step 3.4 we will make dictation part of the
     * same backend attempt so its XP is stored properly.
     */
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const nextQuestion = () => {
    if (currentIndex >= exercises.length - 1) {
      setSessionFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);

    setSelectedOption(null);
    setDictation("");

    setQuestionAttempted(false);
    setQuestionCorrect(false);

    setDictationChecked(false);
    setDictationCorrect(false);

    setAttemptResult(null);

    setShowTranscript(false);
    setShowTranslation(false);
    setShowHint(false);

    setSpeed(1);
    setReplayCount(0);

    setError("");
  };

  // ============================================================
  // RESTART SESSION
  // ============================================================

  const restartSession = () => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);

    setExercises(shuffled.slice(0, SESSION_SIZE));
    setCurrentIndex(0);

    setSelectedOption(null);
    setDictation("");

    setQuestionAttempted(false);
    setQuestionCorrect(false);

    setDictationChecked(false);
    setDictationCorrect(false);

    setAttemptResult(null);

    setShowTranscript(false);
    setShowTranslation(false);
    setShowHint(false);

    setSpeed(1);
    setReplayCount(0);

    setScore(0);
    setCorrectAnswers(0);
    setFirstTryCorrect(0);

    setSessionFinished(false);
    setError("");
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-5">
            <Headphones className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>

          <h2 className="text-xl font-semibold">
            Preparing your listening session
          </h2>

          <p className="text-slate-400 mt-2 text-sm">
            Loading Japanese listening exercises...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error && !currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <X className="w-8 h-8 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold">
            Listening Practice Unavailable
          </h2>

          <p className="text-slate-400 mt-3">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // SESSION COMPLETE
  // ============================================================

  if (sessionFinished) {
    const accuracy =
      exercises.length > 0
        ? Math.round(
            (correctAnswers / exercises.length) * 100
          )
        : 0;

    const firstAccuracy =
      exercises.length > 0
        ? Math.round(
            (firstTryCorrect / exercises.length) * 100
          )
        : 0;

    return (
      <div className="min-h-screen bg-[#050816] text-white px-4 py-8 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center pt-8">
            <div className="w-20 h-20 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>

            <p className="text-pink-400 text-sm font-semibold mt-6 uppercase tracking-wider">
              Listening Session
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              Session Complete!
            </h1>

            <p className="text-slate-400 mt-3">
              Nice work. Keep training your Japanese listening skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <div className="bg-[#0b1124] border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm">
                XP Earned
              </p>

              <p className="text-3xl font-bold mt-2 text-pink-400">
                +{score}
              </p>
            </div>

            <div className="bg-[#0b1124] border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm">
                Accuracy
              </p>

              <p className="text-3xl font-bold mt-2">
                {accuracy}%
              </p>
            </div>

            <div className="bg-[#0b1124] border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm">
                First Try
              </p>

              <p className="text-3xl font-bold mt-2">
                {firstAccuracy}%
              </p>
            </div>
          </div>

          <div className="mt-6 bg-[#0b1124] border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold text-lg">
              Session Summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Questions completed
                </span>

                <span>{exercises.length}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Correct answers
                </span>

                <span>{correctAnswers}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  First-try correct
                </span>

                <span>{firstTryCorrect}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={restartSession}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-400 transition font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return null;
  }

  // ============================================================
  // MAIN LISTENING UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-pink-400" />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Listening Studio
              </h1>

              <p className="text-xs text-slate-500">
                JLPT N5 Practice
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">
              QUESTION
            </p>

            <p className="font-semibold">
              {currentIndex + 1}
              <span className="text-slate-500">
                {" "} / {exercises.length}
              </span>
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-7">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-500">
              Session progress
            </span>

            <span className="text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-[#0b1124] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

          {/* EXERCISE HEADER */}
          <div className="p-6 md:p-8 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium">
                {currentExercise.jlpt_level}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
                {currentExercise.topic}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold">
              {currentExercise.title}
            </h2>

            <p className="text-slate-400 mt-2">
              Listen carefully and choose the best answer.
            </p>
          </div>

          {/* AUDIO AREA */}
          <div className="p-6 md:p-8">
            <div className="rounded-2xl bg-[#070c1c] border border-white/10 p-5 md:p-6">

              <div className="flex flex-col md:flex-row md:items-center gap-5">

                {/* PLAY */}
                <button
                  onClick={playAudio}
                  className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-400 transition font-semibold shrink-0"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Play Audio
                </button>

                {/* SPEED */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Volume2 className="w-3.5 h-3.5" />
                    Playback speed
                  </div>

                  <div className="flex gap-2">
                    {[1, 0.7].map((value) => (
                      <button
                        key={value}
                        onClick={() => setSpeed(value)}
                        className={`px-4 py-2 rounded-lg text-sm border transition ${
                          speed === value
                            ? "bg-white text-black border-white"
                            : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {value === 1
                          ? "Normal 1.0×"
                          : "Slow 0.7×"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* REPLAY */}
                <div className="md:text-right">
                  <p className="text-xs text-slate-500">
                    REPLAYS
                  </p>

                  <p className="font-semibold mt-1">
                    {replayCount}
                  </p>
                </div>
              </div>

              {/* AUDIO VISUAL */}
              <div className="flex items-end justify-center gap-1 h-10 mt-6 opacity-40">
                {[
                  18, 28, 14, 34, 22, 40, 17, 30,
                  23, 36, 15, 27, 20, 32, 17, 25,
                ].map((height, index) => (
                  <div
                    key={index}
                    className="w-1.5 rounded-full bg-pink-400"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>

            {/* QUESTION */}
            <div className="mt-8">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Comprehension
                  </p>

                  <h3 className="text-lg md:text-xl font-semibold mt-1">
                    {currentExercise.question}
                  </h3>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="space-y-3">
                {currentExercise.options.map((option, index) => {
                  const isSelected =
                    selectedOption === index;

                  const isCorrect =
                    questionAttempted &&
                    index === currentExercise.correct_option;

                  const isWrong =
                    questionAttempted &&
                    isSelected &&
                    !isCorrect;

                  return (
                    <button
                      key={index}
                      disabled={questionAttempted}
                      onClick={() =>
                        setSelectedOption(index)
                      }
                      className={`w-full text-left rounded-xl border p-4 transition ${
                        isCorrect
                          ? "bg-green-500/10 border-green-500/50"
                          : isWrong
                          ? "bg-red-500/10 border-red-500/50"
                          : isSelected
                          ? "bg-pink-500/10 border-pink-500/50"
                          : "bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 ${
                            isCorrect
                              ? "bg-green-500/20 text-green-400"
                              : isWrong
                              ? "bg-red-500/20 text-red-400"
                              : isSelected
                              ? "bg-pink-500 text-white"
                              : "bg-white/5 text-slate-400"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>

                        <span className="flex-1 text-base">
                          {option}
                        </span>

                        {isCorrect && (
                          <Check className="w-5 h-5 text-green-400" />
                        )}

                        {isWrong && (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* CHECK ANSWER */}
              {!questionAttempted && (
                <button
                  onClick={checkAnswer}
                  disabled={
                    selectedOption === null ||
                    submitting
                  }
                  className="mt-5 w-full md:w-auto px-6 py-3 rounded-xl bg-white text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition"
                >
                  {submitting
                    ? "Checking..."
                    : "Check Answer"}
                </button>
              )}

              {/* BACKEND ERROR */}
              {error && currentExercise && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* FEEDBACK */}
              {questionAttempted && (
                <div
                  className={`mt-5 rounded-xl border p-4 ${
                    questionCorrect
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  <div className="flex gap-3">
                    {questionCorrect ? (
                      <Check className="w-5 h-5 text-green-400 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mt-0.5" />
                    )}

                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          questionCorrect
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {questionCorrect
                          ? "Correct! Great listening."
                          : "Not quite. Listen again and review the explanation."}
                      </p>

                      {attemptResult && (
                        <p className="text-sm text-slate-400 mt-2">
                          XP earned:{" "}
                          <span className="text-pink-400 font-semibold">
                            +{attemptResult.xp_earned}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LEARNING TOOLS */}
            <div className="mt-8 pt-7 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-yellow-400" />

                <p className="font-semibold text-sm">
                  Learning Tools
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                {/* TRANSCRIPT */}
                <button
                  disabled={!questionAttempted}
                  onClick={() =>
                    setShowTranscript((prev) => !prev)
                  }
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed text-left transition"
                >
                  <BookOpen className="w-5 h-5 text-blue-400" />

                  <div>
                    <p className="text-sm font-medium">
                      Transcript
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {showTranscript
                        ? "Hide"
                        : "Reveal"}
                    </p>
                  </div>
                </button>

                {/* TRANSLATION */}
                <button
                  disabled={!questionAttempted}
                  onClick={() =>
                    setShowTranslation((prev) => !prev)
                  }
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed text-left transition"
                >
                  <Languages className="w-5 h-5 text-green-400" />

                  <div>
                    <p className="text-sm font-medium">
                      Translation
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {showTranslation
                        ? "Hide"
                        : "Reveal"}
                    </p>
                  </div>
                </button>

                {/* HINT */}
                <button
                  onClick={() =>
                    setShowHint((prev) => !prev)
                  }
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-left transition"
                >
                  <Lightbulb className="w-5 h-5 text-yellow-400" />

                  <div>
                    <p className="text-sm font-medium">
                      Hint
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {showHint
                        ? "Hide"
                        : "Get help"}
                    </p>
                  </div>
                </button>
              </div>

              {/* HINT CONTENT */}
              {showHint && (
                <div className="mt-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4">
                  <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">
                    Hint
                  </p>

                  <p className="text-sm text-slate-300 mt-2">
                    {currentExercise.hint}
                  </p>
                </div>
              )}

              {/* TRANSCRIPT CONTENT */}
              {showTranscript && (
                <div className="mt-4 rounded-xl bg-blue-500/5 border border-blue-500/20 p-5">
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                    Japanese Transcript
                  </p>

                  <p className="text-lg leading-relaxed mt-3 whitespace-pre-line">
                    {currentExercise.transcript}
                  </p>
                </div>
              )}

              {/* TRANSLATION CONTENT */}
              {showTranslation && (
                <div className="mt-4 rounded-xl bg-green-500/5 border border-green-500/20 p-5">
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">
                    English Translation
                  </p>

                  <p className="text-slate-300 mt-3 leading-relaxed whitespace-pre-line">
                    {currentExercise.translation}
                  </p>
                </div>
              )}
            </div>

            {/* DICTATION */}
            <div className="mt-8 pt-7 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <PenLine className="w-4 h-4 text-orange-400" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Dictation Practice
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Listen again and type what you hear in Japanese.
                  </p>
                </div>
              </div>

              <textarea
                value={dictation}
                onChange={(e) => {
                  setDictation(e.target.value);

                  // Allow the user to correct and re-check
                  setDictationChecked(false);
                  setDictationCorrect(false);
                }}
                placeholder="日本語で聞こえた文章を入力してください..."
                className="w-full min-h-[120px] mt-5 rounded-xl border border-white/10 bg-[#070c1c] p-4 text-white placeholder:text-slate-600 resize-none focus:outline-none focus:border-pink-500/50 transition"
              />

              {!dictationChecked && (
                <button
                  onClick={checkDictation}
                  disabled={!dictation.trim()}
                  className="mt-3 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition text-sm font-medium"
                >
                  Check Dictation
                </button>
              )}

              {dictationChecked && (
                <div
                  className={`mt-4 rounded-xl border p-4 ${
                    dictationCorrect
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      dictationCorrect
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {dictationCorrect
                      ? "Excellent! Your dictation is correct."
                      : "Not quite. Compare your answer below."}
                  </p>

                  {!dictationCorrect && (
                    <p className="mt-3 text-sm text-slate-300">
                      {currentExercise.dictation_answer}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* NEXT BUTTON */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={nextQuestion}
                disabled={!questionAttempted}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-7 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-30 disabled:cursor-not-allowed transition font-semibold"
              >
                {currentIndex === exercises.length - 1
                  ? "Finish Session"
                  : "Next Question"}

                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER TIP */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-600">
          <Headphones className="w-3.5 h-3.5" />

          <span>
            Listen first • Think carefully • Check your answer
          </span>
        </div>
      </div>
    </div>
  );
}