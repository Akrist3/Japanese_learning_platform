import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Headphones,
  Loader2,
  MessageCircle,
  Mic,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import api from '../services/api';

interface Mission {
  id: string;
  number: number;
  level: string;
  title: string;
  purpose: string;
  skills: string[];
  path: string;
  xp: number;
  type: string;
  status: 'completed' | 'active' | 'unlocked' | 'locked';
  priority?: 'high' | 'normal';
  focus_skills?: string[];
}

interface RoadmapData {
  current_level: string;
  target_level: string;
  weak_skills: string[];
  total_missions: number;
  missions: Mission[];
}

type Stage =
  | 'intro'
  | 'scene'
  | 'learn'
  | 'recall'
  | 'sentence'
  | 'listening'
  | 'speaking'
  | 'challenge'
  | 'complete';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const recallQuestions: Question[] = [
  {
    question: 'What does こんにちは mean?',
    options: [
      'Thank you',
      'Hello / Good afternoon',
      'Good night',
      'Goodbye',
    ],
    answer: 'Hello / Good afternoon',
    explanation:
      'こんにちは is a common daytime greeting in Japanese.',
  },
  {
    question: 'Which sentence means "I am a student"?',
    options: [
      'わたしはがくせいです。',
      'わたしはせんせいです。',
      'これはほんです。',
      'こんにちは。',
    ],
    answer: 'わたしはがくせいです。',
    explanation:
      'わたし = I, は = topic marker, がくせい = student, です = polite ending.',
  },
  {
    question: 'What is the role of は in わたしは?',
    options: [
      'Verb',
      'Topic marker',
      'Question marker',
      'Past tense',
    ],
    answer: 'Topic marker',
    explanation:
      'は marks the topic of the sentence and is pronounced "wa" here.',
  },
];

const challengeQuestions: Question[] = [
  {
    question: 'How do you say "Hello / Good afternoon"?',
    options: [
      'ありがとう',
      'こんにちは',
      'おやすみ',
      'さようなら',
    ],
    answer: 'こんにちは',
    explanation:
      'こんにちは is a standard daytime greeting.',
  },
  {
    question:
      'Complete: わたしは ___ です。 (I am a student.)',
    options: [
      'がくせい',
      'せんせい',
      'ほん',
      'みず',
    ],
    answer: 'がくせい',
    explanation: 'がくせい means student.',
  },
  {
    question: 'What does ありがとう mean?',
    options: [
      'Hello',
      'Thank you',
      'Goodbye',
      'Good morning',
    ],
    answer: 'Thank you',
    explanation:
      'ありがとう is used to say thank you.',
  },
  {
    question: 'Which is a correct basic introduction?',
    options: [
      'わたしはがくせいです。',
      'がくせいわたしです。',
      'ですわたしはがくせい。',
      'わたしですはがくせい。',
    ],
    answer: 'わたしはがくせいです。',
    explanation:
      'The basic pattern is Topic + は + information + です.',
  },
  {
    question:
      'How is は pronounced when it is the topic marker?',
    options: [
      'ha',
      'hi',
      'wa',
      'ho',
    ],
    answer: 'wa',
    explanation:
      'は is normally "ha", but as a topic particle it is pronounced "wa".',
  },
];

const sentenceOptions = [
  'わたし',
  'は',
  'がくせい',
  'です',
];

const Mission: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stage, setStage] = useState<Stage>('intro');

  // Scene
  const [sceneAnswer, setSceneAnswer] = useState<string | null>(null);

  // Recall
  const [recallIndex, setRecallIndex] = useState(0);
  const [recallAnswer, setRecallAnswer] = useState<string | null>(null);
  const [recallCorrect, setRecallCorrect] = useState(0);

  // Sentence
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [sentenceSubmitted, setSentenceSubmitted] = useState(false);
  const [sentenceCorrect, setSentenceCorrect] = useState(false);

  // Listening
  const [listeningAnswer, setListeningAnswer] = useState<string | null>(
    null
  );
  const [listeningSubmitted, setListeningSubmitted] = useState(false);
  const [listeningCorrect, setListeningCorrect] = useState(false);

  // Speaking
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechResult, setSpeechResult] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechPassed, setSpeechPassed] = useState(false);

  // Challenge
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(
    null
  );
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);

  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchMission();

    const Recognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    setSpeechSupported(Boolean(Recognition));
  }, [missionId]);

  const fetchMission = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<RoadmapData>('/roadmap');

      const foundMission = response.data.missions.find(
        (item) => item.id === missionId
      );

      if (!foundMission) {
        setError('Mission not found.');
        return;
      }

      setMission(foundMission);

      if (foundMission.status === 'locked') {
        setError(
          'This mission is still locked. Complete the previous mission first.'
        );
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          'Unable to load this mission.'
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = useMemo(() => {
    const values: Record<Stage, number> = {
      intro: 5,
      scene: 15,
      learn: 25,
      recall: 42,
      sentence: 57,
      listening: 70,
      speaking: 80,
      challenge: 92,
      complete: 100,
    };

    return values[stage];
  }, [stage]);

  const stageName = useMemo(() => {
    const names: Record<Stage, string> = {
      intro: 'Mission Brief',
      scene: 'Experience Japan',
      learn: 'Learn',
      recall: 'Recall',
      sentence: 'Build',
      listening: 'Listen',
      speaking: 'Speak',
      challenge: 'Challenge',
      complete: 'Complete',
    };

    return names[stage];
  }, [stage]);

  const speakJapanese = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;

    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------
  // SCENE
  // -------------------------------------------------------

  const answerScene = (answer: string) => {
    if (sceneAnswer) return;
    setSceneAnswer(answer);
  };

  // -------------------------------------------------------
  // RECALL
  // -------------------------------------------------------

  const answerRecall = (answer: string) => {
    if (recallAnswer) return;

    setRecallAnswer(answer);

    if (answer === recallQuestions[recallIndex].answer) {
      setRecallCorrect((score) => score + 1);
    }
  };

  const nextRecall = () => {
    if (!recallAnswer) return;

    if (recallIndex < recallQuestions.length - 1) {
      setRecallIndex((index) => index + 1);
      setRecallAnswer(null);
    } else {
      setStage('sentence');
    }
  };

  // -------------------------------------------------------
  // SENTENCE
  // -------------------------------------------------------

  const toggleSentenceWord = (word: string) => {
    if (sentenceSubmitted) return;

    setSentenceWords((current) => {
      if (current.includes(word)) {
        return current.filter((item) => item !== word);
      }

      return [...current, word];
    });
  };

  const submitSentence = () => {
    const answer = sentenceWords.join('');

    setSentenceCorrect(
      answer === 'わたしはがくせいです'
    );

    setSentenceSubmitted(true);
  };

  const resetSentence = () => {
    setSentenceWords([]);
    setSentenceSubmitted(false);
    setSentenceCorrect(false);
  };

  // -------------------------------------------------------
  // LISTENING
  // -------------------------------------------------------

  const submitListening = () => {
    if (!listeningAnswer) return;

    setListeningCorrect(
      listeningAnswer === 'わたしはがくせいです。'
    );

    setListeningSubmitted(true);
  };

  // -------------------------------------------------------
  // SPEAKING
  // -------------------------------------------------------

  const startSpeechRecognition = () => {
    const Recognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!Recognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new Recognition();

    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsSpeaking(true);
    setSpeechResult('');
    setSpeechPassed(false);

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[0][0].transcript;

      setSpeechResult(transcript);

      const normalized = transcript
        .replace(/\s/g, '')
        .replace(/[。！？!?]/g, '');

      const accepted = [
        'わたしはがくせいです',
        '私は学生です',
        'わたしは学生です',
      ];

      const passed = accepted.some((answer) =>
        normalized.includes(answer)
      );

      setSpeechPassed(passed);
    };

    recognition.onerror = () => {
      setIsSpeaking(false);
    };

    recognition.onend = () => {
      setIsSpeaking(false);
    };

    recognition.start();
  };

  // -------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------

  const submitChallenge = () => {
    if (!challengeAnswer || challengeSubmitted) return;

    setChallengeSubmitted(true);

    if (
      challengeAnswer ===
      challengeQuestions[challengeIndex].answer
    ) {
      setChallengeScore((score) => score + 1);
    }
  };

  const nextChallenge = () => {
    if (!challengeSubmitted) return;

    if (
      challengeIndex <
      challengeQuestions.length - 1
    ) {
      setChallengeIndex((index) => index + 1);
      setChallengeAnswer(null);
      setChallengeSubmitted(false);
    } else {
      setStage('complete');
    }
  };

  // -------------------------------------------------------
  // SCORE
  // -------------------------------------------------------

  const finalChallengeScore =
    challengeScore +
    (challengeSubmitted &&
    challengeAnswer ===
      challengeQuestions[challengeIndex]?.answer
      ? 1
      : 0);

  const masteryScore = Math.round(
    (
      (
        recallCorrect +
        (sentenceCorrect ? 1 : 0) +
        (listeningCorrect ? 1 : 0) +
        (speechPassed ? 1 : 0) +
        finalChallengeScore
      ) /
      (
        recallQuestions.length +
        1 +
        1 +
        1 +
        challengeQuestions.length
      )
    ) * 100
  );

  const masteryPassed = masteryScore >= 70;

  // -------------------------------------------------------
  // COMPLETE
  // -------------------------------------------------------

  const completeMission = async () => {
    if (!mission || completing || !masteryPassed) return;

    try {
      setCompleting(true);
      setError('');

      await api.post(
        `/roadmap/mission/${mission.id}/complete`
      );

      setCompleted(true);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          'Unable to complete the mission.'
      );
    } finally {
      setCompleting(false);
    }
  };

  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-9 h-9 animate-spin text-pink-400 mx-auto" />
          <p className="mt-4 text-slate-400">
            Preparing your Japanese journey...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // ERROR
  // -------------------------------------------------------

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-red-500/20 bg-slate-900 p-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />

          <h2 className="mt-5 text-2xl font-black text-white">
            Mission Unavailable
          </h2>

          <p className="mt-3 text-slate-400">
            {error || 'Mission not found.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/roadmap')}
            className="mt-7 w-full rounded-2xl bg-white text-slate-950 py-3.5 font-black"
          >
            Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // MAIN UI
  // -------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#080b14] text-white">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-5">

        {/* HEADER */}
        <header className="flex items-center justify-between gap-4">

          <button
            type="button"
            onClick={() => navigate('/roadmap')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:block">
              Exit
            </span>
          </button>

          <div className="flex items-center gap-3">

            <div className="px-3 py-1.5 rounded-full border border-pink-400/20 bg-pink-400/10 text-pink-300 text-xs font-black">
              {mission.level}
            </div>

            <div className="flex items-center gap-1.5 text-amber-300 font-black">
              <Star className="w-4 h-4 fill-current" />
              +{mission.xp} XP
            </div>

          </div>

        </header>

        {/* MISSION TITLE */}
        <div className="mt-8">

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>
              Mission {mission.number}
            </span>

            <span>•</span>

            <span>
              {stageName}
            </span>
          </div>

          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
            {mission.title}
          </h1>

          <p className="mt-2 text-slate-400">
            {mission.purpose}
          </p>

        </div>

        {/* PROGRESS */}
        <div className="mt-7">

          <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
            <span>
              Mission progress
            </span>

            <span>
              {progress}%
            </span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-6 gap-1 mt-3">
            {[
              'Learn',
              'Recall',
              'Build',
              'Listen',
              'Speak',
              'Challenge',
            ].map((item, index) => {
              const current =
                [
                  'learn',
                  'recall',
                  'sentence',
                  'listening',
                  'speaking',
                  'challenge',
                ].indexOf(stage);

              const active = index <= current;

              return (
                <div
                  key={item}
                  className={`text-[10px] sm:text-xs text-center font-bold ${
                    active
                      ? 'text-pink-300'
                      : 'text-slate-600'
                  }`}
                >
                  {item}
                </div>
              );
            })}
          </div>

        </div>

        {/* CONTENT */}
        <main className="mt-10 pb-16">

          {/* ============================================= */}
          {/* INTRO */}
          {/* ============================================= */}

          {stage === 'intro' && (
            <section className="max-w-3xl mx-auto">

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 sm:p-10">

                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center text-3xl">
                  🌸
                </div>

                <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-pink-300">
                  Your next step
                </p>

                <h2 className="mt-3 text-3xl sm:text-5xl font-black">
                  Start speaking Japanese.
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-400">
                  In this mission you'll experience a small
                  Japanese scene, learn a useful greeting,
                  build your first sentence, listen, speak,
                  and finish with a challenge.
                </p>

                <div className="grid sm:grid-cols-3 gap-3 mt-8">

                  {[
                    ['🌸', 'Experience', 'See Japanese in context'],
                    ['🧠', 'Remember', 'Recall what you learn'],
                    ['🎤', 'Speak', 'Use Japanese yourself'],
                  ].map(([icon, title, text]) => (
                    <div
                      key={title}
                      className="rounded-2xl bg-slate-800/60 border border-white/5 p-4"
                    >
                      <div className="text-2xl">
                        {icon}
                      </div>

                      <p className="mt-3 font-black">
                        {title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {text}
                      </p>
                    </div>
                  ))}

                </div>

                <button
                  type="button"
                  onClick={() => setStage('scene')}
                  className="mt-9 w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 font-black flex items-center justify-center gap-2 hover:bg-pink-100 transition"
                >
                  Begin Mission
                  <ArrowRight className="w-5 h-5" />
                </button>

              </div>

            </section>
          )}

          {/* ============================================= */}
          {/* CHERRY BLOSSOM SCENE */}
          {/* ============================================= */}

          {stage === 'scene' && (
            <section className="max-w-4xl mx-auto">

              <div className="text-center mb-7">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 text-xs font-black">
                  <Sparkles className="w-4 h-4" />
                  EXPERIENCE JAPAN
                </div>

                <h2 className="mt-5 text-3xl sm:text-5xl font-black">
                  A Spring Afternoon in Japan
                </h2>

                <p className="mt-3 text-slate-400">
                  Watch the scene. Listen carefully.
                  Your first Japanese phrase is waiting.
                </p>

              </div>

              {/* VIDEO */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">

                <div className="aspect-video">

                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/JYDF4iNpwtI"
                    title="Tokyo Sakura Cherry Blossom Walk"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                </div>

                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-black">
                    🌸 SAKURA SEASON
                  </div>
                </div>

              </div>

              {/* SCENE QUESTION */}
              <div className="mt-6 rounded-[2rem] border border-pink-400/10 bg-gradient-to-br from-pink-500/10 to-slate-900/80 p-6 sm:p-8">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-xs font-black tracking-[0.2em] text-pink-300">
                      LISTEN FOR THIS
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      What greeting are we learning?
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      speakJapanese('こんにちは')
                    }
                    className="shrink-0 w-12 h-12 rounded-full bg-pink-500/15 border border-pink-400/20 flex items-center justify-center hover:bg-pink-500/25 transition"
                  >
                    <Volume2 className="w-5 h-5 text-pink-300" />
                  </button>

                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-6">

                  {[
                    'こんにちは',
                    'ありがとう',
                    'さようなら',
                    'おやすみ',
                  ].map((option) => {

                    const selected =
                      sceneAnswer === option;

                    const correct =
                      option === 'こんにちは';

                    let style =
                      'border-white/10 bg-slate-800/60 hover:bg-slate-800';

                    if (selected && correct) {
                      style =
                        'border-emerald-400/40 bg-emerald-400/10';
                    }

                    if (selected && !correct) {
                      style =
                        'border-red-400/40 bg-red-400/10';
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={Boolean(sceneAnswer)}
                        onClick={() =>
                          answerScene(option)
                        }
                        className={`min-h-[60px] rounded-2xl border px-5 text-left font-bold transition ${style}`}
                      >
                        <div className="flex items-center justify-between">

                          <span className="text-xl">
                            {option}
                          </span>

                          {selected && correct && (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          )}

                          {selected && !correct && (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}

                        </div>
                      </button>
                    );
                  })}

                </div>

                {sceneAnswer && (
                  <div className="mt-5">

                    {sceneAnswer === 'こんにちは' ? (
                      <div className="rounded-2xl bg-emerald-400/10 border border-emerald-400/20 p-5">

                        <p className="font-black text-emerald-300">
                          Perfect! 🌸
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          こんにちは means
                          <span className="text-white font-bold">
                            {' '}Hello / Good afternoon
                          </span>.
                        </p>

                        <button
                          type="button"
                          onClick={() => setStage('learn')}
                          className="mt-5 w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-400 text-slate-950 font-black"
                        >
                          Continue →
                        </button>

                      </div>
                    ) : (
                      <div className="rounded-2xl bg-red-400/10 border border-red-400/20 p-5">

                        <p className="font-black text-red-300">
                          Listen once more.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          The answer is
                          <span className="text-white font-black">
                            {' '}こんにちは
                          </span>.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setSceneAnswer(null)
                          }
                          className="mt-4 flex items-center gap-2 text-sm font-bold text-white"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Try again
                        </button>

                      </div>
                    )}

                  </div>
                )}

              </div>

            </section>
          )}

          {/* ============================================= */}
          {/* LEARN */}
          {/* ============================================= */}

          {stage === 'learn' && (
            <section className="max-w-3xl mx-auto">

              <div className="text-center mb-8">

                <div className="text-sm font-black text-pink-300 uppercase tracking-[0.2em]">
                  Learn
                </div>

                <h2 className="mt-3 text-3xl sm:text-4xl font-black">
                  Your first Japanese greeting
                </h2>

              </div>

              <div className="space-y-4">

                <div className="rounded-[2rem] border border-pink-400/20 bg-gradient-to-br from-pink-500/10 to-slate-900 p-8 text-center">

                  <div className="flex justify-center items-center gap-4">

                    <span className="text-5xl sm:text-7xl font-black">
                      こんにちは
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        speakJapanese('こんにちは')
                      }
                      className="w-12 h-12 rounded-full bg-pink-500/15 border border-pink-400/20 flex items-center justify-center"
                    >
                      <Volume2 className="w-5 h-5 text-pink-300" />
                    </button>

                  </div>

                  <p className="mt-4 text-xl text-slate-400">
                    Konnichiwa
                  </p>

                  <p className="mt-1 text-slate-500">
                    Hello / Good afternoon
                  </p>

                </div>

                <div className="grid sm:grid-cols-2 gap-4">

                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                    <p className="text-xs font-black text-pink-300 uppercase tracking-wider">
                      Useful word
                    </p>

                    <p className="mt-4 text-3xl font-black">
                      わたし
                    </p>

                    <p className="mt-1 text-slate-400">
                      watashi · I / me
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                    <p className="text-xs font-black text-pink-300 uppercase tracking-wider">
                      Topic marker
                    </p>

                    <p className="mt-4 text-3xl font-black">
                      は
                    </p>

                    <p className="mt-1 text-slate-400">
                      pronounced "wa"
                    </p>
                  </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">

                  <p className="text-xs font-black text-pink-300 uppercase tracking-wider">
                    Sentence pattern
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {[
                      ['わたし', 'I'],
                      ['は', 'topic'],
                      ['がくせい', 'student'],
                      ['です', 'polite ending'],
                    ].map(([jp, en]) => (
                      <div
                        key={jp}
                        className="rounded-2xl bg-slate-800 px-4 py-3"
                      >
                        <p className="text-xl font-black">
                          {jp}
                        </p>

                        <p className="text-xs text-slate-500">
                          {en}
                        </p>
                      </div>
                    ))}

                  </div>

                  <p className="mt-5 text-slate-400">
                    Together:
                    <span className="ml-2 text-white font-black">
                      わたしはがくせいです。
                    </span>
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setStage('recall')}
                className="mt-7 w-full py-4 rounded-2xl bg-white text-slate-950 font-black flex items-center justify-center gap-2"
              >
                I understand — Test me
                <ArrowRight className="w-5 h-5" />
              </button>

            </section>
          )}

          {/* ============================================= */}
          {/* RECALL */}
          {/* ============================================= */}

          {stage === 'recall' && (
            <section className="max-w-3xl mx-auto">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <p className="text-xs font-black text-pink-300 uppercase tracking-wider">
                    Recall
                  </p>

                  <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                    Remember without looking
                  </h2>
                </div>

                <div className="text-sm font-black text-slate-500">
                  {recallIndex + 1}/{recallQuestions.length}
                </div>

              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 sm:p-8">

                <h3 className="text-xl sm:text-2xl font-black">
                  {recallQuestions[recallIndex].question}
                </h3>

                <div className="space-y-3 mt-7">

                  {recallQuestions[recallIndex].options.map(
                    (option) => {

                      const selected =
                        recallAnswer === option;

                      const correct =
                        option ===
                        recallQuestions[recallIndex].answer;

                      let style =
                        'border-white/10 bg-slate-800/60 hover:bg-slate-800';

                      if (recallAnswer && correct) {
                        style =
                          'border-emerald-400/40 bg-emerald-400/10';
                      }

                      if (
                        selected &&
                        !correct
                      ) {
                        style =
                          'border-red-400/40 bg-red-400/10';
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={Boolean(recallAnswer)}
                          onClick={() =>
                            answerRecall(option)
                          }
                          className={`w-full text-left p-4 rounded-2xl border transition font-semibold ${style}`}
                        >
                          {option}
                        </button>
                      );
                    }
                  )}

                </div>

                {recallAnswer && (
                  <div className="mt-6">

                    <p className="text-sm text-slate-400">
                      {recallQuestions[recallIndex].explanation}
                    </p>

                    <button
                      type="button"
                      onClick={nextRecall}
                      className="mt-5 w-full py-3.5 rounded-xl bg-white text-slate-950 font-black"
                    >
                      {recallIndex === recallQuestions.length - 1
                        ? 'Build a sentence'
                        : 'Next question'}
                    </button>

                  </div>
                )}

              </div>

            </section>
          )}

          {/* ============================================= */}
          {/* SENTENCE */}
          {/* ============================================= */}

          {stage === 'sentence' && (
            <section className="max-w-3xl mx-auto">

              <div className="text-center mb-7">

                <p className="text-xs font-black text-pink-300 uppercase tracking-wider">
                  Build
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Build your first sentence
                </h2>

                <p className="mt-2 text-slate-400">
                  Put the words in the correct order.
                </p>

              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 sm:p-8">

                <div className="min-h-[100px] rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 flex flex-wrap items-center gap-2">

                  {sentenceWords.length === 0 ? (
                    <p className="text-slate-600">
                      Tap words below...
                    </p>
                  ) : (
                    sentenceWords.map((word) => (
                      <button
                        key={word}
                        type="button"
                        onClick={() =>
                          toggleSentenceWord(word)
                        }
                        className="px-4 py-2 rounded-xl bg-pink-500/15 border border-pink-400/20 text-pink-200 font-black"
                      >
                        {word}
                      </button>
                    ))
                  )}

                </div>

                <div className="flex flex-wrap gap-2 mt-5">

                  {sentenceOptions.map((word) => (
                    <button
                      key={word}
                      type="button"
                      disabled={
                        sentenceWords.includes(word) ||
                        sentenceSubmitted
                      }
                      onClick={() =>
                        toggleSentenceWord(word)
                      }
                      className="px-5 py-3 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 disabled:opacity-30 font-bold"
                    >
                      {word}
                    </button>
                  ))}

                </div>

                {!sentenceSubmitted ? (
                  <div className="flex gap-3 mt-7">

                    <button
                      type="button"
                      onClick={resetSentence}
                      className="px-5 py-3 rounded-xl border border-white/10 text-slate-400"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      disabled={
                        sentenceWords.length !== 4
                      }
                      onClick={submitSentence}
                      className="flex-1 py-3 rounded-xl bg-white text-slate-950 font-black disabled:opacity-30"
                    >
                      Check sentence
                    </button>

                  </div>
                ) : (
                  <div className="mt-7">

                    <div
                      className={`rounded-2xl p-5 border ${
                        sentenceCorrect
                          ? 'bg-emerald-400/10 border-emerald-400/20'
                          : 'bg-red-400/10 border-red-400/20'
                      }`}
                    >

                      <p
                        className={`font-black ${
                          sentenceCorrect
                            ? 'text-emerald-300'
                            : 'text-red-300'
                        }`}
                      >
                        {sentenceCorrect
                          ? '✓ Correct!'
                          : 'Not quite'}
                      </p>

                      <p className="mt-2 text-slate-400">
                        Correct sentence:
                        <span className="ml-2 text-white font-black">
                          わたしはがくせいです。
                        </span>
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setStage('listening')
                      }
                      className="mt-4 w-full py-3.5 rounded-xl bg-white text-slate-950 font-black"
                    >
                      Continue to Listening
                    </button>

                  </div>
                )}

              </div>

            </section>
          )}

          {/* ============================================= */}
          {/* LISTENING */}
          {/* ============================================= */}

          {stage === 'listening' && (
            <section className="max-w-3xl mx-auto">

              <div className="text-center mb-7">

                <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                  <Headphones className="w-7 h-7 text-purple-300" />
                </div>

                <h2 className="mt-5 text-3xl font-black">
                  Listen carefully
                </h2>

                <p className="mt-2 text-slate-400">
                  Listen and choose what you hear.
                </p>

              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 text-center">

                <button
                  type="button"
                  onClick={() =>
                    speakJapanese(
                      'わたしはがくせいです。'
                    )
                  }
                  className="w-20 h-20 mx-auto rounded-full bg-purple-500/15 border border-purple-400/20 flex items-center justify-center hover:bg-purple-500/25 transition"
                >
                  <Volume2 className="w-8 h-8 text-purple-300" />
                </button>

                <p className="mt-5 text-sm text-slate-500">
                  Tap to play
                </p>

                <div className="space-y-3 mt-7">

                  {[
                    'わたしはがくせいです。',
                    'わたしはせんせいです。',
                    'これはほんです。',
                    'こんにちは。',
                  ].map((option) => {

                    const selected =
                      listeningAnswer === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={listeningSubmitted}
                        onClick={() =>
                          setListeningAnswer(option)
                        }
                        className={`w-full p-4 rounded-2xl border text-left font-black transition ${
                          selected
                            ? 'border-purple-400/50 bg-purple-400/10 text-purple-200'
                            : 'border-white/10 bg-slate-800/60 hover:bg-slate-800'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}

                </div>

                {!listeningSubmitted ? (
                  <button
                    type="button"
                    disabled={!listeningAnswer}
                    onClick={submitListening}
                    className="mt-6 w-full py-3.5 rounded-xl bg-white text-slate-950 font-black disabled:opacity-30"
                  >
                    Check answer
                  </button>
                ) : (
                  <>
                    <div
                      className={`mt-6 p-5 rounded-2xl border ${
                        listeningCorrect
                          ? 'bg-emerald-400/10 border-emerald-400/20'
                          : 'bg-red-400/10 border-red-400/20'
                      }`}
                    >
                      <p className="font-black">
                        {listeningCorrect
                          ? '✓ Excellent listening!'
                          : 'Keep practicing!'}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        The sentence was:
                        <span className="ml-2 text-white font-black">
                          わたしはがくせいです。
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setStage('speaking')
                      }
                      className="mt-4 w-full py-3.5 rounded-xl bg-white text-slate-950 font-black"
                    >
                      Time to Speak
                    </button>
                  </>
                )}

              </div>

            </section>
          )}

          {/* ============================================= */}
          {/* SPEAKING */}
          {/* ============================================= */}

          {stage === 'speaking' && (
            <section className="max-w-3xl mx-auto">

              <div className="text-center">

                <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 border border-rose-400/20 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-rose-300" />
                </div>

                <p className="mt-6 text-xs font-black text-rose-300 uppercase tracking-wider">
                  Speaking
                </p>

                <h2 className="mt-2 text-3xl sm:text-4xl font-black">
                  Say it yourself
                </h2>

                <p className="mt-2 text-slate-400">
                  Try to say the sentence naturally.
                </p>

              </div>

              <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-center">

                <p className="text-4xl sm:text-6xl font-black">
                  わたしは
                  <br />
                  がくせいです。
                </p>

                <button
                  type="button"
                  onClick={() =>
                    speakJapanese(
                      'わたしはがくせいです。'
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear pronunciation
                </button>

                <div className="mt-8">

                  {speechSupported ? (
                    <button
                      type="button"
                      disabled={isSpeaking}
                      onClick={startSpeechRecognition}
                      className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition ${
                        isSpeaking
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-rose-500/15 border border-rose-400/20 hover:bg-rose-500/25'
                      }`}
                    >
                      <Mic className="w-9 h-9 text-rose-200" />
                    </button>
                  ) : (
                    <div className="rounded-2xl bg-slate-800 p-5">
                      <p className="text-slate-400 text-sm">
                        Speech recognition is not available
                        in this browser.
                      </p>
                    </div>
                  )}

                </div>

                {isSpeaking && (
                  <p className="mt-5 text-rose-300 font-bold">
                    Listening...
                  </p>
                )}

                {speechResult && (
                  <div className="mt-6 rounded-2xl bg-slate-800/70 p-5">

                    <p className="text-xs text-slate-500 font-black uppercase">
                      You said
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      {speechResult}
                    </p>

                    <p
                      className={`mt-3 font-black ${
                        speechPassed
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {speechPassed
                        ? '✓ Great pronunciation!'
                        : 'Try once more'}
                    </p>

                  </div>
                )}

                {!speechSupported && (
                  <button
                    type="button"
                    onClick={() => setSpeechPassed(true)}
                    className="mt-6 w-full py-3 rounded-xl border border-white/10 text-slate-300"
                  >
                    I practiced speaking
                  </button>
                )}

                {(speechPassed || !speechSupported) && (
                  <button
                    type="button"
                    onClick={() =>
                      setStage('challenge')
                    }
                    className="mt-5 w-full py-3.5 rounded-xl bg-white text-slate-950 font-black"
                  >
                    Enter Final Challenge
                  </button>
                )}

              </div>

            </section>
          )}

          {/* ============================================= */}
          {/* CHALLENGE */}
          {/* ============================================= */}

          {stage === 'challenge' && (
            <section className="max-w-3xl mx-auto">

              <div className="text-center mb-7">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-black">
                  <Target className="w-4 h-4" />
                  FINAL CHALLENGE
                </div>

                <h2 className="mt-4 text-3xl sm:text-4xl font-black">
                  Show what you remember
                </h2>

                <p className="mt-2 text-slate-400">
                  No hints. You've got this.
                </p>

              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 sm:p-8">

                <div className="flex justify-between text-sm font-bold text-slate-500 mb-6">
                  <span>
                    Challenge {challengeIndex + 1}
                  </span>

                  <span>
                    {challengeScore} correct
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black">
                  {challengeQuestions[challengeIndex].question}
                </h3>

                <div className="space-y-3 mt-7">

                  {challengeQuestions[
                    challengeIndex
                  ].options.map((option) => {

                    const correct =
                      option ===
                      challengeQuestions[
                        challengeIndex
                      ].answer;

                    const selected =
                      challengeAnswer === option;

                    let style =
                      'border-white/10 bg-slate-800/60 hover:bg-slate-800';

                    if (
                      challengeSubmitted &&
                      correct
                    ) {
                      style =
                        'border-emerald-400/40 bg-emerald-400/10';
                    }

                    if (
                      challengeSubmitted &&
                      selected &&
                      !correct
                    ) {
                      style =
                        'border-red-400/40 bg-red-400/10';
                    }

                    if (
                      !challengeSubmitted &&
                      selected
                    ) {
                      style =
                        'border-amber-400/40 bg-amber-400/10';
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={challengeSubmitted}
                        onClick={() =>
                          setChallengeAnswer(option)
                        }
                        className={`w-full text-left p-4 rounded-2xl border transition font-bold ${style}`}
                      >
                        {option}
                      </button>
                    );
                  })}

                </div>

                {!challengeSubmitted ? (
                  <button
                    type="button"
                    disabled={!challengeAnswer}
                    onClick={submitChallenge}
                    className="mt-7 w-full py-4 rounded-2xl bg-white text-slate-950 font-black disabled:opacity-30"
                  >
                    Check Answer
                  </button>
                ) : (
                  <>

                    <div className="mt-6 rounded-2xl bg-slate-800/70 p-5">

                      <p className="font-black text-white">
                        {challengeAnswer ===
                        challengeQuestions[
                          challengeIndex
                        ].answer
                          ? '✓ Correct!'
                          : 'Not quite.'}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        {
                          challengeQuestions[
                            challengeIndex
                          ].explanation
                        }
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={nextChallenge}
                      className="mt-5 w-full py-4 rounded-2xl bg-white text-slate-950 font-black"
                    >
                      {challengeIndex ===
                      challengeQuestions.length - 1
                        ? 'See My Result'
                        : 'Next Challenge'}
                    </button>

                  </>
                )}

              </div>

            </section>
          )}

          {/* ============================================= */}
          {/* COMPLETE */}
          {/* ============================================= */}

          {stage === 'complete' && (
            <section className="max-w-3xl mx-auto text-center">

              <div className="rounded-[2.5rem] border border-pink-400/20 bg-gradient-to-b from-pink-500/10 to-slate-900 p-8 sm:p-12">

                <div className="mx-auto w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-amber-300" />
                </div>

                <p className="mt-7 text-xs font-black tracking-[0.25em] text-pink-300">
                  MISSION COMPLETE
                </p>

                <h2 className="mt-3 text-4xl sm:text-5xl font-black">
                  You did it! 🎉
                </h2>

                <p className="mt-3 text-slate-400">
                  You just completed your first Japanese
                  speaking mission.
                </p>

                {/* SCORE */}
                <div className="mt-9">

                  <div className="text-7xl font-black bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    {masteryScore}%
                  </div>

                  <p className="mt-2 text-slate-500 font-bold">
                    Mission mastery
                  </p>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">

                  <div className="rounded-2xl bg-slate-800/60 p-4">
                    <p className="text-2xl font-black">
                      {recallCorrect}/{recallQuestions.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Recall
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-800/60 p-4">
                    <p className="text-2xl font-black">
                      {sentenceCorrect ? '✓' : '—'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Sentence
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-800/60 p-4">
                    <p className="text-2xl font-black">
                      {listeningCorrect ? '✓' : '—'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Listening
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-800/60 p-4">
                    <p className="text-2xl font-black">
                      {finalChallengeScore}/
                      {challengeQuestions.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Challenge
                    </p>
                  </div>

                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-amber-300 font-black text-xl">
                  <Star className="w-5 h-5 fill-current" />
                  +{mission.xp} XP
                </div>

                {!masteryPassed && (
                  <div className="mt-7 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-left">

                    <p className="font-black text-amber-300">
                      Keep practicing
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      You need at least 70% mastery to
                      unlock the next mission.
                    </p>

                  </div>
                )}

                {error && (
                  <div className="mt-5 rounded-2xl bg-red-400/10 border border-red-400/20 p-4 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {!completed ? (
                  <button
                    type="button"
                    disabled={
                      completing || !masteryPassed
                    }
                    onClick={completeMission}
                    className="mt-8 w-full py-4 rounded-2xl bg-white text-slate-950 font-black disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    {completing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving progress...
                      </>
                    ) : (
                      <>
                        Complete Mission
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="mt-8">

                    <div className="rounded-2xl bg-emerald-400/10 border border-emerald-400/20 p-4 text-emerald-300 font-black">
                      ✓ Mission saved to your roadmap
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate('/roadmap')
                      }
                      className="mt-4 w-full py-4 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black"
                    >
                      Continue Journey →
                    </button>

                  </div>
                )}

              </div>

            </section>
          )}

        </main>

      </div>
    </div>
  );
};

export default Mission;