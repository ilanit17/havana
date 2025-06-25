
import React, { useState, useCallback } from 'react';
import { UI_STRINGS_HE, EXERCISE_TYPE_CONFIG } from './constants';
import { ExerciseType, WorksheetData, GeneratedExercise, ExerciseContent } from './types';
import { generateExerciseContent } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WorksheetDisplay from './components/WorksheetDisplay';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedExercises, setSelectedExercises] = useState<Record<ExerciseType, boolean>>(
    Object.values(ExerciseType).reduce((acc, type) => {
      acc[type] = EXERCISE_TYPE_CONFIG[type].defaultChecked;
      return acc;
    }, {} as Record<ExerciseType, boolean>)
  );
  const [worksheet, setWorksheet] = useState<WorksheetData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleExerciseSelectionChange = (exerciseType: ExerciseType) => {
    setSelectedExercises(prev => ({ ...prev, [exerciseType]: !prev[exerciseType] }));
  };

  const validateApiKey = (): boolean => {
    if (!process.env.API_KEY) {
      setError(UI_STRINGS_HE.ERROR_API_KEY);
      return false;
    }
    return true;
  }

  const handleGenerateWorksheet = useCallback(async () => {
    if (!validateApiKey()) return;

    const chosenTypes = Object.entries(selectedExercises)
      .filter(([, isSelected]) => isSelected)
      .map(([type]) => type as ExerciseType);

    if (chosenTypes.length === 0) {
      setError(UI_STRINGS_HE.NO_EXERCISES_SELECTED);
      return;
    }
    
    if (!inputText.trim()) {
        setError("אנא הזינו טקסט ליצירת דף העבודה.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setWorksheet(null);

    const generatedExercisesPromises = chosenTypes.map(async (type): Promise<GeneratedExercise> => {
      try {
        const content: ExerciseContent | null = await generateExerciseContent(type, inputText);
        if (content) {
          return { type, content, error: null };
        } else {
          return { type, content: null, error: `לא התקבל תוכן עבור ${EXERCISE_TYPE_CONFIG[type].label}` };
        }
      } catch (e: any) {
        let errorMessage = `${UI_STRINGS_HE.ERROR_GENERATING_EXERCISE} ${EXERCISE_TYPE_CONFIG[type].label}.`;
        if (e.message === "API_KEY_MISSING") {
            errorMessage = UI_STRINGS_HE.ERROR_API_KEY;
        } else if (e.message === "API_KEY_INVALID") {
            errorMessage = "שגיאה: מפתח ה-API של Gemini אינו תקין או שאין לו הרשאות.";
        } else if (e.message) {
            errorMessage += ` ${e.message}`;
        }
        console.error(`Error processing exercise ${type}:`, e);
        return { type, content: null, error: errorMessage };
      }
    });

    const results = await Promise.all(generatedExercisesPromises);
    
    // Check if any critical API key error occurred
    const apiKeyError = results.find(r => r.error === UI_STRINGS_HE.ERROR_API_KEY || (r.error && r.error.includes("מפתח ה-API של Gemini אינו תקין")));
    if (apiKeyError && apiKeyError.error) {
        setError(apiKeyError.error);
        setIsLoading(false);
        return;
    }


    setWorksheet({
      originalText: inputText,
      title: UI_STRINGS_HE.WORKSHEET_TITLE,
      exercises: results,
    });

    setIsLoading(false);
  }, [inputText, selectedExercises]);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">{UI_STRINGS_HE.APP_TITLE}</h1>
          <p className="text-lg text-gray-600">{UI_STRINGS_HE.APP_SUBTITLE}</p>
        </header>

        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl no-print">
          <div className="mb-8">
            <label htmlFor="text-input" className="block text-xl font-semibold text-gray-700 mb-2">
              {UI_STRINGS_HE.INPUT_TEXT_LABEL}
            </label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={UI_STRINGS_HE.INPUT_TEXT_PLACEHOLDER}
              rows={10}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-base"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">{UI_STRINGS_HE.SELECT_EXERCISES_LABEL}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(EXERCISE_TYPE_CONFIG).map(({ id, label }) => (
                <div key={id} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id={id}
                    value={id}
                    checked={selectedExercises[id]}
                    onChange={() => handleExerciseSelectionChange(id)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={id} className="mr-3 text-base text-gray-700 cursor-pointer flex-grow">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {error && <ErrorMessage message={error} />}

          <div className="text-center">
            <button
              onClick={handleGenerateWorksheet}
              disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? UI_STRINGS_HE.LOADING_MESSAGE : UI_STRINGS_HE.GENERATE_WORKSHEET_BUTTON}
            </button>
          </div>

          {isLoading && <LoadingSpinner />}
        </main>

        {worksheet && <WorksheetDisplay worksheet={worksheet} />}
      </div>
       <footer className="text-center mt-12 py-6 border-t border-gray-300 no-print">
          <p className="text-sm text-gray-500">
            מופעל על ידי Gemini API. נוצר למטרות הדגמה.
          </p>
        </footer>
    </div>
  );
};

export default App;
