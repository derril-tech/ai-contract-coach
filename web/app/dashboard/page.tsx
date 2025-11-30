"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

const mockContracts = [
  {
    id: "1",
    name: "ACME – Master Services Agreement",
    counterpart: "ACME Corp",
    pages: 24,
    risk: "Medium",
    clausesFlagged: 5,
    lastReviewed: "2 hours ago",
  },
  {
    id: "2",
    name: "NovaPay – Reseller Agreement",
    counterpart: "NovaPay",
    pages: 16,
    risk: "High",
    clausesFlagged: 8,
    lastReviewed: "Yesterday",
  },
  {
    id: "3",
    name: "Atlas – Data Processing Addendum",
    counterpart: "Atlas Analytics",
    pages: 9,
    risk: "Low",
    clausesFlagged: 1,
    lastReviewed: "3 days ago",
  },
];

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    Medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    High: "bg-red-500/10 text-red-600 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 border ${map[risk] ?? ""}`}>
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
                <p className="text-[11px] text-text-muted">Across your last 30 contracts</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-bg-subtle/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <span className="text-xs font-medium text-text-secondary">Balanced agreements</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">60%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-bg-subtle/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    <span className="text-xs font-medium text-text-secondary">Needs negotiation</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">30%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-bg-subtle/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                    <span className="text-xs font-medium text-text-secondary">High risk</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">10%</span>
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
          </div>
        </div>
      </div>
    </AppShell>
  );
}
