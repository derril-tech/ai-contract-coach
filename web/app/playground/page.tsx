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
  Zap,
  ListTree,
  MessageCircle,
  FileSearch,
  ChevronRight
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAgent } from "@/hooks/useAgent";
import { useSwipe } from "@/hooks/useSwipe";
import { useAgentStream, type Clause } from "@/hooks/useAgentStream";
import { StreamingClauses } from "@/components/playground/streaming-clauses";
import { AnalysisProgress } from "@/components/playground/analysis-progress";
import { RiskMeter, RiskBadge } from "@/components/playground/risk-meter";
import { RiskSummaryCard } from "@/components/playground/risk-summary-card";
import { ClauseHighlighter } from "@/components/playground/clause-highlighter";
import { VoiceInput } from "@/components/playground/voice-input";
import { ShareButton, QuickCopyButton } from "@/components/playground/share-button";
import { NegotiationTips } from "@/components/playground/negotiation-tips";
import { PdfExportButton } from "@/components/export/pdf-export";
import { EmailSummaryButton } from "@/components/export/email-summary";
import { BatchUploadButton, BatchAnalysis } from "@/components/playground/batch-analysis";
import { SettingsButton, SettingsPanel } from "@/components/settings/settings-panel";
import { MobileAnalysisOverlay } from "@/components/playground/mobile-analysis-overlay";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
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
  const [showSettings, setShowSettings] = useState(false);
  const [showBatchMode, setShowBatchMode] = useState(false);
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const [mobileTab, setMobileTab] = useState<"contract" | "clauses" | "details" | "chat">("contract");
  
  // Tab order for swipe navigation
  const tabOrder: Array<"contract" | "clauses" | "details" | "chat"> = ["contract", "clauses", "details", "chat"];
  
  const { swipeHandlers } = useSwipe({
    onSwipeLeft: () => {
      const currentIndex = tabOrder.indexOf(mobileTab);
      if (currentIndex < tabOrder.length - 1) {
        setMobileTab(tabOrder[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      const currentIndex = tabOrder.indexOf(mobileTab);
      if (currentIndex > 0) {
        setMobileTab(tabOrder[currentIndex - 1]);
      }
    },
  }, { threshold: 50 });
  
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

  // Show mobile overlay when analysis starts
  useEffect(() => {
    if (isStreaming && window.innerWidth < 768) {
      setShowMobileOverlay(true);
    }
  }, [isStreaming]);

  // Hide overlay and switch to clauses when done
  useEffect(() => {
    if (isComplete && showMobileOverlay) {
      // Keep overlay visible briefly to show completion
      const timer = setTimeout(() => {
        setShowMobileOverlay(false);
        setMobileTab("clauses");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, showMobileOverlay]);

  // Auto-switch to details when clause is selected
  useEffect(() => {
    if (selectedClause && window.innerWidth < 768) {
      setMobileTab("details");
    }
  }, [selectedClause]);

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

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-4 sticky top-0 z-10 bg-bg-page pb-2">
          <div className="flex gap-1 p-1 bg-bg-elevated rounded-xl border border-border-subtle/50">
            <button
              onClick={() => setMobileTab("contract")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all",
                mobileTab === "contract"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-subtle/50"
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Contract</span>
            </button>
            <button
              onClick={() => setMobileTab("clauses")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all relative",
                mobileTab === "clauses"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-subtle/50"
              )}
            >
              <ListTree className="h-3.5 w-3.5" />
              <span>Clauses</span>
              {clauses.length > 0 && mobileTab !== "clauses" && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-[9px] font-bold rounded-full flex items-center justify-center text-white">
                  {clauses.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileTab("details")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all",
                mobileTab === "details"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-subtle/50"
              )}
            >
              <FileSearch className="h-3.5 w-3.5" />
              <span>Details</span>
            </button>
            <button
              onClick={() => setMobileTab("chat")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all",
                mobileTab === "chat"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-subtle/50"
              )}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Desktop Grid Layout - Hidden on Mobile */}
        <div className="hidden md:grid gap-6 md:grid-cols-[1.2fr,1.8fr] flex-1 min-h-0">
          
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
                  <BatchUploadButton onClick={() => setShowBatchMode(true)} />
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
                  <SettingsButton onClick={() => setShowSettings(true)} />
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
                        <p className="text-[11px] text-text-muted">
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
                      <Badge className="bg-bg-subtle text-[11px] text-text-muted border border-border-subtle">
                        Ready
                      </Badge>
                    )}
                    <span className="text-[11px] text-text-muted">
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
                    {/* Action buttons in top right */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                      <PdfExportButton
                        contractName="Contract Analysis"
                        risk={overallRisk}
                        clauses={clauses}
                        summary={summary}
                      />
                      <EmailSummaryButton
                        contractName="Contract Analysis"
                        risk={overallRisk}
                        clauses={clauses}
                        summary={summary}
                      />
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
                        <TabsTrigger value="plain" className="text-[11px]">Plain English</TabsTrigger>
                        <TabsTrigger value="risk" className="text-[11px]">Risk & Flags</TabsTrigger>
                        <TabsTrigger value="edit" className="text-[11px]">Suggested Edit</TabsTrigger>
                        <TabsTrigger value="context" className="text-[11px]">In Context</TabsTrigger>
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
                        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Original Clause Text</p>
                        <QuickCopyButton text={selectedClause.originalText} />
                      </div>
                      <div className="max-h-32 overflow-y-auto rounded-md border border-border-subtle/70 bg-bg-subtle/30 p-3 text-[11px] font-mono text-text-secondary leading-relaxed">
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

            {/* Negotiation Tips Card */}
            <AnimatePresence>
              {selectedClause && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <NegotiationTips clause={selectedClause} />
                </motion.div>
              )}
            </AnimatePresence>

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
                            <div className="flex items-center gap-1 mb-1 text-accent font-medium text-[11px]">
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
                    <p className="text-[11px] text-text-muted/80 italic">
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

        {/* Mobile Content - Tab Panels (with swipe navigation) */}
        <div 
          className="md:hidden flex-1 min-h-0 overflow-hidden"
          {...swipeHandlers}
        >
          {/* Contract Tab */}
          {mobileTab === "contract" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col"
            >
              <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm flex-1 flex flex-col">
                <CardHeader className="pb-3 border-b border-border-subtle/50 shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">Contract Source</CardTitle>
                      <p className="text-xs text-text-muted mt-0.5">
                        {clauses.length > 0 
                          ? `${clauses.length} clauses found`
                          : "Paste text or load demo"
                        }
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2.5 text-xs"
                        onClick={handleLoadSample}
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                      <SettingsButton onClick={() => setShowSettings(true)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3 pt-3 pb-4 overflow-hidden">
                  <Textarea
                    rows={8}
                    placeholder="Paste your contract text here..."
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    className="flex-1 text-xs resize-none bg-bg-subtle/30 focus:bg-bg-elevated transition-colors min-h-[200px]"
                  />
                  <div className="flex justify-between items-center gap-2 shrink-0">
                    <p className="text-xs text-text-muted">
                      {contractText.length.toLocaleString()} chars
                    </p>
                    <div className="flex gap-2">
                      {isStreaming && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={abort}
                          className="h-9 px-3 text-xs border-red-200 text-red-600"
                        >
                          <StopCircle className="mr-1.5 h-3.5 w-3.5" />
                          Stop
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        onClick={handleAnalyze}
                        disabled={isStreaming || !contractText.trim()}
                        className="h-9 px-4 bg-primary hover:bg-primary/90 shadow-soft"
                      >
                        <Play className="mr-1.5 h-3.5 w-3.5" />
                        {isStreaming ? "Analyzing..." : "Analyze"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Clauses Tab */}
          {mobileTab === "clauses" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col"
            >
              {/* Risk Summary Mini */}
              {clauses.length > 0 && !isStreaming && (
                <div className="mb-3 p-3 rounded-xl bg-bg-elevated border border-border-subtle/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiskBadge risk={overallRisk} />
                      <span className="text-xs text-text-muted">
                        {clauses.filter(c => c.risk === "high").length} high · {clauses.filter(c => c.risk === "medium").length} med
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <ShareButton
                        risk={overallRisk}
                        clauses={clauses}
                        summary={summary}
                        contractName="Contract Analysis"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm flex-1 flex flex-col overflow-hidden">
                <CardHeader className="pb-2 border-b border-border-subtle/50 shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {isStreaming ? "Analyzing..." : `${clauses.length} Clauses`}
                    </CardTitle>
                    {isStreaming && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4 text-accent" />
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-2 flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <StreamingClauses
                      clauses={clauses}
                      selectedClauseId={selectedClause?.id ?? null}
                      onSelectClause={(clause) => {
                        setSelectedClause(clause);
                        setMobileTab("details");
                      }}
                      isStreaming={isStreaming}
                    />
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Details Tab */}
          {mobileTab === "details" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col gap-3 overflow-y-auto pb-4"
            >
              {selectedClause ? (
                <>
                  {/* Clause Header */}
                  <div className="flex items-center gap-2 px-1">
                    <button
                      onClick={() => setMobileTab("clauses")}
                      className="p-1.5 rounded-lg hover:bg-bg-subtle text-text-muted"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                    <h3 className="text-sm font-semibold flex-1 truncate">{selectedClause.title}</h3>
                    <RiskBadge risk={selectedClause.risk} />
                  </div>

                  {/* Clause Tabs */}
                  <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm">
                    <CardContent className="p-3">
                      <Tabs defaultValue="plain" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-bg-subtle/50 mb-3">
                          <TabsTrigger value="plain" className="text-xs">Summary</TabsTrigger>
                          <TabsTrigger value="risk" className="text-xs">Risk</TabsTrigger>
                          <TabsTrigger value="edit" className="text-xs">Edit</TabsTrigger>
                        </TabsList>
                        <TabsContent value="plain" className="mt-0">
                          <div className="rounded-lg bg-bg-subtle/30 p-3 text-xs text-text-secondary leading-relaxed border border-border-subtle/50">
                            {selectedClause.summary}
                          </div>
                        </TabsContent>
                        <TabsContent value="risk" className="mt-0">
                          <div className={cn(
                            "rounded-lg p-3 text-xs leading-relaxed border",
                            selectedClause.risk === "high" 
                              ? "bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400" 
                              : selectedClause.risk === "medium"
                                ? "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400"
                                : "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          )}>
                            <div className="flex items-center gap-2 mb-2 font-medium">
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span className="capitalize">{selectedClause.risk} Risk</span>
                            </div>
                            <p className="text-text-secondary">{selectedClause.whyItMatters}</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="edit" className="mt-0">
                          <div className="rounded-lg bg-primary/5 p-3 text-xs text-text-secondary leading-relaxed border border-primary/10 font-mono">
                            {selectedClause.suggestedEdit || "No edit suggested."}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Original Text */}
                  <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm">
                    <CardHeader className="py-2 px-3 border-b border-border-subtle/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-medium text-text-muted">Original Text</CardTitle>
                        <QuickCopyButton text={selectedClause.originalText} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="max-h-32 overflow-y-auto rounded-lg border border-border-subtle/50 bg-bg-subtle/30 p-3 text-xs font-mono text-text-secondary leading-relaxed">
                        {selectedClause.originalText}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Negotiation Tips */}
                  <NegotiationTips clause={selectedClause} />
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <FileSearch className="h-12 w-12 text-text-muted/30 mb-4" />
                  <p className="text-sm font-medium text-text-muted">No clause selected</p>
                  <p className="text-xs text-text-muted/60 mt-1 max-w-[200px]">
                    {clauses.length === 0 
                      ? "Run an analysis first in the Contract tab"
                      : "Select a clause from the Clauses tab"
                    }
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setMobileTab(clauses.length === 0 ? "contract" : "clauses")}
                  >
                    Go to {clauses.length === 0 ? "Contract" : "Clauses"}
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Chat Tab */}
          {mobileTab === "chat" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col"
            >
              <Card className="border-border-subtle/80 bg-bg-elevated shadow-sm flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-2.5 px-3 border-b border-border-subtle/50 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <CardTitle className="text-sm font-semibold">Ask ContractCoach</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-3 min-h-0 overflow-hidden">
                  <ScrollArea className="flex-1 pr-2 mb-3">
                    <div className="space-y-3">
                      {displayMessages.map((m, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn("flex w-full", m.role === "assistant" ? "justify-start" : "justify-end")}
                        >
                          <div
                            className={cn(
                              "max-w-[85%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed shadow-sm",
                              m.role === "assistant"
                                ? "bg-bg-subtle text-text-secondary rounded-tl-none"
                                : "bg-primary text-primary-foreground rounded-tr-none"
                            )}
                          >
                            {m.role === "assistant" && (
                              <div className="flex items-center gap-1 mb-1 text-accent font-medium text-[11px]">
                                <Sparkles className="h-2.5 w-2.5" />
                                <span>AI</span>
                              </div>
                            )}
                            {m.content}
                          </div>
                        </motion.div>
                      ))}
                      {isRunning && (
                        <div className="flex w-full justify-start">
                          <div className="bg-bg-subtle rounded-2xl rounded-tl-none px-3 py-2.5 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="shrink-0 space-y-2 pt-2 border-t border-border-subtle/30">
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
                    <div className="flex items-center justify-end">
                      <Button 
                        size="sm" 
                        disabled={isRunning || !question.trim()} 
                        onClick={handleAsk} 
                        className="h-9 px-4 bg-primary hover:bg-primary/90"
                      >
                        {isRunning ? "..." : "Send"}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Batch Analysis Modal */}
      <AnimatePresence>
        {showBatchMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowBatchMode(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
            >
              <BatchAnalysis
                onAnalyze={async (text) => ({
                  risk: "medium" as const,
                  clauseCount: 5,
                  summary: "Analysis complete",
                })}
              />
              <button
                onClick={() => setShowBatchMode(false)}
                className="absolute -top-2 -right-2 p-2 rounded-full bg-bg-elevated border border-border-subtle shadow-lg text-text-muted hover:text-text-primary"
              >
                ×
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Analysis Overlay */}
      <MobileAnalysisOverlay
        isVisible={showMobileOverlay}
        status={streamingState.status}
        message={streamingState.message}
        progress={streamingState.progress.total > 0 
          ? Math.round((streamingState.progress.current / streamingState.progress.total) * 100) 
          : 0
        }
        clauseCount={clauses.length}
        onClose={() => {
          setShowMobileOverlay(false);
          if (isStreaming) abort();
        }}
        onViewResults={() => {
          setShowMobileOverlay(false);
          setMobileTab("clauses");
        }}
      />

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton
        mainIcon={<Sparkles className="h-6 w-6" />}
        actions={[
          {
            icon: <Zap className="h-5 w-5" />,
            label: "Load Demo",
            onClick: handleLoadSample,
            color: "bg-accent text-white",
          },
          {
            icon: <Play className="h-5 w-5" />,
            label: contractText ? "Analyze" : "Input Contract",
            onClick: contractText ? handleAnalyze : () => setMobileTab("contract"),
            color: contractText ? "bg-primary text-white" : "bg-bg-elevated text-primary",
          },
          {
            icon: <FileText className="h-5 w-5" />,
            label: "Batch Mode",
            onClick: () => setShowBatchMode(true),
          },
          {
            icon: <MessageCircle className="h-5 w-5" />,
            label: "Ask AI",
            onClick: () => setMobileTab("chat"),
          },
        ]}
      />
    </AppShell>
  );
}
