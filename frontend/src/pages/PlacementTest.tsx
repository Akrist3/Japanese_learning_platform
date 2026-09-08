import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface PlacementQuestion {
  id: string;
  level: string;
  skill: string;
  question: string;
  options: string[];
}


interface AnswerResult {
  correct: boolean;
  correct_answer: string;
  explanation: string;
}


interface PlacementResult {
  completed: boolean;
  questions_answered: number;
  correct: number;
  mistakes: number;
  percentage: number;
  accuracy: number;
  starting_level: string;
  target_level?: string;
  weak_skills: string[];
}


const API_BASE = "http://localhost:8000/api/v1";


const PlacementTest: React.FC = () => {

  const navigate = useNavigate();


  // =======================================================
  // Questions
  // =======================================================

  const [questions, setQuestions] = useState<
    PlacementQuestion[]
  >([]);


  const [currentIndex, setCurrentIndex] = useState(0);


  // =======================================================
  // Current answer
  // =======================================================

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);


  // =======================================================
  // Answers already checked
  // =======================================================

  const [answers, setAnswers] = useState<
    Record<string, number>
  >({});


  // =======================================================
  // Statistics
  // =======================================================

  const [correctCount, setCorrectCount] =
    useState(0);


  const [mistakeCount, setMistakeCount] =
    useState(0);


  const [consecutiveMistakes, setConsecutiveMistakes] =
    useState(0);


  // =======================================================
  // Answer feedback
  // =======================================================

  const [answerResult, setAnswerResult] =
    useState<AnswerResult | null>(null);


  const [checkingAnswer, setCheckingAnswer] =
    useState(false);


  // =======================================================
  // Loading / errors
  // =======================================================

  const [loading, setLoading] =
    useState(true);


  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState("");


  // =======================================================
  // Final result
  // =======================================================

  const [finished, setFinished] =
    useState(false);


  const [result, setResult] =
    useState<PlacementResult | null>(null);


  // =======================================================
  // Authentication token
  // =======================================================

  const getToken = () => {

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("jwt")
    );
  };


  // =======================================================
  // Load placement test
  // =======================================================

  useEffect(() => {

    const loadTest = async () => {

      try {

        setLoading(true);
        setError("");

        const token = getToken();


        const response = await fetch(
          `${API_BASE}/placement/start`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );


        if (!response.ok) {

          throw new Error(
            `Failed to load placement test (${response.status})`
          );
        }


        const data = await response.json();


        const loadedQuestions =
          data.questions || [];


        if (loadedQuestions.length === 0) {

          throw new Error(
            "No placement questions were returned."
          );
        }


        setQuestions(loadedQuestions);

      } catch (err) {

        console.error(
          "Placement test loading error:",
          err
        );


        setError(
          err instanceof Error
            ? err.message
            : "Unable to load placement test."
        );

      } finally {

        setLoading(false);
      }
    };


    loadTest();

  }, []);


  // =======================================================
  // Current question
  // =======================================================

  const currentQuestion =
    questions[currentIndex];


  // =======================================================
  // Select an answer
  // =======================================================

  const handleAnswer = (
    optionIndex: number
  ) => {

    // Don't allow changing the answer
    // after it has already been checked.

    if (answerResult !== null) {
      return;
    }


    setSelectedAnswer(optionIndex);

    setError("");
  };


  // =======================================================
  // Check current answer
  // =======================================================

  const handleCheckAnswer = async () => {

    if (
      !currentQuestion ||
      selectedAnswer === null
    ) {
      return;
    }


    try {

      setCheckingAnswer(true);
      setError("");


      const token = getToken();


      const response = await fetch(
        `${API_BASE}/placement/answer`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            question_id: currentQuestion.id,

            answer: selectedAnswer,
          }),
        }
      );


      if (!response.ok) {

        const errorData =
          await response.json().catch(() => null);


        throw new Error(
          errorData?.detail ||
          `Failed to check answer (${response.status})`
        );
      }


      const data = await response.json();


      const result: AnswerResult = {
        correct: Boolean(data.correct),

        correct_answer:
          data.correct_answer || "",

        explanation:
          data.explanation || "",
      };


      setAnswerResult(result);


      // ===================================================
      // Update counters
      // ===================================================

      if (result.correct) {

        setCorrectCount(
          previous => previous + 1
        );


        // Correct answer resets
        // consecutive mistake count.

        setConsecutiveMistakes(0);

      } else {

        setMistakeCount(
          previous => previous + 1
        );


        setConsecutiveMistakes(
          previous => previous + 1
        );
      }


      // Save answer locally.

      setAnswers(previous => ({
        ...previous,

        [currentQuestion.id]:
          selectedAnswer,
      }));

    } catch (err) {

      console.error(
        "Answer checking error:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to check answer."
      );

    } finally {

      setCheckingAnswer(false);
    }
  };


  // =======================================================
  // Submit final test
  // =======================================================

  const submitTest = async (
    finalAnswers: Record<string, number>
  ) => {

    try {

      setSubmitting(true);
      setError("");


      const token = getToken();


      const response = await fetch(
        `${API_BASE}/placement/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            answers: finalAnswers,
          }),
        }
      );


      if (!response.ok) {

        const errorData =
          await response.json().catch(() => null);


        throw new Error(
          errorData?.detail ||
          `Failed to submit placement test (${response.status})`
        );
      }


      const data = await response.json();


      const placementResult: PlacementResult = {

        completed:
          data.completed ?? true,

        questions_answered:
          data.questions_answered ??
          Object.keys(finalAnswers).length,

        correct:
          data.correct ?? 0,

        mistakes:
          data.mistakes ?? 0,

        percentage:
          data.percentage ??
          data.accuracy ??
          0,

        accuracy:
          data.accuracy ??
          data.percentage ??
          0,

        starting_level:
          data.starting_level ??
          "N5",

        target_level:
          data.target_level,

        weak_skills:
          data.weak_skills ??
          [],
      };


      console.log(
        "Placement result:",
        data
      );


      setResult(placementResult);

      setFinished(true);

    } catch (err) {

      console.error(
        "Placement submission error:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit placement test."
      );

    } finally {

      setSubmitting(false);
    }
  };


  // =======================================================
  // Move to next question
  // =======================================================

  const handleNext = async () => {

    if (
      !currentQuestion ||
      answerResult === null
    ) {
      return;
    }


    const answeredQuestions =
      Object.keys(answers).length;


    const newMistakeCount =
      mistakeCount;


    const newConsecutiveMistakes =
      consecutiveMistakes;


    // =====================================================
    // Stop rules
    // =====================================================

    const minimumReached =
      answeredQuestions >= 8;


    const reachedFiveMistakes =
      newMistakeCount >= 5;


    const reachedThreeConsecutive =
      newConsecutiveMistakes >= 3;


    const maximumReached =
      answeredQuestions >= 15;


    const noMoreQuestions =
      currentIndex >= questions.length - 1;


    if (
      minimumReached &&
      (
        reachedFiveMistakes ||
        reachedThreeConsecutive ||
        maximumReached ||
        noMoreQuestions
      )
    ) {

      await submitTest(answers);

      return;
    }


    // =====================================================
    // Continue
    // =====================================================

    setCurrentIndex(
      previous => previous + 1
    );


    setSelectedAnswer(null);

    setAnswerResult(null);

    setError("");
  };


  // =======================================================
  // Restart test
  // =======================================================

  const restartTest = () => {

    window.location.reload();
  };


  // =======================================================
  // Loading screen
  // =======================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

        <div className="text-center">

          <div className="text-6xl mb-6 animate-pulse">
            🇯🇵
          </div>


          <h1 className="text-2xl font-bold text-white mb-2">
            Preparing Your Placement Test
          </h1>


          <p className="text-slate-400">
            We're finding the right questions for you...
          </p>

        </div>

      </div>
    );
  }


  // =======================================================
  // Loading error
  // =======================================================

  if (
    error &&
    questions.length === 0
  ) {

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

        <div className="w-full max-w-lg bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center">

          <div className="text-5xl mb-5">
            ⚠️
          </div>


          <h1 className="text-2xl font-bold text-white mb-3">
            Something went wrong
          </h1>


          <p className="text-slate-400 mb-6">
            {error}
          </p>


          <button
            onClick={restartTest}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =======================================================
  // Result screen
  // =======================================================

  if (
    finished &&
    result
  ) {

    return (
      <div className="min-h-screen bg-slate-950 px-6 py-12">

        <div className="max-w-3xl mx-auto">

          {/* Header */}

          <div className="text-center mb-10">

            <div className="text-6xl mb-5">
              🎉
            </div>


            <h1 className="text-4xl font-bold text-white mb-3">
              Placement Complete!
            </h1>


            <p className="text-slate-400 text-lg">
              We've analyzed your Japanese level.
            </p>

          </div>


          {/* Starting level */}

          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 mb-6 text-center">

            <p className="text-indigo-300 uppercase tracking-wider text-sm font-semibold mb-3">
              Your Starting Level
            </p>


            <div className="text-6xl font-black text-white mb-3">
              {result.starting_level}
            </div>


            <p className="text-slate-300">
              Your roadmap will adapt as you continue learning.
            </p>

          </div>


          {/* Statistics */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

              <div className="text-3xl font-bold text-white">
                {result.questions_answered}
              </div>


              <div className="text-slate-400 mt-1">
                Questions
              </div>

            </div>


            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

              <div className="text-3xl font-bold text-emerald-400">
                {result.correct}
              </div>


              <div className="text-slate-400 mt-1">
                Correct
              </div>

            </div>


            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

              <div className="text-3xl font-bold text-indigo-400">
                {Math.round(result.accuracy)}%
              </div>


              <div className="text-slate-400 mt-1">
                Accuracy
              </div>

            </div>

          </div>


          {/* Mistakes */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                Mistakes
              </span>


              <span className="text-red-400 font-bold">
                {result.mistakes}
              </span>

            </div>

          </div>


          {/* Weak skills */}

          {result.weak_skills.length > 0 && (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

              <h2 className="text-xl font-bold text-white mb-4">
                🎯 Areas We'll Focus On
              </h2>


              <div className="flex flex-wrap gap-3">

                {result.weak_skills.map(
                  skill => (

                    <span
                      key={skill}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-300"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          )}


          {/* Roadmap */}

          <button
            onClick={() => navigate("/roadmap")}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition shadow-lg shadow-indigo-600/20"
          >
            🚀 Build My Personalized Roadmap
          </button>


          {/* Retake */}

          <button
            onClick={restartTest}
            className="w-full mt-3 py-3 rounded-xl text-slate-400 hover:text-white transition"
          >
            Retake Test
          </button>

        </div>

      </div>
    );
  }


  // =======================================================
  // No question
  // =======================================================

  if (!currentQuestion) {
    return null;
  }


  // =======================================================
  // Progress
  // =======================================================

  const progress =
    (
      (currentIndex + 1) /
      questions.length
    ) * 100;


  // =======================================================
  // Test UI
  // =======================================================

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">

      <div className="max-w-3xl mx-auto">

        {/* =================================================
            Header
        ================================================= */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider">
              Japanese Placement Test
            </p>


            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Discover Your Japanese Level 🇯🇵
            </h1>

          </div>


          <div className="text-right">

            <div className="text-white font-bold">
              {currentIndex + 1} / {questions.length}
            </div>


            <div className="text-slate-500 text-sm">
              Question
            </div>

          </div>

        </div>


        {/* =================================================
            Progress
        ================================================= */}

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8">

          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>


        {/* =================================================
            Stats
        ================================================= */}

        <div className="grid grid-cols-3 gap-3 mb-6">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">

            <div className="text-lg font-bold text-white">
              {correctCount}
            </div>

            <div className="text-xs text-slate-500">
              Correct
            </div>

          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">

            <div className="text-lg font-bold text-red-400">
              {mistakeCount}
            </div>

            <div className="text-xs text-slate-500">
              Mistakes
            </div>

          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">

            <div className="text-lg font-bold text-orange-400">
              {consecutiveMistakes}
            </div>

            <div className="text-xs text-slate-500">
              Consecutive
            </div>

          </div>

        </div>


        {/* =================================================
            Instructions
        ================================================= */}

        {currentIndex === 0 && (

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-6">

            <p className="text-indigo-200 text-sm">

              💡 Select an answer. You can change your
              selection until you press
              <strong> Check Answer</strong>.

            </p>

          </div>

        )}


        {/* =================================================
            Question Card
        ================================================= */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-10">

          {/* Level + skill */}

          <div className="flex items-center gap-3 mb-7">

            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm">
              {currentQuestion.level}
            </span>


            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-sm">
              {currentQuestion.skill}
            </span>

          </div>


          {/* Question */}

          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mb-8">
            {currentQuestion.question}
          </h2>


          {/* =================================================
              Options
          ================================================= */}

          <div className="space-y-3">

            {currentQuestion.options.map(
              (option, index) => {

                const isSelected =
                  selectedAnswer === index;


                const isCorrectAnswer =
                  answerResult &&
                  answerResult.correct_answer === option;


                return (

                  <button
                    key={`${currentQuestion.id}-${index}`}

                    onClick={() =>
                      handleAnswer(index)
                    }

                    disabled={
                      answerResult !== null
                    }

                    className={`
                      w-full text-left p-4 sm:p-5 rounded-2xl
                      border transition-all duration-200

                      ${
                        isCorrectAnswer
                          ? "border-emerald-500 bg-emerald-500/10 text-white"
                          : ""
                      }

                      ${
                        isSelected &&
                        !answerResult
                          ? "border-indigo-500 bg-indigo-500/10 text-white"
                          : ""
                      }

                      ${
                        !isSelected &&
                        !isCorrectAnswer
                          ? "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50"
                          : ""
                      }
                    `}
                  >

                    <div className="flex items-center gap-4">

                      <span
                        className={`
                          w-9 h-9 flex items-center justify-center
                          rounded-xl font-bold

                          ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-800 text-slate-400"
                          }
                        `}
                      >
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>


                      <span className="text-lg">
                        {option}
                      </span>

                    </div>

                  </button>

                );
              }
            )}

          </div>


          {/* =================================================
              Feedback
          ================================================= */}

          {answerResult && (

            <div
              className={`
                mt-6 p-5 rounded-2xl border

                ${
                  answerResult.correct
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }
              `}
            >

              <div className="flex items-center gap-3 mb-2">

                <span className="text-2xl">
                  {answerResult.correct
                    ? "✅"
                    : "❌"}
                </span>


                <h3
                  className={`
                    font-bold text-lg

                    ${
                      answerResult.correct
                        ? "text-emerald-300"
                        : "text-red-300"
                    }
                  `}
                >
                  {answerResult.correct
                    ? "Correct!"
                    : "Incorrect"}
                </h3>

              </div>


              {!answerResult.correct && (

                <p className="text-slate-300 mb-2">

                  Correct answer:{" "}

                  <strong className="text-white">
                    {answerResult.correct_answer}
                  </strong>

                </p>

              )}


              {answerResult.explanation && (

                <p className="text-slate-400 text-sm">
                  {answerResult.explanation}
                </p>

              )}

            </div>

          )}


          {/* =================================================
              Error
          ================================================= */}

          {error && (

            <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>

          )}


          {/* =================================================
              Buttons
          ================================================= */}

          {!answerResult ? (

            <button
              onClick={handleCheckAnswer}

              disabled={
                selectedAnswer === null ||
                checkingAnswer
              }

              className={`
                w-full mt-8 py-4 rounded-2xl
                font-bold text-lg transition

                ${
                  selectedAnswer === null ||
                  checkingAnswer
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }
              `}
            >

              {checkingAnswer
                ? "Checking Answer..."
                : "Check Answer ✓"}

            </button>

          ) : (

            <button
              onClick={handleNext}

              disabled={submitting}

              className="w-full mt-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition"
            >

              {submitting
                ? "Analyzing Your Level..."
                : "Next Question →"}

            </button>

          )}

        </div>


        {/* =================================================
            Footer
        ================================================= */}

        <div className="flex justify-between items-center mt-5 text-sm text-slate-500">

          <span>
            {answerResult
              ? "Answer checked."
              : "You can change your answer before checking."}
          </span>


          <span>
            {Object.keys(answers).length} answered
          </span>

        </div>

      </div>

    </div>
  );
};


export default PlacementTest;