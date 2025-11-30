import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Get base URL for metadata (social images)
const getBaseUrl = () => {
  // Vercel automatically provides VERCEL_URL (includes protocol)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to custom env var or Railway URL
  return process.env.NEXT_PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "https://web-contract-coach-production.up.railway.app";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "ContractCoach | AI-Powered Contract Review",
  description: "Import agreements from Google Drive, extract key clauses, and get plain English risk assessments in seconds.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-bg-page font-sans antialiased", inter.variable, jetbrainsMono.variable)}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
