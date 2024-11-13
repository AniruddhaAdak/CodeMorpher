import React from 'react';
import { Settings, Zap, Book } from 'lucide-react';
import { ConversionOptions as ConversionOptionsType } from '../types';

interface ConversionOptionsProps {
  value: ConversionOptionsType;
  onChange: (options: ConversionOptionsType) => void;
}

function ConversionOptions({ value, onChange }: ConversionOptionsProps) {
  const handleChange = (
    key: keyof ConversionOptionsType,
    newValue: string
  ) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
          <Settings className="h-5 w-5 text-blue-400" />
          <h3 className="font-medium">Optimization</h3>
        </div>
        <select
          value={value.optimization}
          onChange={(e) => handleChange('optimization', e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="performance">Performance</option>
          <option value="readability">Readability</option>
          <option value="maintainability">Maintainability</option>
        </select>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="font-medium">Environment</h3>
        </div>
        <select
          value={value.environment}
          onChange={(e) => handleChange('environment', e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
          <option value="embedded">Embedded</option>
        </select>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
          <Book className="h-5 w-5 text-green-400" />
          <h3 className="font-medium">Style Guide</h3>
        </div>
        <select
          value={value.styleGuide}
          onChange={(e) => handleChange('styleGuide', e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="standard">Standard</option>
          <option value="google">Google</option>
          <option value="airbnb">Airbnb</option>
        </select>
      </div>
    </div>
  );
}

export default ConversionOptions;