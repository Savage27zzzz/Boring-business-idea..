'use client';

import { useEffect, useState } from 'react';

const messages = [
  'Searching for boring gold...',
  'Ignoring every trendy idea...',
  'Crunching real numbers...',
  'Finding your unfair advantage...',
  'Analyzing 50+ business models...',
  'Matching skills to opportunities...',
  'Filtering by your budget...',
  'Building your playbook...',
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-amber-400 font-medium text-lg transition-all">{messages[messageIndex]}</span>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
