import { UserInputs, CuratedIdea } from './types';
import ideasData from '@/data/ideas.json';

export function matchIdeas(inputs: UserInputs): CuratedIdea[] {
  const ideas = ideasData as CuratedIdea[];

  let filtered = ideas.filter(idea => idea.startupCostRange.min <= inputs.startingBudget);

  filtered = filtered.filter(idea => idea.hoursPerWeekRequired.min <= inputs.timeAvailable);

  const riskMap: Record<string, number> = { low: 1, medium: 2, high: 3 };
  filtered = filtered.filter(idea => riskMap[idea.riskLevel] <= riskMap[inputs.riskTolerance]);

  const scored = filtered.map(idea => {
    let score = 0;

    if (idea.monthlyRevenueRange.max >= inputs.incomeGoal) score += 3;
    else if (idea.monthlyRevenueRange.min >= inputs.incomeGoal * 0.5) score += 1;

    const skillsLower = inputs.skills.toLowerCase();
    const skillMatches = idea.skillTags.filter(tag => skillsLower.includes(tag.toLowerCase()));
    score += skillMatches.length * 2;

    if (idea.startupCostRange.max <= inputs.startingBudget * 0.5) score += 1;

    if (idea.timeToFirstRevenueWeeks.min <= 4) score += 2;

    return { idea, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 15).map(s => s.idea);
}
