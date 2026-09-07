export interface User {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin';
  avatar_url: string;
  current_jlpt: string;
  target_jlpt: string;
  target_exam_date?: string;
  daily_goal_minutes: number;
  preferred_style: string;
  created_at: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  streak_count: number;
  last_active_date?: string;
  romaji_mode: 'full' | 'intermediate' | 'off';
}

export interface Kana {
  id: number;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category: 'base' | 'dakuten' | 'handakuten' | 'combination';
  stroke_count: number;
  mnemonic?: string;
  audio_url?: string;
}

export interface Vocabulary {
  id: number;
  word: string;
  kanji?: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  part_of_speech: string;
  jlpt_level: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  frequency: number;
  category: string;
}

export interface KanjiItem {
  id: number;
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  jlpt_level: string;
  grade: number;
  stroke_count: number;
  mnemonic?: string;
  example_words_json?: string;
}

export interface GrammarItem {
  id: number;
  point: string;
  meaning: string;
  formation: string;
  explanation: string;
  jlpt_level: string;
  example_sentences_json?: string;
  similar_grammar?: string;
  common_mistakes?: string;
}

export interface VerbItem {
  id: number;
  dictionary_form: string;
  kanji?: string;
  meaning: string;
  verb_group: 'godan' | 'ichidan' | 'irregular';
  jlpt_level: string;
}

export interface FlashcardItem {
  flashcard_id: number;
  item_type: 'vocab' | 'kanji' | 'grammar';
  item_id: number;
  repetition: number;
  interval: number;
  ease_factor: number;
  details: {
    word?: string;
    kanji?: string;
    hiragana?: string;
    romaji?: string;
    meaning?: string;
    example?: string;
    translation?: string;
    onyomi?: string;
    kunyomi?: string;
    mnemonic?: string;
  };
}

export interface AchievementItem {
  id: number;
  code: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  unlocked: boolean;
}

export interface MockExamItem {
  id: number;
  title: string;
  jlpt_level: string;
  duration_minutes: number;
  total_questions: number;
}

export interface ExamQuestion {
  id: number;
  section: string;
  question: string;
  options: string[];
}

export interface ResourceItem {
  id: number;
  name: string;
  url: string;
  description: string;
  resource_type: string;
  language: string;
  jlpt_level: string;
  license: string;
  source: string;
}

export interface UserMistake {
  id: number;
  topic: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  explanation?: string;
  reviewed: boolean;
  created_at: string;
}
