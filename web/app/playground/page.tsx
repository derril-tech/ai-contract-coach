"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UploadCloud, Sparkles, ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

interface Clause {
  id: string;
  type: string;
  risk: "Low" | "Medium" | "High";
  excerpt: string;
}

const mockClauses: Clause[] = [
  {
    id: "1",
    type: "Payment Terms",
    risk: "Low",
    excerpt: "Fees shall be invoiced monthly in arrears and are due within thirty (30) days...",
  },
  {
    id: "2",
    type: "Termination for Convenience",
    risk: "Medium",
    excerpt: "Customer may terminate this Agreement for any reason upon thirty (30) days’ notice...",
  },
  {
    id: "3",
    type: "Limitation of Liability",
    risk: "High",
    excerpt: "In no event shall Provider’s aggregate liability exceed the fees paid by Customer in the preceding one (1) month...",
  },
];

export default function PlaygroundPage() {
  const [selectedClause, setSelectedClause] = useState<Clause | null>(mockClauses[1]);
  const [question, setQuestion] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "I’ve scanned your agreement and highlighted key clauses. Select one on the left to see plain English, risk level, and suggested edits.",
    },
  ]);

  const handleAsk = () => {
    if (!question.trim()) return;
    setIsRunning(true);
    const q = question.trim();
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setQuestion("");

    // Fake AI response for UI demo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Here’s what to push back on:\n\n1. Ask for mutual termination rights.\n2. Clarify that previously earned fees remain payable.\n3. Confirm that termination does not waive confidentiality obligations.",
        },
      ]);
      setIsRunning(false);
    }, 900);
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="grid gap-6 md:grid-cols-[1.2fr,1.8fr] flex-1 min-h-0">
          
          {/* Left column: contract & clauses */}
          <div className="flex flex-col gap-4 min-h-0">
            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm shrink-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border-subtle/50">
                <div>
                  <CardTitle className="text-sm font-semibold">Contract Source</CardTitle>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    ACME – Master Services Agreement · 24 pages
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-8 border-primary/20 text-primary hover:bg-primary/5">
                  <UploadCloud className="mr-2 h-3 w-3" />
                  Import
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/10 text-[10px] text-accent border border-accent/20">
                    Medium Risk
                  </Badge>
                  <span className="text-[10px] text-text-muted">
                    5 risky clauses found
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border-subtle/50 shrink-0">
                <div>
                  <CardTitle className="text-sm font-semibold">Detected Clauses</CardTitle>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Review highlighted sections
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <ul className="divide-y divide-border-subtle/50 text-xs">
                    {mockClauses.map((clause) => {
                      const isSelected = selectedClause?.id === clause.id;
                      const RiskIcon =
                        clause.risk === "High"
                          ? ShieldAlert
                          : clause.risk === "Medium"
                          ? ShieldAlert
                          : ShieldCheck;

                      return (
                        <li key={clause.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedClause(clause)}
                            className={cn(
                              "flex w-full items-start gap-3 px-4 py-4 text-left transition-all duration-200",
                              isSelected
                                ? "bg-primary/5 border-l-2 border-primary"
                                : "hover:bg-bg-subtle/50 border-l-2 border-transparent"
                            )}
                          >
                            <div className="mt-0.5">
                              <RiskIcon
                                className={cn("h-4 w-4", {
                                  "text-red-500": clause.risk === "High",
                                  "text-amber-500": clause.risk === "Medium",
                                  "text-emerald-500": clause.risk === "Low",
                                })}
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className={cn("text-[11px] font-semibold", isSelected ? "text-primary" : "text-text-secondary")}>
                                  {clause.type}
                                </span>
                                <Badge variant="outline" className={cn("text-[9px] h-4 px-1", 
                                  clause.risk === "High" ? "border-red-200 text-red-600" :
                                  clause.risk === "Medium" ? "border-amber-200 text-amber-600" :
                                  "border-emerald-200 text-emerald-600"
                                )}>
                                  {clause.risk}
                                </Badge>
                              </div>
                              <p className="line-clamp-2 text-[10px] text-text-muted leading-relaxed">
                                {clause.excerpt}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right column: details & chat */}
          <div className="flex flex-col gap-4 min-h-0">
            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm shrink-0">
              <CardHeader className="space-y-1 pb-3 border-b border-border-subtle/50">
                <div className="flex items-center gap-2">
                   <CardTitle className="text-sm font-semibold">
                     {selectedClause?.type ?? "Clause details"}
                   </CardTitle>
                   <Badge variant="secondary" className="text-[10px] bg-bg-subtle text-text-secondary border-border-subtle">Analysis</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Tabs defaultValue="plain" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-bg-subtle/50">
                    <TabsTrigger value="plain" className="text-[10px]">Plain English</TabsTrigger>
                    <TabsTrigger value="risk" className="text-[10px]">Risk & Flags</TabsTrigger>
                    <TabsTrigger value="edit" className="text-[10px]">Suggested Edit</TabsTrigger>
                  </TabsList>
                  <div className="mt-3 min-h-[100px]">
                     <TabsContent value="plain" className="mt-0 space-y-2 animate-in fade-in duration-300">
                        <div className="rounded-md bg-bg-subtle/30 p-3 text-xs text-text-secondary leading-relaxed border border-border-subtle/50">
                           This provision describes how payments work. ContractCoach explains the impact in plain English based on your role in the agreement.
                        </div>
                     </TabsContent>
                     <TabsContent value="risk" className="mt-0 space-y-2 animate-in fade-in duration-300">
                        <div className="rounded-md bg-amber-500/5 p-3 text-xs text-text-secondary leading-relaxed border border-amber-500/10">
                           <div className="flex items-center gap-2 mb-2 text-amber-600 font-medium">
                              <ShieldAlert className="h-3 w-3" />
                              <span>{selectedClause?.risk} Risk Detected</span>
                           </div>
                           ContractCoach highlights why this clause is considered {selectedClause?.risk.toLowerCase()} risk and which terms are unusual compared to similar agreements.
                        </div>
                     </TabsContent>
                     <TabsContent value="edit" className="mt-0 space-y-2 animate-in fade-in duration-300">
                        <div className="rounded-md bg-primary/5 p-3 text-xs text-text-secondary leading-relaxed border border-primary/10 font-mono">
                           You'll see a suggested alternative wording aimed at balancing risk while keeping the relationship workable.
                        </div>
                     </TabsContent>
                  </div>
                </Tabs>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Original Clause Text</p>
                  <div className="max-h-32 overflow-y-auto rounded-md border border-border-subtle/70 bg-bg-subtle/30 p-3 text-[10px] font-mono text-text-secondary leading-relaxed">
                    {selectedClause?.excerpt}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border-subtle/50 shrink-0">
                <div>
                  <CardTitle className="text-sm font-semibold">Ask ContractCoach</CardTitle>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    AI negotiation partner
                  </p>
                </div>
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4 pt-4 min-h-0 pb-4">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={cn("flex w-full", m.role === "assistant" ? "justify-start" : "justify-end")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm",
                            m.role === "assistant"
                              ? "bg-bg-subtle text-text-secondary rounded-tl-none"
                              : "bg-primary text-white rounded-tr-none"
                          )}
                        >
                           {m.role === "assistant" && (
                              <div className="flex items-center gap-1 mb-1 text-accent font-medium text-[10px]">
                                 <Sparkles className="h-3 w-3" />
                                 <span>AI Assistant</span>
                              </div>
                           )}
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isRunning && (
                       <div className="flex w-full justify-start">
                          <div className="bg-bg-subtle rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                             <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce delay-0" />
                             <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce delay-150" />
                             <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce delay-300" />
                          </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="space-y-3 pt-2 border-t border-border-subtle/30 mt-auto">
                  <Textarea
                    rows={2}
                    placeholder="Ask about negotiation strategy..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                       if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAsk();
                       }
                    }}
                    className="text-xs resize-none bg-bg-subtle/30 focus:bg-bg-elevated transition-colors"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-text-muted/80 italic">
                      AI generated content. Verify with legal counsel.
                    </p>
                    <Button size="sm" disabled={isRunning} onClick={handleAsk} className="h-8 px-4 bg-primary hover:bg-primary/90 shadow-soft transition-all hover:scale-105">
                      {isRunning ? "Thinking..." : "Send"}
                      {!isRunning && <ArrowRight className="ml-2 h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
