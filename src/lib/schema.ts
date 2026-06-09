// Content schema — the shapes of every data file under public/content/.
// Content is git-versioned & cacheable; USER STATE (progress/SRS) lives in IndexedDB, never here.

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Top-level domains used for filtering, mastery bars, and the dashboard. */
export type Domain =
  | 'technicals'
  | 'pe-fundamentals'
  | 'fund-economics'
  | 'performance'
  | 'primaries'
  | 'portfolio-pacing'
  | 'co-investments'
  | 'excel'
  | 'market'
  | 'firm';

export interface LessonRef {
  id: string;
  title: string;
  domain: Domain;
  path: string; // markdown file under content/, e.g. "lessons/pe-fundamentals/j-curve.md"
  order?: number;
  estMinutes?: number;
}

export interface FlashcardDeckRef {
  id: string;
  title: string;
  domain: Domain;
  path: string; // json file
  count?: number;
}

export interface QuestionSetRef {
  id: string;
  title: string;
  domain: Domain;
  path: string;
}

export interface QuizRef {
  id: string;
  title: string;
  domain: Domain;
  path: string;
}

export interface ExcelItemRef {
  id: string;
  title: string;
  walkthrough: string; // markdown path
  file?: string; // .xlsx path under content/excel/files/
  sizeKb?: number;
  macRecommended?: boolean;
}

/** Market Briefings: narrative "context to absorb" rather than testable SRS material. */
export interface BriefingRef {
  id: string;
  title: string;
  domain: Domain;
  path: string;
  updated?: string;
}

/** The master manifest at content/index.json — the extensibility backbone. */
export interface ContentIndex {
  version: number;
  lessons: LessonRef[];
  flashcardDecks: FlashcardDeckRef[];
  questionSets: QuestionSetRef[];
  quizzes: QuizRef[];
  glossary?: { paths: string[] };
  excel: ExcelItemRef[];
  briefings?: BriefingRef[];
}

// ---- Individual content file shapes ----

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags?: string[];
  difficulty?: Difficulty;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  cards: Flashcard[];
}

export interface QuestionItem {
  id: string;
  prompt: string;
  modelAnswer: string;
  difficulty?: Difficulty;
  tags?: string[];
}

export interface QuestionSet {
  id: string;
  title: string;
  questions: QuestionItem[];
}

export type QuizQuestion =
  | {
      id: string;
      type: 'mcq';
      prompt: string;
      choices: string[];
      answerIndex: number;
      explanation?: string;
    }
  | {
      id: string;
      type: 'numeric';
      prompt: string;
      answer: number;
      tolerance?: number; // absolute tolerance for self-grading
      unit?: string;
      explanation?: string;
    }
  | {
      id: string;
      type: 'free';
      prompt: string;
      modelAnswer: string;
    };

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  tags?: string[];
}

export interface Glossary {
  terms: GlossaryTerm[];
}

export interface BriefStat {
  value: string;
  label: string;
  note?: string;
}

export interface BriefSection {
  heading: string;
  body: string; // markdown
}

export interface BriefTalkingPoint {
  text: string;
  tag?: string;
}

export interface Briefing {
  id: string;
  title: string;
  updated: string;
  intro?: string; // markdown
  stats: BriefStat[];
  sections: BriefSection[];
  talkingPoints: BriefTalkingPoint[];
}
