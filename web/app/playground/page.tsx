"use client";

import { useAgent } from "@/hooks/useAgent";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
    AlertTriangle, 
    CheckCircle, 
    FileText, 
    MessageSquare, 
    Upload, 
    ArrowLeft, 
    Send,
    ShieldAlert,
    ShieldCheck,
    Info,
    ChevronRight
} from "lucide-react";

type Clause = {
  id: string;
  type: string;
  title: string;
  risk: "low" | "medium" | "high";
  originalText: string;
  summary: string;
  whyItMatters: string;
  suggestedEdit: string;
};

export default function PlaygroundPage() {
  const { run, loading, lastResult, messages } = useAgent("demo-project");
  const [input, setInput] = useState("");
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveFileId, setDriveFileId] = useState("");
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("google_access_token");
    if (token) setDriveToken(token);
  }, []);

  const handleConnectDrive = async () => {
    try {
      const res = await fetch("/api/auth/google/url");
      const { url } = await res.json();
      router.push(url);
    } catch (e) {
      console.error("Failed to get auth url", e);
    }
  };

  const handleRun = () => {
    if (driveFileId && driveToken) {
        run({ driveFileId, accessToken: driveToken, questions: [] });
    } else {
        run({ text: input });
    }
  };

  const handleAskQuestion = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
          run({ text: "", questions: [e.currentTarget.value] }); 
          e.currentTarget.value = "";
      }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default"; 
      default: return "secondary";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
        case "high": return <ShieldAlert className="h-4 w-4" />;
        case "medium": return <AlertTriangle className="h-4 w-4" />;
        default: return <ShieldCheck className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between bg-card z-20 shadow-sm">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                ContractCoach
            </h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>Dashboard</Button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Column: Input & Clause List */}
        <div className="flex flex-col border-r h-full overflow-hidden bg-muted/5 relative">
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-6 max-w-2xl mx-auto pb-20">
                    
                    {/* Input Section */}
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Contract Input</CardTitle>
                            <CardDescription>Upload from Drive or paste text to begin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Drive Option */}
                             <div className="flex items-center gap-4 p-3 border rounded-md bg-background transition-colors hover:border-primary/50">
                                {driveToken ? (
                                    <div className="flex-1 flex gap-2 items-center">
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 gap-1">
                                            <CheckCircle className="h-3 w-3" /> Drive Connected
                                        </Badge>
                                        <Input 
                                            placeholder="Paste File ID (e.g. 1BxiM...)" 
                                            value={driveFileId}
                                            onChange={(e) => setDriveFileId(e.target.value)}
                                            className="h-8 text-xs font-mono"
                                        />
                                    </div>
                                ) : (
                                    <Button variant="outline" onClick={handleConnectDrive} className="w-full gap-2">
                                        <Upload className="h-4 w-4" />
                                        Connect Google Drive
                                    </Button>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <Textarea 
                                placeholder="Paste contract text here..." 
                                className="min-h-[150px] font-mono text-sm resize-none focus-visible:ring-primary"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={!!driveFileId}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handleRun} 
                                disabled={loading || (!input && !driveFileId)} 
                                className="w-full gap-2 font-medium" 
                                size="lg"
                            >
                                {loading ? "Running Analysis..." : (
                                    <>Analyze Contract <ChevronRight className="h-4 w-4" /></>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Clauses List */}
                    <AnimatePresence>
                    {lastResult?.clauses && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                                    Risk Analysis
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                    {lastResult.overallRisk?.toUpperCase()} RISK
                                </Badge>
                            </div>
                            
                            <div className="grid gap-3">
                                {lastResult.clauses.map((clause: Clause) => (
                                    <motion.div
                                        key={clause.id}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Card 
                                            className={`cursor-pointer transition-all border-l-4 ${selectedClause?.id === clause.id ? 'border-l-primary ring-1 ring-primary/20 bg-accent/10 shadow-md' : 'border-l-transparent hover:border-l-primary/50'}`}
                                            onClick={() => setSelectedClause(clause)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between gap-4 mb-2">
                                                    <Badge variant="outline" className="capitalize">{clause.type}</Badge>
                                                    <Badge variant={getRiskBadgeVariant(clause.risk)} className="gap-1 px-2">
                                                        {getRiskIcon(clause.risk)}
                                                        {clause.risk.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="font-medium text-sm mb-1">{clause.title}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{clause.summary}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>

        {/* Right Column: Details & Chat */}
        <div className="flex flex-col h-full overflow-hidden bg-background relative">
            {selectedClause ? (
                <div className="flex-1 flex flex-col overflow-hidden border-b">
                     <div className="flex-1 overflow-auto">
                        <div className="p-6 pb-8">
                            <motion.div
                                key={selectedClause.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold tracking-tight">{selectedClause.title}</h2>
                                    <Badge variant={getRiskBadgeVariant(selectedClause.risk)} className="text-sm px-3 py-1 gap-1">
                                         {getRiskIcon(selectedClause.risk)}
                                        {selectedClause.risk.toUpperCase()} RISK
                                    </Badge>
                                </div>
                                <Tabs defaultValue="plain-english" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-6">
                                        <TabsTrigger value="plain-english">Plain English</TabsTrigger>
                                        <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                                        <TabsTrigger value="edit">Suggested Edit</TabsTrigger>
                                    </TabsList>
                                    
                                    <div className="min-h-[200px]">
                                        <TabsContent value="plain-english" className="space-y-6 mt-0">
                                            <div className="p-4 bg-muted/30 rounded-lg border">
                                                <p className="text-lg leading-relaxed text-foreground/90">{selectedClause.summary}</p>
                                            </div>
                                            <Separator />
                                            <div>
                                                <Label className="text-muted-foreground mb-3 block text-xs uppercase tracking-wider font-semibold">Original Text</Label>
                                                <div className="bg-muted p-4 rounded-md font-mono text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border">
                                                    {selectedClause.originalText}
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="risk" className="space-y-4 mt-0">
                                            <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg text-destructive-foreground">
                                                <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    Why this matters
                                                </h4>
                                                <p className="leading-relaxed">{selectedClause.whyItMatters}</p>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="edit" className="space-y-4 mt-0">
                                             <div className="p-6 border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 rounded-lg">
                                                <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400 flex items-center gap-2 text-lg">
                                                    <CheckCircle className="h-5 w-5" />
                                                    Recommended Change
                                                </h4>
                                                <p className="font-mono text-sm leading-relaxed">{selectedClause.suggestedEdit}</p>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </motion.div>
                        </div>
                     </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 border-b p-8 text-center">
                    <div className="bg-muted/50 p-6 rounded-full mb-4">
                        <Info className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No Clause Selected</h3>
                    <p className="max-w-xs mt-2">Select a detected clause from the list on the left to view detailed analysis and recommendations.</p>
                </div>
            )}

            {/* Q&A / Chat Panel */}
            <div className="h-1/3 min-h-[320px] max-h-[400px] flex flex-col bg-card border-t shadow-lg z-10">
                <div className="px-4 py-3 border-b bg-muted/10 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">AI Assistant</h3>
                </div>
                <ScrollArea className="flex-1 p-4 bg-background/50">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full py-8 opacity-50">
                                <p className="text-sm">Ask questions about the contract here.</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {m.role === "assistant" && <Avatar className="h-8 w-8 mt-1"><AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback></Avatar>}
                                <div className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none border"}`}>
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <div className="relative">
                        <Input 
                            placeholder="Ask a question about this clause..." 
                            onKeyDown={handleAskQuestion}
                            className="w-full pr-10"
                        />
                        <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-primary" aria-label="Send message">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
