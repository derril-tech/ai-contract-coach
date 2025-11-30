# PROJECT_BRIEF.md

---
project_name: "OpenAI ContractCoach"
framework: "openai-sdk"                 # openai-sdk | langgraph | autogen | n8n | crewai
external_api: "Google Drive API"
supabase_schema: "contractcoach"
redis_prefix: "contractcoach"
repo_routes: ["/", "/dashboard", "/playground"]
api_endpoints: ["POST /agent/run", "GET /jobs/{id}", "GET /messages?projectId"]
env_keys:
  [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "OPENAI_API_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "SUPABASE_SERVICE_ROLE",
    "SUPABASE_SCHEMA",
    "REDIS_PREFIX",
    "RAILWAY_PUBLIC_DOMAIN",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI"
  ]
frontend_stack: "React 19.2 / Next.js 15 (App Router, TypeScript, Tailwind, shadcn/ui)"
---

## One-liner

AI contract assistant that imports agreements from Google Drive, extracts key clauses, flags risky terms, and explains everything in plain English.

## User Stories

- As a user, I can connect my Google account and browse my Drive to select a contract file.
- As a user, I can run an AI review on a selected contract and see the overall risk level.
- As a user, I can see key clauses grouped by type (payment, IP, confidentiality, termination, liability).
- As a user, I can read plain-English summaries for each clause so I understand what it means.
- As a user, I can see which clauses are unusual or risky with short explanations why.
- As a user, I can ask follow-up questions about a clause (e.g., “Is this standard?” or “What should I push back on?”).
- As a user, I can revisit recent contract reviews and see their risk summary and key flagged clauses.

## Success Criteria (MVP)

- End-to-end flow works: Google OAuth → pick contract from Drive → `/agent/run` → `/jobs/{id}` polling → clause list + risk table + summaries visible in the UI.
- Supports contracts up to at least ~50 pages via chunking + OpenAI structured outputs.
- Key clause types extracted for >80% of tested contracts (payment, IP, confidentiality, termination, liability).
- Overall and per-clause risk levels returned in a structured JSON schema.
- p95 round-trip from “Run review” click to initial results under 20 seconds for a 20–30 page contract.
- All runs, messages, and jobs persisted in Supabase under `contractcoach` schema; job state cached in Redis with prefix `contractcoach`.
