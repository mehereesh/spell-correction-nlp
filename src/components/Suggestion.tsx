import React from 'react';
import { SuggestionProps } from '../types';

export function Suggestion({ correction, onSelect }: SuggestionProps) {
  return (
    <li className="text-sm">
      <span className="text-red-500 font-medium">{correction.word}</span>
      <ul className="ml-4 mt-1 space-x-2 flex flex-wrap">
        {correction.suggestions.map((suggestion, index) => (
          <li key={index}>
            <button
              onClick={() => onSelect(suggestion)}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
}