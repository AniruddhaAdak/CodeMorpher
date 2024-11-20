import React, { useState } from 'react';
import { Code2, ArrowRight, Download, Copy, Wand2 } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import LanguageSelector from './components/LanguageSelector';
import ConversionOptions from './components/ConversionOptions';
import { languages } from './data/languages';
import { convertCode } from './utils/api';
import { ConversionOptions as ConversionOptionsType } from './types';

function App() {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLang, setSourceLang] = useState('javascript');
  const [targetLang, setTargetLang] = useState('python');
  const [convertedCode, setConvertedCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptionsType>({
    optimization: 'readability',
    environment: 'web',
    styleGuide: 'standard',
  });

  const handleConvert = async () => {
    try {
      setIsConverting(true);
      setError(null);
      const result = await convertCode(sourceCode, sourceLang, targetLang, options);
      setConvertedCode(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert code');
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(convertedCode);
  };

  const handleDownload = () => {
    const blob = new Blob([convertedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${languages[targetLang].extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Code2 className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold">CodeMorpher</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source Code Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Source Code</h2>
              <LanguageSelector
                value={sourceLang}
                onChange={setSourceLang}
                languages={languages}
              />
            </div>
            <CodeEditor
              value={sourceCode}
              onChange={setSourceCode}
              language={sourceLang}
              placeholder="Paste your code here..."
            />
          </div>

          {/* Target Code Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Converted Code</h2>
              <LanguageSelector
                value={targetLang}
                onChange={setTargetLang}
                languages={languages}
              />
            </div>
            <CodeEditor
              value={convertedCode}
              onChange={setConvertedCode}
              language={targetLang}
              readOnly
              placeholder="Converted code will appear here..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCopy}
                disabled={!convertedCode}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!convertedCode}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conversion Options */}
        <div className="mt-8">
          <ConversionOptions value={options} onChange={setOptions} />
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleConvert}
              disabled={isConverting || !sourceCode}
              className={`
                px-6 py-3 rounded-lg flex items-center space-x-3
                ${isConverting || !sourceCode
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500'}
                transition-colors
              `}
            >
              <Wand2 className="h-5 w-5" />
              <span className="font-medium">
                {isConverting ? 'Converting...' : 'Convert Code'}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
