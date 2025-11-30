// Created automatically by Cursor AI (2025-11-30)
// Feature #3: Live Clause Highlighter - Bidirectional clause-text navigation

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronUp, ChevronDown } from "lucide-react";
import type { Clause } from "@/hooks/useAgentStream";

interface ClauseHighlighterProps {
  contractText: string;
  clauses: Clause[];
  selectedClauseId: string | null;
  onSelectClause: (clause: Clause) => void;
  className?: string;
}

interface HighlightedSection {
  start: number;
  end: number;
  clause: Clause;
}

export function ClauseHighlighter({
  contractText,
  clauses,
  selectedClauseId,
  onSelectClause,
  className,
}: ClauseHighlighterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const highlightRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [highlightedSections, setHighlightedSections] = useState<HighlightedSection[]>([]);

  // Find clause positions in the contract text
  useEffect(() => {
    const sections: HighlightedSection[] = [];
    
    clauses.forEach((clause) => {
      // Try to find the original text in the contract
      const searchText = clause.originalText.substring(0, 100); // Use first 100 chars for matching
      const index = contractText.toLowerCase().indexOf(searchText.toLowerCase());
      
      if (index !== -1) {
        sections.push({
          start: index,
          end: index + clause.originalText.length,
          clause,
        });
      }
    });

    // Sort by position
    sections.sort((a, b) => a.start - b.start);
    setHighlightedSections(sections);
  }, [contractText, clauses]);

  // Scroll to selected clause
  useEffect(() => {
    if (selectedClauseId) {
      const element = highlightRefs.current.get(selectedClauseId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedClauseId]);

  // Navigate to next/previous clause
  const navigateClause = useCallback((direction: "up" | "down") => {
    if (clauses.length === 0) return;
    
    const currentIndex = clauses.findIndex(c => c.id === selectedClauseId);
    let newIndex: number;
    
    if (direction === "down") {
      newIndex = currentIndex < clauses.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : clauses.length - 1;
    }
    
    onSelectClause(clauses[newIndex]);
  }, [clauses, selectedClauseId, onSelectClause]);

  // Render text with highlights
  const renderHighlightedText = () => {
    if (!contractText || highlightedSections.length === 0) {
      return (
        <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
          {contractText || "No contract text available. Run an analysis to see highlighted clauses."}
        </p>
      );
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    highlightedSections.forEach((section, i) => {
      // Add text before this highlight
      if (section.start > lastIndex) {
        parts.push(
          <span key={`text-${i}`} className="text-text-secondary">
            {contractText.substring(lastIndex, section.start)}
          </span>
        );
      }

      // Add highlighted section
      const isSelected = section.clause.id === selectedClauseId;
      const riskColor = {
        low: "bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/30",
        medium: "bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/30",
        high: "bg-red-500/20 border-red-500/40 hover:bg-red-500/30",
      }[section.clause.risk];

      parts.push(
        <motion.span
          key={`highlight-${section.clause.id}`}
          ref={(el) => {
            if (el) highlightRefs.current.set(section.clause.id, el);
          }}
          initial={{ backgroundColor: "transparent" }}
          animate={{
            scale: isSelected ? 1.01 : 1,
          }}
          className={cn(
            "relative inline cursor-pointer rounded px-0.5 border-b-2 transition-all duration-200",
            riskColor,
            isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-bg-elevated"
          )}
          onClick={() => onSelectClause(section.clause)}
        >
          {contractText.substring(section.start, section.end)}
          
          {/* Clause label on hover */}
          <AnimatePresence>
            {isSelected && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute -top-6 left-0 z-10"
              >
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[9px] whitespace-nowrap shadow-sm",
                    section.clause.risk === "high" && "border-red-500 text-red-600 bg-red-50",
                    section.clause.risk === "medium" && "border-amber-500 text-amber-600 bg-amber-50",
                    section.clause.risk === "low" && "border-emerald-500 text-emerald-600 bg-emerald-50"
                  )}
                >
                  {section.clause.title}
                </Badge>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      );

      lastIndex = section.end;
    });

    // Add remaining text
    if (lastIndex < contractText.length) {
      parts.push(
        <span key="text-end" className="text-text-secondary">
          {contractText.substring(lastIndex)}
        </span>
      );
    }

    return (
      <p className="text-xs leading-relaxed whitespace-pre-wrap">
        {parts}
      </p>
    );
  };

  if (!contractText) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
        <FileText className="h-10 w-10 text-text-muted/20 mb-3" />
        <p className="text-sm text-text-muted">No contract loaded</p>
        <p className="text-xs text-text-muted/60 mt-1">
          Run an analysis to view highlighted clauses
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Navigation controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle/50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted">
            {highlightedSections.length} clauses highlighted
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateClause("up")}
            className="p-1 rounded hover:bg-bg-subtle transition-colors"
            title="Previous clause"
          >
            <ChevronUp className="h-4 w-4 text-text-muted" />
          </button>
          <button
            onClick={() => navigateClause("down")}
            className="p-1 rounded hover:bg-bg-subtle transition-colors"
            title="Next clause"
          >
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Scrollable text area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4">
          {renderHighlightedText()}
        </div>
      </ScrollArea>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 px-3 py-2 border-t border-border-subtle/50 bg-bg-subtle/30 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded bg-emerald-500/30 border-b-2 border-emerald-500" />
          <span className="text-[9px] text-text-muted">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded bg-amber-500/30 border-b-2 border-amber-500" />
          <span className="text-[9px] text-text-muted">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded bg-red-500/30 border-b-2 border-red-500" />
          <span className="text-[9px] text-text-muted">High</span>
        </div>
      </div>
    </div>
  );
}

