import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserInputs, CuratedIdea, GenerationResult } from '../src/lib/types';

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables.');
  return new GoogleGenerativeAI(apiKey);
}

export async function generateIdeas(
  inputs: UserInputs,
  candidates: CuratedIdea[]
): Promise<GenerationResult> {
  const systemPrompt = `You are an expert business advisor specializing in boring, unglamorous but highly profitable businesses. You are direct, practical, and never hype anything up. Every number you give must be conservative and defensible.

RULES:
- No trendy tech ideas — prioritize businesses with boring, durable demand
- Every revenue estimate must be conservative and defensible
- Never recommend a business that requires more capital than the user's starting budget of $${inputs.startingBudget}
- Flag any idea that conflicts with the stated risk tolerance (${inputs.riskTolerance})
- Startup costs must be itemized
- First 5 customers playbook must be specific and actionable, not generic advice`;

  const userPrompt = `USER PROFILE:
- Skills & Background: ${inputs.skills}
- Time Available: ${inputs.timeAvailable} hours/week
- Starting Budget: $${inputs.startingBudget}
- Monthly Income Goal: $${inputs.incomeGoal}
- Risk Tolerance: ${inputs.riskTolerance}

CANDIDATE IDEAS FROM DATABASE (use these as starting points, customize them for this user, and you may combine or modify them):
${candidates.map((c, i) => `${i + 1}. ${c.name} (${c.category}) — ${c.description}`).join('\n')}

Generate exactly 10 boring but genuinely profitable business ideas. For each, output a JSON object following this exact structure:

{
  "ideas": [
    {
      "number": 1,
      "concept": "one sentence description",
      "whyUnsexButProfitable": "why others ignore it, why that's your advantage",
      "targetCustomer": "specific, not vague",
      "first5CustomersPlaybook": "exactly how to get them — specific steps",
      "monthlyRevenuePotential": "realistic range with explanation",
      "startupCost": "itemized estimate",
      "timeToFirstRevenue": "realistic weeks/months",
      "biggestRisk": "the one thing that could kill it",
      "unfairAdvantage": "why this user's specific background makes them suited"
    }
  ],
  "topPicks": [
    { "rank": 1, "ideaNumber": 3, "reasoning": "why this is the best fit" },
    { "rank": 2, "ideaNumber": 7, "reasoning": "why" },
    { "rank": 3, "ideaNumber": 1, "reasoning": "why" }
  ],
  "quickStart": "For the #1 pick, a detailed day-by-day plan for the next 7 days to get started"
}

Return ONLY valid JSON, no markdown code fences.`;

  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4000,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { role: 'model', parts: [{ text: systemPrompt }] },
  });

  const content = result.response.text();
  if (!content) throw new Error('No response from Gemini');

  return JSON.parse(content) as GenerationResult;
}
