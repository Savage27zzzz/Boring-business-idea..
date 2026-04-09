'use client';

import { useState } from 'react';
import { GeneratedIdea } from '@/lib/types';

interface IdeaCardProps {
  idea: GeneratedIdea;
  isTopPick?: number;
}

export default function IdeaCard({ idea, isTopPick }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all duration-300 cursor-pointer ${
        isTopPick
          ? 'bg-amber-500/5 border-amber-500/40 hover:border-amber-500/70'
          : 'bg-gray-900 border-gray-800 hover:border-gray-700'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isTopPick
                ? 'bg-amber-500 text-gray-950'
                : 'bg-gray-800 text-gray-400'
            }`}>
              {idea.number}
            </span>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-base leading-snug">{idea.concept}</h3>
              <p className="text-amber-400 text-sm mt-1 font-medium">{idea.monthlyRevenuePotential}</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 mt-1.5 ${
              expanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isTopPick && (
          <span className="inline-block mt-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
            TOP PICK #{isTopPick}
          </span>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 space-y-4 border-t border-gray-800 pt-4">
          <DetailRow label="Why Unsexy But Profitable" value={idea.whyUnsexButProfitable} />
          <DetailRow label="Target Customer" value={idea.targetCustomer} />
          <DetailRow label="First 5 Customers Playbook" value={idea.first5CustomersPlaybook} />
          <DetailRow label="Monthly Revenue Potential" value={idea.monthlyRevenuePotential} />
          <DetailRow label="Startup Cost" value={idea.startupCost} />
          <DetailRow label="Time to First Revenue" value={idea.timeToFirstRevenue} />
          <DetailRow label="Biggest Risk" value={idea.biggestRisk} highlight />
          <DetailRow label="Your Unfair Advantage" value={idea.unfairAdvantage} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</dt>
      <dd className={`text-sm leading-relaxed ${highlight ? 'text-red-400' : 'text-gray-300'}`}>{value}</dd>
    </div>
  );
}
