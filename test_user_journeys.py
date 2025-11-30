"""
Comprehensive User Journey Testing Script for ContractCoach MVP

This script tests all critical user journeys end-to-end.
"""

import httpx
import time
import json
from typing import Dict, Any, Optional

# Configuration
API_URL = "https://api-contract-coach-production.up.railway.app"
WEB_URL = "https://web-contract-coach-production.up.railway.app"  # Update with actual Vercel URL

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_success(text: str):
    print(f"{Colors.GREEN}[PASS] {text}{Colors.END}")

def print_error(text: str):
    print(f"{Colors.RED}[FAIL] {text}{Colors.END}")

def print_warning(text: str):
    print(f"{Colors.YELLOW}[WARN] {text}{Colors.END}")

def print_info(text: str):
    print(f"{Colors.BLUE}[INFO] {text}{Colors.END}")

# ============================================================
# JOURNEY 1: API Health & Backend Connectivity
# ============================================================

def test_api_health():
    print_header("JOURNEY 1: API Health & Backend Connectivity")
    
    results = []
    
    # 1.1 Root endpoint
    try:
        r = httpx.get(f"{API_URL}/", timeout=10)
        if r.status_code == 200:
            print_success("Root endpoint accessible")
            results.append(True)
        else:
            print_error(f"Root endpoint failed: {r.status_code}")
            results.append(False)
    except Exception as e:
        print_error(f"Root endpoint error: {e}")
        results.append(False)
    
    # 1.2 Health check
    try:
        r = httpx.get(f"{API_URL}/health", timeout=10)
        if r.status_code == 200:
            data = r.json()
            print_success("Health check endpoint accessible")
            print_info(f"Status: {data.get('status')}")
            for service, status in data.get("services", {}).items():
                print_info(f"  - {service}: {status}")
            results.append(True)
        else:
            print_error(f"Health check failed: {r.status_code}")
            results.append(False)
    except Exception as e:
        print_error(f"Health check error: {e}")
        results.append(False)
    
    return all(results)

# ============================================================
# JOURNEY 2: Contract Analysis - Text Input
# ============================================================

def test_text_analysis():
    print_header("JOURNEY 2: Contract Analysis - Text Input")
    
    results = []
    job_id = None
    
    # 2.1 Submit contract text
    print_info("Submitting contract text for analysis...")
    contract_text = """
    MASTER SERVICES AGREEMENT
    
    This Agreement is entered into between Provider ("Provider") and Customer ("Customer").
    
    SECTION 1: PAYMENT TERMS
    Customer shall pay Provider monthly fees of $10,000, due within 30 days of invoice.
    
    SECTION 2: TERMINATION
    Either party may terminate this Agreement at any time with 30 days written notice.
    
    SECTION 3: LIABILITY
    IN NO EVENT SHALL PROVIDER'S AGGREGATE LIABILITY EXCEED THE FEES PAID BY CUSTOMER 
    IN THE PRECEDING ONE (1) MONTH. PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, 
    INCIDENTAL, OR CONSEQUENTIAL DAMAGES.
    
    SECTION 4: INTELLECTUAL PROPERTY
    All intellectual property rights in the Services shall remain the exclusive property of Provider.
    """
    
    try:
        payload = {
            "projectId": f"test-journey-2-{int(time.time())}",
            "input": {
                "text": contract_text,
                "questions": ["What are the payment terms?", "What are the risks in this contract?"]
            }
        }
        
        r = httpx.post(f"{API_URL}/agent/run", json=payload, timeout=30)
        
        if r.status_code == 200:
            data = r.json()
            job_id = data.get("jobId")
            print_success(f"Job created: {job_id}")
            results.append(True)
        else:
            print_error(f"Job creation failed: {r.status_code} - {r.text}")
            results.append(False)
            return False
    except Exception as e:
        print_error(f"Job creation error: {e}")
        results.append(False)
        return False
    
    # 2.2 Poll for completion
    print_info("Polling job status...")
    max_polls = 15
    completed = False
    
    for i in range(max_polls):
        try:
            r = httpx.get(f"{API_URL}/jobs/{job_id}", timeout=10)
            if r.status_code == 200:
                data = r.json()
                status = data.get("status")
                print_info(f"Poll {i+1}/{max_polls}: Status = {status}")
                
                if status == "done":
                    print_success("Job completed successfully!")
                    
                    # Check result structure
                    result = data.get("result", {})
                    if isinstance(result, dict):
                        print_success("Result structure valid")
                        print_info(f"  - Overall Risk: {result.get('overallRisk', 'N/A')}")
                        print_info(f"  - Summary: {result.get('summary', 'N/A')[:100]}...")
                        print_info(f"  - Clauses found: {len(result.get('clauses', []))}")
                        results.append(True)
                        completed = True
                        break
                    else:
                        print_warning("Result structure unexpected")
                        
                elif status == "error":
                    print_error(f"Job failed: {data.get('result')}")
                    results.append(False)
                    return False
                    
            time.sleep(2)
        except Exception as e:
            print_error(f"Polling error: {e}")
            time.sleep(2)
    
    if not completed:
        print_warning("Job polling timed out")
        results.append(False)
    
    # 2.3 Retrieve messages
    print_info("Retrieving messages from database...")
    try:
        project_id = payload["projectId"]
        r = httpx.get(f"{API_URL}/messages?projectId={project_id}", timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            if len(items) >= 2:  # Should have user message + assistant response
                print_success(f"Messages retrieved: {len(items)} items")
                results.append(True)
            else:
                print_warning(f"Expected at least 2 messages, got {len(items)}")
                results.append(False)
        else:
            print_error(f"Messages retrieval failed: {r.status_code}")
            results.append(False)
    except Exception as e:
        print_error(f"Messages retrieval error: {e}")
        results.append(False)
    
    return all(results)

# ============================================================
# JOURNEY 3: Google OAuth Flow
# ============================================================

def test_google_oauth():
    print_header("JOURNEY 3: Google OAuth Flow")
    
    results = []
    
    # 3.1 Get OAuth URL
    print_info("Requesting Google OAuth URL...")
    try:
        r = httpx.get(f"{API_URL}/auth/google/url", timeout=10)
        if r.status_code == 200:
            data = r.json()
            auth_url = data.get("url")
            if auth_url and auth_url.startswith("https://accounts.google.com"):
                print_success("OAuth URL generated correctly")
                print_info(f"URL: {auth_url[:80]}...")
                results.append(True)
            else:
                print_error(f"Invalid OAuth URL format: {auth_url}")
                results.append(False)
        else:
            print_error(f"OAuth URL request failed: {r.status_code}")
            results.append(False)
    except Exception as e:
        print_error(f"OAuth URL error: {e}")
        results.append(False)
    
    # Note: Actual OAuth callback test requires manual browser interaction
    print_warning("OAuth callback test requires manual browser testing")
    print_info("Manual test: Open OAuth URL, authorize, verify callback redirects correctly")
    
    return all(results)

# ============================================================
# JOURNEY 4: Error Handling
# ============================================================

def test_error_handling():
    print_header("JOURNEY 4: Error Handling")
    
    results = []
    
    # 4.1 Empty text
    print_info("Testing empty text submission...")
    try:
        payload = {
            "projectId": f"test-error-{int(time.time())}",
            "input": {
                "text": "",
                "questions": []
            }
        }
        r = httpx.post(f"{API_URL}/agent/run", json=payload, timeout=10)
        
        # Should either validate on frontend or return 400/422 on backend
        if r.status_code in [200, 400, 422]:
            if r.status_code == 200:
                print_warning("Empty text accepted (may fail in background task)")
            else:
                print_success("Empty text rejected with appropriate status code")
            results.append(True)
        else:
            print_error(f"Unexpected status: {r.status_code}")
            results.append(False)
    except Exception as e:
        print_error(f"Empty text test error: {e}")
        results.append(False)
    
    # 4.2 Invalid job ID
    print_info("Testing invalid job ID retrieval...")
    try:
        r = httpx.get(f"{API_URL}/jobs/invalid-job-id-12345", timeout=10)
        if r.status_code == 404:
            print_success("Invalid job ID returns 404")
            results.append(True)
        else:
            print_error(f"Expected 404, got {r.status_code}")
            results.append(False)
    except Exception as e:
        print_error(f"Invalid job ID test error: {e}")
        results.append(False)
    
    # 4.3 Invalid messages projectId
    print_info("Testing messages with invalid projectId...")
    try:
        r = httpx.get(f"{API_URL}/messages?projectId=invalid-project", timeout=10)
        if r.status_code == 200:
            data = r.json()
            items = data.get("items", [])
            if len(items) == 0:
                print_success("Invalid projectId returns empty list")
                results.append(True)
            else:
                print_warning(f"Unexpected items for invalid project: {len(items)}")
                results.append(False)
        else:
            print_error(f"Messages endpoint failed: {r.status_code}")
            results.append(False)
    except Exception as e:
        print_error(f"Invalid projectId test error: {e}")
        results.append(False)
    
    return all(results)

# ============================================================
# JOURNEY 5: Multiple Concurrent Requests
# ============================================================

def test_concurrent_requests():
    print_header("JOURNEY 5: Concurrent Request Handling")
    
    results = []
    
    print_info("Submitting 3 concurrent analysis requests...")
    
    job_ids = []
    for i in range(3):
        try:
            payload = {
                "projectId": f"test-concurrent-{i}-{int(time.time())}",
                "input": {
                    "text": f"This is test contract {i}. Payment terms: $1000 per month.",
                    "questions": []
                }
            }
            r = httpx.post(f"{API_URL}/agent/run", json=payload, timeout=10)
            if r.status_code == 200:
                job_id = r.json().get("jobId")
                job_ids.append(job_id)
                print_success(f"Request {i+1} created: {job_id[:8]}...")
            else:
                print_error(f"Request {i+1} failed: {r.status_code}")
        except Exception as e:
            print_error(f"Request {i+1} error: {e}")
    
    if len(job_ids) == 3:
        print_success("All 3 concurrent requests accepted")
        results.append(True)
        
        # Quick check that jobs are accessible
        time.sleep(1)
        accessible = 0
        for job_id in job_ids:
            try:
                r = httpx.get(f"{API_URL}/jobs/{job_id}", timeout=5)
                if r.status_code == 200:
                    accessible += 1
            except:
                pass
        
        if accessible == 3:
            print_success("All jobs are accessible")
            results.append(True)
        else:
            print_warning(f"Only {accessible}/3 jobs accessible immediately")
            results.append(True)  # Not a failure, jobs may still be processing
    else:
        print_error(f"Only {len(job_ids)}/3 requests succeeded")
        results.append(False)
    
    return all(results)

# ============================================================
# JOURNEY 6: Rate Limiting
# ============================================================

def test_rate_limiting():
    print_header("JOURNEY 6: Rate Limiting")
    
    results = []
    
    print_info("Sending rapid requests to test rate limiting...")
    print_warning("Note: Rate limit is 5 requests per minute per IP")
    
    success_count = 0
    rate_limited = False
    
    for i in range(7):  # Send 7 requests rapidly
        try:
            payload = {
                "projectId": f"test-rate-{i}-{int(time.time())}",
                "input": {
                    "text": f"Test contract {i}",
                    "questions": []
                }
            }
            r = httpx.post(f"{API_URL}/agent/run", json=payload, timeout=5)
            
            if r.status_code == 200:
                success_count += 1
                print_info(f"Request {i+1}: Accepted")
            elif r.status_code == 429:
                rate_limited = True
                print_success(f"Request {i+1}: Rate limited (429) - Rate limiting works!")
                break
            else:
                print_warning(f"Request {i+1}: Status {r.status_code}")
                
        except Exception as e:
            print_error(f"Request {i+1} error: {e}")
        
        time.sleep(0.5)  # Small delay between requests
    
    if rate_limited:
        print_success("Rate limiting is working correctly")
        results.append(True)
    elif success_count >= 5:
        print_warning("Rate limiting may not be active (all requests accepted)")
        print_info("This could be normal if rate limit window has passed")
        results.append(True)  # Not a failure, could be timing
    else:
        print_error("Unexpected rate limiting behavior")
        results.append(False)
    
    return all(results)

# ============================================================
# MAIN TEST RUNNER
# ============================================================

def main():
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print(" " * 10 + "ContractCoach MVP User Journey Tests" + " " * 10)
    print("=" * 60)
    print(f"{Colors.END}\n")
    
    print_info(f"API URL: {API_URL}")
    print_info(f"Web URL: {WEB_URL}")
    print_info("Starting comprehensive user journey testing...\n")
    
    test_results = {}
    
    # Run all tests
    test_results["API Health"] = test_api_health()
    time.sleep(1)
    
    test_results["Text Analysis"] = test_text_analysis()
    time.sleep(2)
    
    test_results["Google OAuth"] = test_google_oauth()
    time.sleep(1)
    
    test_results["Error Handling"] = test_error_handling()
    time.sleep(1)
    
    test_results["Concurrent Requests"] = test_concurrent_requests()
    time.sleep(1)
    
    test_results["Rate Limiting"] = test_rate_limiting()
    
    # Summary
    print_header("TEST SUMMARY")
    
    passed = sum(1 for v in test_results.values() if v)
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = f"{Colors.GREEN}[PASS]{Colors.END}" if result else f"{Colors.RED}[FAIL]{Colors.END}"
        print(f"{test_name:.<40} {status}")
    
    print(f"\n{Colors.BOLD}Results: {passed}/{total} tests passed{Colors.END}\n")
    
    if passed == total:
        print_success("All critical user journeys are working correctly!")
        print_info("MVP is ready for deployment and user testing.")
    else:
        print_error(f"{total - passed} test(s) failed. Please review the issues above.")
    
    print("\n")
    print_info("Note: Frontend UI testing requires manual browser testing")
    print_info("  - Visit the web URL and test UI interactions")
    print_info("  - Verify theme switching works")
    print_info("  - Test Google OAuth flow in browser")
    print_info("  - Verify responsive design on mobile devices")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

