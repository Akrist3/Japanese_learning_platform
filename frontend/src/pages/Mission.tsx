import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Headphones,
  Loader2,
  MessageCircle,
  Mic,
  Play,
  RotateCcw,
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
  | 'learn'
  | 'recall'
  | 'sentence'
  | 'listening'
  | 'speaking'
  | 'challenge'
  | 'complete';

interface RecallQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface ChallengeQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const recallQuestions: RecallQuestion[] = [
  {
    question: 'What does こんにちは mean?',
    options: ['Thank you', 'Hello / Good afternoon', 'Good night', 'Goodbye'],
    answer: 'Hello / Good afternoon',
    explanation: 'こんにちは is a common daytime greeting.',
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
    explanation: 'わたし = I, がくせい = student, and です completes the polite sentence.',
  },
  {
    question: 'What is the role of は in わたしは?',
    options: ['Verb', 'Topic marker', 'Question marker', 'Past tense'],
    answer: 'Topic marker',
    explanation: 'は marks the topic of the sentence. It is pronounced "wa" here.',
  },
];

const challengeQuestions: ChallengeQuestion[] = [
  {
    question: 'How do you say "Hello / Good afternoon"?',
    options: ['ありがとう', 'こんにちは', 'おやすみ', 'さようなら'],
    answer: 'こんにちは',
    explanation: 'こんにちは is a standard daytime greeting.',
  },
  {
    question: 'Complete: わたしは ___ です。 (I am a student.)',
    options: ['がくせい', 'せんせい', 'ほん', 'みず'],
    answer: 'がくせい',
    explanation: 'がくせい means student.',
  },
  {
    question: 'What does ありがとう mean?',
    options: ['Hello', 'Thank you', 'Goodbye', 'Good morning'],
    answer: 'Thank you',
    explanation: 'ありがとう is the common informal/polite-basic expression for thank you.',
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
    explanation: 'The basic pattern is Topic + は + information + です.',
  },
  {
    question: 'How is は pronounced when it is the topic marker?',
    options: ['ha', 'hi', 'wa', 'ho'],
    answer: 'wa',
    explanation: 'The character は is normally "ha", but as a topic particle it is pronounced "wa".',
  },
];

export const Mission: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stage, setStage] = useState<Stage>('intro');

  const [recallIndex, setRecallIndex] = useState(0);
  const [recallAnswer, setRecallAnswer] = useState<string | null>(null);
  const [recallCorrect, setRecallCorrect] = useState(0);

  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [sentenceSubmitted, setSentenceSubmitted] = useState(false);
  const [sentenceCorrect, setSentenceCorrect] = useState(false);

  const [listeningAnswer, setListeningAnswer] = useState<string | null>(null);
  const [listeningSubmitted, setListeningSubmitted] = useState(false);
  const [listeningCorrect, setListeningCorrect] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechResult, setSpeechResult] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechPassed, setSpeechPassed] = useState(false);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);

  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchMission();

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    setSpeechSupported(Boolean(SpeechRecognition));
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
      console.error('Failed to load mission:', err);

      setError(
        err.response?.data?.detail ||
          'Unable to load this mission.'
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = useMemo(() => {
    switch (stage) {
      case 'intro':
        return 5;
      case 'learn':
        return 20;
      case 'recall':
        return 40;
      case 'sentence':
        return 55;
      case 'listening':
        return 70;
      case 'speaking':
        return 80;
      case 'challenge':
        return 90;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  }, [stage]);

  const speakJapanese = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
  };

  const getLevelColor = (level: string) => {
    if (level.includes('N5')) return 'text-emerald-400';
    if (level.includes('N4')) return 'text-cyan-400';
    if (level.includes('N3')) return 'text-blue-400';
    if (level.includes('N2')) return 'text-purple-400';
    return 'text-rose-400';
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'Reading':
        return <BookOpen className="w-4 h-4" />;
      case 'Listening':
        return <Headphones className="w-4 h-4" />;
      case 'Speaking':
        return <MessageCircle className="w-4 h-4" />;
      case 'Grammar':
        return <Target className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const startMission = () => {
    setStage('learn');
  };

  const startRecall = () => {
    setRecallIndex(0);
    setRecallAnswer(null);
    setRecallCorrect(0);
    setStage('recall');
  };

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

  const sentenceOptions = [
    'わたし',
    'は',
    'がくせい',
    'です',
  ];

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

    setSentenceCorrect(answer === 'わたしはがくせいです。');
    setSentenceSubmitted(true);
  };

  const resetSentence = () => {
    setSentenceWords([]);
    setSentenceSubmitted(false);
    setSentenceCorrect(false);
  };

  const startListening = () => {
    setListeningAnswer(null);
    setListeningSubmitted(false);
    setListeningCorrect(false);
    setStage('listening');
  };

  const submitListening = () => {
    if (!listeningAnswer) return;

    setListeningCorrect(listeningAnswer === 'わたしはがくせいです。');
    setListeningSubmitted(true);
  };

  const startSpeaking = () => {
    setSpeechResult('');
    setSpeechPassed(false);
    setStage('speaking');
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsSpeaking(true);
    setSpeechResult('');

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

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

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsSpeaking(false);
    };

    recognition.onend = () => {
      setIsSpeaking(false);
    };

    recognition.start();
  };

  const startChallenge = () => {
    setChallengeIndex(0);
    setChallengeAnswer(null);
    setChallengeSubmitted(false);
    setChallengeScore(0);
    setStage('challenge');
  };

  const answerChallenge = (answer: string) => {
    if (challengeSubmitted) return;

    setChallengeAnswer(answer);
  };

  const submitChallenge = () => {
    if (!challengeAnswer) return;

    const question = challengeQuestions[challengeIndex];

    if (challengeAnswer === question.answer) {
      setChallengeScore((score) => score + 1);
    }

    setChallengeSubmitted(true);
  };

  const nextChallenge = () => {
    if (!challengeSubmitted) return;

    if (challengeIndex < challengeQuestions.length - 1) {
      setChallengeIndex((index) => index + 1);
      setChallengeAnswer(null);
      setChallengeSubmitted(false);
    } else {
      setStage('complete');
    }
  };

  const finalScore = challengeScore;

  const masteryScore = Math.round(
    ((recallCorrect +
      (sentenceCorrect ? 1 : 0) +
      (listeningCorrect ? 1 : 0) +
      (speechPassed ? 1 : 0) +
      finalScore) /
      (recallQuestions.length + 1 + 1 + 1 + challengeQuestions.length)) *
      100
  );

  const masteryPassed = masteryScore >= 80;

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
      console.error('Failed to complete mission:', err);

      setError(
        err.response?.data?.detail ||
          'Unable to complete the mission.'
      );
    } finally {
      setCompleting(false);
    }
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
          <p className="text-sm font-semibold">
            Preparing your mission...
          </p>
        </div>
      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error || !mission) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-xl bg-slate-900 border border-red-500/20 rounded-3xl p-8 text-center">

          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />

          <h2 className="text-xl font-black text-white mb-2">
            Mission Unavailable
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            {error || 'This mission could not be loaded.'}
          </p>

          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmap
          </Link>

        </div>
      </div>
    );
  }

  // =======================================================
  // COMPLETE
  // =======================================================

  if (completed) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">

        <div className="w-full max-w-2xl text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-emerald-400" />
          </div>

          <p className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-3">
            Mission Complete
          </p>

          <h1 className="text-4xl font-black text-white mb-4">
            Excellent Work! 🎉
          </h1>

          <p className="text-slate-400 max-w-lg mx-auto mb-6">
            You mastered "{mission.title}" and are ready for the next
            mission.
          </p>

          <div className="inline-flex flex-col items-center px-8 py-5 rounded-2xl bg-slate-900 border border-slate-800 mb-8">

            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-2xl font-black">
                +{mission.xp} XP
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Mastery score: {masteryScore}%
            </p>

          </div>

          <button
            onClick={() => navigate('/roadmap')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
          >
            Continue Journey
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    );
  }

  // =======================================================
  // MAIN
  // =======================================================

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">

      {/* BACK */}

      <div className="mb-6">
        <Link
          to="/roadmap"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roadmap
        </Link>
      </div>

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex flex-wrap items-center gap-3 mb-4">

          <span
            className={`text-xs font-black tracking-widest ${getLevelColor(
              mission.level
            )}`}
          >
            {mission.level}
          </span>

          <span className="text-slate-700">•</span>

          <span className="text-xs text-slate-500 font-bold">
            MISSION {mission.number}
          </span>

          <span className="ml-auto flex items-center gap-1 text-yellow-400 text-sm font-black">
            <Star className="w-4 h-4 fill-current" />
            {mission.xp} XP
          </span>

        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
          {mission.title}
        </h1>

        <p className="text-slate-400 max-w-2xl">
          {mission.purpose}
        </p>

      </div>

      {/* PROGRESS */}

      <div className="mb-8">

        <div className="flex justify-between text-xs mb-2">

          <span className="text-slate-500 font-bold">
            Mission Progress
          </span>

          <span className="text-slate-400 font-bold">
            {progress}%
          </span>

        </div>

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

      {/* ===================================================
          INTRO
      =================================================== */}

      {stage === 'intro' && (
        <div className="space-y-6">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

            <div className="flex gap-4">

              <div className="w-12 h-12 shrink-0 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-rose-400" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-rose-400 mb-2">
                  Mission Objective
                </p>

                <h2 className="text-xl font-black text-white mb-2">
                  Start introducing yourself in Japanese
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed">
                  By the end of this mission, you should be able to greet
                  someone, say who you are, understand a basic Japanese
                  sentence, and produce a simple self-introduction.
                </p>
              </div>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {mission.skills.map((skill) => (
              <div
                key={skill}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="text-rose-400">
                  {getSkillIcon(skill)}
                </div>

                <span className="font-bold text-slate-300">
                  {skill}
                </span>
              </div>
            ))}

          </div>

          <button
            onClick={startMission}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Mission
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      )}

      {/* ===================================================
          LEARN
      =================================================== */}

      {stage === 'learn' && (
        <div className="space-y-6">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

            <div className="flex items-center gap-3 mb-7">

              <BookOpen className="w-6 h-6 text-blue-400" />

              <div>
                <p className="text-xs font-bold text-blue-400 uppercase">
                  Step 1
                </p>

                <h2 className="text-2xl font-black text-white">
                  Learn the basics
                </h2>
              </div>

            </div>

            {/* GREETING */}

            <div className="mb-6">

              <div className="flex items-center justify-between mb-3">

                <div>
                  <p className="text-xs text-slate-500 font-bold">
                    GREETING
                  </p>

                  <h3 className="text-3xl font-black text-white">
                    こんにちは
                  </h3>

                  <p className="text-slate-400">
                    Konnichiwa — Hello / Good afternoon
                  </p>
                </div>

                <button
                  onClick={() => speakJapanese('こんにちは')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

              </div>

            </div>

            {/* GRAMMAR */}

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 mb-6">

              <p className="text-xs font-black uppercase tracking-wider text-rose-400 mb-3">
                Grammar Pattern
              </p>

              <div className="text-2xl font-black text-white mb-4">
                わたしは がくせい です。
              </div>

              <p className="text-sm text-slate-400 mb-5">
                I am a student.
              </p>

              <div className="grid md:grid-cols-4 gap-2">

                {[
                  ['わたし', 'I'],
                  ['は', 'topic marker'],
                  ['がくせい', 'student'],
                  ['です', 'am / is / are'],
                ].map(([jp, meaning]) => (
                  <div
                    key={jp}
                    className="rounded-xl bg-slate-900 border border-slate-800 p-3"
                  >
                    <p className="text-lg font-black text-white">
                      {jp}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {meaning}
                    </p>
                  </div>
                ))}

              </div>

            </div>

            {/* VOCABULARY */}

            <div>

              <p className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3">
                Essential Words
              </p>

              <div className="grid sm:grid-cols-2 gap-3">

                {[
                  ['こんにちは', 'Hello / Good afternoon'],
                  ['ありがとう', 'Thank you'],
                  ['わたし', 'I / me'],
                  ['がくせい', 'Student'],
                  ['せんせい', 'Teacher'],
                  ['よろしくおねがいします', 'Nice to meet you / Please treat me well'],
                ].map(([jp, meaning]) => (
                  <div
                    key={jp}
                    className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-4"
                  >

                    <div>
                      <p className="font-black text-white">
                        {jp}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {meaning}
                      </p>
                    </div>

                    <button
                      onClick={() => speakJapanese(jp)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

          <button
            onClick={startRecall}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black"
          >
            I Learned It — Test My Recall
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      )}

      {/* ===================================================
          RECALL
      =================================================== */}

      {stage === 'recall' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

          <div className="flex items-center justify-between mb-7">

            <div>
              <p className="text-xs font-bold text-purple-400 uppercase">
                Step 2
              </p>

              <h2 className="text-2xl font-black text-white">
                Active Recall
              </h2>
            </div>

            <span className="text-xs text-slate-500 font-bold">
              {recallIndex + 1} / {recallQuestions.length}
            </span>

          </div>

          <h3 className="text-xl font-black text-white mb-6">
            {recallQuestions[recallIndex].question}
          </h3>

          <div className="space-y-3">

            {recallQuestions[recallIndex].options.map((option) => {

              const selected = recallAnswer === option;
              const correct =
                recallAnswer &&
                option === recallQuestions[recallIndex].answer;

              return (
                <button
                  key={option}
                  onClick={() => answerRecall(option)}
                  className={`w-full text-left p-4 rounded-xl border font-bold transition-all ${
                    correct
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : selected
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {option}
                </button>
              );
            })}

          </div>

          {recallAnswer && (
            <div className="mt-6">

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-5">

                <p className="text-sm text-slate-400">
                  {recallQuestions[recallIndex].explanation}
                </p>

              </div>

              <button
                onClick={nextRecall}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                {recallIndex < recallQuestions.length - 1
                  ? 'Next Question'
                  : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      )}

      {/* ===================================================
          SENTENCE
      =================================================== */}

      {stage === 'sentence' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

          <div className="mb-7">

            <p className="text-xs font-bold text-cyan-400 uppercase">
              Step 3
            </p>

            <h2 className="text-2xl font-black text-white">
              Build the Sentence
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Put the words in the correct order.
            </p>

          </div>

          <div className="min-h-20 rounded-2xl bg-slate-950 border border-slate-800 p-5 mb-5 flex flex-wrap gap-2">

            {sentenceWords.length === 0 ? (
              <span className="text-sm text-slate-600">
                Select words below...
              </span>
            ) : (
              sentenceWords.map((word) => (
                <span
                  key={word}
                  className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-white font-bold"
                >
                  {word}
                </span>
              ))
            )}

          </div>

          <div className="flex flex-wrap gap-3 mb-6">

            {sentenceOptions.map((word) => {

              const selected = sentenceWords.includes(word);

              return (
                <button
                  key={word}
                  onClick={() => toggleSentenceWord(word)}
                  disabled={selected || sentenceSubmitted}
                  className={`px-5 py-3 rounded-xl border font-bold ${
                    selected
                      ? 'bg-slate-800 border-slate-700 text-slate-600'
                      : 'bg-slate-950 border-slate-800 text-white hover:border-rose-500/40'
                  }`}
                >
                  {word}
                </button>
              );
            })}

          </div>

          {!sentenceSubmitted ? (
            <div className="flex gap-3">

              <button
                onClick={resetSentence}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Reset
              </button>

              <button
                onClick={submitSentence}
                disabled={sentenceWords.length !== 4}
                className="flex-1 px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold"
              >
                Check Sentence
              </button>

            </div>
          ) : (
            <div>

              <div
                className={`p-5 rounded-2xl border mb-5 ${
                  sentenceCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >

                <div className="flex items-center gap-3">

                  {sentenceCorrect ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}

                  <div>
                    <p className="font-black text-white">
                      {sentenceCorrect
                        ? 'Correct!'
                        : 'Not quite.'}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      わたしはがくせいです。
                    </p>
                  </div>

                </div>

              </div>

              <button
                onClick={startListening}
                className="w-full px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                Continue to Listening
              </button>

            </div>
          )}

        </div>
      )}

      {/* ===================================================
          LISTENING
      =================================================== */}

      {stage === 'listening' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

          <div className="text-center mb-8">

            <Headphones className="w-10 h-10 text-cyan-400 mx-auto mb-4" />

            <p className="text-xs font-bold text-cyan-400 uppercase">
              Step 4
            </p>

            <h2 className="text-2xl font-black text-white">
              Listening Check
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Listen carefully and choose what you heard.
            </p>

          </div>

          <div className="text-center mb-8">

            <button
              onClick={() => speakJapanese('わたしはがくせいです')}
              className="mx-auto w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20"
            >
              <Volume2 className="w-8 h-8" />
            </button>

            <p className="text-xs text-slate-500 mt-3">
              Press to hear the Japanese sentence
            </p>

          </div>

          <div className="space-y-3">

            {[
              'わたしはがくせいです。',
              'わたしはせんせいです。',
              'これはほんです。',
              'こんにちは。',
            ].map((option) => {

              const selected = listeningAnswer === option;

              return (
                <button
                  key={option}
                  onClick={() => {
                    if (!listeningSubmitted) {
                      setListeningAnswer(option);
                    }
                  }}
                  className={`w-full p-4 rounded-xl border text-left font-bold ${
                    selected
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {option}
                </button>
              );
            })}

          </div>

          {!listeningSubmitted ? (
            <button
              onClick={submitListening}
              disabled={!listeningAnswer}
              className="w-full mt-6 px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold"
            >
              Check Answer
            </button>
          ) : (
            <div className="mt-6">

              <div
                className={`p-5 rounded-2xl border mb-5 ${
                  listeningCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >

                <div className="flex items-center gap-3">

                  {listeningCorrect ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}

                  <p className="font-bold text-white">
                    {listeningCorrect
                      ? 'Excellent listening!'
                      : 'Listen once more and remember the sentence.'}
                  </p>

                </div>

              </div>

              <button
                onClick={startSpeaking}
                className="w-full px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                Continue to Speaking
              </button>

            </div>
          )}

        </div>
      )}

      {/* ===================================================
          SPEAKING
      =================================================== */}

      {stage === 'speaking' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

          <div className="text-center">

            <MessageCircle className="w-10 h-10 text-emerald-400 mx-auto mb-4" />

            <p className="text-xs font-bold text-emerald-400 uppercase">
              Step 5
            </p>

            <h2 className="text-2xl font-black text-white">
              Speak Japanese
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Say the following sentence aloud.
            </p>

          </div>

          <div className="my-8 rounded-2xl bg-slate-950 border border-slate-800 p-7 text-center">

            <p className="text-4xl font-black text-white mb-3">
              わたしはがくせいです。
            </p>

            <p className="text-slate-500">
              Watashi wa gakusei desu.
            </p>

            <p className="text-sm text-slate-400 mt-3">
              I am a student.
            </p>

            <button
              onClick={() => speakJapanese('わたしはがくせいです')}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <Volume2 className="w-4 h-4" />
              Hear Example
            </button>

          </div>

          {speechSupported ? (
            <>
              <button
                onClick={startSpeechRecognition}
                disabled={isSpeaking}
                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 ${
                  isSpeaking
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                }`}
              >
                <Mic className="w-6 h-6" />

                {isSpeaking
                  ? 'Listening to you...'
                  : 'Tap and Speak'}
              </button>

              {speechResult && (
                <div className="mt-5 bg-slate-950 border border-slate-800 rounded-2xl p-5">

                  <p className="text-xs text-slate-500 font-bold uppercase mb-2">
                    What we heard
                  </p>

                  <p className="text-lg font-bold text-white">
                    {speechResult}
                  </p>

                  {speechPassed && (
                    <div className="flex items-center gap-2 mt-4 text-emerald-400 font-bold">
                      <CheckCircle className="w-5 h-5" />
                      Great pronunciation attempt!
                    </div>
                  )}

                </div>
              )}
            </>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">

              <p className="font-bold text-amber-300 mb-2">
                Speech recognition isn't available in this browser.
              </p>

              <p className="text-sm text-slate-400">
                Practice saying the sentence aloud, then continue to the
                final challenge.
              </p>

              <button
                onClick={() => setSpeechPassed(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                I Practiced Speaking
              </button>

            </div>
          )}

          {(speechPassed || !speechSupported) && (
            <button
              onClick={startChallenge}
              className="w-full mt-5 px-5 py-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black"
            >
              Start Final Challenge
              <ChevronRight className="inline w-5 h-5 ml-2" />
            </button>
          )}

        </div>
      )}

      {/* ===================================================
          FINAL CHALLENGE
      =================================================== */}

      {stage === 'challenge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>

              <div>
                <p className="text-xs font-bold text-yellow-400 uppercase">
                  Final Challenge
                </p>

                <h2 className="text-xl font-black text-white">
                  Show what you know
                </h2>
              </div>

            </div>

            <span className="text-xs text-slate-500 font-bold">
              {challengeIndex + 1} / {challengeQuestions.length}
            </span>

          </div>

          <h3 className="text-2xl font-black text-white mb-7">
            {challengeQuestions[challengeIndex].question}
          </h3>

          <div className="space-y-3">

            {challengeQuestions[challengeIndex].options.map((option) => {

              const selected = challengeAnswer === option;

              const correct =
                challengeSubmitted &&
                option === challengeQuestions[challengeIndex].answer;

              const wrong =
                challengeSubmitted &&
                selected &&
                option !== challengeQuestions[challengeIndex].answer;

              return (
                <button
                  key={option}
                  onClick={() => answerChallenge(option)}
                  disabled={challengeSubmitted}
                  className={`w-full text-left p-4 rounded-xl border font-bold ${
                    correct
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : wrong
                      ? 'bg-red-500/10 border-red-500/40 text-red-300'
                      : selected
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {option}
                </button>
              );
            })}

          </div>

          {!challengeSubmitted ? (
            <button
              onClick={submitChallenge}
              disabled={!challengeAnswer}
              className="w-full mt-6 px-5 py-4 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black"
            >
              Check Answer
            </button>
          ) : (
            <div className="mt-6">

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5">

                <p className="text-sm text-slate-400">
                  {challengeQuestions[challengeIndex].explanation}
                </p>

              </div>

              <button
                onClick={nextChallenge}
                className="w-full px-5 py-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black"
              >
                {challengeIndex < challengeQuestions.length - 1
                  ? 'Next Challenge'
                  : 'See My Mastery'}
              </button>

            </div>
          )}

        </div>
      )}

      {/* ===================================================
          MASTERY
      =================================================== */}

      {stage === 'complete' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6">

            <Trophy className="w-10 h-10 text-yellow-400" />

          </div>

          <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">
            Mastery Check
          </p>

          <h2 className="text-3xl font-black text-white mb-3">
            {masteryPassed
              ? 'You mastered this mission! 🎉'
              : 'Almost there!'}
          </h2>

          <div className="text-6xl font-black text-white mb-3">
            {masteryScore}%
          </div>

          <p className="text-sm text-slate-400 mb-8">
            You need at least <strong className="text-white">80%</strong>
            {' '}to complete this mission.
          </p>

          <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-8">

            <div
              className={`h-full rounded-full ${
                masteryPassed
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
              style={{
                width: `${masteryScore}%`,
              }}
            />

          </div>

          {masteryPassed ? (
            <button
              onClick={completeMission}
              disabled={completing}
              className="w-full px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-slate-950 font-black"
            >
              {completing ? (
                <>
                  <Loader2 className="inline w-5 h-5 animate-spin mr-2" />
                  Completing Mission...
                </>
              ) : (
                <>
                  <CheckCircle className="inline w-5 h-5 mr-2" />
                  Complete Mission +{mission.xp} XP
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                setStage('learn');
                setRecallIndex(0);
                setRecallAnswer(null);
                setRecallCorrect(0);
                setSentenceWords([]);
                setSentenceSubmitted(false);
                setSentenceCorrect(false);
                setListeningAnswer(null);
                setListeningSubmitted(false);
                setListeningCorrect(false);
                setSpeechPassed(false);
                setSpeechResult('');
                setChallengeIndex(0);
                setChallengeAnswer(null);
                setChallengeSubmitted(false);
                setChallengeScore(0);
              }}
              className="w-full px-6 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black"
            >
              <RotateCcw className="inline w-5 h-5 mr-2" />
              Review Mission and Try Again
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default Mission;