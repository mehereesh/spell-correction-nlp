import React, { useState, useEffect } from 'react';
import { SpellCheckResult } from '../types';
import { checkSpelling, initializeDictionary } from '../utils/spellCheck';
import { Suggestion } from './Suggestion';

interface SpellCheckerProps {
  text: string;
  language: string;
  onCorrection: (correctedText: string) => void;
}

export function SpellChecker({ text, language, onCorrection }: SpellCheckerProps) {
  const [corrections, setCorrections] = useState<SpellCheckResult[]>([]);
  const [currentText, setCurrentText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAndCheck = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await initializeDictionary(language);
        if (mounted) {
          const results = checkSpelling(currentText, language);
          setCorrections(results);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load dictionary. Please try again.');
          console.error('Spell checker error:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAndCheck();

    return () => {
      mounted = false;
    };
  }, [currentText, language]);

  const handleSuggestionClick = (correction: SpellCheckResult, suggestion: string) => {
    const before = currentText.slice(0, correction.start);
    const after = currentText.slice(correction.start + correction.length);
    const newText = before + suggestion + after;
    setCurrentText(newText);
    onCorrection(newText);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="w-full h-40 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Type or paste your text here..."
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="text-gray-500">Loading dictionary...</div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!isLoading && !error && corrections.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Suggestions</h3>
          <ul className="space-y-2">
            {corrections.map((correction, index) => (
              <Suggestion
                key={index}
                correction={correction}
                onSelect={(suggestion) => handleSuggestionClick(correction, suggestion)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}