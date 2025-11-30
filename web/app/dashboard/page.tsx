"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ArrowRight, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { RiskDonut } from "@/components/playground/risk-donut";
import { RiskBar } from "@/components/playground/risk-summary-card";
import { ContractHistory } from "@/components/dashboard/contract-history";
import { motion } from "framer-motion";

const mockContracts = [
  {
    id: "1",
    name: "ACME – Master Services Agreement",
    counterpart: "ACME Corp",
    pages: 24,
    risk: "medium" as const,
    clausesFlagged: 5,
    lastReviewed: "2 hours ago",
    clauses: [
      { risk: "low" as const },
      { risk: "medium" as const },
      { risk: "medium" as const },
      { risk: "high" as const },
      { risk: "low" as const },
    ],
  },
  {
    id: "2",
    name: "NovaPay – Reseller Agreement",
    counterpart: "NovaPay",
    pages: 16,
    risk: "high" as const,
    clausesFlagged: 8,
    lastReviewed: "Yesterday",
    clauses: [
      { risk: "high" as const },
      { risk: "high" as const },
      { risk: "medium" as const },
      { risk: "high" as const },
      { risk: "medium" as const },
      { risk: "low" as const },
      { risk: "high" as const },
      { risk: "medium" as const },
    ],
  },
  {
    id: "3",
    name: "Atlas – Data Processing Addendum",
    counterpart: "Atlas Analytics",
    pages: 9,
    risk: "low" as const,
    clausesFlagged: 1,
    lastReviewed: "3 days ago",
    clauses: [
      { risk: "low" as const },
    ],
  },
];

// Aggregate all clauses for the portfolio donut
const allClauses = mockContracts.flatMap(c => c.clauses);

function RiskBadge({ risk }: { risk: "low" | "medium" | "high" }) {
  const map: Record<string, string> = {
    low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    high: "bg-red-500/10 text-red-600 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 border capitalize ${map[risk] ?? ""}`}>
      {risk} risk
    </Badge>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">
              Overview of your recent contract reviews, risks, and AI insights.
            </p>
          </div>
          <Button asChild className="shadow-soft bg-primary hover:bg-primary/90 transition-all hover:translate-y-[-1px]">
            <Link href="/playground">
              Start new review
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
          {/* Recent Contracts List */}
          <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border-subtle/50 bg-bg-subtle/30">
              <div>
                <CardTitle className="text-base font-semibold">Recent contracts</CardTitle>
                <p className="text-[11px] text-text-muted mt-0.5">Last 10 imports from Drive</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <ul className="divide-y divide-border-subtle/50 text-sm">
                  {mockContracts.map((c) => (
                    <li key={c.id} className="group">
                      <Link href="/playground" className="flex items-center gap-4 px-5 py-4 hover:bg-bg-subtle/40 transition-colors">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                           <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary truncate">{c.name}</p>
                          <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                             <span className="truncate">{c.counterpart}</span>
                             <span>•</span>
                             <span>{c.pages} pages</span>
                             <span>•</span>
                             <span>{c.clausesFlagged} clauses flagged</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <RiskBadge risk={c.risk} />
                          <RiskBar clauses={c.clauses} className="w-16" />
                          <span className="text-[10px] text-text-muted">{c.lastReviewed}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Stats Column */}
          <div className="space-y-6">
            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm">
              <CardHeader className="space-y-1 pb-3 border-b border-border-subtle/50">
                <CardTitle className="text-sm font-semibold">Portfolio risk snapshot</CardTitle>
                <p className="text-[11px] text-text-muted">Across all analyzed clauses</p>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Risk Donut Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center"
                >
                  <RiskDonut clauses={allClauses} size="md" showLegend={true} />
                </motion.div>

                {/* Stats breakdown */}
                <div className="mt-4 pt-4 border-t border-border-subtle/30 space-y-3">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-bg-subtle/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      <span className="text-xs font-medium text-text-secondary">Low risk clauses</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-500">
                      {allClauses.filter(c => c.risk === "low").length}
                    </span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-bg-subtle/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                      <span className="text-xs font-medium text-text-secondary">Medium risk clauses</span>
                    </div>
                    <span className="text-sm font-bold text-amber-500">
                      {allClauses.filter(c => c.risk === "medium").length}
                    </span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-bg-subtle/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="h-5 w-5 text-red-500" />
                      <span className="text-xs font-medium text-text-secondary">High risk clauses</span>
                    </div>
                    <span className="text-sm font-bold text-red-500">
                      {allClauses.filter(c => c.risk === "high").length}
                    </span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm">
              <CardHeader className="space-y-1 pb-3 border-b border-border-subtle/50">
                <CardTitle className="text-sm font-semibold">Suggested next actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex gap-3 items-start">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                   <p className="text-xs text-text-secondary leading-relaxed">Revisit liability caps in 3 high-risk agreements.</p>
                </div>
                <div className="flex gap-3 items-start">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                   <p className="text-xs text-text-secondary leading-relaxed">Standardize termination language in your MSA template.</p>
                </div>
                <div className="flex gap-3 items-start">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                   <p className="text-xs text-text-secondary leading-relaxed">Share AI-generated summaries with business stakeholders.</p>
                </div>
              </CardContent>
            </Card>

            {/* Contract History */}
            <ContractHistory className="col-span-full" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
