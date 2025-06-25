
export enum ExerciseType {
  CHRONOLOGICAL = 'chronological',
  JUMBLED_SENTENCE = 'jumbled_sentence',
  CLOZE_TEST = 'cloze_test',
  WORD_FAMILY = 'word_family',
}

export interface ChronologicalExerciseContent {
  title: string;
  instruction: string;
  sentences: string[];
}

export interface JumbledSentenceExerciseContent {
  title: string;
  instruction: string;
  jumbled_sentences: string[];
}

export interface ClozeTestExerciseContent {
  title: string;
  instruction: string;
  text_with_blanks: string;
}

export interface WordFamilyExerciseContent {
  title: string;
  instruction: string;
  word_bank: string[];
  questions: string[];
}

export type ExerciseContent =
  | ChronologicalExerciseContent
  | JumbledSentenceExerciseContent
  | ClozeTestExerciseContent
  | WordFamilyExerciseContent;

export interface GeneratedExercise {
  type: ExerciseType;
  content: ExerciseContent | null;
  error?: string | null;
}

export interface WorksheetData {
  originalText: string;
  title: string;
  exercises: GeneratedExercise[];
}

// For API responses, specifically for Gemini JSON parsing
export interface GeminiChronologicalResponse {
  title: string;
  instruction: string;
  sentences: string[];
}

export interface GeminiJumbledSentenceResponse {
  title: string;
  instruction: string;
  jumbled_sentences: string[];
}

export interface GeminiClozeTestResponse {
  title: string;
  instruction: string;
  text_with_blanks: string;
}

export interface GeminiWordFamilyResponse {
  title: string;
  instruction: string;
  word_bank: string[];
  questions: string[];
}
