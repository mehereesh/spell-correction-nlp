import React, { useState } from 'react';
import { SpellChecker } from './components/SpellChecker';
import { LanguageSelector } from './components/LanguageSelector';
import { supportedLanguages } from './utils/languages';
import { Language } from './types';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(supportedLanguages[0]);
  const [text, setText] = useState('');

  const handleCorrection = (correctedText: string) => {
    setText(correctedText);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Multi-Language Spell Checker
            </h1>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Language
              </label>
              <LanguageSelector
                languages={supportedLanguages}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>

            <SpellChecker
              text={text}
              language={selectedLanguage.dictionary}
              onCorrection={handleCorrection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;