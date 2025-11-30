def test_health_check(client):
    # Not an explicit health endpoint, but we can check 404 on root
    response = client.get("/")
    assert response.status_code == 404

def test_jobs_endpoint_contract(client):
    """
    Ensure /jobs/{id} returns 404 for unknown job (since we mock empty DB).
    """
    response = client.get("/jobs/non-existent-id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Job not found"}

def test_messages_endpoint_contract(client):
    """
    Ensure /messages returns expected list shape.
    """
    response = client.get("/messages?projectId=test-proj")
    assert response.status_code == 200
    assert "items" in response.json()
    assert isinstance(response.json()["items"], list)

