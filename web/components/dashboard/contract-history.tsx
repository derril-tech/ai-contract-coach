// Created automatically by Cursor AI (2025-11-30)
// Feature #9: Contract History Dashboard Component

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Clock,
  FileText,
  Search,
  Trash2,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Shield,
  TrendingUp,
} from "lucide-react";

export interface HistoryEntry {
  id: string;
  name: string;
  analyzedAt: string;
  overallRisk: "low" | "medium" | "high";
  clauseCount: number;
  highRiskCount: number;
  summary: string;
  clauses?: any[];
}

const STORAGE_KEY = "contractcoach_history";

export function useContractHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save to localStorage
  const saveHistory = (entries: HistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      setHistory(entries);
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  const addEntry = (entry: Omit<HistoryEntry, "id" | "analyzedAt">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `history-${Date.now()}`,
      analyzedAt: new Date().toISOString(),
    };
    saveHistory([newEntry, ...history].slice(0, 50)); // Keep last 50
  };

  const removeEntry = (id: string) => {
    saveHistory(history.filter((e) => e.id !== id));
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return { history, addEntry, removeEntry, clearHistory };
}

interface ContractHistoryProps {
  onSelectEntry?: (entry: HistoryEntry) => void;
  className?: string;
}

export function ContractHistory({ onSelectEntry, className }: ContractHistoryProps) {
  const { history, removeEntry, clearHistory } = useContractHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = history.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: history.length,
    highRisk: history.filter((e) => e.overallRisk === "high").length,
    avgClauses: history.length > 0
      ? Math.round(history.reduce((sum, e) => sum + e.clauseCount, 0) / history.length)
      : 0,
  };

  const riskColors = {
    low: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    medium: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    high: "text-red-500 bg-red-500/10 border-red-500/30",
  };

  return (
    <Card className={cn("border-border-subtle/80 bg-bg-elevated shadow-sm", className)}>
      <CardHeader className="pb-3 border-b border-border-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Analysis History</CardTitle>
            <Badge variant="outline" className="text-[10px]">
              {history.length} contracts
            </Badge>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-text-muted hover:text-red-500"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Stats Row */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-2 p-3 border-b border-border-subtle/30 bg-bg-subtle/30">
            <div className="text-center">
              <div className="text-lg font-bold text-text-primary">{stats.total}</div>
              <div className="text-[9px] text-text-muted">Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">{stats.highRisk}</div>
              <div className="text-[9px] text-text-muted">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-primary">{stats.avgClauses}</div>
              <div className="text-[9px] text-text-muted">Avg Clauses</div>
            </div>
          </div>
        )}

        {/* Search */}
        {history.length > 5 && (
          <div className="p-3 border-b border-border-subtle/30">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        )}

        {/* History List */}
        <ScrollArea className="h-[300px]">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-10 w-10 text-text-muted/20 mb-3" />
              <p className="text-sm text-text-muted">No history yet</p>
              <p className="text-xs text-text-muted/60 mt-1">
                Analyzed contracts will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle/30">
              {filteredHistory.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <button
                    onClick={() => onSelectEntry?.(entry)}
                    className="w-full p-3 hover:bg-bg-subtle/50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-text-primary truncate">
                            {entry.name}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn("text-[9px] capitalize", riskColors[entry.overallRisk])}
                          >
                            {entry.overallRisk}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
                          {entry.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-text-muted flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.analyzedAt).toLocaleDateString()}
                          </span>
                          <span className="text-[9px] text-text-muted">
                            {entry.clauseCount} clauses
                          </span>
                          {entry.highRiskCount > 0 && (
                            <span className="text-[9px] text-red-500 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {entry.highRiskCount} high risk
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Clear Confirmation */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-elevated/95 flex flex-col items-center justify-center p-4"
            >
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-3" />
              <p className="text-sm font-medium text-text-primary mb-1">Clear all history?</p>
              <p className="text-xs text-text-muted mb-4">This cannot be undone</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    clearHistory();
                    setShowClearConfirm(false);
                  }}
                >
                  Clear All
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

