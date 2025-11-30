

import { useState } from "react";

type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};

type AgentResult = {
  overallRisk?: string;
  clauses?: any[];
  summary?: string;
  meta?: any;
};

export function useAgent(projectId: string) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AgentResult | null>(null);

  async function run(input: any) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, input }),
      });

      if (!res.ok) {
        throw new Error(`Run failed with status ${res.status}`);
      }

      const { jobId } = await res.json();

      let result: AgentResult | null = null;
      for (let i = 0; i < 40; i++) {
        const jr = await fetch(`/api/jobs/${jobId}`);
        if (!jr.ok) {
          throw new Error(`Job poll failed with status ${jr.status}`);
        }
        const data = await jr.json();

        if (data.status === "done") {
          result = data.result;
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      if (!result) {
        throw new Error("Job did not complete in time");
      }

      setLastResult(result);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: JSON.stringify(input) },
        { role: "assistant", content: result.summary ?? "Analysis complete." },
      ]);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return { messages, run, loading, error, lastResult };
}
