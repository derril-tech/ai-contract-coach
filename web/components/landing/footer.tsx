import Link from "next/link";
import { Github, Linkedin, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-bg-subtle/30 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 text-sm md:flex-row md:px-12">
        
        <div className="flex flex-col gap-2 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-2 font-semibold text-text-primary">
              <span>ContractCoach</span>
              <span className="text-text-muted font-normal">•</span>
              <span className="text-text-muted font-normal">© 2025 Derril Filemon</span>
           </div>
           <p className="text-xs text-text-muted">
              Built with Next.js 15 & OpenAI SDK.
           </p>
        </div>

        <div className="flex items-center gap-6">
           <Link 
              href="https://github.com/derril-tech" 
              target="_blank"
              className="group flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
           >
              <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Github</span>
           </Link>
           <Link 
              href="https://www.linkedin.com/in/derril-filemon-a31715319" 
              target="_blank"
              className="group flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
           >
              <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
           </Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-elevated/50 px-3 py-1.5 rounded-full border border-border-subtle">
           <span>Created by Derril Filemon</span>
           <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
        </div>

      </div>
    </footer>
  );
}

