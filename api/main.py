from fastapi import FastAPI, HTTPException, Query, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid
import time
import json
import asyncio
import io
from typing import Any, Dict, Optional, List
from dotenv import load_dotenv

from supabase import create_client, Client
from upstash_redis import Redis

# External Integrations
try:
    from api.openai_adapter import analyze_contract
    from api.google_drive_client import (
        get_auth_url, 
        exchange_code_for_tokens, 
        download_file_content,
        fetch_file_metadata
    )
except ImportError:
    # Fallback for Railway if running from root without 'api' package awareness
    from openai_adapter import analyze_contract
    from google_drive_client import (
        get_auth_url, 
        exchange_code_for_tokens, 
        download_file_content,
        fetch_file_metadata
    )

# Text Extraction
try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    import docx
except ImportError:
    docx = None

load_dotenv()

APP_NAME = "contractcoach"
PREFIX = os.getenv("REDIS_PREFIX", "contractcoach")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE")
SUPABASE_SCHEMA = os.getenv("SUPABASE_SCHEMA", "contractcoach")
REDIS_URL = os.getenv("UPSTASH_REDIS_REST_URL")
REDIS_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
PUBLIC_DOMAIN = os.getenv("RAILWAY_PUBLIC_DOMAIN", "http://localhost:3000")

# Initialize clients
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    # Create client with schema configuration
    supabase = create_client(
        SUPABASE_URL, 
        SUPABASE_KEY,
        options={
            "schema": SUPABASE_SCHEMA
        }
    )

redis: Optional[Redis] = None
if REDIS_URL and REDIS_TOKEN:
    redis = Redis(url=REDIS_URL, token=REDIS_TOKEN)

app = FastAPI(title="OpenAI ContractCoach API")

# CORS
origins = [
    "http://localhost:3000",
    PUBLIC_DOMAIN,
    f"https://{PUBLIC_DOMAIN}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentInput(BaseModel):
    driveFileId: Optional[str] = None
    text: Optional[str] = None
    questions: Optional[list[str]] = None
    accessToken: Optional[str] = None

class RunBody(BaseModel):
    projectId: str
    input: AgentInput

class ExchangeCodeBody(BaseModel):
    code: str

# Rate Limiting Helper
async def check_rate_limit(key: str, limit: int, window: int) -> bool:
    if not redis:
        return True
    
    current = await redis.incr(key)
    if current == 1:
        await redis.expire(key, window)
    
    return current <= limit

def extract_text_from_bytes(content: bytes, mime_type: str) -> str:
    text = ""
    try:
        if mime_type == 'application/pdf':
            if PdfReader:
                reader = PdfReader(io.BytesIO(content))
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            else:
                text = "[PDF extraction unavailable - install pypdf]"
        elif mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            if docx:
                doc = docx.Document(io.BytesIO(content))
                for para in doc.paragraphs:
                    text += para.text + "\n"
            else:
                 text = "[Docx extraction unavailable - install python-docx]"
        else:
            # Assume text/plain
            text = content.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Extraction error: {e}")
        text = f"[Error extracting text: {str(e)}]"
    
    return text

async def process_contract_analysis(job_id: str, project_id: str, input_data: AgentInput):
    """
    Background task to run analysis and update storage.
    """
    try:
        # 1. Update status to running
        if redis:
            update_payload = {"status": "running", "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z")}
            await redis.set(f"{PREFIX}:job:{job_id}", json.dumps(update_payload))
        
        # 2. Resolve Text (Drive vs Direct)
        text_to_analyze = input_data.text
        
        if input_data.driveFileId:
            if not input_data.accessToken:
                 raise ValueError("Drive File ID provided but no access token")
            
            # Check Redis Cache
            cache_key = f"{PREFIX}:cache:drive:file:{input_data.driveFileId}"
            cached_text = None
            if redis:
                cached_text = await redis.get(cache_key)
            
            if cached_text:
                text_to_analyze = cached_text
            else:
                # Fetch metadata to know mime type
                meta = fetch_file_metadata(input_data.driveFileId, input_data.accessToken)
                mime_type = meta.get('mimeType')
                
                # Download content
                content_bytes = download_file_content(input_data.driveFileId, input_data.accessToken)
                
                # Extract text
                text_to_analyze = extract_text_from_bytes(content_bytes, mime_type)
                
                # Cache
                if redis and text_to_analyze:
                    await redis.set(cache_key, text_to_analyze, ex=1800) # 30 mins

        if not text_to_analyze:
             raise ValueError("No text provided or extracted")

        # 3. Run Analysis
        result = await analyze_contract(text_to_analyze, {"questions": input_data.questions})
        
        # 4. Save User Message
        # Sanitize input for storage (don't store large text if redundant, but for now ok)
        stored_input = input_data.model_dump()
        if len(stored_input.get("text", "") or "") > 1000:
             stored_input["text"] = "(truncated)..."
        if stored_input.get("accessToken"):
             stored_input["accessToken"] = "***"

        user_msg = {
            "project_id": project_id,
            "role": "user",
            "content": json.dumps(stored_input),
            "meta": {"jobId": job_id}
        }
        if supabase:
            supabase.table("messages").insert(user_msg).execute()

        # 5. Save Assistant Message (Summary)
        assistant_msg = {
            "project_id": project_id,
            "role": "assistant",
            "content": result.get("summary", "Analysis complete."),
            "meta": {"jobId": job_id, "risk": result.get("overallRisk")}
        }
        if supabase:
            supabase.table("messages").insert(assistant_msg).execute()

        # 6. Update Job Status to Done
        final_job_state = {
            "status": "done",
            "result": result,
            "updated_at": time.time(),
            "project_id": project_id
        }
        
        if redis:
            await redis.set(f"{PREFIX}:job:{job_id}", json.dumps(final_job_state))
        
        if supabase:
            supabase.table("jobs").update({
                "status": "done",
                "result": result,
                "updated_at": "now()"
            }).eq("id", job_id).execute()

    except Exception as e:
        print(f"Job failed: {e}")
        error_state = {
            "status": "error",
            "result": {"error": str(e)},
            "updated_at": time.time()
        }
        if redis:
            await redis.set(f"{PREFIX}:job:{job_id}", json.dumps(error_state))
        if supabase:
             supabase.table("jobs").update({
                "status": "error",
                "result": {"error": str(e)},
                "updated_at": "now()"
            }).eq("id", job_id).execute()

@app.get("/")
async def root():
    return {"message": "Welcome to ContractCoach API"}

@app.get("/health")
async def health_check():
    """Health check endpoint to verify all service connections"""
    health = {
        "status": "healthy",
        "services": {}
    }
    
    # Check Redis
    try:
        if redis:
            await redis.ping()
            health["services"]["redis"] = "connected"
        else:
            health["services"]["redis"] = "not_configured"
    except Exception as e:
        health["services"]["redis"] = f"error: {str(e)}"
        health["status"] = "degraded"
    
    # Check Supabase
    try:
        if supabase:
            # Simple query to test connection
            supabase.table("profiles").select("id").limit(1).execute()
            health["services"]["supabase"] = f"connected (schema: {SUPABASE_SCHEMA})"
        else:
            health["services"]["supabase"] = "not_configured"
    except Exception as e:
        health["services"]["supabase"] = f"error: {str(e)}"
        health["status"] = "degraded"
    
    # Check OpenAI (just verify key exists, don't make a call)
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        health["services"]["openai"] = "configured"
    else:
        health["services"]["openai"] = "not_configured"
        health["status"] = "degraded"
    
    return health

@app.get("/auth/google/url")
async def google_auth_url():
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/google/callback")
    return {"url": get_auth_url(redirect_uri)}

@app.post("/auth/google/exchange")
async def google_auth_exchange(body: ExchangeCodeBody):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/google/callback")
    tokens = exchange_code_for_tokens(body.code, redirect_uri)
    return tokens

@app.post("/agent/run")
async def run_agent(body: RunBody, background_tasks: BackgroundTasks, request: Request):
    try:
        # Rate Limiting (per IP)
        client_ip = "unknown"
        if request.client:
            client_ip = request.client.host
        
        rate_key = f"{PREFIX}:rate:{client_ip}"
        
        # Only check rate limit if redis is available to avoid crashing
        if redis:
            try:
                allowed = await check_rate_limit(rate_key, limit=5, window=60) # 5 reqs / min
                if not allowed:
                    raise HTTPException(status_code=429, detail="Rate limit exceeded")
            except Exception as e:
                print(f"Rate limit check failed: {e}")
                # Proceed if rate limit check fails (fail open) or handle as needed
                pass

        job_id = str(uuid.uuid4())
        
        # Initial Job State
        initial_job = {
            "id": job_id,
            "project_id": body.projectId,
            "kind": "contract_review",
            "status": "queued",
            "payload": body.input.model_dump(exclude={"accessToken"}), # Don't log token
            "created_at": time.time()
        }

        # 1. Cache in Redis
        if redis:
            try:
                await redis.set(f"{PREFIX}:job:{job_id}", json.dumps(initial_job))
            except Exception as e:
                print(f"Redis cache failed: {e}")
                # Continue even if Redis fails, rely on DB

        # 2. Persist in Supabase
        if supabase:
            try:
                db_job = {
                    "id": job_id,
                    "project_id": body.projectId,
                    "kind": "contract_review",
                    "status": "queued",
                    "payload": body.input.model_dump(exclude={"accessToken"}),
                }
                supabase.table("jobs").insert(db_job).execute()
            except Exception as e:
                print(f"Supabase insert failed: {e}")
                # If DB fails, we probably shouldn't continue as user can't retrieve result
                raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

        # 3. Trigger Background Processing
        background_tasks.add_task(process_contract_analysis, job_id, body.projectId, body.input)

        return {"jobId": job_id}
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/jobs/{job_id}")
async def get_job(job_id: str):
    # 1. Try Redis
    if redis:
        cached = await redis.get(f"{PREFIX}:job:{job_id}")
        if cached:
            if isinstance(cached, str):
                return json.loads(cached)
            return cached

    # 2. Fallback to Supabase
    if supabase:
        try:
            response = supabase.table("jobs").select("*").eq("id", job_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        except Exception as e:
            print(f"Supabase select failed: {e}")
    
    raise HTTPException(status_code=404, detail="Job not found")

@app.get("/messages")
async def get_messages(projectId: str = Query(..., alias="projectId")):
    if supabase:
        try:
            response = supabase.table("messages")\
                .select("*")\
                .eq("project_id", projectId)\
                .order("created_at", desc=True)\
                .limit(50)\
                .execute()
            return {"items": response.data}
        except Exception as e:
             raise HTTPException(status_code=500, detail=str(e))
    
    return {"items": []}
