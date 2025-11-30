# ARCH.md

---
api_contract: ["POST /agent/run", "GET /jobs/{id}", "GET /messages?projectId"]
persistence:
  [
    "supabase: contractcoach.profiles, contractcoach.projects, contractcoach.messages, contractcoach.jobs",
    "redis: contractcoach:job:{id}, contractcoach:rate:{bucket}, contractcoach:cache:*"
  ]
observability: ["basic logging"]
---

## Backend

- **FastAPI (Python 3.11+)**
  - `POST /agent/run`
    - Body: `{ projectId: string, input: { driveFileId: string, mode: "full_review" | "clause_only", questions?: string[] } }`
    - Flow:
      1. Validate user/project.
      2. If needed, fetch file metadata from Google Drive.
      3. Enqueue job (Redis) to:
         - Download file via Google Drive API.
         - Convert to text (PDF / docx handling).
         - Chunk contract (size + semantic).
         - Call OpenAI SDK (o3 / gpt-4.1) with structured output schema for:
           - Key clauses per category.
           - Risk score per clause + overall.
           - Plain-English summary per clause + contract.
         - Persist `messages` + `jobs` rows in Supabase (`contractcoach` schema).
      4. Return `{ jobId }`.
  - `GET /jobs/{id}`
    - Reads job payload from Redis key `contractcoach:job:{id}`.
    - If missing, falls back to Supabase `jobs` table.
    - Response shape:
      ```json
      {
        "status": "queued" | "running" | "done" | "error",
        "result": {
          "overallRisk": "low" | "medium" | "high",
          "clauses": [
            {
              "id": "uuid",
              "type": "payment" | "ip" | "confidentiality" | "termination" | "liability" | "other",
              "title": "Payment Terms",
              "risk": "low" | "medium" | "high",
              "originalText": "...",
              "summary": "...",
              "whyItMatters": "...",
              "suggestedEdit": "..."
            }
          ],
          "summary": "Plain-English contract summary",
          "meta": { "pages": 24, "driveFileId": "..." }
        }
      }
      ```
  - `GET /messages?projectId=...`
    - Returns recent conversation / analysis history:
      ```json
      { "items": [{ "id": "uuid", "role": "user" | "assistant", "content": "string", "meta": {} }] }
      ```

- **External Integrations**
  - **OpenAI SDK**
    - Models: o3 / gpt-4.1 with JSON / structured outputs for clause extraction schema.
  - **Google Drive API**
    - OAuth 2.0 (Google Identity).
    - Read-only file scope; fetch PDF/docx contracts by `fileId`.

- **Storage**
  - **Supabase** (schema `contractcoach`):
    - `profiles`, `projects`, `messages`, `jobs` as in shared schema.
  - **Upstash Redis** (prefix `contractcoach`):
    - `contractcoach:job:{id}` – job status + result.
    - `contractcoach:rate:{bucket}` – rate limiting per IP/user.
    - `contractcoach:cache:drive:file:{fileId}` – cached text extraction (TTL 10–30 min).

- **Secrets / Config**
  - All secrets from `.env`:
    - `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE`, `UPSTASH_REDIS_*`, `SUPABASE_SCHEMA=contractcoach`,
      `REDIS_PREFIX=contractcoach`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.

## Frontend

- **Next.js 15 (React 19.2, App Router, TypeScript)**
  - Routes:
    - `/` – marketing + hero + “Upload contract” CTA.
    - `/dashboard` – list of reviewed contracts + risk snapshot.
    - `/playground` – primary review workspace.
  - **UI Tech**:
    - Tailwind CSS + shadcn/ui.
    - `useAgent(projectId)` hook for `/agent/run` + `/jobs/{id}` polling.
    - Light/dark themes per design system; hero video background on landing page.

### `/playground` UX

- Left column:
  - Contract selector (e.g., from previous jobs).
  - Google Drive “Import” button.
  - Clause list grouped by type, each with risk badge.
- Right column:
  - Tabs: `Plain English`, `Risk & Red Flags`, `Suggested Edit`.
  - Original clause text + AI explanation.
  - Chat-like Q&A panel using the same `/agent/run` pipeline for follow-up questions.

## Data Model (Supabase – Schema `contractcoach`)

- `profiles(id, email, created_at)`
- `projects(id, owner, title, framework, external_api, created_at)`
- `messages(id, project_id, role, content, meta, created_at)`
- `jobs(id, project_id, kind, status, payload, result, created_at, updated_at)`

## Security

- No long-term storage of raw contract files, only extracted text + structured summaries (configurable).
- Drive access tokens stored securely or short-lived (depending on implementation).
- Rate limiting on `/agent/run` via Redis (`contractcoach:rate:{ip}`).
