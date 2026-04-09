# Boring Business Idea Generator

Generates 10 boring-but-profitable business ideas personalized to your skills, budget, and goals. Uses a curated database of 50+ proven business models enhanced by AI.

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your Gemini API key
4. Run dev server: `npm run dev`
5. Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` to Environment Variables
4. Deploy

## Telegram Bot

The same generator also runs as a Telegram bot.

### Setup
1. Create a bot with [@BotFather](https://t.me/BotFather) on Telegram
2. Copy the bot token
3. Add to `.env.local`:
   ```
   TELEGRAM_BOT_TOKEN=your-token-here
   GEMINI_API_KEY=your-gemini-api-key-here
   ```
4. Run: `npm run bot`

### Commands
- `/start` — Welcome message
- `/generate` — Start the 5-step questionnaire to get 10 personalized ideas

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Google Gemini API (gemini-2.0-flash)
- Curated database of 50+ boring business ideas

## How It Works
1. You enter your skills, time, budget, income goal, and risk tolerance
2. The matcher filters 50+ curated business ideas based on your constraints
3. Gemini personalizes the top candidates into 10 detailed recommendations
4. You get actionable ideas with startup costs, revenue estimates, and a 7-day quick start plan
