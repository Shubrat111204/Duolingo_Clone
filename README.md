# Duolingo Clone (Spanish)

Full-stack take-home: a Duolingo-style learning path, lesson player and gamification loop.

**Stack:** Next.js 14 (TypeScript, App Router) · FastAPI · SQLAlchemy · SQLite

## Run locally
```bash
# backend (http://localhost:8000, docs at /docs) - auto-creates and seeds duolingo.db
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && uvicorn main:app --reload

# frontend (http://localhost:3000)
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

## Deploy
- **Backend (Render/Railway):** root `backend`, build `pip install -r requirements.txt`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`. Set `CORS_ORIGINS` to your frontend URL. SQLite resets on redeploy for free tiers; the seed recreates the demo data on boot.
- **Frontend (Vercel):** root `frontend`, env `NEXT_PUBLIC_API_URL=<backend URL>`.

## Features
Learning path with locked/available/completed skills and progress rings · lesson player with 5 exercise types (multiple choice, word bank, match pairs, fill in the blank, type the answer) · feedback bar, progress bar, wrong answers re-queued · hearts (lose on mistake, regenerate 1 per 5 min, mock refill with gems, out-of-hearts modal) · XP, daily goal, streak · seeded leaderboard · profile with weekly XP chart and achievements · settings placeholders · dark mode and responsive layout.
Streak logic is testable: the **Simulate next day** button (right panel) shifts the learner's date.

## Architecture
`frontend/` pages call a thin `lib/api.ts` client; `backend/main.py` holds REST routes and gamification rules (streak, hearts regen, XP), `models.py` the schema, `seed.py` the Spanish course and demo learner. Answers are checked server-side and never sent to the client. Assumption: a single default logged-in learner (auth simplified per brief).

## Database schema
`users` (xp, streak, last_active, hearts, hearts_at, gems, daily_goal, day_offset) · `units` 1-N `skills` 1-N `lessons` 1-N `exercises` (type, prompt, data JSON, answer) · `user_lessons` (user_id, lesson_id, unique pair; progress is derived from it) · `xp_log` (user_id, day, xp; daily goal + weekly chart).
Skill state (locked/available/completed) is computed from `user_lessons`, so there is no duplicated progress state.

## API
`GET /api/me` · `GET /api/path` · `GET /api/lessons/{id}` · `POST /api/exercises/{id}/check` · `POST /api/hearts/lose` · `POST /api/hearts/refill` · `POST /api/lessons/{id}/complete` · `GET /api/leaderboard` · `GET /api/profile` · `POST /api/debug/next-day`

## Not included / mocked
Audio, speech, real auth, Super, friends, multiple languages.
