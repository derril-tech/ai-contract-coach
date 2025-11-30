

<!-- Purpose: Integrate Google Drive API for contract import and caching. -->

You are implementing the external API integration.

CONTEXT
- external_api in PROJECT_BRIEF.md: `Google Drive API`.
- We already have `/agent/run` and `/jobs/{id}` wired to OpenAI.
- Google OAuth envs: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.
- Redis prefix: `contractcoach`.

TASKS
1) Backend Google client:
   - Create `/api/google_drive_client.py` with:
     - `get_auth_url()` – generate OAuth consent URL.
     - `exchange_code_for_tokens(code)` – OAuth callback.
     - `fetch_file_metadata(file_id, access_token)`.
     - `download_file_content(file_id, access_token)` → binary.
   - Cache extracted text per `fileId` in Redis key `contractcoach:cache:drive:file:{fileId}` with TTL 10–30 minutes.
2) Frontend OAuth flow:
   - Add a “Connect Google Drive” button in `/playground` that links to auth URL.
   - Add frontend route (e.g., `/auth/google/callback`) that:
     - Receives `code`, sends to backend, stores a session token or cookie if needed.
3) `/agent/run` integration:
   - If `input.driveFileId` is provided:
     - Use stored access token to fetch & cache text (PDF/docx → text).
     - Pass text into OpenAI adapter as before.
4) Rate limiting:
   - Add simple per-IP or per-user rate limiting for Drive fetches via `contractcoach:rate:{bucket}`.

OUTPUT
- New/updated files and explanation of how a user goes from clicking “Import from Drive” to having text analyzed.
