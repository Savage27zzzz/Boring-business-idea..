import { NextRequest, NextResponse } from 'next/server';
import { UserInputs } from '@/lib/types';
import { matchIdeas } from '@/lib/matcher';
import { generateIdeas } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured. Please add it to your environment variables.' },
        { status: 500 }
      );
    }

    const body: UserInputs = await request.json();

    if (!body.skills || !body.timeAvailable || !body.startingBudget || !body.incomeGoal || !body.riskTolerance) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const candidates = matchIdeas(body);

    const result = await generateIdeas(body, candidates);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate ideas';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
