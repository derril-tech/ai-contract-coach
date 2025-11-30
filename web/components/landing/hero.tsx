"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, FileText, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const videoSrc = isDark ? "/hero-bg-dark.mp4" : "/hero-bg-light.mp4";
  const posterSrc = isDark ? "/Screenshot-dark.png" : "/Screenshot-light.png";

  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-bg-page">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-16 md:px-12 lg:py-24">
        {/* === BACKGROUND LAYER === */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <video
            key={videoSrc}
            className="h-full w-full origin-center scale-105 object-cover opacity-90 transition-opacity duration-1000"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Theme-aware overlay gradients */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{
              backgroundImage: [
                isDark
                  ? "radial-gradient(circle at 20% 20%, rgba(122,168,129,0.25), transparent 55%)"
                  : "radial-gradient(circle at 20% 20%, rgba(122,168,129,0.12), transparent 55%)",
                isDark
                  ? "radial-gradient(circle at 80% 70%, rgba(122,168,129,0.18), transparent 60%)"
                  : "radial-gradient(circle at 80% 70%, rgba(122,168,129,0.08), transparent 60%)",
                "linear-gradient(to right, var(--hero-overlay-from), var(--hero-overlay-to), transparent)",
                "linear-gradient(to top, var(--hero-overlay-from), transparent)",
              ].join(","),
            }}
          />
        </div>

        {/* === FOREGROUND CONTENT LAYER === */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center w-full">
          <div className="flex flex-col items-start space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full bg-bg-elevated/80 px-4 py-1.5 text-xs font-medium text-text-muted shadow-soft ring-1 ring-border-subtle/70 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>AI-powered contract review in seconds</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="max-w-2xl text-4xl font-bold tracking-tight text-text-primary md:text-6xl leading-[1.1]"
            >
              Turn dense contracts into <span className="text-primary">clear guidance</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl text-lg text-text-secondary leading-relaxed"
            >
              ContractCoach imports agreements from Google Drive, extracts key clauses, flags unusual terms, and translates legalese into human language—so you can negotiate with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-strong transition-all hover:scale-105" asChild>
                <Link href="/playground">
                  Review a contract
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-bg-elevated/50 backdrop-blur border-border-subtle hover:bg-bg-elevated hover:text-primary transition-all" asChild>
                <Link href="#how-it-works">Watch the workflow</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="flex flex-wrap items-center gap-6 text-sm text-text-muted pt-4"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-accent" />
                <span>Risk detection</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-text-secondary" />
                <span>Plain English summaries</span>
              </div>
            </motion.div>
          </div>

          {/* Right column: Floating Glass Card */}
          <motion.div
             initial={{ opacity: 0, x: 40, scale: 0.95 }}
             animate={{ opacity: 1, x: 0, scale: 1 }}
             transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
             className="hidden lg:block relative"
          >
             <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent/30 to-primary/30 blur-2xl opacity-40" />
             <Card className="relative w-full max-w-md border-border-subtle/50 bg-bg-elevated/80 shadow-strong backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border-subtle/50">
                   <div>
                      <CardTitle className="text-sm font-semibold">ACME – MSA v3.pdf</CardTitle>
                      <p className="text-xs text-text-muted mt-1">Imported from Drive · 24 pages</p>
                   </div>
                   <Badge className="bg-accent/10 text-xs font-medium text-accent border border-accent/20 px-2 py-0.5">
                      Medium Risk
                   </Badge>
                </CardHeader>
                <CardContent className="space-y-5 pt-5">
                   <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-medium text-text-secondary">Termination for convenience</span>
                         <Badge variant="outline" className="border-warning/40 text-[10px] text-warning bg-warning/5">
                            Unbalanced
                         </Badge>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed pl-3 border-l-2 border-warning/30 italic">
                         "Either party may terminate this Agreement for any reason with thirty (30) days' prior written notice..."
                      </p>
                   </div>
                   
                   <div className="rounded-lg bg-bg-subtle/80 p-4 border border-border-subtle/50">
                      <div className="flex items-center gap-2 mb-2">
                         <Sparkles className="h-3 w-3 text-primary" />
                         <p className="text-xs font-semibold text-primary">AI Insight</p>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                         The client can end the contract at any time, but you don't get the same right. This creates an imbalance in leverage. Suggest adding mutual termination rights.
                      </p>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

