"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Send, 
  BarChart3, 
  Settings, 
  LogOut, 
  MessageSquarePlus, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  CreditCard
} from "lucide-react";

export default function Dashboard() {
  const [phone, setPhone] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

      useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // Fetch user's profile and sub status securely via backend to bypass RLS restrictions
      try {
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id })
        });
        const { profile } = await res.json();
        
        if (profile) {
          if (profile.default_message) setCustomMessage(profile.default_message);
          if (profile.google_review_link) setGoogleLink(profile.google_review_link);
          if (profile.stripe_subscription_status) setSubscriptionStatus(profile.stripe_subscription_status);
        } else {
          setCustomMessage("Thanks for choosing us! We'd love if you could leave a quick 5-star review here:");
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }

      // BULLETPROOF UNLOCK: If returning from Paystack checkout, force unlock immediately.
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        try {
          await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id })
          });
          setSubscriptionStatus('active');
          // Clean up URL silently
          window.history.replaceState({}, document.title, '/dashboard');
        } catch (e) {
          console.error('Failed to verify session', e);
        }
      }

      // We set the user email LAST. The dashboard uses `if (!userEmail)` to show a loading spinner.
      // Setting this after all the profile fetching finishes prevents the paywall from flashing.
      setUserEmail(session.user.email || "");
      setUserId(session.user.id);
    };

    fetchData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCheckout = async () => {
    try {
      setStatus("loading");
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, userId: userId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleLink) {
      setErrorMessage("Please set your Google Review Link in Settings first!");
      setStatus("error");
      return;
    }
    
    setStatus("loading");

    try {
      const fullMessage = `${customMessage} ${googleLink}`;

      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phoneNumber: phone,
          message: fullMessage
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send SMS");

      setStatus("success");
      setPhone("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // --- THE PAYWALL ---
  if (subscriptionStatus !== 'active') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] font-sans text-slate-900 flex flex-col">
        <nav className="bg-white border-b border-slate-200 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="font-bold text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm">
                <Send size={16} />
              </div>
              ReviewMantis
            </div>
            <button onClick={handleSignOut} className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign Out</button>
          </div>
        </nav>
        
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="w-16 h-16 bg-blue-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Activate Your Account</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              You are one step away from putting your Google Reviews on autopilot. Upgrade to Pro to unlock the SMS dashboard.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-slate-900">ReviewMantis Pro</span>
                <span className="text-xl font-bold">$29<span className="text-sm font-normal text-slate-500">/mo</span></span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Unlimited SMS requests</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Custom message templates</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Auto-appended review links</li>
              </ul>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={status === "loading"}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition active:scale-[0.98] disabled:opacity-50 shadow-md"
            >
              {status === "loading" ? "Connecting to secure checkout..." : "Upgrade to Pro"}
            </button>
            <p className="mt-4 text-xs text-slate-400">Secure checkout provided by Stripe.</p>
          </div>
        </main>
      </div>
    );
  }

  // --- THE FULL DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm">
                <Send size={16} />
              </div>
              ReviewMantis
            </Link>
            
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-500">
              <Link href="/dashboard" className="px-3 py-1.5 bg-slate-100 text-slate-900 rounded-md transition">Overview</Link>
              <span className="px-3 py-1.5 text-slate-400 cursor-not-allowed">Customers</span>
              <Link href="/settings" className="px-3 py-1.5 hover:text-slate-900 transition">Settings</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Pro Active
            </div>
            <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-slate-600 transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your review requests and monitor conversions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-emerald-600">
                <Send size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Requests Sent</p>
              <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">0</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BarChart3 size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Est. Reviews Generated</p>
              <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">~0</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                <Settings size={20} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                Pro
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Current Plan</p>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">$29/mo</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">Send Request</h2>
                <p className="text-sm text-slate-500 mt-1">Text your Google link to a customer.</p>
              </div>
              <div className="p-6 bg-slate-50/50">
                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Customer Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-medium text-slate-700">Message</label>
                      {!googleLink && <Link href="/settings" className="text-xs font-bold text-red-600 hover:underline">⚠️ Link Missing</Link>}
                    </div>
                    <textarea 
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={3}
                      className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm resize-none"
                    />
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      + {googleLink ? googleLink : "[Configure link in Settings]"}
                    </p>
                  </div>

                  {status === "success" && (
                    <div className="flex items-start gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                      <p>SMS delivered successfully!</p>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
                      <p>Failed: {errorMessage}</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm p-3 rounded-lg transition disabled:opacity-50 active:scale-[0.98] shadow-sm"
                  >
                    {status === "loading" ? "Sending..." : "Send SMS"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden h-full">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <div className="p-12 flex flex-col items-center justify-center text-center h-[calc(100%-80px)]">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <Clock size={24} className="text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">No requests sent yet</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  When you send a review request, it will appear here along with its delivery status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
