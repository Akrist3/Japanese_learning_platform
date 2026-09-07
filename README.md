# Japanese Journey — Production-Ready Japanese Learning & JLPT Platform 🇯🇵

A full-stack, gamified web application taking learners from **absolute zero to JLPT N1**. Built with React, TypeScript, Tailwind CSS, Python FastAPI, SQLAlchemy, SQLite, and SM-2 Spaced Repetition.

---

## 🌟 Key Features

* **Full Curriculum (Zero to N1)**:
  * **Hiragana & Katakana Courses**: Interactive charts (46 base + dakuten + handakuten + combinations), stroke order, writing canvas, memory matching game, and timed quizzes.
  * **Vocabulary (N5–N1)**: Structured word database with readings, meanings, parts of speech, example sentences, translations, and audio.
  * **Kanji Studio (N5–N1)**: Radicals, onyomi, kunyomi, mnemonics, example words, interactive stroke canvas, and speed challenge game.
  * **Grammar Engine**: Formation breakdowns, English explanations, related grammar comparisons, and common mistake alerts.
  * **Verb Conjugator Trainer**: Interactive practice for Godan, Ichidan, and Irregular verbs across 15+ forms (masu, nai, te, ta, potential, passive, causative, volitional, conditional, imperative).
  * **Listening Studio**: Native TTS speech synthesis, slow (0.6x) and normal (1.0x) speed toggles, dictation, transcript & translation toggles, listening quizzes.
  * **Reading Studio**: Graded N5–N1 reading passages with furigana toggle, line-by-line translation, vocabulary popovers, and comprehension questions.
  * **Speaking Practice**: Browser Web Speech API (`ja-JP`) microphone recording with real-time speech-to-text accuracy scoring.
* **SuperMemo SM-2 Spaced Repetition (SRS)**:
  * Anki-style flashcard interface (Again, Hard, Good, Easy) calculating optimal review dates and ease factors.
* **Gamification & Mastery System**:
  * Leveling system, XP rewards, daily streaks, unlocked achievements, global leaderboards, daily goals & quests.
* **JLPT Preparation & Mock Exam Mode**:
  * Real structure N5–N1 timed mock exams, countdown timer, question navigation bar, auto-saving, diagnostic score reports, and weak topic auto-detection.
* **Adaptive Learning & "Your Mistakes" Log**:
  * Automatically records wrong answers into a review log with targeted lesson recommendations.
* **AI Tutor & Scenario Roleplay**:
  * Interactive AI grammar tutor ("Why は vs が?"), sentence checker, and restaurant/travel scenario roleplay.
* **Admin Dashboard & Content Management**:
  * Role-based authorization for managing vocabulary, kanji, grammar, resources, and viewing user statistics.

---

## 🛠️ Stack & Architecture

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti, HTML5 Canvas.
* **Backend**: Python 3.14, FastAPI, SQLAlchemy ORM, SQLite (`japanese_learning.db`), PyJWT, Bcrypt.
* **Audio Engine**: Web Speech Synthesis API (`ja-JP` voice) with fallback audio engine.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API

```bash
cd backend
python -m app.seed.seed_all
python ../run.py
```
The FastAPI backend will start at `http://localhost:8000`. Interactive API Docs are available at `http://localhost:8000/docs`.

### 2. Start the Frontend Application

```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🔑 Default Seed Credentials

* **Learner User**:
  * Email: `learner@japanese.com`
  * Password: `learner123`
* **Admin User**:
  * Email: `admin@japanese.com`
  * Password: `admin123`

---

## 🧪 Testing

To run the backend test suite:

```bash
cd backend
python run_tests.py
```

To run the frontend TypeScript build check:

```bash
cd frontend
npm run build
```
