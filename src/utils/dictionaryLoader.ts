import { DictionaryFiles } from '../types';

declare global {
  interface Window {
    typoJsDictionaryFiles: {
      [key: string]: DictionaryFiles;
    };
  }
}

export async function loadDictionary(language: string): Promise<DictionaryFiles> {
  try {
    const files = window.typoJsDictionaryFiles[language];
    if (!files) {
      throw new Error(`Dictionary not found for language: ${language}`);
    }

    const [affResponse, dicResponse] = await Promise.all([
      fetch(files.aff),
      fetch(files.dic)
    ]);

    if (!affResponse.ok || !dicResponse.ok) {
      throw new Error('Failed to fetch dictionary files');
    }

    const [affData, dicData] = await Promise.all([
      affResponse.text(),
      dicResponse.text()
    ]);

    return {
      aff: affData,
      dic: dicData
    };
  } catch (error) {
    console.error('Dictionary loading error:', error);
    throw new Error(`Failed to load dictionary for ${language}`);
  }
}