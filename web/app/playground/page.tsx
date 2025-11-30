"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  UploadCloud, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight,
  Play,
  StopCircle,
  FileText,
  Zap
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAgent } from "@/hooks/useAgent";
import { useAgentStream, type Clause } from "@/hooks/useAgentStream";
import { StreamingClauses } from "@/components/playground/streaming-clauses";
import { AnalysisProgress } from "@/components/playground/analysis-progress";
import { RiskMeter, RiskBadge } from "@/components/playground/risk-meter";
import { RiskSummaryCard } from "@/components/playground/risk-summary-card";
import { ClauseHighlighter } from "@/components/playground/clause-highlighter";
import { VoiceInput } from "@/components/playground/voice-input";
import { ShareButton, QuickCopyButton } from "@/components/playground/share-button";
import { motion, AnimatePresence } from "framer-motion";

// Sample contract for demo
const SAMPLE_CONTRACT = `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into as of the date last signed below.

1. PAYMENT TERMS
Fees shall be invoiced monthly in arrears and are due within thirty (30) days of invoice receipt. Late payments shall accrue interest at 1.5% per month.

2. INTELLECTUAL PROPERTY
All intellectual property created by Provider during the course of this Agreement shall be owned by Provider. Customer receives a non-exclusive license to use deliverables.

3. CONFIDENTIALITY
Each party agrees to keep confidential all proprietary information disclosed by the other party. This obligation survives termination for a period of three (3) years.

4. TERMINATION
Either party may terminate this Agreement for convenience upon thirty (30) days written notice. Customer may terminate for cause if Provider materially breaches this Agreement.

5. LIMITATION OF LIABILITY
IN NO EVENT SHALL PROVIDER'S AGGREGATE LIABILITY EXCEED THE FEES PAID BY CUSTOMER IN THE PRECEDING ONE (1) MONTH. PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.

6. INDEMNIFICATION
Provider shall indemnify Customer against third-party claims arising from Provider's gross negligence or willful misconduct.`;

export default function PlaygroundPage() {
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [question, setQuestion] = useState("");
  const [contractText, setContractText] = useState("");
  const [showContractInput, setShowContractInput] = useState(false);
  
  // Streaming hook for real-time analysis
  const {
    streamingState,
    clauses,
    summary,
    overallRisk,
    isStreaming,
    isComplete,
    hasError,
    error: streamError,
    runStream,
    abort,
    reset,
  } = useAgentStream("demo-project");
  
  // Original hook for Q&A chat
  const { messages, run, loading: isRunning, error: chatError, lastResult } = useAgent("demo-project");

  // Auto-select first clause when analysis completes
  useEffect(() => {
    if (clauses.length > 0 && !selectedClause) {
      setSelectedClause(clauses[0]);
    }
  }, [clauses, selectedClause]);

  // Initialize with welcome message if empty
  const displayMessages = messages.length > 0 ? messages : [
    {
      role: "assistant" as const,
      content: summary || "I'm ready to analyze your contract. Submit contract text above, or ask me questions about the analysis.",
    }
  ];

  const handleAnalyze = async () => {
    if (!contractText.trim()) return;
    reset();
    setSelectedClause(null);
    await runStream({
      text: contractText.trim(),
      questions: [],
    });
  };

  const handleLoadSample = () => {
    setContractText(SAMPLE_CONTRACT);
    setShowContractInput(true);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    
    await run({
      text: q,
      questions: [q],
    });
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Analysis Progress Bar - Shows during streaming */}
        <AnimatePresence>
          {(isStreaming || streamingState.status !== "idle") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <AnalysisProgress
                status={streamingState.status}
                message={streamingState.message}
                progress={streamingState.progress}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 md:grid-cols-[1.2fr,1.8fr] flex-1 min-h-0">
          
          {/* Left column: contract input & clauses */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Contract Source Card */}
            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm shrink-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border-subtle/50">
                <div>
                  <CardTitle className="text-sm font-semibold">Contract Source</CardTitle>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {clauses.length > 0 
                      ? `Analysis complete · ${clauses.length} clauses found`
                      : "Paste contract text or load sample"
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => setShowContractInput(!showContractInput)}
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    {showContractInput ? "Hide" : "Input"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 border-accent/20 text-accent hover:bg-accent/5"
                    onClick={handleLoadSample}
                  >
                    <Zap className="mr-2 h-3 w-3" />
                    Demo
                  </Button>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {showContractInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="space-y-3 pt-3">
                      <Textarea
                        rows={6}
                        placeholder="Paste your contract text here..."
                        value={contractText}
                        onChange={(e) => setContractText(e.target.value)}
                        className="text-xs resize-none bg-bg-subtle/30 focus:bg-bg-elevated transition-colors"
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] text-text-muted">
                          {contractText.length} characters
                        </p>
                        <div className="flex gap-2">
                          {isStreaming && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={abort}
                              className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <StopCircle className="mr-2 h-3 w-3" />
                              Stop
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            onClick={handleAnalyze}
                            disabled={isStreaming || !contractText.trim()}
                            className="h-8 px-4 bg-primary hover:bg-primary/90 shadow-soft"
                          >
                            <Play className="mr-2 h-3 w-3" />
                            {isStreaming ? "Analyzing..." : "Analyze"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showContractInput && (
                <CardContent className="space-y-3 pt-3">
                  <div className="flex items-center gap-2">
                    {overallRisk ? (
                      <RiskBadge risk={overallRisk} />
                    ) : (
                      <Badge className="bg-bg-subtle text-[10px] text-text-muted border border-border-subtle">
                        Ready
                      </Badge>
                    )}
                    <span className="text-[10px] text-text-muted">
                      {clauses.length > 0 
                        ? `${clauses.filter(c => c.risk === "high").length} high risk, ${clauses.filter(c => c.risk === "medium").length} medium risk`
                        : "No analysis yet"
                      }
                    </span>
                  </div>
                  {overallRisk && (
                    <RiskMeter risk={overallRisk} showLabel={false} />
                  )}
                </CardContent>
              )}
            </Card>

            {/* Detected Clauses Card */}
            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border-subtle/50 shrink-0">
                <div>
                  <CardTitle className="text-sm font-semibold">Detected Clauses</CardTitle>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {isStreaming 
                      ? "Streaming results..."
                      : clauses.length > 0 
                        ? `${clauses.length} clauses analyzed`
                        : "Review highlighted sections"
                    }
                  </p>
                </div>
                {isStreaming && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4 text-accent" />
                  </motion.div>
                )}
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <StreamingClauses
                    clauses={clauses}
                    selectedClauseId={selectedClause?.id ?? null}
                    onSelectClause={setSelectedClause}
                    isStreaming={isStreaming}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right column: risk summary, details & chat */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Risk Summary Card - Shows when analysis is complete */}
            <AnimatePresence>
              {(isComplete || clauses.length > 0) && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    {/* Share button in top right */}
                    <div className="absolute top-3 right-3 z-10">
                      <ShareButton
                        risk={overallRisk}
                        clauses={clauses}
                        summary={summary}
                        contractName="Contract Analysis"
                      />
                    </div>
                    <RiskSummaryCard
                      risk={overallRisk}
                      clauses={clauses}
                      summary={summary}
                      isStreaming={isStreaming}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clause Details Card */}
            <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm shrink-0">
              <CardHeader className="space-y-1 pb-3 border-b border-border-subtle/50">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">
                    {selectedClause?.title ?? "Clause Details"}
                  </CardTitle>
                  {selectedClause && (
                    <RiskBadge risk={selectedClause.risk} />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {selectedClause ? (
                  <>
                    <Tabs defaultValue="plain" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-bg-subtle/50">
                        <TabsTrigger value="plain" className="text-[10px]">Plain English</TabsTrigger>
                        <TabsTrigger value="risk" className="text-[10px]">Risk & Flags</TabsTrigger>
                        <TabsTrigger value="edit" className="text-[10px]">Suggested Edit</TabsTrigger>
                        <TabsTrigger value="context" className="text-[10px]">In Context</TabsTrigger>
                      </TabsList>
                      <div className="mt-3 min-h-[100px]">
                        <TabsContent value="plain" className="mt-0 space-y-2 animate-in fade-in duration-300">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-md bg-bg-subtle/30 p-3 text-xs text-text-secondary leading-relaxed border border-border-subtle/50"
                          >
                            {selectedClause.summary}
                          </motion.div>
                        </TabsContent>
                        <TabsContent value="risk" className="mt-0 space-y-2 animate-in fade-in duration-300">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "rounded-md p-3 text-xs text-text-secondary leading-relaxed border",
                              selectedClause.risk === "high" 
                                ? "bg-red-500/5 border-red-500/10" 
                                : selectedClause.risk === "medium"
                                  ? "bg-amber-500/5 border-amber-500/10"
                                  : "bg-emerald-500/5 border-emerald-500/10"
                            )}
                          >
                            <div className={cn(
                              "flex items-center gap-2 mb-2 font-medium",
                              selectedClause.risk === "high" 
                                ? "text-red-600" 
                                : selectedClause.risk === "medium"
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                            )}>
                              <ShieldAlert className="h-3 w-3" />
                              <span className="capitalize">{selectedClause.risk} Risk Detected</span>
                            </div>
                            {selectedClause.whyItMatters}
                          </motion.div>
                        </TabsContent>
                        <TabsContent value="edit" className="mt-0 space-y-2 animate-in fade-in duration-300">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-md bg-primary/5 p-3 text-xs text-text-secondary leading-relaxed border border-primary/10 font-mono"
                          >
                            {selectedClause.suggestedEdit || "No edit suggested for this clause."}
                          </motion.div>
                        </TabsContent>
                        <TabsContent value="context" className="mt-0 animate-in fade-in duration-300">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-md border border-border-subtle/50 bg-bg-subtle/20 overflow-hidden"
                          >
                            <ClauseHighlighter
                              contractText={contractText}
                              clauses={clauses}
                              selectedClauseId={selectedClause?.id ?? null}
                              onSelectClause={setSelectedClause}
                              className="h-[200px]"
                            />
                          </motion.div>
                        </TabsContent>
                      </div>
                    </Tabs>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Original Clause Text</p>
                        <QuickCopyButton text={selectedClause.originalText} />
                      </div>
                      <div className="max-h-32 overflow-y-auto rounded-md border border-border-subtle/70 bg-bg-subtle/30 p-3 text-[10px] font-mono text-text-secondary leading-relaxed">
                        {selectedClause.originalText}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-10 w-10 text-text-muted/30 mb-3" />
                    <p className="text-sm text-text-muted">Select a clause to view details</p>
                    <p className="text-xs text-text-muted/60 mt-1">
                      {clauses.length === 0 
                        ? "Run an analysis first"
                        : "Click on a clause from the list"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Card */}
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
                    {displayMessages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn("flex w-full", m.role === "assistant" ? "justify-start" : "justify-end")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm",
                            m.role === "assistant"
                              ? "bg-bg-subtle text-text-secondary rounded-tl-none"
                              : "bg-primary text-primary-foreground rounded-tr-none"
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
                      </motion.div>
                    ))}
                    {isRunning && (
                      <div className="flex w-full justify-start">
                        <div className="bg-bg-subtle rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                    {(chatError || streamError) && (
                      <div className="flex w-full justify-center">
                        <div className="bg-red-100 text-red-600 rounded-md px-3 py-2 text-xs">
                          Error: {chatError || streamError}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="space-y-3 pt-2 border-t border-border-subtle/30 mt-auto">
                  <div className="relative">
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
                      className="text-xs resize-none bg-bg-subtle/30 focus:bg-bg-elevated transition-colors pr-10"
                    />
                    {/* Voice Input Button */}
                    <div className="absolute right-2 top-2">
                      <VoiceInput
                        onTranscript={(text) => setQuestion(text)}
                        onSubmit={(text) => {
                          setQuestion(text);
                          handleAsk();
                        }}
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-text-muted/80 italic">
                      AI generated content. Verify with legal counsel.
                    </p>
                    <Button 
                      size="sm" 
                      disabled={isRunning} 
                      onClick={handleAsk} 
                      className="h-8 px-4 bg-primary hover:bg-primary/90 shadow-soft transition-all hover:scale-105"
                    >
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
