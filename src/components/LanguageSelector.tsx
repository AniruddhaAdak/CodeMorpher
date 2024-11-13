import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  languages: Record<string, Language>;
}

function LanguageSelector({ value, onChange, languages }: LanguageSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          bg-gray-800 text-white
          px-4 py-2 pr-10 rounded-lg
          border border-gray-700
          focus:outline-none focus:border-blue-500
          cursor-pointer
        "
      >
        {Object.entries(languages).map(([key, lang]) => (
          <option key={key} value={key}>
            {lang.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default LanguageSelector;