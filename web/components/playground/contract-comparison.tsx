// Created automatically by Cursor AI (2025-11-30)
// Feature #7: Contract Comparison Mode

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GitCompare,
  FileText,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Equal,
} from "lucide-react";
import type { Clause } from "@/hooks/useAgentStream";

interface ComparisonResult {
  contractA: {
    name: string;
    risk: "low" | "medium" | "high";
    clauses: Clause[];
    summary: string;
  };
  contractB: {
    name: string;
    risk: "low" | "medium" | "high";
    clauses: Clause[];
    summary: string;
  };
}

interface ClauseMatch {
  type: "added" | "removed" | "changed" | "unchanged";
  clauseA?: Clause;
  clauseB?: Clause;
  similarity?: number;
}

interface ContractComparisonProps {
  comparison: ComparisonResult | null;
  onClose: () => void;
  className?: string;
}

export function ContractComparison({ comparison, onClose, className }: ContractComparisonProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "clauses" | "diff">("overview");

  // Calculate clause matches
  const clauseMatches = useMemo<ClauseMatch[]>(() => {
    if (!comparison) return [];

    const matches: ClauseMatch[] = [];
    const matchedBIds = new Set<string>();

    // Find matching clauses by type
    comparison.contractA.clauses.forEach((clauseA) => {
      const matchingClauseB = comparison.contractB.clauses.find(
        (b) => b.type === clauseA.type && !matchedBIds.has(b.id)
      );

      if (matchingClauseB) {
        matchedBIds.add(matchingClauseB.id);
        const isSame = clauseA.originalText === matchingClauseB.originalText;
        matches.push({
          type: isSame ? "unchanged" : "changed",
          clauseA,
          clauseB: matchingClauseB,
          similarity: isSame ? 100 : calculateSimilarity(clauseA.originalText, matchingClauseB.originalText),
        });
      } else {
        matches.push({
          type: "removed",
          clauseA,
        });
      }
    });

    // Find clauses only in B
    comparison.contractB.clauses.forEach((clauseB) => {
      if (!matchedBIds.has(clauseB.id)) {
        matches.push({
          type: "added",
          clauseB,
        });
      }
    });

    return matches;
  }, [comparison]);

  // Simple similarity calculation
  function calculateSimilarity(a: string, b: string): number {
    const wordsA = new Set(a.toLowerCase().split(/\s+/));
    const wordsB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = [...wordsA].filter((w) => wordsB.has(w));
    const union = new Set([...wordsA, ...wordsB]);
    return Math.round((intersection.length / union.size) * 100);
  }

  const stats = useMemo(() => ({
    added: clauseMatches.filter((m) => m.type === "added").length,
    removed: clauseMatches.filter((m) => m.type === "removed").length,
    changed: clauseMatches.filter((m) => m.type === "changed").length,
    unchanged: clauseMatches.filter((m) => m.type === "unchanged").length,
  }), [clauseMatches]);

  const riskColors = {
    low: "text-emerald-500 bg-emerald-500/10",
    medium: "text-amber-500 bg-amber-500/10",
    high: "text-red-500 bg-red-500/10",
  };

  if (!comparison) {
    return (
      <Card className={cn("border-border-subtle/80 bg-bg-elevated shadow-sm", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <GitCompare className="h-12 w-12 text-text-muted/20 mb-3" />
          <p className="text-sm text-text-muted">No comparison loaded</p>
          <p className="text-xs text-text-muted/60 mt-1">
            Analyze two contracts to compare them
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border-subtle/80 bg-bg-elevated shadow-sm overflow-hidden", className)}>
      <CardHeader className="pb-3 border-b border-border-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Contract Comparison</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Contract Headers */}
        <div className="grid grid-cols-2 divide-x divide-border-subtle/50 border-b border-border-subtle/30">
          <div className="p-3 bg-bg-subtle/20">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-text-muted" />
              <span className="text-xs font-medium text-text-primary truncate">
                {comparison.contractA.name}
              </span>
            </div>
            <Badge className={cn("text-[9px]", riskColors[comparison.contractA.risk])}>
              {comparison.contractA.risk.toUpperCase()} RISK
            </Badge>
          </div>
          <div className="p-3 bg-bg-subtle/20">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-text-muted" />
              <span className="text-xs font-medium text-text-primary truncate">
                {comparison.contractB.name}
              </span>
            </div>
            <Badge className={cn("text-[9px]", riskColors[comparison.contractB.risk])}>
              {comparison.contractB.risk.toUpperCase()} RISK
            </Badge>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2 p-3 border-b border-border-subtle/30 bg-bg-subtle/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Plus className="h-3 w-3 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-500">{stats.added}</span>
            </div>
            <div className="text-[9px] text-text-muted">Added</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Minus className="h-3 w-3 text-red-500" />
              <span className="text-sm font-bold text-red-500">{stats.removed}</span>
            </div>
            <div className="text-[9px] text-text-muted">Removed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ArrowRight className="h-3 w-3 text-amber-500" />
              <span className="text-sm font-bold text-amber-500">{stats.changed}</span>
            </div>
            <div className="text-[9px] text-text-muted">Changed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Equal className="h-3 w-3 text-text-muted" />
              <span className="text-sm font-bold text-text-muted">{stats.unchanged}</span>
            </div>
            <div className="text-[9px] text-text-muted">Same</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-bg-subtle/30 rounded-none border-b border-border-subtle/30">
            <TabsTrigger value="overview" className="text-[11px]">Overview</TabsTrigger>
            <TabsTrigger value="clauses" className="text-[11px]">Clause Changes</TabsTrigger>
            <TabsTrigger value="diff" className="text-[11px]">Side by Side</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            <TabsContent value="overview" className="mt-0 p-4 space-y-4">
              {/* Risk Comparison */}
              <div>
                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Risk Level Change
                </h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-subtle/30">
                  <Badge className={cn(riskColors[comparison.contractA.risk])}>
                    {comparison.contractA.risk.toUpperCase()}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-text-muted" />
                  <Badge className={cn(riskColors[comparison.contractB.risk])}>
                    {comparison.contractB.risk.toUpperCase()}
                  </Badge>
                  {comparison.contractA.risk !== comparison.contractB.risk && (
                    <span className="text-xs text-text-muted ml-auto">
                      Risk {comparison.contractA.risk === "high" || 
                        (comparison.contractA.risk === "medium" && comparison.contractB.risk === "low")
                        ? "decreased" : "increased"}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Key Differences
                </h4>
                <div className="space-y-2">
                  {stats.added > 0 && (
                    <div className="flex items-start gap-2 p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                      <Plus className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary">
                        {stats.added} new clause(s) added in the second contract
                      </p>
                    </div>
                  )}
                  {stats.removed > 0 && (
                    <div className="flex items-start gap-2 p-2 rounded bg-red-500/5 border border-red-500/10">
                      <Minus className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary">
                        {stats.removed} clause(s) removed from the original contract
                      </p>
                    </div>
                  )}
                  {stats.changed > 0 && (
                    <div className="flex items-start gap-2 p-2 rounded bg-amber-500/5 border border-amber-500/10">
                      <ArrowRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary">
                        {stats.changed} clause(s) modified between versions
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clauses" className="mt-0 p-0">
              <div className="divide-y divide-border-subtle/30">
                {clauseMatches.map((match, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-3",
                      match.type === "added" && "bg-emerald-500/5",
                      match.type === "removed" && "bg-red-500/5",
                      match.type === "changed" && "bg-amber-500/5"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {match.type === "added" && <Plus className="h-4 w-4 text-emerald-500" />}
                      {match.type === "removed" && <Minus className="h-4 w-4 text-red-500" />}
                      {match.type === "changed" && <ArrowRight className="h-4 w-4 text-amber-500" />}
                      {match.type === "unchanged" && <Equal className="h-4 w-4 text-text-muted" />}
                      <span className="text-xs font-medium text-text-primary">
                        {(match.clauseA || match.clauseB)?.title}
                      </span>
                      <Badge variant="outline" className="text-[9px] capitalize">
                        {(match.clauseA || match.clauseB)?.type}
                      </Badge>
                      {match.similarity && match.type === "changed" && (
                        <Badge variant="outline" className="text-[9px] ml-auto">
                          {match.similarity}% similar
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted line-clamp-2">
                      {(match.clauseA || match.clauseB)?.summary}
                    </p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="diff" className="mt-0 p-0">
              <div className="divide-y divide-border-subtle/30">
                {clauseMatches
                  .filter((m) => m.type === "changed")
                  .map((match, index) => (
                    <div key={index} className="p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-text-primary">
                          {match.clauseA?.title}
                        </span>
                        <Badge className="text-[9px] bg-amber-500/10 text-amber-500">
                          {match.similarity}% similar
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-red-500/5 border border-red-500/10 p-2">
                          <p className="text-[9px] text-red-600 font-medium mb-1">Original</p>
                          <p className="text-[11px] text-text-secondary line-clamp-4">
                            {match.clauseA?.originalText}
                          </p>
                        </div>
                        <div className="rounded-md bg-emerald-500/5 border border-emerald-500/10 p-2">
                          <p className="text-[9px] text-emerald-600 font-medium mb-1">New Version</p>
                          <p className="text-[11px] text-text-secondary line-clamp-4">
                            {match.clauseB?.originalText}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {clauseMatches.filter((m) => m.type === "changed").length === 0 && (
                  <div className="p-8 text-center">
                    <CheckCircle className="h-8 w-8 text-emerald-500/30 mx-auto mb-2" />
                    <p className="text-xs text-text-muted">No changed clauses to compare</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Button to trigger comparison mode
export function CompareButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="text-xs"
    >
      <GitCompare className="h-3.5 w-3.5 mr-1.5" />
      Compare
    </Button>
  );
}

