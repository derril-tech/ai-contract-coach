# PLAN.md

---
milestones: 5
---

## M1 — Skeleton & Plumbing

- Scaffold repo with `/api`, `/web`, `/db`, and core spec files using Cursor.
- Implement FastAPI endpoints:
  - `POST /agent/run` (dummy implementation returning static structured result).
  - `GET /jobs/{id}` (reads from in-memory/Redis stub).
  - `GET /messages?projectId` (returns empty list).
- Set up Supabase schema `contractcoach` & Upstash Redis connectivity (envs only, optional in code for M1).
- Build minimal Next.js 15 pages:
  - `/` – hero + CTA.
  - `/dashboard` – placeholder list.
  - `/playground` – UI scaffold using `useAgent(projectId)`.

## M2 — OpenAI Adapter & Clause Schema

- Implement OpenAI adapter for `framework = openai-sdk`:
  - Define Python class/function that accepts contract text + options and returns:
    - Overall risk level.
    - List of clauses with type, risk, summary, explanation, suggested edit.
  - Use structured outputs / JSON schema with o3 / gpt-4.1.
- Integrate adapter into `/agent/run`:
  - Accept simple `{ projectId, input: { text: string } }` for now.
  - Save request/response in `contractcoach.messages` and `contractcoach.jobs`.

## M3 — Google Drive Integration & Long-Document Handling

- Add Google OAuth flow on frontend:
  - “Connect Google Drive” button; store access token securely via backend.
- Implement backend client for Google Drive API:
  - Fetch selected file by `fileId`.
  - Handle common formats (PDF, docx) and convert to text.
  - Cache extracted text per `fileId` in Redis (`contractcoach:cache:drive:file:{fileId}`).
- Add chunking pipeline on backend:
  - Split long documents into chunks with overlap.
  - Feed into OpenAI adapter; merge clause results.

## M4 — Playground UX & Risk Visualization

- Upgrade `/playground` UI to full contract workspace:
  - Clause list grouped by type with risk badges.
  - Clause detail panel with tabs (plain English, risk, suggested edit).
  - Chat-style Q&A area for follow-up questions.
- Implement risk summary components:
  - Overall risk pill (Low / Medium / High).
  - Simple visualization (e.g., bar chart / donut) of clause risk distribution (optional).
- Populate `/dashboard` with recent jobs from Supabase:
  - Name, date, counterpart, overall risk, number of risky clauses.

## M5 — Hardening, Deploy & Docs

- Add basic tests for FastAPI endpoints:
  - Smoke tests for `/agent/run`, `/jobs/{id}`, `/messages`.
  - Mock OpenAI + Drive for tests.
- Add rate limiting on `/agent/run`.
- Polish copy, empty states, and error messages.
- Generate README via `WRITE_DOCS` prompt (using PROJECT_BRIEF, ARCH, PLAN).
- Deploy web + API services to Railway:
  - Configure Supabase + Redis env vars.
  - Verify Google OAuth redirect URL.
  - Confirm end-to-end flow works on production URL.
