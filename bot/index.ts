import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { UserInputs, GeneratedIdea } from '../src/lib/types';
import { matchIdeas } from './matcher';
import { generateIdeas } from './gemini';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is required');
  process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

interface ConversationState {
  step: 'idle' | 'skills' | 'time' | 'budget' | 'income' | 'risk' | 'generating';
  data: Partial<UserInputs>;
}

const sessions = new Map<number, ConversationState>();

function getSession(userId: number): ConversationState {
  if (!sessions.has(userId)) {
    sessions.set(userId, { step: 'idle', data: {} });
  }
  return sessions.get(userId)!;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

bot.start(async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'idle';
  session.data = {};

  await ctx.reply(
    '💰 *Boring Business Idea Generator*\n\n' +
    'I generate 10 boring\\-but\\-profitable business ideas personalized to YOU\\.\n\n' +
    'Type /generate to get started\\!',
    { parse_mode: 'MarkdownV2' }
  );
});

bot.command('generate', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'skills';
  session.data = {};

  await ctx.reply(
    '📝 *Step 1/5: Skills & Background*\n\n' +
    'Tell me about your skills, experience, and background\\.\n\n' +
    '_Example: "10 years in accounting, good with spreadsheets, some sales experience"_',
    { parse_mode: 'MarkdownV2' }
  );
});

bot.on(message('text'), async (ctx) => {
  const session = getSession(ctx.from.id);
  const text = ctx.message.text;

  if (text.startsWith('/')) return;

  switch (session.step) {
    case 'skills':
      session.data.skills = text;
      session.step = 'time';
      await ctx.reply(
        '⏰ *Step 2/5: Time Available*\n\nHow many hours per week can you commit? (1-80)\n\n_Just send a number._',
        { parse_mode: 'MarkdownV2' }
      );
      break;

    case 'time': {
      const hours = parseInt(text);
      if (isNaN(hours) || hours < 1 || hours > 80) {
        await ctx.reply('⚠️ Please enter a number between 1 and 80.');
        return;
      }
      session.data.timeAvailable = hours;
      session.step = 'budget';
      await ctx.reply(
        '💵 *Step 3/5: Starting Budget*\n\nHow much money can you invest to start? \\(in USD\\)\n\n_Just send a number, e\\.g\\. 2000_',
        { parse_mode: 'MarkdownV2' }
      );
      break;
    }

    case 'budget': {
      const budget = parseInt(text.replace(/[$,]/g, ''));
      if (isNaN(budget) || budget < 0) {
        await ctx.reply('⚠️ Please enter a valid dollar amount (e.g. 2000).');
        return;
      }
      session.data.startingBudget = budget;
      session.step = 'income';
      await ctx.reply(
        '🎯 *Step 4/5: Monthly Income Goal*\n\nWhat monthly revenue are you targeting? \\(in USD\\)\n\n_Just send a number, e\\.g\\. 5000_',
        { parse_mode: 'MarkdownV2' }
      );
      break;
    }

    case 'income': {
      const income = parseInt(text.replace(/[$,]/g, ''));
      if (isNaN(income) || income < 1) {
        await ctx.reply('⚠️ Please enter a valid dollar amount (e.g. 5000).');
        return;
      }
      session.data.incomeGoal = income;
      session.step = 'risk';
      await ctx.reply(
        '⚖️ *Step 5/5: Risk Tolerance*\n\nHow much risk are you comfortable with?',
        {
          parse_mode: 'MarkdownV2',
          ...Markup.inlineKeyboard([
            Markup.button.callback('🟢 Low', 'risk_low'),
            Markup.button.callback('🟡 Medium', 'risk_medium'),
            Markup.button.callback('🔴 High', 'risk_high'),
          ])
        }
      );
      break;
    }

    case 'generating':
      await ctx.reply('⏳ Still generating your ideas... hang tight!');
      break;

    case 'idle':
      await ctx.reply('Type /generate to get personalized business ideas!');
      break;
  }
});

bot.action(/^risk_(low|medium|high)$/, async (ctx) => {
  const session = getSession(ctx.from.id);
  if (session.step !== 'risk') return;

  const risk = ctx.match[1] as 'low' | 'medium' | 'high';
  session.data.riskTolerance = risk;
  session.step = 'generating';

  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup(undefined);

  const inputs = session.data as UserInputs;

  await ctx.reply(
    '🔄 *Generating your boring money machines\\.\\.\\.*\n\n' +
    'This takes 15\\-30 seconds\\. Crunching 57 business models against your profile\\.\\.\\.',
    { parse_mode: 'MarkdownV2' }
  );

  try {
    const candidates = matchIdeas(inputs);
    const result = await generateIdeas(inputs, candidates);

    for (const idea of result.ideas) {
      const ideaText = formatIdea(idea);
      await ctx.reply(ideaText, { parse_mode: 'HTML' });
      await new Promise(r => setTimeout(r, 300));
    }

    let topPicksText = '🏆 <b>TOP 3 PICKS FOR YOU</b>\n\n';
    for (const pick of result.topPicks) {
      const idea = result.ideas.find(i => i.number === pick.ideaNumber);
      topPicksText += `<b>#${pick.rank}: Idea ${pick.ideaNumber}</b> — ${escapeHtml(idea?.concept || 'N/A')}\n`;
      topPicksText += `${escapeHtml(pick.reasoning)}\n\n`;
    }
    await ctx.reply(topPicksText, { parse_mode: 'HTML' });

    await ctx.reply(
      `🚀 <b>QUICK START: Your Next 7 Days</b>\n\n${escapeHtml(result.quickStart)}`,
      { parse_mode: 'HTML' }
    );

    await ctx.reply('Want to generate again? Type /generate');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Generation error:', error);
    await ctx.reply(`❌ Error generating ideas: ${msg}\n\nPlease try again with /generate`);
  } finally {
    session.step = 'idle';
    session.data = {};
  }
});

function formatIdea(idea: GeneratedIdea): string {
  return [
    `💡 <b>IDEA #${idea.number}</b>`,
    ``,
    `<b>CONCEPT:</b> ${escapeHtml(idea.concept)}`,
    ``,
    `<b>WHY UNSEXY BUT PROFITABLE:</b>`,
    `${escapeHtml(idea.whyUnsexButProfitable)}`,
    ``,
    `<b>TARGET CUSTOMER:</b> ${escapeHtml(idea.targetCustomer)}`,
    ``,
    `<b>FIRST 5 CUSTOMERS:</b>`,
    `${escapeHtml(idea.first5CustomersPlaybook)}`,
    ``,
    `<b>MONTHLY REVENUE:</b> ${escapeHtml(idea.monthlyRevenuePotential)}`,
    `<b>STARTUP COST:</b> ${escapeHtml(idea.startupCost)}`,
    `<b>TIME TO FIRST $:</b> ${escapeHtml(idea.timeToFirstRevenue)}`,
    ``,
    `⚠️ <b>BIGGEST RISK:</b> ${escapeHtml(idea.biggestRisk)}`,
    ``,
    `✅ <b>YOUR ADVANTAGE:</b> ${escapeHtml(idea.unfairAdvantage)}`,
  ].join('\n');
}

bot.launch();
console.log('🤖 Boring Business Bot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
