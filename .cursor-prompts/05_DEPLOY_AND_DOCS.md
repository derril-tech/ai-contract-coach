

<!-- Purpose: Finalize Railway deploy, generate README and basic docs. -->

You are preparing the project for deployment and documentation.

CONTEXT
- Services: `/api` (FastAPI) and `/web` (Next.js 15).
- Env keys defined in PROJECT_BRIEF.md and `.env.example`.
- Supabase + Upstash Redis configured externally.

TASKS
1) Deployment config:
   - Add `railway.toml` (or equivalent) describing two services:
     - `api` on FastAPI (uvicorn).
     - `web` on Next.js (pnpm build/start).
   - Ensure CORS on FastAPI allows the Railway web domain.
2) README:
   - Use PROJECT_BRIEF.md, ARCH.md, PLAN.md, TODO.md to generate a README with:
     - Title + one-liner.
     - Features list.
     - Tech stack.
     - Getting started (env setup, running web + api locally).
     - Basic API reference for `/agent/run`, `/jobs/{id}`, `/messages`.
3) Production checklist:
   - Confirm environment variables present in Railway.
   - Confirm Google OAuth redirect URL matches Railway web domain.
   - Run a full end-to-end test: Drive import → analysis → UI.

OUTPUT
- README.md at repo root.
- Short summary of deployment instructions and any manual steps.
