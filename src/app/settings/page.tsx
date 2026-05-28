     1|"use client";
     2|
     3|import { useState, useEffect } from "react";
     4|import { supabase } from "@/lib/supabase";
     5|import { useRouter } from "next/navigation";
     6|import Link from "next/link";
     7|import { Send, LogOut } from "lucide-react";
     8|
     9|export default function Settings() {
    10|  const [googleLink, setGoogleLink] = useState("");
    11|  const [defaultMessage, setDefaultMessage] = useState("Thanks for choosing us! We'd love if you could leave a quick 5-star review here:");
    12|  const [userEmail, setUserEmail] = useState<string | null>(null);
    13|  const [userId, setUserId] = useState<string | null>(null);
    14|  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    15|  const [errorMessage, setErrorMessage] = useState("");
    16|  const router = useRouter();
    17|
    18|  useEffect(() => {
    19|    const fetchProfile = async () => {
    20|      const { data: { session } } = await supabase.auth.getSession();
    21|      if (!session) {
    22|        router.push("/login");
    23|        return;
    24|      }
    25|      setUserEmail(session.user.email || "");
    26|      setUserId(session.user.id);
    27|
    28|      // Try to fetch existing profile
    29|      const { data, error } = await supabase
    30|        .from('profiles')
    31|        .select('*')
    32|        .eq('id', session.user.id)
    33|        .single();
    34|
    35|      if (data) {
    36|        if (data.google_review_link) setGoogleLink(data.google_review_link);
    37|        if (data.default_message) setDefaultMessage(data.default_message);
    38|      } else if (error && error.code === 'PGRST116') {
    39|        // Record doesn't exist yet, we'll create it on save
    40|        console.log("No profile yet");
    41|      }
    42|    };
    43|    fetchProfile();
    44|  }, [router]);
    45|
    46|  const handleSave = async (e: React.FormEvent) => {
    47|    e.preventDefault();
    48|    setStatus("loading");
    49|    setErrorMessage("");
    50|
    51|    try {
    52|      if (!userId) throw new Error("Not authenticated");
    53|
    54|      const { error } = await supabase
    55|        .from('profiles')
    56|        .upsert({ 
    57|          id: userId, 
    58|          google_review_link: googleLink,
    59|          default_message: defaultMessage,
    60|          updated_at: new Date().toISOString()
    61|        });
    62|
    63|      if (error) {
    64|        // If the table doesn't exist yet, show a helpful message
    65|        if (error.code === '42P01') {
    66|          throw new Error("Database tables are not set up yet. (Need to run SQL in Supabase dashboard)");
    67|        }
    68|        throw error;
    69|      }
    70|
    71|      setStatus("success");
    72|      setTimeout(() => setStatus("idle"), 3000);
    73|    } catch (err: any) {
    74|      setStatus("error");
    75|      setErrorMessage(err.message);
    76|    }
    77|  };
    78|
    79|  const handleSignOut = async () => {
    80|    await supabase.auth.signOut();
    81|    router.push("/login");
    82|  };
    83|
    84|  if (!userEmail) return <div className="min-h-screen bg-slate-50"></div>;
    85|
    86|  return (
    87|    <div className="min-h-screen bg-[#F7F9FC] font-sans text-slate-900">
    88|      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
    89|        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    90|          <div className="flex items-center gap-8">
    91|            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
    92|              <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm">
    93|                <Send size={16} />
    94|              </div>
    95|              ReviewMantis
    96|            </Link>
    97|            
    98|            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-500">
    99|              <Link href="/dashboard" className="px-3 py-1.5 hover:text-slate-900 transition">Overview</Link>
   100|              <span className="px-3 py-1.5 text-slate-400 cursor-not-allowed">Customers</span>
   101|              <Link href="/settings" className="px-3 py-1.5 bg-slate-100 text-slate-900 rounded-md transition">Settings</Link>
   102|            </div>
   103|          </div>
   104|
   105|          <div className="flex items-center gap-4">
   106|            <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white">
   107|              {userEmail.charAt(0).toUpperCase()}
   108|            </div>
   109|            <button onClick={handleSignOut} className="text-slate-400 hover:text-slate-600 transition">
   110|              <LogOut size={20} />
   111|            </button>
   112|          </div>
   113|        </div>
   114|      </nav>
   115|
   116|      <main className="max-w-3xl mx-auto px-6 py-12">
   117|        <div className="mb-8">
   118|          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Workspace Settings</h1>
   119|          <p className="text-sm text-slate-500 mt-1">Configure your review link and default messaging.</p>
   120|        </div>
   121|
   122|        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
   123|          <form onSubmit={handleSave}>
   124|            <div className="p-8 space-y-8">
   125|              
   126|              {/* Google Link Section */}
   127|              <div>
   128|                <h3 className="text-sm font-semibold text-slate-900 mb-1">Google Review Link</h3>
   129|                <p className="text-sm text-slate-500 mb-3">This is the direct link customers will click to leave a review.</p>
   130|                <input 
   131|                  type="url" 
   132|                  value={googleLink}
   133|                  onChange={(e) => setGoogleLink(e.target.value)}
   134|                  placeholder="https://g.page/r/example/review"
   135|                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm"
   136|                  required
   137|                />
   138|              </div>
   139|
   140|              <hr className="border-slate-100" />
   141|
   142|              {/* Message Template Section */}
   143|              <div>
   144|                <div className="flex justify-between items-center mb-1">
   145|                  <h3 className="text-sm font-semibold text-slate-900">Default SMS Message</h3>
   146|                  <span className="text-xs text-slate-400 font-mono">{defaultMessage.length}/120 chars</span>
   147|                </div>
   148|                <p className="text-sm text-slate-500 mb-3">This message will be pre-filled on your dashboard. Your Google link will be automatically attached to the end.</p>
   149|                <textarea 
   150|                  value={defaultMessage}
   151|                  onChange={(e) => setDefaultMessage(e.target.value)}
   152|                  rows={3}
   153|                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm resize-none"
   154|                  required
   155|                />
   156|                
   157|                {/* Live Preview Box */}
   158|                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
   159|                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live Preview (What the customer sees)</p>
   160|                  <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm inline-block max-w-[80%]">
   161|                    {defaultMessage} {googleLink || "[Your Link Here]"}
   162|                  </p>
   163|                </div>
   164|              </div>
   165|
   166|            </div>
   167|
   168|            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
   169|              <div>
   170|                {status === "success" && <span className="text-sm font-medium text-green-600">✅ Settings saved successfully!</span>}
   171|                {status === "error" && <span className="text-sm font-medium text-red-600">❌ {errorMessage}</span>}
   172|              </div>
   173|              <button 
   174|                type="submit"
   175|                disabled={status === "loading"}
   176|                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition disabled:opacity-50 active:scale-[0.98] shadow-sm"
   177|              >
   178|                {status === "loading" ? "Saving..." : "Save Settings"}
   179|              </button>
   180|            </div>
   181|          </form>
   182|        </div>
   183|      </main>
   184|    </div>
   185|  );
   186|}
   187|