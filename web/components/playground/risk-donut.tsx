// Created automatically by Cursor AI (2025-11-30)
// Animated donut chart showing risk distribution

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface RiskDonutProps {
  clauses: Array<{ risk: "low" | "medium" | "high" }>;
  size?: "sm" | "md" | "lg";
  showLegend?: boolean;
  className?: string;
}

const riskColors = {
  low: { fill: "#10b981", label: "Low Risk", bg: "bg-emerald-500" },
  medium: { fill: "#f59e0b", label: "Medium Risk", bg: "bg-amber-500" },
  high: { fill: "#ef4444", label: "High Risk", bg: "bg-red-500" },
};

const sizeConfig = {
  sm: { width: 100, strokeWidth: 16, innerRadius: 25 },
  md: { width: 140, strokeWidth: 20, innerRadius: 35 },
  lg: { width: 180, strokeWidth: 24, innerRadius: 45 },
};

export function RiskDonut({ 
  clauses, 
  size = "md", 
  showLegend = true,
  className 
}: RiskDonutProps) {
  const sizeProps = sizeConfig[size];
  const center = sizeProps.width / 2;
  const radius = center - sizeProps.strokeWidth / 2 - 5;

  // Calculate distribution
  const distribution = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    clauses.forEach(c => {
      counts[c.risk]++;
    });
    return counts;
  }, [clauses]);

  const total = clauses.length;

  // Calculate segments
  const segments = useMemo(() => {
    if (total === 0) return [];

    const result: Array<{
      risk: "low" | "medium" | "high";
      count: number;
      percentage: number;
      startAngle: number;
      endAngle: number;
    }> = [];

    let currentAngle = -90; // Start from top
    const order: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];

    order.forEach(risk => {
      const count = distribution[risk];
      if (count > 0) {
        const percentage = (count / total) * 100;
        const angle = (count / total) * 360;
        result.push({
          risk,
          count,
          percentage,
          startAngle: currentAngle,
          endAngle: currentAngle + angle,
        });
        currentAngle += angle;
      }
    });

    return result;
  }, [distribution, total]);

  // Create arc path
  const createArc = (startAngle: number, endAngle: number, r: number) => {
    const start = polarToCartesian(center, center, r, endAngle);
    const end = polarToCartesian(center, center, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  // Calculate circumference for animation
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <svg width={sizeProps.width} height={sizeProps.width} viewBox={`0 0 ${sizeProps.width} ${sizeProps.width}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeProps.strokeWidth}
            className="text-bg-subtle/50"
          />
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-text-muted text-xs"
          >
            No data
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <svg 
          width={sizeProps.width} 
          height={sizeProps.width} 
          viewBox={`0 0 ${sizeProps.width} ${sizeProps.width}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeProps.strokeWidth}
            className="text-bg-subtle/30"
          />

          {/* Animated segments */}
          {segments.map((segment, index) => {
            const segmentLength = (segment.percentage / 100) * circumference;
            const offset = segments
              .slice(0, index)
              .reduce((sum, s) => sum + (s.percentage / 100) * circumference, 0);

            return (
              <motion.circle
                key={segment.risk}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={riskColors[segment.risk].fill}
                strokeWidth={sizeProps.strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${segmentLength} ${circumference}` }}
                transition={{ 
                  duration: 1,
                  delay: 0.2 + index * 0.2,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-text-primary">{total}</div>
            <div className="text-[11px] text-text-muted">Clauses</div>
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {(["high", "medium", "low"] as const).map(risk => {
            const count = distribution[risk];
            if (count === 0) return null;
            return (
              <div key={risk} className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", riskColors[risk].bg)} />
                <span className="text-[11px] text-text-secondary">
                  {count} {riskColors[risk].label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

