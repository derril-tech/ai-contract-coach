"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, UploadCloud, Sparkles, Moon, SunMedium } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Steps } from "@/components/landing/steps";
import { SampleAnalysis } from "@/components/landing/sample-analysis";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  
  return (
    <main className="min-h-screen bg-bg-page text-text-primary flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-page/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg-page/60">
         <div className="container flex h-14 items-center justify-between px-6 md:px-12 mx-auto max-w-7xl">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
               <div className="relative h-8 w-8">
                 <Image src="/logo.png" alt="ContractCoach Logo" fill className="object-contain" />
               </div>
               <span className="text-primary">ContractCoach</span>
            </Link>
            <div className="flex items-center gap-4">
               <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full p-2 text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
                aria-label="Toggle theme"
               >
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
               </button>
               <Link href="/dashboard" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors hidden sm:inline-block">
                  Sign In
               </Link>
               <Button size="sm" className="bg-primary text-white hover:bg-primary/90 shadow-sm" asChild>
                  <Link href="/playground">Get Started</Link>
               </Button>
            </div>
         </div>
      </div>

      <Hero />

      <section className="border-b border-border-subtle bg-bg-subtle/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center md:justify-between gap-6 px-6 py-6 md:px-12">
          <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Powered by OpenAI SDK </span>
            <span className="text-text-muted/50">•</span>
            <span>Next.js 15</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-border-strong/50 text-xs text-text-secondary font-normal px-3 py-1">
              Legal Engineering
            </Badge>
            <Badge className="bg-accent/10 text-xs text-accent border border-accent/20 font-medium px-3 py-1">
              Beta v1.0
            </Badge>
          </div>
        </div>
      </section>

      <FeatureGrid />

      <Steps />

      <section className="bg-bg-page py-24 border-t border-border-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-subtle/50 to-bg-page pointer-events-none" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-6 md:px-12 md:flex-row items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              See a contract review before you connect your data
            </h2>
            <p className="max-w-xl text-lg text-text-secondary leading-relaxed">
              We&apos;ll analyze a sample MSA and show you how ContractCoach highlights risky clauses, explains them in plain
              English, and suggests negotiation points.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 shadow-soft">
                <Link href="/playground">
                  Explore sample analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-bg-elevated hover:bg-bg-subtle border-border-strong">
                <Link href="/dashboard">
                  View dashboard
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
            <SampleAnalysis />
          </div>
        </div>
      </section>

      <section className="bg-bg-subtle/30 py-24 border-y border-border-subtle">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center md:px-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-text-primary">
            Ready to stop reading contracts alone?
          </h2>
          <p className="max-w-2xl text-lg text-text-secondary leading-relaxed">
            Import your next agreement from Google Drive and let ContractCoach extract key clauses, flag red flags, and explain
            everything in plain language—before you sign.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-strong h-14 px-8 text-base" asChild>
              <Link href="/playground">
                <UploadCloud className="mr-2 h-5 w-5" />
                Upload a contract
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
