# BOOTSTRAP.md

> Base setup instructions, environment template, and notes for Cursor when bootstrapping the **OpenAI ContractCoach** project.

---

## 1. Environment Template (`.env.example`)

```bash
# Supabase (Postgres)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
SUPABASE_SCHEMA=contractcoach

# OpenAI SDK
OPENAI_API_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_PREFIX=contractcoach

# Google OAuth (Drive)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# Hosting / misc
RAILWAY_PUBLIC_DOMAIN=


Cursor: when generating code, always reference these env keys via os.getenv / process.env and never hardcode secrets.

2. Stack & Routing (Reminder for Cursor)

Frontend: React 19.2 / Next.js 15 (App Router, TypeScript, Tailwind, shadcn/ui).

Backend: FastAPI 3.11+, running as a separate service.

Database: Supabase schema contractcoach.

Cache/Queue: Upstash Redis with prefix contractcoach.

Required routes (frontend):

/ – landing page with hero video + CTA.

/dashboard – recent contracts and risk overview.

/playground – main contract review interface.

Required endpoints (backend):

POST /agent/run – Start contract analysis job.

GET /jobs/{id} – Poll job status/result.

GET /messages?projectId – Fetch message history (optional but recommended).

3. Cursor Expectations

When using 01_BOOTSTRAP:

Create folders: /api, /web, /db, /web/hooks, /components.

Place FastAPI stub in /api/main.py.

Place useAgent hook in /web/hooks/useAgent.ts.

Place SQL schema in /db/000-init.sql.

Wire .cursorrules, .cursorignore, .cursorconfig.json, .cursorcontext, .cursorignore-largefiles at repo root.

When using 02_IMPLEMENT_FRAMEWORK:

Implement an OpenAI SDK adapter for clause extraction with structured outputs.

Connect /agent/run to this adapter.

When using 03_EXTERNAL_API:

Implement Google Drive API integration for fetching contract files and caching content in Redis.

The rest of the prompts refine UI, tests, and docs.