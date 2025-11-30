
<!-- Purpose: Implement OpenAI SDK adapter for clause extraction and wire it into /agent/run. -->

You are the framework adapter implementer.

CONTEXT
- Framework in PROJECT_BRIEF.md: `openai-sdk`.
- ARCH.md defines `/agent/run` contract and structured result format (overallRisk, clauses[], summary, meta).
- Supabase schema: `contractcoach`.
- Redis prefix: `contractcoach`.

TASKS
1) Create an adapter module in `/api` (e.g., `openai_adapter.py`) that:
   - Exposes `async def analyze_contract(text: str, options: dict) -> dict`.
   - Uses OpenAI SDK (o3 / gpt-4.1) with a JSON / structured output schema that returns:
     - `overallRisk: "low" | "medium" | "high"`
     - `clauses: [...]` with type, risk, originalText, summary, whyItMatters, suggestedEdit.
2) Update `/agent/run` in `api/main.py`:
   - Accept `{ projectId, input: { text?: string, driveFileId?: string, questions?: string[] } }`.
   - For now, support `text` directly (Drive integration can come later).
   - Create a job id, enqueue or immediately call `analyze_contract`, and save:
     - Job row in `contractcoach.jobs`.
     - User + assistant messages in `contractcoach.messages`.
   - Cache job state in Redis `contractcoach:job:{id}`.
3) Ensure `/jobs/{id}`:
   - Reads from Redis first.
   - Falls back to Supabase jobs row if needed.
   - Returns the structured `result` shape defined in ARCH.md.

CONSTRAINTS
- No hardcoded API keys; always load from `OPENAI_API_KEY`.
- Keep adapter loosely coupled (easily swappable).

OUTPUT
- List of new/updated files with brief notes on responsibilities.
