// Created automatically by Cursor AI (2025-11-30)
// Pull-to-Refresh indicator component

"use client";

import { motion } from "framer-motion";
import { RefreshCw, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  canRefresh: boolean;
  threshold?: number;
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  canRefresh,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 360;

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <motion.div
      initial={false}
      animate={{
        height: pullDistance > 0 || isRefreshing ? Math.max(pullDistance, isRefreshing ? 60 : 0) : 0,
        opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
      }}
      className="w-full flex items-center justify-center overflow-hidden md:hidden"
    >
      <motion.div
        animate={{
          rotate: isRefreshing ? 360 : rotation,
        }}
        transition={{
          rotate: isRefreshing
            ? { duration: 1, repeat: Infinity, ease: "linear" }
            : { duration: 0 },
        }}
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full",
          canRefresh || isRefreshing
            ? "bg-primary/10 text-primary"
            : "bg-bg-subtle text-text-muted"
        )}
      >
        {isRefreshing ? (
          <RefreshCw className="h-5 w-5" />
        ) : canRefresh ? (
          <RefreshCw className="h-5 w-5" />
        ) : (
          <ArrowDown className="h-5 w-5" />
        )}
      </motion.div>
    </motion.div>
  );
}

