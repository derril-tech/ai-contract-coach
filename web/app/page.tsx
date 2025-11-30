"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Hero Video Background (Placeholder) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10 dark:opacity-5 pointer-events-none">
         <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 animate-pulse" />
         {/* In a real app, <video autoPlay loop muted playsInline className="w-full h-full object-cover">...</video> */}
      </div>

      <main className="relative z-10 flex flex-col items-center text-center max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600 dark:to-green-400">
            OpenAI ContractCoach
          </h1>
        </motion.div>

        <motion.p 
          className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Your AI-powered legal assistant. Identify risks, extract key clauses, and negotiate with confidence.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button asChild size="lg" className="rounded-full px-8 text-lg h-12">
            <Link href="/playground">Go to Playground</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg h-12">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </motion.div>
      </main>
      
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} ContractCoach. All rights reserved.
      </footer>
    </div>
  );
}
