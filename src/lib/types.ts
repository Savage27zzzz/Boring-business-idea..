export interface UserInputs {
  skills: string;
  timeAvailable: number;
  startingBudget: number;
  incomeGoal: number;
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface CuratedIdea {
  id: string;
  name: string;
  category: string;
  description: string;
  whyUnsexy: string;
  targetCustomer: string;
  startupCostRange: { min: number; max: number };
  monthlyRevenueRange: { min: number; max: number };
  timeToFirstRevenueWeeks: { min: number; max: number };
  hoursPerWeekRequired: { min: number; max: number };
  riskLevel: 'low' | 'medium' | 'high';
  skillTags: string[];
}

export interface GeneratedIdea {
  number: number;
  concept: string;
  whyUnsexButProfitable: string;
  targetCustomer: string;
  first5CustomersPlaybook: string;
  monthlyRevenuePotential: string;
  startupCost: string;
  timeToFirstRevenue: string;
  biggestRisk: string;
  unfairAdvantage: string;
}

export interface GenerationResult {
  ideas: GeneratedIdea[];
  topPicks: {
    rank: number;
    ideaNumber: number;
    reasoning: string;
  }[];
  quickStart: string;
}
