'use client';

import { useState } from 'react';
import { UserInputs } from '@/lib/types';
import { GenerationResult } from '@/lib/types';
import InputForm from '@/components/InputForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import LoadingState from '@/components/LoadingState';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (inputs: UserInputs) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate ideas');
      }

      setResult(data as GenerationResult);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Boring Business
            <span className="block text-amber-400">Idea Generator</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Unsexy ideas. Real money.
          </p>
        </div>

        {!result && !loading && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <InputForm onSubmit={handleSubmit} isLoading={loading} />
          </div>
        )}

        {loading && <LoadingState />}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mt-6">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {result && <ResultsDisplay result={result} onReset={handleReset} />}
      </div>
    </main>
  );
}
