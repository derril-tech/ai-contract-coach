// Created automatically by Cursor AI (2025-11-30)
// Real-time streaming hook for contract analysis using Server-Sent Events

import { useState, useCallback, useRef } from "react";

// Types
export interface Clause {
  id: string;
  type: string;
  title: string;
  risk: "low" | "medium" | "high";
  originalText: string;
  summary: string;
  whyItMatters: string;
  suggestedEdit?: string;
}

export interface StreamingState {
  status: "idle" | "starting" | "analyzing" | "streaming" | "parsing" | "complete" | "error";
  message: string;
  progress: {
    current: number;
    total: number;
  };
}

export interface StreamingResult {
  jobId: string | null;
  clauses: Clause[];
  summary: string | null;
  overallRisk: "low" | "medium" | "high" | null;
}

export interface UseAgentStreamOptions {
  onClause?: (clause: Clause) => void;
  onProgress?: (current: number, total: number) => void;
  onComplete?: (result: StreamingResult) => void;
  onError?: (error: string) => void;
}

export function useAgentStream(projectId: string, options?: UseAgentStreamOptions) {
  const [streamingState, setStreamingState] = useState<StreamingState>({
    status: "idle",
    message: "",
    progress: { current: 0, total: 0 },
  });
  
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [overallRisk, setOverallRisk] = useState<"low" | "medium" | "high" | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setClauses([]);
    setSummary(null);
    setOverallRisk(null);
    setJobId(null);
    setError(null);
    setStreamingState({
      status: "idle",
      message: "",
      progress: { current: 0, total: 0 },
    });
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreamingState(prev => ({
      ...prev,
      status: "idle",
      message: "Analysis cancelled",
    }));
  }, []);

  const runStream = useCallback(async (input: {
    text?: string;
    driveFileId?: string;
    accessToken?: string;
    questions?: string[];
  }) => {
    // Reset state
    reset();
    
    // Create abort controller
    abortControllerRef.current = new AbortController();
    
    setStreamingState({
      status: "starting",
      message: "Connecting to analysis service...",
      progress: { current: 0, total: 0 },
    });

    try {
      const response = await fetch("/api/agent/run/stream", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({ projectId, input }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Parse SSE events from buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        let currentEventType = "";
        let currentEventData = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            currentEventData = line.slice(6).trim();
            
            // Process the event
            if (currentEventType && currentEventData) {
              try {
                const data = JSON.parse(currentEventData);
                handleEvent(currentEventType, data);
              } catch (e) {
                console.error("Failed to parse SSE data:", currentEventData);
              }
            }
            
            currentEventType = "";
            currentEventData = "";
          }
        }
      }

      // Final state update
      setStreamingState(prev => ({
        ...prev,
        status: "complete",
        message: "Analysis complete!",
      }));

    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user");
        return;
      }
      
      const errorMessage = err?.message || "Unknown error occurred";
      setError(errorMessage);
      setStreamingState({
        status: "error",
        message: errorMessage,
        progress: { current: 0, total: 0 },
      });
      options?.onError?.(errorMessage);
    }
  }, [projectId, options, reset]);

  const handleEvent = useCallback((eventType: string, data: any) => {
    switch (eventType) {
      case "job":
        setJobId(data.jobId);
        break;
        
      case "status":
        setStreamingState(prev => ({
          ...prev,
          status: data.status as StreamingState["status"],
          message: data.message || "",
        }));
        break;
        
      case "progress":
        setStreamingState(prev => ({
          ...prev,
          progress: {
            current: data.current,
            total: data.total,
          },
          message: data.message || `Analyzing clause ${data.current} of ${data.total}...`,
        }));
        options?.onProgress?.(data.current, data.total);
        break;
        
      case "clause":
        const newClause: Clause = {
          id: data.id,
          type: data.type,
          title: data.title,
          risk: data.risk,
          originalText: data.originalText,
          summary: data.summary,
          whyItMatters: data.whyItMatters,
          suggestedEdit: data.suggestedEdit,
        };
        setClauses(prev => [...prev, newClause]);
        options?.onClause?.(newClause);
        break;
        
      case "summary":
        setSummary(data.summary);
        setOverallRisk(data.overallRisk);
        break;
        
      case "complete":
        setStreamingState(prev => ({
          ...prev,
          status: "complete",
          message: "Analysis complete!",
        }));
        break;
        
      case "error":
        setError(data.error);
        setStreamingState({
          status: "error",
          message: data.error,
          progress: { current: 0, total: 0 },
        });
        options?.onError?.(data.error);
        break;
        
      default:
        console.log("Unknown event type:", eventType, data);
    }
  }, [options]);

  return {
    // State
    streamingState,
    clauses,
    summary,
    overallRisk,
    jobId,
    error,
    
    // Derived
    isStreaming: ["starting", "analyzing", "streaming", "parsing"].includes(streamingState.status),
    isComplete: streamingState.status === "complete",
    hasError: streamingState.status === "error",
    
    // Actions
    runStream,
    abort,
    reset,
  };
}

