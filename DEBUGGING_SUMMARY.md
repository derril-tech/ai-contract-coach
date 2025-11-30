# DEBUGGING_SUMMARY.md

## Issue Found: Supabase Schema Access

### Error Message
```
"Could not find the table 'public.contractcoach.jobs' in the schema cache"
```

### Root Cause
Supabase PostgREST (which the Python client uses) **only exposes schemas that are configured in PostgREST API settings**. Even with the service role key, custom schemas must be explicitly exposed for PostgREST to access them.

### Current Status
- ✅ Root endpoint: Working
- ✅ Auth endpoint: Working  
- ❌ Agent run endpoint: Failing (500) - Schema access issue
- ⚠️ Redis: Needs async wrapper fixes
- ❌ Supabase: Schema not accessible via PostgREST

### Solutions (Choose One)

#### Option 1: Expose Schema in Supabase (Recommended)
1. Go to Supabase Dashboard → Settings → API
2. Find "Exposed Schemas" or "Schema" settings
3. Add `contractcoach` to the list of exposed schemas
4. Save and wait for PostgREST to refresh

#### Option 2: Move Tables to Public Schema
- Modify `db/000-init.sql` to create tables in `public` schema instead
- Re-run migration in production
- Update all table references to remove schema prefix

#### Option 3: Use Direct SQL Queries (Advanced)
- Use Supabase's SQL execution endpoint or direct database connection
- Requires more code changes

### Recommended Next Steps
1. **Check if tables exist**: Run this in Supabase SQL Editor:
   ```sql
   SELECT table_schema, table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'contractcoach';
   ```

2. **If tables exist**: Expose the schema in PostgREST settings (Option 1)

3. **If tables don't exist**: Run the migration script in production first

### Redis Issue (Also Found)
- Upstash Redis REST client is synchronous
- Need to wrap calls in `asyncio.to_thread()` for async functions
- Fix is already prepared in code

