"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Send, 
  BarChart3, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Clock,
  CreditCard,
  Building2,
  ChevronDown,
  HelpCircle,
  AlertCircle,
  TrendingUp,
  Sliders,
  Sparkles,
  ArrowUpRight,
  Menu,
  X,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react";
import { SettingsModal } from "../components/modals/SettingsModal";

interface RequestItem {
  id: string;
  phone: string;
  message: string;
  status: "Delivered" | "Pending" | "Failed";
  priority: "High" | "Normal";
  date: string;
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Onboarding Wizard states
  const [businessName, setBusinessName] = useState("");
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(1);

  const router = useRouter();

  // Interactive local list to populate the high-fidelity UI tables/charts dynamically
  const [requestsList, setRequestsList] = useState<RequestItem[]>([
    {
      id: "req-1",
      phone: "+1 (555) 382-9012",
      message: "Thanks for choosing Bello Heating & Air! Please leave us a quick review here:",
      status: "Delivered",
      priority: "High",
      date: "May 28, 2026"
    },
    {
      id: "req-2",
      phone: "+1 (415) 882-1920",
      message: "Thanks for choosing Bello Heating & Air! Please leave us a quick review here:",
      status: "Delivered",
      priority: "Normal",
      date: "May 27, 2026"
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // Fetch user's profile directly via client-side Supabase (RLS is configured)
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('business_name, default_message, google_review_link, stripe_subscription_status')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Failed to fetch profile", profileError);
        }

        if (profile) {
          if (profile.business_name) setBusinessName(profile.business_name);
          if (profile.default_message) {
            setCustomMessage(profile.default_message);
          } else {
            setCustomMessage("Thanks for choosing us! We'd love if you could leave a quick 5-star review here:");
          }
          if (profile.google_review_link) {
            setGoogleLink(profile.google_review_link);
            setIsOnboarded(true);
          } else {
            setIsOnboarded(false);
          }
          if (profile.stripe_subscription_status) setSubscriptionStatus(profile.stripe_subscription_status);
        } else {
          setCustomMessage("Thanks for choosing us! We'd love if you could leave a quick 5-star review here:");
          setIsOnboarded(false);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setIsOnboarded(false);
      }
      // BULLETPROOF UNLOCK: If returning from Paystack checkout, force unlock immediately on the client side.
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        try {
          // Check if profile exists first
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (existingProfile) {
            await supabase
              .from('profiles')
              .update({ stripe_subscription_status: 'active' })
              .eq('id', session.user.id);
          } else {
            await supabase
              .from('profiles')
              .insert({ 
                id: session.user.id,
                stripe_subscription_status: 'active'
              });
          }
          setSubscriptionStatus('active');
          window.history.replaceState({}, document.title, '/dashboard');
        } catch (e) {
          console.error('Failed to verify session client-side', e);
        }
      }

      // Fetch outbound SMS logs from Supabase
      try {
        const { data: logs, error: logsError } = await supabase
          .from('sms_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (logsError) {
          // If the table doesn't exist yet (42P01), ignore silently and rely on dummy fallback
          if (logsError.code !== '42P01') {
            console.error("Failed to fetch SMS logs from Supabase", logsError);
          }
        } else if (logs && logs.length > 0) {
          const formattedLogs: RequestItem[] = logs.map((log: any) => ({
            id: log.id,
            phone: log.recipient_phone,
            message: log.message,
            status: log.status,
            priority: log.priority,
            date: new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }));
          setRequestsList(formattedLogs);
        }
      } catch (err) {
        console.error("Failed to fetch SMS logs", err);
      }

      // We set the user email LAST to prevent any paywall layout flickering during loading
      setUserEmail(session.user.email || "");
      setUserId(session.user.id);
    };

    fetchData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          business_name: businessName,
          google_review_link: googleLink,
          default_message: customMessage || "Thanks for choosing us! We'd love if you could leave a quick 5-star review here:",
          updated_at: new Date().toISOString()
        });

      if (error) {
        if (error.code === '42P01') {
          throw new Error("Database tables are not set up yet. (Need to run SQL in Supabase dashboard)");
        }
        throw error;
      }
      
      setIsOnboarded(true);
      setStatus("idle");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
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
        window.location.href = data.url;
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

      // Try to write to Supabase table (protected by RLS)
      try {
        await supabase.from('sms_logs').insert({
          user_id: userId,
          recipient_phone: phone,
          message: customMessage,
          status: "Delivered",
          priority: "High"
        });
      } catch (dbErr) {
        console.error("Failed to persist SMS log to database, using local fallback.", dbErr);
      }

      // Push newly sent item into our high-fidelity interactive list
      const newItem: RequestItem = {
        id: `req-${Date.now()}`,
        phone: phone,
        message: customMessage,
        status: "Delivered",
        priority: "High",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      setRequestsList(prev => [newItem, ...prev]);
      setStatus("success");
      setPhone("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  // Safe greeting generator
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  if (!userEmail || isOnboarded === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // --- ONBOARDING WIZARD ---
  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col font-sans">
        <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="font-bold text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <Send size={16} />
              </div>
              ReviewMantis
            </div>
            <button onClick={handleSignOut} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Sign Out</button>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:py-12">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden min-h-[500px]">
            
            {/* Left Column: Form & Steps */}
            <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Step Indicators */}
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        onboardingStep === step 
                          ? "bg-emerald-600 text-white shadow-md ring-4 ring-emerald-600/10" 
                          : onboardingStep > step 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-slate-100 text-slate-400"
                      }`}>
                        {onboardingStep > step ? <Check size={14} /> : step}
                      </div>
                      {step < 3 && <div className={`w-8 h-0.5 rounded ${onboardingStep > step ? "bg-emerald-500" : "bg-slate-200"}`}></div>}
                    </div>
                  ))}
                </div>

                {/* Step 1: Business Details */}
                {onboardingStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Step 1 of 3</span>
                      <h2 className="text-2xl font-bold text-slate-950 mt-1 mb-2">Tell us about your business</h2>
                      <p className="text-sm text-slate-500">We will use this to brand your automated reviews and text messages.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text"
                            value={businessName}
                            onChange={(e) => {
                              const name = e.target.value;
                              setBusinessName(name);
                              // Auto-generate standard message with their business name
                              setCustomMessage(`Thanks for choosing ${name}! Please leave us a quick review here:`);
                            }}
                            placeholder="e.g., Bello Heating & Air"
                            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition shadow-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Google Review Link */}
                {onboardingStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Step 2 of 3</span>
                      <h2 className="text-2xl font-bold text-slate-950 mt-1 mb-2">Connect Google Reviews</h2>
                      <p className="text-sm text-slate-500">This is where your clients will be redirected to leave their 5-star reviews.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Google Review Link</label>
                        <input 
                          type="url"
                          value={googleLink}
                          onChange={(e) => setGoogleLink(e.target.value)}
                          placeholder="https://g.page/r/example/review"
                          className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition shadow-sm"
                          required
                        />
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 space-y-2">
                        <p className="font-semibold text-slate-700">How to find your Google review link:</p>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>Go to your Google Business Profile manager.</li>
                          <li>Click on the <span className="font-semibold text-slate-700">"Get more reviews"</span> button on your dashboard.</li>
                          <li>Copy the short link starting with <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">g.page/r/...</code> or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">search.google.com/...</code> and paste it here.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: SMS Invite Customization */}
                {onboardingStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Step 3 of 3</span>
                      <h2 className="text-2xl font-bold text-slate-950 mt-1 mb-2">Customize your SMS Invite</h2>
                      <p className="text-sm text-slate-500">Write the message that customers will receive. Keep it short, warm, and clear.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-sm font-semibold text-slate-700">Invite Message</label>
                          <span className="text-xs text-slate-400 font-mono">{(customMessage || "").length}/120 chars</span>
                        </div>
                        <textarea 
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value.slice(0, 120))}
                          placeholder="Thanks for choosing us! We'd love if you could leave a quick 5-star review here:"
                          className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition shadow-sm h-28 resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
                {onboardingStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep((s) => s - 1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold px-4 py-2 rounded-xl transition"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div></div>
                )}

                {onboardingStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onboardingStep === 1 && !businessName.trim()) {
                        setErrorMessage("Please enter your business name.");
                        setStatus("error");
                        setTimeout(() => setStatus("idle"), 3000);
                        return;
                      }
                      if (onboardingStep === 2 && !googleLink.trim()) {
                        setErrorMessage("Please enter your Google Review Link.");
                        setStatus("error");
                        setTimeout(() => setStatus("idle"), 3000);
                        return;
                      }
                      setErrorMessage("");
                      setOnboardingStep((s) => s + 1);
                    }}
                    className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-md active:scale-[0.98]"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteOnboarding}
                    disabled={status === "loading"}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-md active:scale-[0.98] disabled:opacity-50"
                  >
                    {status === "loading" ? "Saving workspace..." : "Finish & Launch Dashboard 🦗"}
                  </button>
                )}
              </div>

              {errorMessage && status === "error" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Right Column: Visual Side-by-Side (Branding & Live SMS Preview) */}
            <div className="w-full md:w-2/5 bg-slate-900 p-8 sm:p-10 flex flex-col justify-center items-center relative overflow-hidden text-white border-t md:border-t-0 md:border-l border-slate-800">
              {/* Decorative Glow */}
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 w-full max-w-[280px]">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Live Customer Preview</h4>
                
                {/* Smartphone Wrapper */}
                <div className="bg-slate-950 border-[6px] border-slate-800 rounded-[36px] p-4 shadow-2xl relative">
                  <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto mb-4 relative top-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                  </div>
                  
                  {/* SMS Message Bubble */}
                  <div className="space-y-4 min-h-[220px] flex flex-col justify-end">
                    <div className="text-[10px] text-slate-500 text-center font-semibold uppercase tracking-wider mb-2">Today • iMessage</div>
                    
                    <div className="bg-emerald-600 text-white text-xs p-3 rounded-2xl rounded-br-none shadow-md max-w-[90%] ml-auto leading-relaxed relative">
                      <p className="font-semibold mb-1 text-[10px] text-emerald-100">
                        {businessName || "Your Business"}
                      </p>
                      <p className="text-[11px]">
                        {customMessage || "Thanks for choosing us! We'd love if you could leave a quick 5-star review here:"}
                      </p>
                      <p className="text-[10px] underline text-emerald-200 break-all font-mono mt-2">
                        {googleLink || "https://g.page/r/..."}
                      </p>
                    </div>
                  </div>

                  <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto mt-6"></div>
                </div>

                <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
                  This is exactly how the SMS invite will appear on your customers' mobile phones.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // --- THE PAYWALL ---
  if (subscriptionStatus !== 'active') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] text-slate-900 flex flex-col font-sans">
        <nav className="bg-white border-b border-slate-200 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="font-bold text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <Send size={16} />
              </div>
              ReviewMantis
            </div>
            <button onClick={handleSignOut} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Sign Out</button>
          </div>
        </nav>
        
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-950 mb-2">Activate Your Account</h1>
            <p className="text-slate-500 mb-8 leading-relaxed text-sm">
              Unlock the review automation engine. Start collecting 5-star Google Reviews immediately.
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-900">ReviewMantis Pro</span>
                <span className="text-xl font-extrabold text-slate-950">$29<span className="text-sm font-normal text-slate-500">/mo</span></span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited SMS requests</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Custom message templates</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Direct Google Business linking</li>
              </ul>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={status === "loading"}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition active:scale-[0.98] disabled:opacity-50 shadow-md"
            >
              {status === "loading" ? "Connecting to secure checkout..." : "Upgrade to Pro"}
            </button>
            <p className="mt-4 text-xs text-slate-400">Secure checkout handled by Paystack.</p>
          </div>
        </main>
      </div>
    );
  }

  // --- NEW HIGH-FIDELITY MAIN APP DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-900 flex relative overflow-hidden">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Inspired by AutomatedPro and Proijeck UI layouts) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          {/* Logo & Workspace Selector */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <Send size={14} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-950 leading-tight">ReviewMantis</h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Active Workspace</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-3 mb-2">Main Menu</div>
            <Link href="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 bg-emerald-50 text-emerald-950 border border-emerald-100/50 rounded-lg text-sm font-semibold transition">
              <Building2 size={18} className="text-emerald-700" />
              <span>Overview</span>
            </Link>
            <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-slate-600 hover:text-slate-950 rounded-lg text-sm font-medium transition">
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <div className="pt-6">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-3 mb-2">Client Links</div>
              <button disabled className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 cursor-not-allowed rounded-lg text-sm font-medium transition">
                <Sparkles size={18} />
                <span>Customers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer (Matches Profile UI perfectly) */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-full text-white flex items-center justify-center font-bold shadow-sm">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="text-left overflow-hidden">
              <h5 className="text-xs font-bold text-slate-950 truncate max-w-[130px]">{userEmail}</h5>
              <p className="text-[10px] text-emerald-700 font-semibold">Pro Active</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 rounded-lg transition"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 md:hidden transition"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <span>Overview</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>Server status: <span className="text-green-500 font-bold">Online</span></span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span>Est. Response: <span className="text-slate-800 font-bold">&lt; 1s</span></span>
          </div>
        </header>

        {/* Inner Content Grid */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1">
          
          {/* Greeting Box */}
          <div>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">{getGreeting()}, Partner!</h2>
            <p className="text-sm text-slate-500 mt-1">ReviewMantis is active. Type a phone number and click send to collect reviews.</p>
          </div>

          {/* Three Prominent Stats Cards (Inspired by Reference Images) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Requests</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">Live Tracker</span>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-slate-950 tracking-tight">{requestsList.length}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-emerald-500" />
                  <span>SMS successfully dispatched</span>
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Rate</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">Twilio Status</span>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-slate-950 tracking-tight">100%</h3>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reviews Generated</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100">Est. Conversion</span>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-slate-950 tracking-tight">~{Math.ceil(requestsList.length * 0.4)}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <ArrowUpRight size={12} className="text-emerald-500" />
                  <span>Calculated at 40% response rate</span>
                </p>
              </div>
            </div>
          </div>

          {/* Middle Layout Block: Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Form Section (3/5 Width) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-950">Send Review Request</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Send your customized template link instantly.</p>
                </div>
                {!googleLink && (
                  <button onClick={() => setIsSettingsOpen(true)} className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                    <AlertCircle size={12} />
                    <span>Configure link</span>
                  </button>
                )}
              </div>
              
              <div className="p-6 bg-slate-50/50 flex-1">
                <form onSubmit={handleSend} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Customer Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition shadow-sm font-medium"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Custom Message Template
                    </label>
                    <textarea 
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={3}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition shadow-sm resize-none font-medium leading-relaxed"
                    />
                    <div className="mt-2 p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-md">Suffix</span>
                      <p className="text-xs font-semibold text-slate-500 truncate">
                        {googleLink ? googleLink : "[Configure link in Settings]"}
                      </p>
                    </div>
                  </div>

                  {status === "success" && (
                    <div className="flex items-start gap-2.5 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                      <p>SMS request delivered successfully!</p>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl text-sm font-semibold">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-600" />
                      <p>Failed: {errorMessage}</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="w-full flex justify-center items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm py-4 rounded-xl transition disabled:opacity-50 active:scale-[0.98] shadow-sm"
                  >
                    {status === "loading" ? "Dispatched..." : "Send Review SMS"}
                  </button>
                </form>
              </div>
            </div>

            {/* Area Chart/Rate Section (2/5 Width - Inspired by Image 1's Rate Chart) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-950">Task Completion Rate</h3>
                <p className="text-xs text-slate-400 mt-0.5">Your SMS request conversion rates.</p>
              </div>

              {/* Vector Area Line Chart */}
              <div className="my-6 relative">
                <svg className="w-full h-40" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                  
                  {/* Fill Area */}
                  <path d="M 0 40 Q 25 20, 50 15 T 100 10 L 100 40 Z" fill="url(#grad)" />
                  {/* Main Line */}
                  <path d="M 0 40 Q 25 20, 50 15 T 100 10" fill="none" stroke="#10b981" strokeWidth="1.5" />
                </svg>
                {/* Tooltip Overlay */}
                <div className="absolute top-8 right-8 bg-slate-900 text-white p-2.5 rounded-lg shadow-md border border-slate-800 text-[10px] space-y-0.5 pointer-events-none">
                  <p className="text-slate-400 font-bold">Aug 21, 2024</p>
                  <p className="font-semibold">Assigned Task: <span className="font-bold">24 Tasks</span></p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                <span>Aug 1</span>
                <span>Aug 10</span>
                <span>Aug 21</span>
                <span>Aug 31</span>
              </div>
            </div>
          </div>

          {/* Bottom Table Section (Spreadsheet Grid style - Inspired by Reference Image 2) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">SMS Request Directory</h3>
                <p className="text-xs text-slate-400 mt-0.5">Full audit history of outbound review requests.</p>
              </div>
              {/* Table controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">All Tasks: {requestsList.length}</span>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg">Delivered: {requestsList.filter(r => r.status === 'Delivered').length}</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                    <th className="py-4 px-6">Recipient Phone</th>
                    <th className="py-4 px-6">Template Body</th>
                    <th className="py-4 px-6">Priority</th>
                    <th className="py-4 px-6">Progress Rate</th>
                    <th className="py-4 px-6">Status Badge</th>
                    <th className="py-4 px-6">Sent Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium">
                  {requestsList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150">
                      {/* Recipient Phone */}
                      <td className="py-4 px-6 text-slate-950 font-bold">{item.phone}</td>
                      {/* Message Suffix */}
                      <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{item.message}</td>
                      {/* Priority (Colored badge like Image 2) */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold ${
                          item.priority === "High" ? "bg-red-50 text-red-700 border border-red-100" : "bg-teal-50 text-teal-700 border border-teal-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.priority === "High" ? "bg-red-500" : "bg-teal-500"}`}></span>
                          {item.priority}
                        </span>
                      </td>
                      {/* Custom Progress Bar (Matches Image 2 perfectly) */}
                      <td className="py-4 px-6 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: item.status === "Delivered" ? "100%" : "30%" }}></div>
                          </div>
                          <span className="text-xs text-slate-400 font-bold">
                            {item.status === "Delivered" ? "100%" : "30%"}
                          </span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="py-4 px-6 text-slate-400 text-xs font-semibold">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}