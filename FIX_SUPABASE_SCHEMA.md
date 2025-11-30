# ✅ Fix Complete: Direct PostgreSQL Connection (Bypass PostgREST)

## Problem Solved
The Supabase Python client uses PostgREST API, which requires schemas to be exposed. We've now switched to **direct PostgreSQL connection** with `psycopg2` to bypass PostgREST entirely, allowing us to query the custom schema (`contractcoach`) without exposing it.

## Changes Made

### ✅ Code Changes
1. **Added `psycopg2-binary`** to `api/requirements.txt`
2. **Created `api/db_helper.py`** - Database helper for direct PostgreSQL queries
3. **Updated `api/main.py`**:
   - Removed Supabase PostgREST client
   - Added direct PostgreSQL connection via `db_helper`
   - Fixed all Redis async issues (removed `await` - Upstash Redis is synchronous)
   - Updated all database operations to use direct SQL queries

### 🔧 What You Need to Do

#### **CRITICAL: Add `DATABASE_URL` Environment Variable to Railway**

1. **Get the PostgreSQL Connection String:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **Settings → Database**
   - Scroll to **Connection string** section
   - Select the **URI** tab
   - You'll see something like:
     ```
     postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - **Important:** Replace `[YOUR-PASSWORD]` with your actual database password
     - The password is shown in the same section (click "Reveal" if hidden)
     - Or reset it if needed in **Settings → Database → Database password**

2. **Add to Railway:**
   - Go to Railway Dashboard
   - Click on your **`api`** service
   - Go to **Variables** tab
   - Click **"New Variable"**
   - **Key:** `DATABASE_URL`
   - **Value:** The full connection string from step 1
   - Click **"Add"**

3. **Redeploy:**
   - Railway will automatically redeploy when you add the variable
   - Or manually trigger a redeploy if needed

## Testing

After adding `DATABASE_URL` and redeploying, test the `/health` endpoint:

```bash
curl https://api-contract-coach-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "redis": "connected",
    "postgresql": "connected (direct connection, schema: contractcoach)",
    "openai": "configured"
  }
}
```

## Architecture

- **Before:** Frontend → Backend → Supabase PostgREST API → PostgreSQL (required schema exposure)
- **After:** Frontend → Backend → Direct PostgreSQL connection → Custom Schema (no exposure needed)

All database operations now bypass PostgREST completely, so the custom schema never needs to be exposed!

## Files Modified

- `api/requirements.txt` - Added `psycopg2-binary`
- `api/db_helper.py` - New file for direct PostgreSQL access
- `api/main.py` - Updated to use direct SQL instead of Supabase client
- All Redis calls - Fixed async issues (removed `await`)

## Notes

- The `SUPABASE_SCHEMA` environment variable is still used to specify which schema to query
- All queries now use the schema directly via `SET search_path` or schema-qualified table names
- No changes needed to Supabase dashboard settings - schema remains unexposed
