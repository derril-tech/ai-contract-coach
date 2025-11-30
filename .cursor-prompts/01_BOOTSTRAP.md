<!-- Purpose: Scaffold base FastAPI + Next.js project structure from specs for OpenAI ContractCoach. -->

You are the project bootstrapper.

CONTEXT
- Use PROJECT_BRIEF.md, ARCH.md, PLAN.md, TODO.md, BOOTSTRAP.md as the source of truth.
- Frontend: React 19.2 / Next.js 15 (App Router) in `/web`.
- Backend: FastAPI in `/api`.
- Database: Supabase schema `contractcoach`.
- Cache: Upstash Redis with prefix `contractcoach`.

TASKS
1) Create base folder structure:
   - `/api`, `/web`, `/db`, `/web/hooks`, `/components`.
2) Backend:
   - Implement `/api/main.py` with FastAPI app, endpoints:
     - `POST /agent/run` stub (in-memory jobs, static contract analysis placeholder).
     - `GET /jobs/{id}` stub reading in-memory jobs.
     - `GET /messages` stub returning empty `items: []`.
3) Frontend:
   - Create Next.js 15 App Router project skeleton in `/web`.
   - Implement routes: `/`, `/dashboard`, `/playground`.
   - Add `useAgent(projectId)` hook in `/web/hooks/useAgent.ts` that:
     - POSTs to `/api/agent/run`.
     - Polls `/api/jobs/{id}` until `status === "done"` or timeout.
4) Database:
   - Add `/db/000-init.sql` using the shared schema for `contractcoach` (profiles, projects, messages, jobs).
5) Env:
   - Ensure `.env.example` matches env_keys in PROJECT_BRIEF.md.

OUTPUT
- Summarize created/modified files and any assumptions about local dev (ports, proxies).
