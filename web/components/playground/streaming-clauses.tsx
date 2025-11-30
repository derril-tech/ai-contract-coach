// Created automatically by Cursor AI (2025-11-30)
// Animated streaming clause list for real-time contract analysis

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  ChevronRight,
  CreditCard,
  Key,
  Lock,
  XCircle,
  AlertTriangle,
  FileText
} from "lucide-react";
import type { Clause } from "@/hooks/useAgentStream";

interface StreamingClausesProps {
  clauses: Clause[];
  selectedClauseId: string | null;
  onSelectClause: (clause: Clause) => void;
  isStreaming: boolean;
  className?: string;
}

// Map clause types to icons
const clauseTypeIcons: Record<string, any> = {
  payment: CreditCard,
  ip: Key,
  confidentiality: Lock,
  termination: XCircle,
  liability: AlertTriangle,
  other: FileText,
};

// Risk configuration
const riskConfig = {
  low: { 
    icon: ShieldCheck, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    badge: "border-emerald-200 text-emerald-600 bg-emerald-50"
  },
  medium: { 
    icon: Shield, 
    color: "text-amber-500", 
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    badge: "border-amber-200 text-amber-600 bg-amber-50"
  },
  high: { 
    icon: ShieldAlert, 
    color: "text-red-500", 
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    badge: "border-red-200 text-red-600 bg-red-50"
  },
};

export function StreamingClauses({
  clauses,
  selectedClauseId,
  onSelectClause,
  isStreaming,
  className,
}: StreamingClausesProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode="popLayout">
        {clauses.map((clause, index) => {
          const risk = riskConfig[clause.risk] || riskConfig.medium;
          const RiskIcon = risk.icon;
          const TypeIcon = clauseTypeIcons[clause.type] || FileText;
          const isSelected = selectedClauseId === clause.id;

          return (
            <motion.div
              key={clause.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1, // Staggered entrance
                ease: [0.23, 1, 0.32, 1], // Custom easing
              }}
              layout
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 overflow-hidden",
                  "border hover:shadow-md",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border-subtle/70 bg-bg-elevated hover:bg-bg-subtle/50"
                )}
                onClick={() => onSelectClause(clause)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Risk Icon with Animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 500 }}
                      className={cn("p-1.5 rounded-md shrink-0", risk.bg)}
                    >
                      <RiskIcon className={cn("h-4 w-4", risk.color)} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-3.5 w-3.5 text-text-muted" />
                          <span className={cn(
                            "text-xs font-semibold truncate",
                            isSelected ? "text-primary" : "text-text-primary"
                          )}>
                            {clause.title}
                          </span>
                        </div>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <Badge 
                            variant="outline" 
                            className={cn("text-[9px] h-4 px-1.5 capitalize", risk.badge)}
                          >
                            {clause.risk}
                          </Badge>
                        </motion.div>
                      </div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        className="text-[10px] text-text-muted line-clamp-2 leading-relaxed"
                      >
                        {clause.summary}
                      </motion.p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      animate={{ x: isSelected ? 0 : -5, opacity: isSelected ? 1 : 0.3 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronRight className={cn(
                        "h-4 w-4",
                        isSelected ? "text-primary" : "text-text-muted"
                      )} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Streaming indicator */}
      {isStreaming && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-center gap-2 py-4"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-text-muted">Analyzing more clauses...</span>
        </motion.div>
      )}

      {/* Empty state */}
      {clauses.length === 0 && !isStreaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <FileText className="h-10 w-10 text-text-muted/30 mb-3" />
          <p className="text-sm text-text-muted">No clauses analyzed yet</p>
          <p className="text-xs text-text-muted/60 mt-1">
            Submit a contract to start analysis
          </p>
        </motion.div>
      )}
    </div>
  );
}

