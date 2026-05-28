"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUserEmail(session.user.email || "");
      }
    };
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send SMS");

      setStatus("success");
      setPhone("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  if (!userEmail) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl text-blue-600">🚀 ReviewRocket Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{userEmail}</span>
            <button onClick={handleSignOut} className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign Out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Texts Sent</h3>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Reviews Generated</h3>
            <p className="text-3xl font-bold text-slate-900">~0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Account Status</h3>
            <p className="text-lg font-bold text-green-600">Active Beta</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border shadow-sm max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Send a Review Request</h2>
          <p className="text-slate-500 mb-8">Enter your customer's phone number to send them your Google Review link immediately.</p>
          
          <form onSubmit={handleSend} className="space-y-4">
            <input 
              type="tel" 
              placeholder="+1 555 123 4567" 
              className="w-full text-lg p-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full bg-blue-600 text-white font-bold text-lg p-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send SMS Now"}
            </button>

            {status === "success" && (
              <div className="p-3 bg-green-100 text-green-800 rounded-lg font-medium">✅ SMS Sent Successfully!</div>
            )}
            {status === "error" && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg font-medium">❌ Error: {errorMessage}</div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
