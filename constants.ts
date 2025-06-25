
import { ExerciseType } from './types';

export const UI_STRINGS_HE = {
  APP_TITLE: "מחולל דפי עבודה חכם",
  APP_SUBTITLE: "הדביקו את הטקסט הרצוי, בחרו את התרגילים וצרו דף עבודה בעזרת Gemini.",
  INPUT_TEXT_LABEL: "הדביקו כאן את הטקסט:",
  INPUT_TEXT_PLACEHOLDER: "צמח הכדנית הוא צמח טורף...",
  SELECT_EXERCISES_LABEL: "בחרו את התרגילים שיופיעו בדף העבודה:",
  GENERATE_WORKSHEET_BUTTON: "צרו דף עבודה!",
  PRINT_WORKSHEET_BUTTON: "הדפסה",
  WORKSHEET_TITLE: "דף עבודה",
  ORIGINAL_TEXT_TITLE: "הטקסט המקורי",
  LOADING_MESSAGE: "יוצר דף עבודה, נא להמתין...",
  ERROR_GENERATING_EXERCISE: "שגיאה ביצירת תרגיל:",
  ERROR_API_KEY: "שגיאה: API Key של Gemini אינו מוגדר. יש להגדיר את משתנה הסביבה process.env.API_KEY.",
  NO_EXERCISES_SELECTED: "אנא בחרו לפחות תרגיל אחד.",
  GENERAL_ERROR_MESSAGE: "אירעה שגיאה. נסו שוב מאוחר יותר.",
};

export const EXERCISE_TYPE_CONFIG: Record<ExerciseType, { id: ExerciseType; label: string; defaultChecked: boolean }> = {
  [ExerciseType.CHRONOLOGICAL]: {
    id: ExerciseType.CHRONOLOGICAL,
    label: "תרגיל סדר כרונולוגי",
    defaultChecked: true,
  },
  [ExerciseType.JUMBLED_SENTENCE]: {
    id: ExerciseType.JUMBLED_SENTENCE,
    label: "תרגיל סידור מילים במשפט",
    defaultChecked: true,
  },
  [ExerciseType.CLOZE_TEST]: {
    id: ExerciseType.CLOZE_TEST,
    label: "תרגיל השלמת מילים (Cloze)",
    defaultChecked: true,
  },
  [ExerciseType.WORD_FAMILY]: {
    id: ExerciseType.WORD_FAMILY,
    label: "תרגיל משפחות מילים",
    defaultChecked: false,
  },
};
