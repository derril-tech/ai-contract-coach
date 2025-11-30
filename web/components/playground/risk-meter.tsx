// Created automatically by Cursor AI (2025-11-30)
// Animated risk meter visualization

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RiskMeterProps {
  risk: "low" | "medium" | "high" | null;
  className?: string;
  showLabel?: boolean;
}

const riskConfig = {
  low: { 
    value: 25, 
    color: "from-emerald-400 to-emerald-500",
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-500",
    label: "Low Risk"
  },
  medium: { 
    value: 55, 
    color: "from-amber-400 to-amber-500",
    bgColor: "bg-amber-500",
    textColor: "text-amber-500",
    label: "Medium Risk"
  },
  high: { 
    value: 85, 
    color: "from-red-400 to-red-500",
    bgColor: "bg-red-500",
    textColor: "text-red-500",
    label: "High Risk"
  },
};

export function RiskMeter({ risk, className, showLabel = true }: RiskMeterProps) {
  const config = risk ? riskConfig[risk] : null;
  const value = config?.value ?? 0;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Meter Bar */}
      <div className="relative h-3 bg-bg-subtle rounded-full overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-red-500/20" />
        
        {/* Animated fill */}
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            config?.color || "from-gray-400 to-gray-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ 
            duration: 1, 
            ease: [0.23, 1, 0.32, 1],
            delay: 0.2 
          }}
        />

        {/* Marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          initial={{ left: "0%" }}
          animate={{ left: `${value}%` }}
          transition={{ 
            duration: 1, 
            ease: [0.23, 1, 0.32, 1],
            delay: 0.2 
          }}
        >
          <motion.div
            className={cn(
              "h-5 w-2 -ml-1 rounded-full shadow-md",
              config?.bgColor || "bg-gray-400"
            )}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[9px] text-text-muted">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>

      {/* Risk Label */}
      {showLabel && config && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 pt-1"
        >
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            config.bgColor + "/10",
            config.textColor
          )}>
            <motion.span
              className={cn("h-2 w-2 rounded-full", config.bgColor)}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {config.label}
          </span>
        </motion.div>
      )}
    </div>
  );
}

// Compact circular risk indicator
export function RiskBadge({ risk, className }: { risk: "low" | "medium" | "high" | null; className?: string }) {
  const config = risk ? riskConfig[risk] : null;

  if (!config) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
        config.bgColor + "/10",
        config.textColor,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.bgColor)} />
      {config.label}
    </motion.div>
  );
}

