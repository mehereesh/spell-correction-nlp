import Typo from 'typo-js';
import { SpellCheckResult, DictionaryFiles } from '../types';
import { loadDictionary } from './dictionaryLoader';

const dictionaryCache: { [key: string]: Typo } = {};
const dictionaryLoadPromises: { [key: string]: Promise<void> } = {};

export async function initializeDictionary(language: string): Promise<void> {
  if (dictionaryCache[language]) {
    return;
  }

  try {
    if (!dictionaryLoadPromises[language]) {
      dictionaryLoadPromises[language] = (async () => {
        const files = await loadDictionary(language);
        dictionaryCache[language] = new Typo(language, files.aff, files.dic, { platform: 'web' });
      })();
    }

    await dictionaryLoadPromises[language];
  } catch (error) {
    console.error(`Failed to initialize dictionary for ${language}:`, error);
    throw new Error(`Failed to initialize dictionary for ${language}`);
  }
}

export function checkSpelling(text: string, language: string): SpellCheckResult[] {
  const checker = dictionaryCache[language];
  if (!checker) {
    return [];
  }

  try {
    const words = text.split(/\s+/);
    let currentPosition = 0;
    const results: SpellCheckResult[] = [];

    words.forEach(word => {
      if (word && !/^\s*$/.test(word)) {
        const isCorrect = checker.check(word);
        if (!isCorrect) {
          const suggestions = checker.suggest(word) || [];
          results.push({
            word,
            suggestions: suggestions.slice(0, 5),
            start: currentPosition,
            length: word.length
          });
        }
      }
      currentPosition += word.length + 1; // +1 for the space
    });

    return results;
  } catch (error) {
    console.error('Spell check error:', error);
    return [];
  }
}