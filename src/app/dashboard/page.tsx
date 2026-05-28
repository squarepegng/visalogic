     1|"use client";
     2|
     3|import { useState, useEffect } from "react";
     4|import { supabase } from "@/lib/supabase";
     5|import { useRouter, useSearchParams } from "next/navigation";
     6|import Link from "next/link";
     7|import { 
     8|  Send, 
     9|  BarChart3, 
    10|  Settings, 
    11|  LogOut, 
    12|  MessageSquarePlus, 
    13|  CheckCircle2, 
    14|  Clock,
    15|  ArrowUpRight,
    16|  CreditCard
    17|} from "lucide-react";
    18|
    19|export default function Dashboard() {
    20|  const [phone, setPhone] = useState("");
    21|  const [customMessage, setCustomMessage] = useState("");
    22|  const [googleLink, setGoogleLink] = useState("");
    23|  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive");
    24|  
    25|  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    26|  const [errorMessage, setErrorMessage] = useState("");
    27|  
    28|  const [userEmail, setUserEmail] = useState<string | null>(null);
    29|  const [userId, setUserId] = useState<string | null>(null);
    30|  const router = useRouter();
    31|
    32|  useEffect(() => {
    33|    const fetchData = async () => {
    34|      const { data: { session } } = await supabase.auth.getSession();
    35|      if (!session) {
    36|        router.push("/login");
    37|        return;
    38|      }
    39|      setUserEmail(session.user.email || "");
    40|      setUserId(session.user.id);
    41|
    42|      // Fetch user's profile and sub status
    43|      const { data: profile } = await supabase
    44|        .from('profiles')
    45|        .select('default_message, google_review_link, stripe_subscription_status')
    46|        .eq('id', session.user.id)
    47|        .single();
    48|
    49|      if (profile) {
    50|        if (profile.default_message) setCustomMessage(profile.default_message);
    51|        if (profile.google_review_link) setGoogleLink(profile.google_review_link);
    52|        if (profile.stripe_subscription_status) setSubscriptionStatus(profile.stripe_subscription_status);
    53|      } else {
    54|        setCustomMessage("Thanks for choosing us! We'd love if you could leave a quick 5-star review here:");
    55|      }
    56|    };
    57|
    58|    fetchData();
    59|  }, [router]);
    60|
    61|  const handleSignOut = async () => {
    62|    await supabase.auth.signOut();
    63|    router.push("/login");
    64|  };
    65|
    66|  const handleCheckout = async () => {
    67|    try {
    68|      setStatus("loading");
    69|      const res = await fetch('/api/checkout', {
    70|        method: 'POST',
    71|        headers: { 'Content-Type': 'application/json' },
    72|        body: JSON.stringify({ email: userEmail, userId: userId }),
    73|      });
    74|      const data = await res.json();
    75|      if (data.url) {
    76|        window.location.href = data.url; // Redirect to Stripe
    77|      } else {
    78|        throw new Error(data.error || "Failed to create checkout session");
    79|      }
    80|    } catch (err: any) {
    81|      setStatus("error");
    82|      setErrorMessage(err.message);
    83|    }
    84|  };
    85|
    86|  const handleSend = async (e: React.FormEvent) => {
    87|    e.preventDefault();
    88|    if (!googleLink) {
    89|      setErrorMessage("Please set your Google Review Link in Settings first!");
    90|      setStatus("error");
    91|      return;
    92|    }
    93|    
    94|    setStatus("loading");
    95|
    96|    try {
    97|      const fullMessage = `${customMessage} ${googleLink}`;
    98|
    99|      const res = await fetch("/api/send-sms", {
   100|        method: "POST",
   101|        headers: { "Content-Type": "application/json" },
   102|        body: JSON.stringify({ 
   103|          phoneNumber: phone,
   104|          message: fullMessage
   105|        }),
   106|      });
   107|
   108|      const data = await res.json();
   109|      if (!res.ok) throw new Error(data.error || "Failed to send SMS");
   110|
   111|      setStatus("success");
   112|      setPhone("");
   113|      setTimeout(() => setStatus("idle"), 4000);
   114|    } catch (err: any) {
   115|      setStatus("error");
   116|      setErrorMessage(err.message);
   117|    }
   118|  };
   119|
   120|  if (!userEmail) {
   121|    return (
   122|      <div className="min-h-screen flex items-center justify-center bg-slate-50">
   123|        <div className="animate-pulse flex flex-col items-center gap-4">
   124|          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
   125|          <p className="text-slate-500 font-medium">Loading workspace...</p>
   126|        </div>
   127|      </div>
   128|    );
   129|  }
   130|
   131|  // --- THE PAYWALL ---
   132|  if (subscriptionStatus !== 'active') {
   133|    return (
   134|      <div className="min-h-screen bg-[#F7F9FC] font-sans text-slate-900 flex flex-col">
   135|        <nav className="bg-white border-b border-slate-200 p-4">
   136|          <div className="max-w-6xl mx-auto flex justify-between items-center">
   137|            <div className="font-bold text-lg flex items-center gap-2">
   138|              <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm">
   139|                <Send size={16} />
   140|              </div>
   141|              ReviewMantis
   142|            </div>
   143|            <button onClick={handleSignOut} className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign Out</button>
   144|          </div>
   145|        </nav>
   146|        
   147|        <main className="flex-1 flex items-center justify-center p-6">
   148|          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-center relative overflow-hidden">
   149|            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
   150|            <div className="w-16 h-16 bg-blue-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
   151|              <CreditCard size={32} />
   152|            </div>
   153|            <h1 className="text-2xl font-bold text-slate-900 mb-2">Activate Your Account</h1>
   154|            <p className="text-slate-500 mb-8 leading-relaxed">
   155|              You are one step away from putting your Google Reviews on autopilot. Upgrade to Pro to unlock the SMS dashboard.
   156|            </p>
   157|            
   158|            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
   159|              <div className="flex justify-between items-center mb-4">
   160|                <span className="font-semibold text-slate-900">ReviewMantis Pro</span>
   161|                <span className="text-xl font-bold">$29<span className="text-sm font-normal text-slate-500">/mo</span></span>
   162|              </div>
   163|              <ul className="space-y-3 text-sm text-slate-600">
   164|                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Unlimited SMS requests</li>
   165|                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Custom message templates</li>
   166|                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Auto-appended review links</li>
   167|              </ul>
   168|            </div>
   169|
   170|            <button 
   171|              onClick={handleCheckout}
   172|              disabled={status === "loading"}
   173|              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition active:scale-[0.98] disabled:opacity-50 shadow-md"
   174|            >
   175|              {status === "loading" ? "Connecting to secure checkout..." : "Upgrade to Pro"}
   176|            </button>
   177|            <p className="mt-4 text-xs text-slate-400">Secure checkout provided by Stripe.</p>
   178|          </div>
   179|        </main>
   180|      </div>
   181|    );
   182|  }
   183|
   184|  // --- THE FULL DASHBOARD ---
   185|  return (
   186|    <div className="min-h-screen bg-[#F7F9FC] font-sans text-slate-900">
   187|      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
   188|        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
   189|          <div className="flex items-center gap-8">
   190|            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
   191|              <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm">
   192|                <Send size={16} />
   193|              </div>
   194|              ReviewMantis
   195|            </Link>
   196|            
   197|            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-500">
   198|              <Link href="/dashboard" className="px-3 py-1.5 bg-slate-100 text-slate-900 rounded-md transition">Overview</Link>
   199|              <span className="px-3 py-1.5 text-slate-400 cursor-not-allowed">Customers</span>
   200|              <Link href="/settings" className="px-3 py-1.5 hover:text-slate-900 transition">Settings</Link>
   201|            </div>
   202|          </div>
   203|
   204|          <div className="flex items-center gap-4">
   205|            <div className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600">
   206|              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
   207|              Pro Active
   208|            </div>
   209|            <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white">
   210|              {userEmail.charAt(0).toUpperCase()}
   211|            </div>
   212|            <button onClick={handleSignOut} className="text-slate-400 hover:text-slate-600 transition">
   213|              <LogOut size={20} />
   214|            </button>
   215|          </div>
   216|        </div>
   217|      </nav>
   218|
   219|      <main className="max-w-6xl mx-auto px-6 py-8">
   220|        <div className="flex justify-between items-end mb-8">
   221|          <div>
   222|            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1>
   223|            <p className="text-sm text-slate-500 mt-1">Manage your review requests and monitor conversions.</p>
   224|          </div>
   225|        </div>
   226|
   227|        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
   228|          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
   229|            <div className="flex justify-between items-start mb-4">
   230|              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-emerald-600">
   231|                <Send size={20} />
   232|              </div>
   233|            </div>
   234|            <div>
   235|              <p className="text-sm font-medium text-slate-500 mb-1">Total Requests Sent</p>
   236|              <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">0</h3>
   237|            </div>
   238|          </div>
   239|          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
   240|            <div className="flex justify-between items-start mb-4">
   241|              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
   242|                <BarChart3 size={20} />
   243|              </div>
   244|            </div>
   245|            <div>
   246|              <p className="text-sm font-medium text-slate-500 mb-1">Est. Reviews Generated</p>
   247|              <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">~0</h3>
   248|            </div>
   249|          </div>
   250|          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
   251|            <div className="flex justify-between items-start mb-4">
   252|              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
   253|                <Settings size={20} />
   254|              </div>
   255|              <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full">
   256|                Pro
   257|              </span>
   258|            </div>
   259|            <div>
   260|              <p className="text-sm font-medium text-slate-500 mb-1">Current Plan</p>
   261|              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">$29/mo</h3>
   262|            </div>
   263|          </div>
   264|        </div>
   265|
   266|        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
   267|          <div className="lg:col-span-1">
   268|            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
   269|              <div className="p-6 border-b border-slate-100">
   270|                <h2 className="text-lg font-semibold text-slate-900">Send Request</h2>
   271|                <p className="text-sm text-slate-500 mt-1">Text your Google link to a customer.</p>
   272|              </div>
   273|              <div className="p-6 bg-slate-50/50">
   274|                <form onSubmit={handleSend} className="space-y-4">
   275|                  <div>
   276|                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
   277|                      Customer Phone Number
   278|                    </label>
   279|                    <input 
   280|                      type="tel" 
   281|                      placeholder="+1 (555) 000-0000" 
   282|                      className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm"
   283|                      value={phone}
   284|                      onChange={(e) => setPhone(e.target.value)}
   285|                      required
   286|                    />
   287|                  </div>
   288|
   289|                  <div>
   290|                    <div className="flex justify-between items-center mb-1.5">
   291|                      <label className="block text-sm font-medium text-slate-700">Message</label>
   292|                      {!googleLink && <Link href="/settings" className="text-xs font-bold text-red-600 hover:underline">⚠️ Link Missing</Link>}
   293|                    </div>
   294|                    <textarea 
   295|                      value={customMessage}
   296|                      onChange={(e) => setCustomMessage(e.target.value)}
   297|                      rows={3}
   298|                      className="w-full text-sm p-3 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm resize-none"
   299|                    />
   300|                    <p className="text-xs text-slate-400 mt-1 font-mono">
   301|                      + {googleLink ? googleLink : "[Configure link in Settings]"}
   302|                    </p>
   303|                  </div>
   304|
   305|                  {status === "success" && (
   306|                    <div className="flex items-start gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
   307|                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
   308|                      <p>SMS delivered successfully!</p>
   309|                    </div>
   310|                  )}
   311|
   312|                  {status === "error" && (
   313|                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
   314|                      <p>Failed: {errorMessage}</p>
   315|                    </div>
   316|                  )}
   317|
   318|                  <button 
   319|                    type="submit" 
   320|                    disabled={status === "loading"}
   321|                    className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm p-3 rounded-lg transition disabled:opacity-50 active:scale-[0.98] shadow-sm"
   322|                  >
   323|                    {status === "loading" ? "Sending..." : "Send SMS"}
   324|                  </button>
   325|                </form>
   326|              </div>
   327|            </div>
   328|          </div>
   329|
   330|          <div className="lg:col-span-2">
   331|            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden h-full">
   332|              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
   333|                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
   334|              </div>
   335|              <div className="p-12 flex flex-col items-center justify-center text-center h-[calc(100%-80px)]">
   336|                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
   337|                  <Clock size={24} className="text-slate-400" />
   338|                </div>
   339|                <h3 className="text-sm font-semibold text-slate-900 mb-1">No requests sent yet</h3>
   340|                <p className="text-sm text-slate-500 max-w-sm">
   341|                  When you send a review request, it will appear here along with its delivery status.
   342|                </p>
   343|              </div>
   344|            </div>
   345|          </div>
   346|        </div>
   347|      </main>
   348|    </div>
   349|  );
   350|}
   351|