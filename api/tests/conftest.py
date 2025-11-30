import pytest
from fastapi.testclient import TestClient
from api.main import app, supabase, redis
from unittest.mock import MagicMock
import os

@pytest.fixture
def client():
    # Override deps if needed
    return TestClient(app)

@pytest.fixture(autouse=True)
def mock_external_services(monkeypatch):
    """
    Mock Supabase, Redis, and OpenAI by default to avoid external calls.
    """
    # Mock Redis
    mock_redis = MagicMock()
    mock_redis.get.return_value = None
    mock_redis.set.return_value = True
    mock_redis.incr.return_value = 1
    monkeypatch.setattr("api.main.redis", mock_redis)

    # Mock Supabase
    mock_supabase = MagicMock()
    mock_table = MagicMock()
    mock_table.insert.return_value.execute.return_value = None
    mock_table.update.return_value.eq.return_value.execute.return_value = None
    mock_table.select.return_value.eq.return_value.execute.return_value = MagicMock(data=[])
    mock_supabase.table.return_value = mock_table
    monkeypatch.setattr("api.main.supabase", mock_supabase)

    # Mock OpenAI Adapter
    async def mock_analyze(*args, **kwargs):
        return {
            "overallRisk": "medium",
            "summary": "Mocked summary",
            "clauses": []
        }
    monkeypatch.setattr("api.main.analyze_contract", mock_analyze)
    
    # Mock Google Auth
    monkeypatch.setattr("api.main.get_auth_url", lambda x: "http://mock-auth-url")
    monkeypatch.setattr("api.main.exchange_code_for_tokens", lambda x, y: {"access_token": "mock"})

