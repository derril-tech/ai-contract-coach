// Created automatically by Cursor AI (2025-11-30)
// Feature #8: PDF Export with Branding

"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileDown, Loader2, Check, FileText } from "lucide-react";
import type { Clause } from "@/hooks/useAgentStream";

interface PdfExportOptions {
  includeOriginalText: boolean;
  includeTips: boolean;
  includeRiskDetails: boolean;
  companyName: string;
  preparedBy: string;
}

interface PdfExportProps {
  contractName: string;
  risk: "low" | "medium" | "high" | null;
  clauses: Clause[];
  summary: string | null;
  onExport?: () => void;
}

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [options, setOptions] = useState<PdfExportOptions>({
    includeOriginalText: true,
    includeTips: false,
    includeRiskDetails: true,
    companyName: "",
    preparedBy: "",
  });

  const generatePdf = useCallback(async (
    contractName: string,
    risk: string | null,
    clauses: Clause[],
    summary: string | null,
    opts: PdfExportOptions
  ) => {
    setIsExporting(true);

    try {
      // Generate HTML content for PDF
      const htmlContent = generateReportHtml(contractName, risk, clauses, summary, opts);
      
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Failed to open print window");
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // printWindow.close();
        }, 250);
      };

      return true;
    } catch (error) {
      console.error("PDF export failed:", error);
      return false;
    } finally {
      setIsExporting(false);
      setIsDialogOpen(false);
    }
  }, []);

  return {
    isExporting,
    isDialogOpen,
    setIsDialogOpen,
    options,
    setOptions,
    generatePdf,
  };
}

function generateReportHtml(
  contractName: string,
  risk: string | null,
  clauses: Clause[],
  summary: string | null,
  options: PdfExportOptions
): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const riskColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  const riskColor = risk ? riskColors[risk as keyof typeof riskColors] : "#6b7280";

  const highRiskCount = clauses.filter(c => c.risk === "high").length;
  const mediumRiskCount = clauses.filter(c => c.risk === "medium").length;
  const lowRiskCount = clauses.filter(c => c.risk === "low").length;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contract Analysis Report - ${contractName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; line-height: 1.6; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
    .title { font-size: 28px; font-weight: 600; margin-bottom: 5px; }
    .subtitle { color: #6b7280; font-size: 14px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; }
    .meta-item { text-align: center; }
    .meta-label { font-size: 11px; color: #6b7280; text-transform: uppercase; }
    .meta-value { font-size: 14px; font-weight: 600; }
    .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: white; background: ${riskColor}; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: 600; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
    .summary-box { padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #2563eb; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
    .stat-card { text-align: center; padding: 15px; border-radius: 8px; }
    .stat-card.high { background: #fef2f2; border: 1px solid #fecaca; }
    .stat-card.medium { background: #fffbeb; border: 1px solid #fde68a; }
    .stat-card.low { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .stat-number { font-size: 24px; font-weight: bold; }
    .stat-card.high .stat-number { color: #ef4444; }
    .stat-card.medium .stat-number { color: #f59e0b; }
    .stat-card.low .stat-number { color: #10b981; }
    .stat-label { font-size: 11px; color: #6b7280; }
    .clause { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; page-break-inside: avoid; }
    .clause-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .clause-title { font-weight: 600; }
    .clause-type { font-size: 11px; color: #6b7280; text-transform: uppercase; }
    .clause-summary { font-size: 13px; color: #374151; margin-bottom: 10px; }
    .clause-risk { font-size: 12px; padding: 10px; border-radius: 6px; margin-bottom: 10px; }
    .clause-risk.high { background: #fef2f2; color: #b91c1c; }
    .clause-risk.medium { background: #fffbeb; color: #b45309; }
    .clause-risk.low { background: #f0fdf4; color: #15803d; }
    .clause-original { font-size: 11px; color: #6b7280; padding: 10px; background: #f9fafb; border-radius: 6px; font-family: monospace; white-space: pre-wrap; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 11px; }
    @media print {
      body { padding: 20px; }
      .clause { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🔍 ContractCoach</div>
    <div class="title">Contract Analysis Report</div>
    <div class="subtitle">${contractName}</div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <div class="meta-label">Analysis Date</div>
      <div class="meta-value">${date}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Overall Risk</div>
      <div class="meta-value"><span class="risk-badge">${risk?.toUpperCase() || "N/A"}</span></div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Total Clauses</div>
      <div class="meta-value">${clauses.length}</div>
    </div>
    ${options.companyName ? `
    <div class="meta-item">
      <div class="meta-label">Company</div>
      <div class="meta-value">${options.companyName}</div>
    </div>
    ` : ""}
    ${options.preparedBy ? `
    <div class="meta-item">
      <div class="meta-label">Prepared By</div>
      <div class="meta-value">${options.preparedBy}</div>
    </div>
    ` : ""}
  </div>

  <div class="stats">
    <div class="stat-card high">
      <div class="stat-number">${highRiskCount}</div>
      <div class="stat-label">High Risk</div>
    </div>
    <div class="stat-card medium">
      <div class="stat-number">${mediumRiskCount}</div>
      <div class="stat-label">Medium Risk</div>
    </div>
    <div class="stat-card low">
      <div class="stat-number">${lowRiskCount}</div>
      <div class="stat-label">Low Risk</div>
    </div>
  </div>

  ${summary ? `
  <div class="section">
    <div class="section-title">Executive Summary</div>
    <div class="summary-box">${summary}</div>
  </div>
  ` : ""}

  <div class="section">
    <div class="section-title">Clause Analysis</div>
    ${clauses.map((clause, i) => `
    <div class="clause">
      <div class="clause-header">
        <div>
          <span class="clause-title">${i + 1}. ${clause.title}</span>
          <span class="clause-type">${clause.type}</span>
        </div>
        <span class="risk-badge" style="background: ${riskColors[clause.risk]}">${clause.risk}</span>
      </div>
      <div class="clause-summary">${clause.summary}</div>
      ${options.includeRiskDetails ? `
      <div class="clause-risk ${clause.risk}">
        <strong>Why It Matters:</strong> ${clause.whyItMatters}
      </div>
      ` : ""}
      ${options.includeOriginalText ? `
      <div class="clause-original">${clause.originalText}</div>
      ` : ""}
    </div>
    `).join("")}
  </div>

  <div class="footer">
    <p>Generated by ContractCoach AI • ${date}</p>
    <p>This analysis is for informational purposes only. Consult with legal counsel for professional advice.</p>
  </div>
</body>
</html>
  `;
}

export function PdfExportButton({ contractName, risk, clauses, summary }: PdfExportProps) {
  const { isExporting, isDialogOpen, setIsDialogOpen, options, setOptions, generatePdf } = usePdfExport();
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    const success = await generatePdf(contractName, risk, clauses, summary, options);
    if (success) {
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    }
  };

  const isDisabled = !risk || clauses.length === 0;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        disabled={isDisabled}
        className="text-xs"
      >
        {exported ? (
          <>
            <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
            Exported
          </>
        ) : (
          <>
            <FileDown className="h-3.5 w-3.5 mr-1.5" />
            Export PDF
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Export PDF Report
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs">Company Name (optional)</Label>
              <Input
                placeholder="Your Company"
                value={options.companyName}
                onChange={(e) => setOptions({ ...options, companyName: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Prepared By (optional)</Label>
              <Input
                placeholder="Your Name"
                value={options.preparedBy}
                onChange={(e) => setOptions({ ...options, preparedBy: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-xs font-medium">Include in Report</Label>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Original clause text</span>
                <Switch
                  checked={options.includeOriginalText}
                  onCheckedChange={(checked) => setOptions({ ...options, includeOriginalText: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Risk explanations</span>
                <Switch
                  checked={options.includeRiskDetails}
                  onCheckedChange={(checked) => setOptions({ ...options, includeRiskDetails: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="h-3.5 w-3.5 mr-1.5" />
                  Generate PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

