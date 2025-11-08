import React from 'react';
import { Lightbulb } from 'lucide-react';

interface AvatarDescriptionExamplesProps {
  onSelectExample: (description: string) => void;
}

const examples = [
  "A friendly college student with curly brown hair wearing an orange Princeton hoodie",
  "An athletic person with short hair wearing a Princeton varsity jacket",
  "A studious person with glasses wearing a formal Princeton shirt",
  "A cheerful student with long hair wearing casual Princeton apparel"
];

export function AvatarDescriptionExamples({ onSelectExample }: AvatarDescriptionExamplesProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-slate-300">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <span className="text-sm">Example descriptions:</span>
      </div>
      <div className="space-y-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelectExample(example)}
            className="w-full text-left text-sm text-slate-400 hover:text-orange-400 hover:bg-slate-700/50 rounded px-3 py-2 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
