// Created automatically by Cursor AI (2025-11-30)
// Animated progress indicator for streaming contract analysis

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, FileText, Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface AnalysisProgressProps {
  status: "idle" | "starting" | "analyzing" | "streaming" | "parsing" | "complete" | "error";
  message: string;
  progress: {
    current: number;
    total: number;
  };
  className?: string;
}

const statusConfig = {
  idle: { icon: FileText, color: "text-text-muted", bg: "bg-bg-subtle" },
  starting: { icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
  analyzing: { icon: Brain, color: "text-primary", bg: "bg-primary/10" },
  streaming: { icon: Sparkles, color: "text-accent", bg: "bg-accent/10" },
  parsing: { icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
  complete: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  error: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export function AnalysisProgress({ status, message, progress, className }: AnalysisProgressProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isAnimating = ["starting", "analyzing", "streaming", "parsing"].includes(status);
  const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "rounded-lg p-4 border transition-colors",
          config.bg,
          status === "error" ? "border-red-500/20" : "border-border-subtle/50",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={isAnimating ? { rotate: status === "streaming" ? [0, 360] : 0 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Icon 
              className={cn(
                "h-5 w-5",
                config.color,
                isAnimating && status !== "streaming" && "animate-spin"
              )} 
            />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.p 
              className={cn("text-sm font-medium", config.color)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message || getDefaultMessage(status)}
            </motion.p>
            
            {/* Progress bar */}
            {progress.total > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-[11px] text-text-muted mb-1">
                  <span>Clause {progress.current} of {progress.total}</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-1.5 bg-bg-subtle rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Animated dots for loading states */}
          {isAnimating && (
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getDefaultMessage(status: string): string {
  switch (status) {
    case "idle": return "Ready to analyze";
    case "starting": return "Connecting...";
    case "analyzing": return "Analyzing contract...";
    case "streaming": return "Streaming results...";
    case "parsing": return "Processing results...";
    case "complete": return "Analysis complete!";
    case "error": return "Analysis failed";
    default: return "";
  }
}

