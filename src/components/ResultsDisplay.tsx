'use client';

import { GenerationResult } from '@/lib/types';
import IdeaCard from './IdeaCard';

interface ResultsDisplayProps {
  result: GenerationResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const topPickNumbers = new Map(
    result.topPicks.map((tp) => [tp.ideaNumber, tp.rank])
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Your 10 Boring Business Ideas</h2>
        <p className="text-gray-400 text-sm">Click any card to expand the full breakdown.</p>
      </div>

      <div className="space-y-4">
        {result.ideas.map((idea) => (
          <IdeaCard
            key={idea.number}
            idea={idea}
            isTopPick={topPickNumbers.get(idea.number)}
          />
        ))}
      </div>

      {result.topPicks.length > 0 && (
        <div className="border-t border-gray-800 pt-10">
          <h2 className="text-2xl font-bold text-amber-400 mb-6">Top 3 Picks</h2>
          <div className="space-y-4">
            {result.topPicks.map((pick) => {
              const idea = result.ideas.find((i) => i.number === pick.ideaNumber);
              return (
                <div
                  key={pick.rank}
                  className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-gray-950 flex items-center justify-center text-sm font-bold">
                      #{pick.rank}
                    </span>
                    <div>
                      <h3 className="text-white font-semibold">
                        Idea #{pick.ideaNumber}: {idea?.concept || 'N/A'}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{pick.reasoning}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result.quickStart && (
        <div className="border-t border-gray-800 pt-10">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start: Your Next 7 Days</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {result.quickStart}
            </p>
          </div>
        </div>
      )}

      <div className="pt-4 pb-8">
        <button
          onClick={onReset}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all border border-gray-700"
        >
          Generate Again
        </button>
      </div>
    </div>
  );
}
