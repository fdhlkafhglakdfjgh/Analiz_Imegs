import React from 'react';
import { SpinnerIcon } from './icons';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onSubmit, isLoading, disabled }) => {
  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col sm:flex-row items-center gap-3 mt-8">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Add a retro filter, make it cartoonish..."
        className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !prompt.trim()}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            Generating
          </>
        ) : (
          'Apply Edit'
        )}
      </button>
    </form>
  );
};

export { PromptForm };
