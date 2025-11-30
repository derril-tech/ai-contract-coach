"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Moon, SunMedium, LayoutDashboard, MessageSquare, FileText, Github, Linkedin, Heart, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/playground", label: "Playground", icon: MessageSquare },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-bg-page text-text-primary transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border-subtle bg-bg-elevated/90 px-4 py-5 md:flex">
        <Link href="/" className="flex items-center gap-3 px-2 mb-8">
          <div className="relative h-8 w-8">
            <Image src="/logo.png" alt="ContractCoach logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">ContractCoach</span>
            <span className="text-[11px] text-text-muted">AI Contract Review</span>
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-text-muted")} />
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
           <div className="rounded-xl border border-border-subtle bg-bg-subtle/50 p-4">
              <div className="flex items-center gap-3">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    DF
                 </div>
                 <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-xs font-medium">Derril Filemon</span>
                    <span className="truncate text-[11px] text-text-muted">Pro Plan</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-between px-1">
              <div className="flex gap-2">
                 <Link href="https://github.com/derril-tech" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
                    <Github className="h-4 w-4" />
                 </Link>
                 <Link href="https://www.linkedin.com/in/derril-filemon-a31715319" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                 </Link>
              </div>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full p-2 text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-subtle bg-bg-elevated/80 px-4 py-3 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-3 md:hidden">
             <Link href="/">
                <div className="relative h-8 w-8">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>
             </Link>
             <span className="text-sm font-semibold">ContractCoach</span>
          </div>

          {/* Desktop Header Content */}
          <div className="hidden items-center gap-2 md:flex">
            <FileText className="h-4 w-4 text-accent" />
            <span className="text-xs text-text-muted">
              {pathname === "/playground" ? "New Review Session" : "Dashboard Overview"}
            </span>
          </div>

          <div className="flex items-center gap-3">
             {/* Desktop Theme Toggle (added) */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:inline-flex rounded-full p-2 text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button variant="default" size="sm" asChild className="hidden sm:inline-flex bg-primary text-white hover:bg-primary/90 shadow-soft transition-all hover:translate-y-[-1px]">
              <Link href="/playground">
                 <MessageSquare className="mr-2 h-3 w-3" />
                 New Review
              </Link>
            </Button>
            
            {/* Mobile Theme Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 bg-bg-page p-4 md:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-bg-elevated/90 backdrop-blur-lg md:hidden pb-safe">
           <div className="flex items-center justify-around p-2">
              {navItems.map(({ href, label, icon: Icon, exact }) => {
                 const active = exact ? pathname === href : pathname.startsWith(href);
                 return (
                    <Link 
                       key={href} 
                       href={href}
                       className={cn(
                          "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                          active ? "text-primary" : "text-text-muted hover:text-text-secondary"
                       )}
                    >
                       <Icon className={cn("h-5 w-5", active && "fill-current/20")} />
                       <span className="text-[11px] font-medium">{label}</span>
                    </Link>
                 );
              })}
           </div>
        </nav>
        {/* Spacer for bottom nav */}
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}
