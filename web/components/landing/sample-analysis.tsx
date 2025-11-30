import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle2, FileText } from "lucide-react";

export function SampleAnalysis() {
  return (
    <Card className="border-border-subtle/80 bg-bg-elevated shadow-strong transition-all hover:shadow-soft">
      <CardHeader className="space-y-1 pb-3 border-b border-border-subtle/50">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-secondary" />
              <CardTitle className="text-sm font-semibold">SaaS_Subscription_MSA.pdf</CardTitle>
           </div>
           <Badge className="bg-accent/10 text-[11px] text-accent border border-accent/20 px-2 py-0.5">
              Medium Risk
           </Badge>
        </div>
        <p className="text-[11px] text-text-muted pl-6">
          18 pages · 37 clauses · 5 flagged as unusual
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Top Risk Factors</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3 p-2 rounded-md bg-bg-subtle/50">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
              <span className="text-xs text-text-secondary leading-snug">Termination for convenience only granted to the client.</span>
            </li>
            <li className="flex items-start gap-3 p-2 rounded-md bg-bg-subtle/50">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-xs text-text-secondary leading-snug">Liability cap excludes data security incidents.</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
          <p className="mb-1 text-[11px] font-bold text-primary uppercase tracking-wider">Plain English Summary</p>
          <p className="text-xs text-text-secondary leading-relaxed">
            This contract is mostly balanced, but the client can end it more easily than you can, and your liability for security
            issues is broader than typical SaaS agreements. Consider asking for mutual termination rights.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t border-border-subtle/50 pt-3 bg-bg-subtle/30">
        <Badge variant="outline" className="border-accent/40 text-[11px] text-accent bg-accent/5">
          5 risky clauses
        </Badge>
        <div className="flex items-center gap-1 text-[11px] text-emerald-600">
           <CheckCircle2 className="h-3 w-3" />
           <span>12 standard protections</span>
        </div>
      </CardFooter>
    </Card>
  );
}

