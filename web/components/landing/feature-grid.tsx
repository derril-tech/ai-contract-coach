import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Highlighter, Sparkles, FolderOpen } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Risk at a glance",
    body: "See overall contract risk and clause-level severity before you sign.",
  },
  {
    icon: Highlighter,
    title: "Clause highlights",
    body: "Payment, IP, confidentiality, termination, and liability clauses automatically surfaced.",
  },
  {
    icon: Sparkles,
    title: "Plain English summaries",
    body: "Turn dense paragraphs into human explanations and negotiation guidance.",
  },
  {
    icon: FolderOpen,
    title: "Google Drive native",
    body: "Connect once, then import any agreement without leaving your workflow.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-bg-page py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Built for real-world contract review
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              ContractCoach isn&apos;t just a chat bot. It&apos;s an opinionated review assistant tuned for legal documents and powered by OpenAI.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <Card
              key={title}
              className="group border-border-subtle/80 bg-bg-elevated/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft hover:bg-bg-elevated"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-text-secondary leading-relaxed">{body}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

