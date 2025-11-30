import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UploadCloud, ScanLine, ListChecks, FileText } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Connect Google Drive",
    body: "Authorize read-only access so ContractCoach can pull your agreement securely.",
  },
  {
    icon: ScanLine,
    title: "AI clause extraction",
    body: "OpenAI SDK parses and classifies key clauses from long documents.",
  },
  {
    icon: ListChecks,
    title: "Risk assessment",
    body: "Unusual terms and missing protections are highlighted with clear reasoning.",
  },
  {
    icon: FileText,
    title: "Plain English summary",
    body: "Get a shareable digest and suggested edits you can send to your counterpart.",
  },
];

export function Steps() {
  return (
    <section id="how-it-works" className="bg-bg-subtle/40 py-24 border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl mb-4">
             How ContractCoach reads your contracts
           </h2>
           <p className="max-w-2xl mx-auto text-lg text-text-secondary">
             From Google Drive import to negotiation-ready suggestions, every step is designed to keep you informed and protected.
           </p>
        </div>
        
        <div className="relative grid gap-8 md:grid-cols-4">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-6 left-0 right-0 hidden md:block h-0.5 bg-border-subtle top-[2.5rem] z-0" />
          
          {steps.map(({ icon: Icon, title, body }, index) => (
            <div key={title} className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left group">
               <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-bg-page bg-bg-elevated shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:border-primary/20">
                  <Icon className="h-8 w-8 text-primary" />
               </div>
               <h3 className="text-lg font-semibold mb-2">{title}</h3>
               <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

