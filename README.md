# OpenAI ContractCoach

AI contract assistant that imports agreements from Google Drive, extracts key clauses, flags risky terms, and explains everything in plain English.

![Demo](https://via.placeholder.com/800x400?text=ContractCoach+Demo+Placeholder)

## 🚀 Features

- **Google Drive Integration**: Connect your account and import PDF/Docx contracts directly.
- **AI Analysis**: Uses OpenAI (GPT-4o) to extract key clauses (Payment, IP, Liability, Termination).
- **Risk Assessment**: automatically flags high-risk terms and explains why they matter.
- **Plain English Summaries**: Translates legalese into simple language.
- **Interactive Q&A**: Ask follow-up questions about specific clauses or the entire agreement.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19.2, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: FastAPI (Python 3.11+).
- **Database**: Supabase (PostgreSQL).
- **Cache/Queue**: Upstash Redis.
- **AI**: OpenAI SDK (Structured Outputs).
- **External API**: Google Drive API (OAuth 2.0).

## 🏁 Getting Started

### Prerequisites

1.  **Node.js 20+** & **Python 3.11+**
2.  **Supabase Project**: Create a project and run `db/000-init.sql` in the SQL editor.
3.  **Upstash Redis**: Create a Redis database.
4.  **OpenAI API Key**: Get a key with access to GPT-4o.
5.  **Google Cloud Project**: Enable Drive API and create OAuth credentials.

### Environment Setup

Copy `.env.example` to `.env` and fill in the keys:

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE` | Supabase Service Role Key (Backend) |
| `OPENAI_API_KEY` | OpenAI API Key |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Token |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `GOOGLE_REDIRECT_URI` | `http://localhost:3000/auth/google/callback` |
| `REDIS_PREFIX` | Redis Key Prefix (default: `contractcoach`) |
| `SUPABASE_SCHEMA` | Supabase Schema (default: `contractcoach`) |
| `RAILWAY_PUBLIC_DOMAIN` | Production Domain (for CORS/Auth) |

### Running Locally

1.  **Backend (FastAPI)**
    ```bash
    cd api
    pip install -r requirements.txt
    uvicorn api.main:app --reload --port 8000
    ```

2.  **Frontend (Next.js)**
    ```bash
    cd web
    npm install
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 📡 API Reference

- **POST** `/agent/run`: Start analysis job.
  - Body: `{ projectId, input: { text?, driveFileId?, accessToken? } }`
- **GET** `/jobs/{id}`: Poll job status (`queued`, `running`, `done`).
- **GET** `/messages?projectId=...`: Fetch chat history.

## 🚀 Deployment (Railway)

The project includes a `railway.toml` for easy deployment.

1.  Push to GitHub.
2.  Import project in Railway.
3.  Add all Environment Variables from `.env` to Railway.
4.  Update `GOOGLE_REDIRECT_URI` in Google Cloud Console to your production domain (e.g., `https://your-app.up.railway.app/auth/google/callback`).

## ⚠️ Notes

- **Rate Limits**: Requests are limited to 5 per minute per IP.
- **Data Privacy**: Contracts are processed transiently; text is cached in Redis for 30 mins and then expired. Analysis results are stored in Supabase.

## 📄 License

MIT

