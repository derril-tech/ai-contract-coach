import httpx
import os
import sys
import json
import time

# Define the API URL - prioritizing the live URL if available
API_URL = "https://api-contract-coach-production.up.railway.app"

def test_root():
    print(f"Testing GET {API_URL}/ ...")
    try:
        r = httpx.get(f"{API_URL}/", timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
        if r.status_code == 200:
            print("[OK] Root endpoint OK")
        else:
            print("[FAIL] Root endpoint failed")
    except Exception as e:
        print(f"[FAIL] Connection failed: {e}")

def test_google_auth_url():
    print(f"\nTesting GET {API_URL}/auth/google/url ...")
    try:
        r = httpx.get(f"{API_URL}/auth/google/url", timeout=10)
        print(f"Status: {r.status_code}")
        if r.status_code == 200 and "url" in r.json():
            print("[OK] Auth URL endpoint OK")
        else:
            print(f"[FAIL] Auth URL endpoint failed: {r.text}")
    except Exception as e:
        print(f"[FAIL] Connection failed: {e}")

def test_health_check():
    print(f"\nTesting GET {API_URL}/health ...")
    try:
        r = httpx.get(f"{API_URL}/health", timeout=10)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"Overall Status: {data.get('status')}")
            print("Service Status:")
            for service, status in data.get("services", {}).items():
                print(f"  - {service}: {status}")
            print("[OK] Health check passed")
        else:
            print(f"[FAIL] Health check failed: {r.text}")
    except Exception as e:
        print(f"[FAIL] Connection failed: {e}")

def test_agent_run_text():
    print(f"\nTesting POST {API_URL}/agent/run (Text Only)...")
    payload = {
        "projectId": "test-script-verify",
        "input": {
            "text": "This is a test contract clause. The Provider shall be liable for all damages.",
            "questions": ["Is this risky?"]
        }
    }
    
    try:
        r = httpx.post(f"{API_URL}/agent/run", json=payload, timeout=30)
        print(f"Status: {r.status_code}")
        print(f"Response Headers: {dict(r.headers)}")
        
        if r.status_code == 200:
            data = r.json()
            job_id = data.get("jobId")
            print(f"[OK] Job created: {job_id}")
            return job_id
        else:
            print(f"[FAIL] Agent run failed")
            print(f"Response Body: {r.text}")
            # Try to parse as JSON for better error message
            try:
                error_data = r.json()
                print(f"Error Detail: {error_data.get('detail', 'No detail provided')}")
            except:
                pass
            return None
    except Exception as e:
        print(f"[FAIL] Connection failed: {e}")
        import traceback
        traceback.print_exc()
        return None

def poll_job(job_id):
    if not job_id:
        return
        
    print(f"\nPolling Job {job_id}...")
    for i in range(10):
        try:
            r = httpx.get(f"{API_URL}/jobs/{job_id}", timeout=10)
            if r.status_code != 200:
                print(f"[WARN] Poll failed: {r.status_code}")
                time.sleep(2)
                continue
                
            data = r.json()
            status = data.get("status")
            print(f"Poll {i+1}: Status = {status}")
            
            if status == "done":
                print("[OK] Job completed successfully!")
                print("Result snippet:", str(data.get("result"))[:100] + "...")
                return
            elif status == "error":
                print(f"[FAIL] Job failed with error: {data.get('result')}")
                return
                
            time.sleep(2)
        except Exception as e:
            print(f"[FAIL] Polling error: {e}")
            time.sleep(2)
            
    print("[WARN] Job polling timed out (it might still be running)")

def test_messages():
    print(f"\nTesting GET {API_URL}/messages?projectId=test-script-verify ...")
    try:
        r = httpx.get(f"{API_URL}/messages?projectId=test-script-verify", timeout=10)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            items = r.json().get("items", [])
            print(f"[OK] Messages retrieved: {len(items)} items")
        else:
            print(f"[FAIL] Messages endpoint failed: {r.text}")
    except Exception as e:
        print(f"[FAIL] Connection failed: {e}")

if __name__ == "__main__":
    print("[INFO] Starting Production API Verification...")
    print("-" * 40)
    
    test_root()
    test_google_auth_url()
    test_health_check()
    
    # IMPORTANT: This test sends data to OpenAI and DB. 
    # Use sparingly or comment out if not needed.
    job_id = test_agent_run_text()
    poll_job(job_id)
    
    if job_id:
        # Only check messages if we actually ran a job (to ensure there's something to find)
        # Wait a bit for async DB write
        time.sleep(2) 
        test_messages()
        
    print("-" * 40)
    print("Verification Complete.")

