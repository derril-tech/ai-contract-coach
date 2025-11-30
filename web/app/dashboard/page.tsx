"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your contracts and review risk assessments.</p>
            </div>
            <Button asChild className="gap-2">
                <Link href="/playground">
                    <Plus className="h-4 w-4" />
                    New Analysis
                </Link>
            </Button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">High Risk Detected</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">0</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Processing Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">-</div>
                </CardContent>
            </Card>
        </div>

        {/* Recent Contracts */}
        <div className="grid gap-4">
          <Card className="min-h-[300px] flex flex-col justify-center items-center text-center p-8 border-dashed">
            <div className="rounded-full bg-muted p-4 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No contracts yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Upload a contract or paste text in the Playground to get started with your first analysis.
            </p>
            <Button variant="outline" asChild>
                <Link href="/playground">
                    Go to Playground <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
