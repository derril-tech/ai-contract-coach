// Created automatically by Cursor AI (2025-11-30)
// Feature #11: Batch Contract Analysis

"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers,
  Upload,
  FileText,
  Play,
  Pause,
  X,
  Check,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";

interface QueuedContract {
  id: string;
  name: string;
  content: string;
  status: "queued" | "processing" | "done" | "error";
  result?: {
    risk: "low" | "medium" | "high";
    clauseCount: number;
    summary?: string;
  };
  error?: string;
}

interface BatchAnalysisProps {
  onAnalyze: (text: string) => Promise<{
    risk: "low" | "medium" | "high";
    clauseCount: number;
    summary: string;
  }>;
  className?: string;
}

export function BatchAnalysis({ onAnalyze, className }: BatchAnalysisProps) {
  const [queue, setQueue] = useState<QueuedContract[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const completedCount = queue.filter(q => q.status === "done").length;
  const errorCount = queue.filter(q => q.status === "error").length;
  const progress = queue.length > 0 ? (completedCount / queue.length) * 100 : 0;

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setQueue(prev => [
          ...prev,
          {
            id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content,
            status: "queued",
          },
        ]);
      };
      reader.readAsText(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setIsProcessing(false);
    setIsPaused(false);
    abortRef.current = false;
  }, []);

  const processQueue = useCallback(async () => {
    setIsProcessing(true);
    setIsPaused(false);
    abortRef.current = false;

    for (let i = 0; i < queue.length; i++) {
      if (abortRef.current) break;
      
      const contract = queue[i];
      if (contract.status !== "queued") continue;

      // Wait if paused
      while (isPaused && !abortRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (abortRef.current) break;

      // Update status to processing
      setQueue(prev => prev.map(q => 
        q.id === contract.id ? { ...q, status: "processing" } : q
      ));

      try {
        // Simulate analysis (in real app, call the API)
        const result = await mockAnalysis(contract.content);
        
        setQueue(prev => prev.map(q => 
          q.id === contract.id ? { ...q, status: "done", result } : q
        ));
      } catch (err: any) {
        setQueue(prev => prev.map(q => 
          q.id === contract.id ? { ...q, status: "error", error: err.message } : q
        ));
      }

      // Small delay between contracts
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
  }, [queue, isPaused]);

  // Mock analysis function - replace with actual API call
  async function mockAnalysis(content: string): Promise<{
    risk: "low" | "medium" | "high";
    clauseCount: number;
    summary: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const risks: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
    return {
      risk: risks[Math.floor(Math.random() * risks.length)],
      clauseCount: Math.floor(Math.random() * 10) + 3,
      summary: "Contract analyzed successfully with AI-powered clause detection.",
    };
  }

  const pauseProcessing = () => {
    setIsPaused(true);
  };

  const resumeProcessing = () => {
    setIsPaused(false);
  };

  const stopProcessing = () => {
    abortRef.current = true;
    setIsProcessing(false);
    setIsPaused(false);
  };

  const statusColors = {
    queued: "bg-gray-500/10 text-gray-500",
    processing: "bg-blue-500/10 text-blue-500",
    done: "bg-emerald-500/10 text-emerald-500",
    error: "bg-red-500/10 text-red-500",
  };

  const riskColors = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    high: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  return (
    <Card className={cn("border-border-subtle/80 bg-bg-elevated shadow-sm", className)}>
      <CardHeader className="pb-3 border-b border-border-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Batch Analysis</CardTitle>
            {queue.length > 0 && (
              <Badge variant="outline" className="text-[11px]">
                {queue.length} contracts
              </Badge>
            )}
          </div>
          {queue.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQueue}
              className="text-xs text-text-muted hover:text-red-500"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            "hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
            "border-border-subtle"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="h-8 w-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">
            Click to upload contracts
          </p>
          <p className="text-xs text-text-muted/60 mt-1">
            Supports .txt, .doc, .docx, .pdf
          </p>
        </div>

        {/* Progress Bar */}
        {queue.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">
                {completedCount} of {queue.length} completed
              </span>
              <span className="text-text-muted">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Controls */}
        {queue.length > 0 && (
          <div className="flex items-center gap-2">
            {!isProcessing ? (
              <Button
                size="sm"
                onClick={processQueue}
                disabled={queue.every(q => q.status !== "queued")}
                className="flex-1"
              >
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Start Analysis
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resumeProcessing}
                    className="flex-1"
                  >
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Resume
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={pauseProcessing}
                    className="flex-1"
                  >
                    <Pause className="h-3.5 w-3.5 mr-1.5" />
                    Pause
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopProcessing}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        )}

        {/* Queue List */}
        {queue.length > 0 && (
          <ScrollArea className="h-[250px]">
            <div className="space-y-2">
              {queue.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    "border-border-subtle/50 bg-bg-subtle/20"
                  )}
                >
                  {/* Status Icon */}
                  <div className="shrink-0">
                    {contract.status === "queued" && (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    {contract.status === "processing" && (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    )}
                    {contract.status === "done" && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                    {contract.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>

                  {/* Contract Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <span className="text-xs font-medium text-text-primary truncate">
                        {contract.name}
                      </span>
                    </div>
                    {contract.result && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={cn("text-[9px]", riskColors[contract.result.risk])}
                        >
                          {contract.result.risk.toUpperCase()}
                        </Badge>
                        <span className="text-[11px] text-text-muted">
                          {contract.result.clauseCount} clauses
                        </span>
                      </div>
                    )}
                    {contract.error && (
                      <p className="text-[11px] text-red-500 mt-1">{contract.error}</p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <Badge className={cn("text-[9px] capitalize shrink-0", statusColors[contract.status])}>
                    {contract.status}
                  </Badge>

                  {/* Remove Button (only for queued) */}
                  {contract.status === "queued" && (
                    <button
                      onClick={() => removeFromQueue(contract.id)}
                      className="p-1 rounded hover:bg-bg-subtle text-text-muted hover:text-red-500 shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Stats */}
        {queue.length > 0 && (completedCount > 0 || errorCount > 0) && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle/30">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-500">{completedCount}</div>
              <div className="text-[9px] text-text-muted">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">{errorCount}</div>
              <div className="text-[9px] text-text-muted">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-muted">
                {queue.filter(q => q.status === "queued").length}
              </div>
              <div className="text-[9px] text-text-muted">Pending</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick batch upload button
export function BatchUploadButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="text-xs">
      <Layers className="h-3.5 w-3.5 mr-1.5" />
      Batch Mode
    </Button>
  );
}

