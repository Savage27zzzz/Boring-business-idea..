'use client';

import { useState } from 'react';
import { UserInputs } from '@/lib/types';

interface InputFormProps {
  onSubmit: (inputs: UserInputs) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [skills, setSkills] = useState('');
  const [timeAvailable, setTimeAvailable] = useState<number>(20);
  const [startingBudget, setStartingBudget] = useState<number>(1000);
  const [incomeGoal, setIncomeGoal] = useState<number>(5000);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!skills.trim()) newErrors.skills = 'Tell us about your skills and background';
    if (!timeAvailable || timeAvailable < 1) newErrors.timeAvailable = 'Must be at least 1 hour';
    if (timeAvailable > 80) newErrors.timeAvailable = 'Max 80 hours per week';
    if (!startingBudget && startingBudget !== 0) newErrors.startingBudget = 'Enter a budget amount';
    if (!incomeGoal || incomeGoal < 1) newErrors.incomeGoal = 'Enter your income goal';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ skills, timeAvailable, startingBudget, incomeGoal, riskTolerance });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
          Skills & Background
        </label>
        <textarea
          id="skills"
          rows={3}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g., 10 years in accounting, good with spreadsheets, some sales experience..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
          disabled={isLoading}
        />
        {errors.skills && <p className="mt-1 text-sm text-red-400">{errors.skills}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="timeAvailable" className="block text-sm font-medium text-gray-300 mb-2">
            Hours per week
          </label>
          <input
            id="timeAvailable"
            type="number"
            min={1}
            max={80}
            value={timeAvailable}
            onChange={(e) => setTimeAvailable(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          {errors.timeAvailable && <p className="mt-1 text-sm text-red-400">{errors.timeAvailable}</p>}
        </div>

        <div>
          <label htmlFor="startingBudget" className="block text-sm font-medium text-gray-300 mb-2">
            Starting budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              id="startingBudget"
              type="number"
              min={0}
              value={startingBudget}
              onChange={(e) => setStartingBudget(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>
          {errors.startingBudget && <p className="mt-1 text-sm text-red-400">{errors.startingBudget}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="incomeGoal" className="block text-sm font-medium text-gray-300 mb-2">
          Monthly income goal
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input
            id="incomeGoal"
            type="number"
            min={0}
            value={incomeGoal}
            onChange={(e) => setIncomeGoal(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>
        {errors.incomeGoal && <p className="mt-1 text-sm text-red-400">{errors.incomeGoal}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Risk tolerance
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['low', 'medium', 'high'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setRiskTolerance(level)}
              disabled={isLoading}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all capitalize ${
                riskTolerance === level
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-gray-950 font-bold py-4 px-6 rounded-lg transition-all text-lg"
      >
        {isLoading ? 'Generating...' : 'Generate My Boring Money Machines'}
      </button>
    </form>
  );
}
