# Vytora on Floot

The Next.js app in this repo was rebuilt as a full-stack Floot app (project **Vytora**,
id `cc16ffb5-2963-4063-bba3-7622f25664c1`). Floot hosts the code, database, auth,
file storage, realtime and AI. This repo is kept as the original reference.

## What's in the Floot app

| Route | What it does |
| --- | --- |
| `/` | Landing page with the 6-months-free banner, features, Nigerian foods, calisthenics teaser, FAQ |
| `/login`, `/register` | Email + password auth (Floot auth) |
| `/tracker` | Live GPS tracker for walk, run, hike, cycle, treadmill, gym, yoga, swim. Public. Saving needs an account |
| `/dashboard` | Today's step ring, streak, level/XP, 7-day chart, goals, activity history, manual activity logging |
| `/activities/:id` | Route map, stats and per-km splits. You can delete an activity here |
| `/nutrition` | Nigerian food database (45+ foods), custom foods, per-day log with macros, 7-day chart, meal plan for your goal |
| `/sleep` | Log each night (one entry per night, logging again updates it), quality, sleep debt, 7-night chart |
| `/goals` | Goals that track steps, km, kcal, workouts, active minutes or sleep automatically, plus custom goals you update yourself |
| `/achievements` | 18 badges and 10 levels, all worked out from your real data |
| `/challenges` | Daily, weekly and streak challenges, plus a weekly/monthly leaderboard |
| `/tribe` | Community feed with photo posts and likes, live chat, and an online count. All realtime, no polling |
| `/coach` | Vyto AI coach that sees your stats. Also a floating chat button on every app page |
| `/calisthenics`, `/tips` | Military calisthenics programs, exercise library, fitness tips |
| `/profile` | Name, body stats (with BMI), fitness goal, daily step and calorie goals |

## What changed from the Next.js version

- **Tracker**
  - Finishing a session reads values from refs. The old nested `setState` trick is gone, and it could save stale numbers.
  - Pausing doesn't count the distance covered while paused.
  - A session survives a page reload or the app being killed. It's saved to localStorage and comes back paused.
  - The screen stays awake while you track (Wake Lock).
  - GPS starts warming up as soon as the page opens.
- **Anti-cheat**
  - The server caps GPS distance at the length of the recorded route.
  - It rejects speeds no human can reach for that activity.
  - It limits the step count to what the distance supports.
- **Stats**
  - Streaks, badges, XP and goal progress are worked out from the source rows every time they're read, in the user's own timezone.
  - The old version kept counters in the database, split across Drizzle and Supabase, and they could drift out of sync.
- **Tribe**
  - Likes are one per user and tapping again unlikes. Before, every tap added another like.
  - Chat has a flood limit.
  - The feed and chat update in realtime. Before, they polled every 2–5 seconds.
- **Vyto** now uses Floot AI (`gpt-6-luna`). It no longer needs a Groq key.
- **Removed**
  - Stripe, Paystack and plan gating, since the promo makes everything free for 6 months.
  - The made-up marketing claims ("10M+ steps", "4.9★", "250K members").
  - The FAQ answers about Apple Health and Garmin syncing, because those integrations don't exist.
- **Not ported**
  - The SEO blog and compare pages.
  - The admin page.
  - The emailed weekly report. It needs a verified email sending domain first.
