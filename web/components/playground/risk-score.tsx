// Created automatically by Cursor AI (2025-11-30)
// Animated risk score counter with visual indicator

"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RiskScoreProps {
  risk: "low" | "medium" | "high" | null;
  animated?: boolean;
  showBar?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig = {
  low: { 
    score: 25,
    maxScore: 40,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    barColor: "from-emerald-400 to-emerald-500",
    label: "Low Risk",
    description: "This contract has minimal concerning clauses"
  },
  medium: { 
    score: 55,
    maxScore: 70,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    barColor: "from-amber-400 to-amber-500",
    label: "Medium Risk",
    description: "Some clauses require attention"
  },
  high: { 
    score: 85,
    maxScore: 100,
    color: "text-red-500",
    bgColor: "bg-red-500",
    barColor: "from-red-400 to-red-500",
    label: "High Risk",
    description: "Multiple concerning clauses detected"
  },
};

const sizeConfig = {
  sm: { scoreSize: "text-2xl", labelSize: "text-xs", barHeight: "h-1.5" },
  md: { scoreSize: "text-4xl", labelSize: "text-sm", barHeight: "h-2" },
  lg: { scoreSize: "text-5xl", labelSize: "text-base", barHeight: "h-2.5" },
};

export function RiskScore({ 
  risk, 
  animated = true,
  showBar = true,
  size = "md",
  className 
}: RiskScoreProps) {
  const config = risk ? riskConfig[risk] : null;
  const sizeProps = sizeConfig[size];
  const targetScore = config?.score ?? 0;

  // Animated counter using spring
  const spring = useSpring(0, { 
    stiffness: 50, 
    damping: 20,
    duration: 2000 
  });
  
  const displayScore = useTransform(spring, (value) => Math.round(value));
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (animated && risk) {
      spring.set(targetScore);
    } else if (risk) {
      spring.set(targetScore);
    }
  }, [risk, targetScore, animated, spring]);

  useEffect(() => {
    const unsubscribe = displayScore.on("change", (value) => {
      setCurrentScore(value);
    });
    return () => unsubscribe();
  }, [displayScore]);

  if (!risk || !config) {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <div className={cn("font-bold text-text-muted", sizeProps.scoreSize)}>--</div>
        <div className={cn("text-text-muted", sizeProps.labelSize)}>No analysis</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Score display */}
      <div className="flex items-baseline gap-1">
        <motion.span
          className={cn("font-bold tabular-nums", sizeProps.scoreSize, config.color)}
        >
          {currentScore}
        </motion.span>
        <span className={cn("text-text-muted", sizeProps.labelSize)}>/100</span>
      </div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className={cn("font-semibold mt-1", sizeProps.labelSize, config.color)}
      >
        {config.label}
      </motion.div>

      {/* Progress bar */}
      {showBar && (
        <div className={cn("w-full bg-bg-subtle rounded-full overflow-hidden mt-3", sizeProps.barHeight)}>
          <motion.div
            className={cn("h-full rounded-full bg-gradient-to-r", config.barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${targetScore}%` }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
          />
        </div>
      )}

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-[10px] text-text-muted mt-2"
      >
        {config.description}
      </motion.p>
    </div>
  );
}

// Compact inline score badge
export function RiskScoreBadge({ 
  risk, 
  className 
}: { 
  risk: "low" | "medium" | "high" | null; 
  className?: string 
}) {
  const config = risk ? riskConfig[risk] : null;

  if (!config) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        config.bgColor + "/10",
        className
      )}
    >
      <span className={cn("text-lg font-bold tabular-nums", config.color)}>
        {config.score}
      </span>
      <span className={cn("text-xs font-medium", config.color)}>
        {config.label}
      </span>
    </motion.div>
  );
}

