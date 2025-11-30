

<!-- Purpose: Create FastAPI smoke tests without external dependencies. -->

You are adding minimal tests for the FastAPI backend.

CONTEXT
- Endpoints:
  - `POST /agent/run`
  - `GET /jobs/{id}`
  - `GET /messages?projectId`
- OpenAI + Google Drive interactions should be mocked.

TASKS
1) Testing setup:
   - Create `/api/tests/` with `__init__.py`.
   - Add `conftest.py` providing a FastAPI TestClient fixture.
   - If needed, add `/api/requirements-dev.txt` with `pytest`, `httpx`, `pytest-asyncio`.
2) Tests:
   - `test_health_contract.py`:
     - Ensure `/agent/run` returns `jobId` and 200.
     - Ensure `/jobs/{id}` returns `status` key.
   - `test_agent_flow.py`:
     - Mock OpenAI adapter to return deterministic `{"overallRisk": "medium", ...}`.
     - Post to `/agent/run`, then poll `/jobs/{id}` until `status == "done"`.
3) Isolation:
   - Override `SUPABASE_SCHEMA` and `REDIS_PREFIX` with test-specific values.
   - Avoid network calls to OpenAI or Google Drive (mock them).

OUTPUT
- New test files and any changes to `api/main.py` necessary for dependency injection.
