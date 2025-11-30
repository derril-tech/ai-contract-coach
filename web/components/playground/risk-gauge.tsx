// Created automatically by Cursor AI (2025-11-30)
// Animated circular risk gauge with needle indicator

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RiskGaugeProps {
  risk: "low" | "medium" | "high" | null;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig = {
  low: { 
    angle: -60, // Points to green zone
    score: 25,
    color: "text-emerald-500",
    glowColor: "shadow-emerald-500/50",
    label: "Low Risk"
  },
  medium: { 
    angle: 0, // Points to center/yellow zone
    score: 55,
    color: "text-amber-500",
    glowColor: "shadow-amber-500/50",
    label: "Medium Risk"
  },
  high: { 
    angle: 60, // Points to red zone
    score: 85,
    color: "text-red-500",
    glowColor: "shadow-red-500/50",
    label: "High Risk"
  },
};

const sizeConfig = {
  sm: { width: 120, strokeWidth: 8, fontSize: "text-xs" },
  md: { width: 160, strokeWidth: 10, fontSize: "text-sm" },
  lg: { width: 200, strokeWidth: 12, fontSize: "text-base" },
};

export function RiskGauge({ 
  risk, 
  animated = true, 
  size = "md",
  className 
}: RiskGaugeProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const config = risk ? riskConfig[risk] : null;
  const sizeProps = sizeConfig[size];
  
  const targetAngle = config?.angle ?? 0;
  const startAngle = -90; // Start from left

  useEffect(() => {
    if (risk && animated) {
      setHasAnimated(true);
    }
  }, [risk, animated]);

  const center = sizeProps.width / 2;
  const radius = center - sizeProps.strokeWidth - 10;
  const needleLength = radius - 15;

  // Arc path for the gauge background
  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  // Calculate needle end point
  const getNeedleEnd = (angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + needleLength * Math.cos(rad),
      y: center + needleLength * Math.sin(rad)
    };
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg 
        width={sizeProps.width} 
        height={sizeProps.width * 0.7} 
        viewBox={`0 0 ${sizeProps.width} ${sizeProps.width * 0.7}`}
        className="overflow-visible"
      >
        {/* Background arc gradient */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={createArc(-90, 90)}
          fill="none"
          stroke="currentColor"
          strokeWidth={sizeProps.strokeWidth}
          strokeLinecap="round"
          className="text-bg-subtle opacity-30"
        />

        {/* Colored arc */}
        <path
          d={createArc(-90, 90)}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={sizeProps.strokeWidth}
          strokeLinecap="round"
          className="opacity-80"
        />

        {/* Tick marks */}
        {[-60, -30, 0, 30, 60].map((tickAngle, i) => {
          const outer = polarToCartesian(center, center, radius + 8, tickAngle);
          const inner = polarToCartesian(center, center, radius - 2, tickAngle);
          return (
            <line
              key={i}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="currentColor"
              strokeWidth={2}
              className="text-text-muted/50"
            />
          );
        })}

        {/* Needle */}
        <motion.g
          initial={{ rotate: animated ? startAngle : targetAngle }}
          animate={{ rotate: hasAnimated || !animated ? targetAngle : startAngle }}
          transition={{ 
            duration: 1.5, 
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.3
          }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          {/* Needle shape */}
          <polygon
            points={`
              ${center},${center - 6}
              ${center + needleLength},${center}
              ${center},${center + 6}
            `}
            className={cn(
              "transition-colors duration-300",
              config?.color || "text-text-muted"
            )}
            fill="currentColor"
            filter={risk ? "url(#glow)" : undefined}
          />
          
          {/* Center cap */}
          <circle
            cx={center}
            cy={center}
            r={12}
            className="fill-bg-elevated stroke-border-subtle"
            strokeWidth={2}
          />
          <circle
            cx={center}
            cy={center}
            r={6}
            className={cn(
              "transition-colors duration-300",
              config?.color || "text-text-muted"
            )}
            fill="currentColor"
          />
        </motion.g>
      </svg>

      {/* Label */}
      {config && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className={cn(
            "mt-2 font-semibold",
            sizeProps.fontSize,
            config.color
          )}
        >
          {config.label}
        </motion.div>
      )}

      {!risk && (
        <div className={cn("mt-2 text-text-muted", sizeProps.fontSize)}>
          No data
        </div>
      )}
    </div>
  );
}

