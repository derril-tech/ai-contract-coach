// Created automatically by Cursor AI (2025-11-30)
// Full-screen analysis overlay for mobile devices

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileAnalysisOverlayProps {
  isVisible: boolean;
  status: "idle" | "starting" | "analyzing" | "streaming" | "parsing" | "complete" | "done" | "error";
  message: string;
  progress: number;
  clauseCount: number;
  onClose: () => void;
  onViewResults: () => void;
}

export function MobileAnalysisOverlay({
  isVisible,
  status,
  message,
  progress,
  clauseCount,
  onClose,
  onViewResults,
}: MobileAnalysisOverlayProps) {
  const isActive = status !== "idle" && status !== "done" && status !== "complete" && status !== "error";
  const isDone = status === "done" || status === "complete";
  const isError = status === "error";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-bg-page/95 backdrop-blur-lg md:hidden flex flex-col items-center justify-center p-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-bg-elevated/80 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Main content */}
          <div className="w-full max-w-sm space-y-8 text-center">
            {/* Animated icon */}
            <div className="relative">
              <motion.div
                animate={isActive ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                } : {}}
                transition={{
                  scale: { duration: 1.5, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                }}
                className={cn(
                  "mx-auto h-24 w-24 rounded-full flex items-center justify-center",
                  isActive && "bg-primary/10",
                  isDone && "bg-emerald-500/10",
                  isError && "bg-red-500/10"
                )}
              >
                {isActive && <Sparkles className="h-12 w-12 text-primary" />}
                {isDone && <CheckCircle className="h-12 w-12 text-emerald-500" />}
                {isError && <AlertCircle className="h-12 w-12 text-red-500" />}
              </motion.div>

              {/* Pulse rings */}
              {isActive && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 mx-auto h-24 w-24 rounded-full border-2 border-primary/30"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-0 mx-auto h-24 w-24 rounded-full border-2 border-primary/30"
                  />
                </>
              )}
            </div>

            {/* Status text */}
            <div className="space-y-2">
              <h2 className={cn(
                "text-xl font-semibold",
                isActive && "text-text-primary",
                isDone && "text-emerald-500",
                isError && "text-red-500"
              )}>
                {isDone ? "Analysis Complete!" : isError ? "Analysis Failed" : "Analyzing Contract"}
              </h2>
              <p className="text-sm text-text-muted">
                {message}
              </p>
            </div>

            {/* Progress bar */}
            {isActive && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-bg-subtle rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <p className="text-xs text-text-muted">
                  {clauseCount} clause{clauseCount !== 1 ? "s" : ""} found
                </p>
              </div>
            )}

            {/* Clause counter animation */}
            {isActive && clauseCount > 0 && (
              <motion.div
                key={clauseCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <span className="text-4xl font-bold text-primary">{clauseCount}</span>
                <span className="text-sm text-text-muted">clauses analyzed</span>
              </motion.div>
            )}

            {/* Actions */}
            {isDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={onViewResults}
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                >
                  View Results
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {isError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

