# DONE.md

## MVP Phase
- [2025-11-30] [Cursor] Copy `.env.example` → `.env` and fill OpenAI, Supabase, Redis, and Google OAuth keys.
- [2025-11-30] [Cursor] Set `SUPABASE_SCHEMA=contractcoach` and `REDIS_PREFIX=contractcoach`.
- [2025-11-30] [Cursor] Implement FastAPI `/agent/run` stub returning a static contract analysis result.
- [2025-11-30] [Cursor] Implement `/jobs/{id}` to read in-memory/Redis jobs.
- [2025-11-30] [Cursor] Create `useAgent(projectId)` hook in `/web/hooks/useAgent.ts` and wire to `/agent/run` + `/jobs/{id}`.
- [2025-11-30] [Cursor] Build basic `/playground` layout with contract info card, clause list, AI response area.
- [2025-11-30] [Cursor] Run migrations: apply `/db/000-init.sql` to Supabase.
- [2025-11-30] [Cursor] Implement OpenAI adapter using o3 / gpt-4.1 with structured outputs for clauses + risk.
- [2025-11-30] [Cursor] Replace static stub in `/agent/run` with real adapter call.
- [2025-11-30] [Cursor] Implement Google OAuth connect button + callback route on frontend.
- [2025-11-30] [Cursor] Implement backend Google Drive client for fetching contract files by `fileId`.
- [2025-11-30] [Cursor] Implement text extraction + chunking for PDFs/docx and cache results in Redis.
- [2025-11-30] [Cursor] Persist messages/jobs properly in Supabase (`contractcoach.messages`, `contractcoach.jobs`).
- [2025-11-30] [Cursor] Add clause grouping + risk badges in `/playground`.
- [2025-11-30] [Cursor] Implement clause detail panel with tabs (Plain English, Risk, Suggested Edit).
- [2025-11-30] [Cursor] Add follow-up Q&A input box that posts questions via `/agent/run`.
- [2025-11-30] [Cursor] Implement `/dashboard` list of recent contracts with overall risk indicators.
- [2025-11-30] [Cursor] Connect light/dark theme + hero video background as per design system.
- [2025-11-30] [Cursor] Add Redis-based rate limiting for `/agent/run` (`contractcoach:rate:{ip}`).
- [2025-11-30] [Cursor] Implement FastAPI tests (`/api/tests`) with mocked OpenAI + Drive.
- [2025-11-30] [Cursor] Add `railway.toml` / deploy config for API + web.
- [2025-11-30] [Cursor] Generate README via `WRITE_DOCS` Cursor prompt.

