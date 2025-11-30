# .cursor-prompts/WRITE_DOCS.md

<!-- Purpose: Generate README.md for end users from project spec. -->

You are a technical writer. Produce a concise, practical README for OpenAI ContractCoach.

INPUTS
- Parse PROJECT_BRIEF.md (project_name, framework, external_api, env_keys).
- Use ARCH.md for architecture overview and API contract.
- Use PLAN.md/TODO.md for quickstart steps and roadmap.

REQUIRED SECTIONS
1) Title + one-liner.
2) Demo (placeholder link + screenshot reference).
3) Features (derived from user stories).
4) Tech stack (Next.js 15, React 19.2, FastAPI, Supabase, Redis, OpenAI SDK, Google Drive API).
5) Getting started:
   - Env setup (table from env_keys).
   - Running API + web locally.
6) API:
   - `/agent/run`
   - `/jobs/{id}`
   - `/messages?projectId`
7) Deploy (Railway):
   - Two services, env vars, CORS note.
8) Notes & limitations (rate limits, data handling).
9) License (MIT by default).

OUTPUT
- `README.md` at repo root.
- Short change summary at the end of the file.
