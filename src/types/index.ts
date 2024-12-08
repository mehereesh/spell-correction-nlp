export interface SpellCheckResult {
  word: string;
  suggestions: string[];
  start: number;
  length: number;
}

export interface Language {
  code: string;
  name: string;
  dictionary: string;
}

export interface SpellCheckerProps {
  text: string;
  language: string;
  onCorrection: (correctedText: string) => void;
}

export interface DictionaryFiles {
  aff: string;
  dic: string;
}

export interface SuggestionProps {
  correction: SpellCheckResult;
  onSelect: (suggestion: string) => void;
}