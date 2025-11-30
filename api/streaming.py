# Created automatically by Cursor AI (2025-11-30)
# Server-Sent Events (SSE) utilities for real-time streaming

import json
from typing import Any, Dict, AsyncGenerator

def format_sse_event(event_type: str, data: Dict[str, Any]) -> str:
    """
    Format data as a Server-Sent Event string.
    
    SSE format:
    event: <type>
    data: <json>
    
    """
    json_data = json.dumps(data)
    return f"event: {event_type}\ndata: {json_data}\n\n"


def format_sse_message(data: Dict[str, Any]) -> str:
    """
    Format a simple message event.
    """
    return format_sse_event("message", data)


def format_sse_error(error: str) -> str:
    """
    Format an error event.
    """
    return format_sse_event("error", {"error": error})


def format_sse_done() -> str:
    """
    Format a done/complete event.
    """
    return format_sse_event("done", {"status": "complete"})


class StreamingEventTypes:
    """Event type constants for streaming analysis."""
    STATUS = "status"
    CLAUSE = "clause"
    PROGRESS = "progress"
    SUMMARY = "summary"
    COMPLETE = "complete"
    ERROR = "error"

