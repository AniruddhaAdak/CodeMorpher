import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  readOnly?: boolean;
}

function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  readOnly = false,
}: CodeEditorProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`
          w-full h-[400px] p-4 rounded-lg
          bg-gray-800 text-gray-100
          font-mono text-sm
          border border-gray-700
          focus:outline-none focus:border-blue-500
          resize-none
          ${readOnly ? 'cursor-default' : ''}
        `}
      />
      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-gray-700 text-xs text-gray-300">
        {language}
      </div>
    </div>
  );
}

export default CodeEditor;