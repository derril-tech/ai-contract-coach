"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setStatus("Error: No code received");
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await fetch("/api/auth/google/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          throw new Error("Failed to exchange code");
        }

        const data = await res.json();
        // Store token in localStorage for now (MVP)
        // In a real app, this should be a secure cookie or associated with a user session in DB
        if (data.access_token) {
           localStorage.setItem("google_access_token", data.access_token);
        }

        setStatus("Success! Redirecting...");
        setTimeout(() => {
          router.push("/playground");
        }, 1000);
      } catch (err) {
        setStatus("Authentication failed.");
        console.error(err);
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 border rounded-lg bg-card text-center">
        <h2 className="text-xl font-bold mb-4">Google Drive Connection</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}

export default function AuthGoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}

