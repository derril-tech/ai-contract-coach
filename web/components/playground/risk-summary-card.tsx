// Created automatically by Cursor AI (2025-11-30)
// Combined risk summary card with gauge, score, and distribution

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RiskGauge } from "./risk-gauge";
import { RiskDonut } from "./risk-donut";
import { RiskScore } from "./risk-score";
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface RiskSummaryCardProps {
  risk: "low" | "medium" | "high" | null;
  clauses: Array<{ risk: "low" | "medium" | "high" }>;
  summary?: string | null;
  isStreaming?: boolean;
  className?: string;
}

export function RiskSummaryCard({ 
  risk, 
  clauses, 
  summary,
  isStreaming = false,
  className 
}: RiskSummaryCardProps) {
  const hasData = risk && clauses.length > 0;

  // Calculate stats
  const highRiskCount = clauses.filter(c => c.risk === "high").length;
  const mediumRiskCount = clauses.filter(c => c.risk === "medium").length;
  const lowRiskCount = clauses.filter(c => c.risk === "low").length;

  return (
    <Card className={cn("border-border-subtle/80 bg-bg-elevated shadow-sm overflow-hidden", className)}>
      <CardHeader className="pb-3 border-b border-border-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Risk Assessment</CardTitle>
          </div>
          {isStreaming && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] text-accent font-medium"
            >
              Analyzing...
            </motion.div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {!hasData ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Shield className="h-12 w-12 text-text-muted/20 mb-3" />
            <p className="text-sm text-text-muted">No analysis yet</p>
            <p className="text-xs text-text-muted/60 mt-1">
              Submit a contract to see risk assessment
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Main visualization row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Gauge */}
              <div className="flex flex-col items-center">
                <RiskGauge risk={risk} size="sm" />
              </div>

              {/* Score */}
              <div className="flex flex-col justify-center">
                <RiskScore risk={risk} size="sm" showBar={true} />
              </div>
            </div>

            {/* Distribution */}
            <div className="pt-2 border-t border-border-subtle/30">
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">
                Clause Distribution
              </p>
              <RiskDonut clauses={clauses} size="sm" showLegend={true} />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle/30">
              <StatItem 
                icon={AlertTriangle} 
                label="High Risk" 
                value={highRiskCount} 
                color="text-red-500"
              />
              <StatItem 
                icon={TrendingUp} 
                label="Medium" 
                value={mediumRiskCount} 
                color="text-amber-500"
              />
              <StatItem 
                icon={CheckCircle} 
                label="Low Risk" 
                value={lowRiskCount} 
                color="text-emerald-500"
              />
            </div>

            {/* Summary */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="pt-3 border-t border-border-subtle/30"
              >
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                  AI Summary
                </p>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {summary}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper component for stats
function StatItem({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: number; 
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="flex flex-col items-center p-2 rounded-lg bg-bg-subtle/30"
    >
      <Icon className={cn("h-4 w-4 mb-1", color)} />
      <span className={cn("text-lg font-bold", color)}>{value}</span>
      <span className="text-[9px] text-text-muted">{label}</span>
    </motion.div>
  );
}

// Compact horizontal risk bar for lists
export function RiskBar({ 
  clauses,
  className 
}: { 
  clauses: Array<{ risk: "low" | "medium" | "high" }>; 
  className?: string;
}) {
  const total = clauses.length;
  if (total === 0) return null;

  const high = clauses.filter(c => c.risk === "high").length;
  const medium = clauses.filter(c => c.risk === "medium").length;
  const low = clauses.filter(c => c.risk === "low").length;

  return (
    <div className={cn("flex h-2 rounded-full overflow-hidden bg-bg-subtle", className)}>
      {high > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(high / total) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="bg-red-500"
        />
      )}
      {medium > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(medium / total) * 100}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-amber-500"
        />
      )}
      {low > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(low / total) * 100}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-emerald-500"
        />
      )}
    </div>
  );
}

