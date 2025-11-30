// Created automatically by Cursor AI (2025-11-30)
// Feature #6: Smart Negotiation Tips - AI-powered negotiation suggestions

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Sparkles,
  Shield,
  FileEdit,
  Trash2,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Clause } from "@/hooks/useAgentStream";

export interface NegotiationTip {
  id: string;
  category: "soften" | "protect" | "counter" | "remove";
  title: string;
  originalText: string;
  suggestedText: string;
  strategy: string;
  confidence: number;
}

interface NegotiationTipsProps {
  clause: Clause | null;
  className?: string;
}

const categoryConfig = {
  soften: {
    icon: MessageSquare,
    label: "Soften Language",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  protect: {
    icon: Shield,
    label: "Add Protection",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  counter: {
    icon: FileEdit,
    label: "Counter Offer",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  remove: {
    icon: Trash2,
    label: "Remove Clause",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
};

export function NegotiationTips({ clause, className }: NegotiationTipsProps) {
  const [tips, setTips] = useState<NegotiationTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateTips = useCallback(async () => {
    if (!clause) return;

    setIsLoading(true);
    setError(null);
    setTips([]);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
      const response = await fetch(`${API_URL}/negotiate/tips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clauseText: clause.originalText,
          clauseType: clause.type,
          riskLevel: clause.risk,
          clauseTitle: clause.title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate tips");
      }

      const data = await response.json();
      setTips(data.tips || []);
    } catch (err: any) {
      setError(err.message || "Failed to generate tips");
    } finally {
      setIsLoading(false);
    }
  }, [clause]);

  const copyToClipboard = useCallback(async (text: string, tipId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(tipId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  if (!clause) {
    return (
      <Card className={cn("border-border-subtle/80 bg-bg-elevated shadow-sm", className)}>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Lightbulb className="h-10 w-10 text-text-muted/20 mb-3" />
          <p className="text-sm text-text-muted">Select a clause</p>
          <p className="text-xs text-text-muted/60 mt-1">
            to get AI-powered negotiation tips
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border-subtle/80 bg-bg-elevated shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border-subtle/50">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          <CardTitle className="text-sm font-semibold">Smart Negotiation Tips</CardTitle>
        </div>
        <Button
          size="sm"
          onClick={generateTips}
          disabled={isLoading}
          className={cn(
            "h-7 px-3 text-xs transition-all",
            tips.length > 0 
              ? "bg-bg-subtle hover:bg-bg-subtle/80 text-text-secondary" 
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : tips.length > 0 ? (
            <>
              <RefreshCw className="mr-1.5 h-3 w-3" />
              Refresh
            </>
          ) : (
            <>
              <Sparkles className="mr-1.5 h-3 w-3" />
              Generate Tips
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px]">
          <div className="p-3 space-y-3">
            {/* Loading state */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border-subtle/50 bg-bg-subtle/30 p-4 animate-pulse"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-5 w-5 rounded bg-bg-subtle" />
                        <div className="h-4 w-24 rounded bg-bg-subtle" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-bg-subtle" />
                        <div className="h-3 w-3/4 rounded bg-bg-subtle" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error state */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center"
              >
                <p className="text-xs text-red-600">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateTips}
                  className="mt-2 h-7 text-xs"
                >
                  Try Again
                </Button>
              </motion.div>
            )}

            {/* Tips list */}
            {!isLoading && tips.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {tips.map((tip, index) => {
                  const config = categoryConfig[tip.category] || categoryConfig.counter;
                  const Icon = config.icon;
                  const isExpanded = expandedTip === tip.id;
                  const isCopied = copiedId === tip.id;

                  return (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "rounded-lg border p-3 transition-all",
                        config.borderColor,
                        config.bgColor
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", config.color)} />
                          <span className={cn("text-xs font-semibold uppercase tracking-wide", config.color)}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="text-[9px] h-5 px-1.5 border-border-subtle"
                          >
                            {Math.round(tip.confidence * 100)}% confident
                          </Badge>
                          <button
                            onClick={() => copyToClipboard(tip.suggestedText, tip.id)}
                            className={cn(
                              "p-1 rounded transition-colors",
                              isCopied
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "hover:bg-bg-subtle text-text-muted hover:text-text-primary"
                            )}
                            title={isCopied ? "Copied!" : "Copy suggested text"}
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-medium text-text-primary mb-2">
                        {tip.title}
                      </h4>

                      {/* Suggested Text */}
                      <div className="rounded-md bg-bg-elevated/50 border border-border-subtle/30 p-2.5 mb-2">
                        <p className="text-[11px] text-text-primary leading-relaxed font-mono">
                          "{tip.suggestedText}"
                        </p>
                      </div>

                      {/* Expand/Collapse for strategy */}
                      <button
                        onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                        className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            Hide strategy
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            Show strategy
                          </>
                        )}
                      </button>

                      {/* Strategy explanation */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 pt-2 border-t border-border-subtle/30">
                              <p className="text-[11px] text-text-secondary leading-relaxed">
                                <span className="font-semibold text-text-primary">Strategy: </span>
                                {tip.strategy}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Confidence bar */}
                      <div className="mt-2 pt-2 border-t border-border-subtle/30">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-text-muted">Acceptance likelihood:</span>
                          <div className="flex-1 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${tip.confidence * 100}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className={cn(
                                "h-full rounded-full",
                                tip.confidence > 0.7
                                  ? "bg-emerald-500"
                                  : tip.confidence > 0.4
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Empty state (after generation attempt) */}
            {!isLoading && !error && tips.length === 0 && (
              <div className="text-center py-6">
                <Lightbulb className="h-8 w-8 text-accent/30 mx-auto mb-2" />
                <p className="text-xs text-text-muted mb-1">
                  Ready to help you negotiate
                </p>
                <p className="text-[11px] text-text-muted/70">
                  Click "Generate Tips" for AI-powered suggestions
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

