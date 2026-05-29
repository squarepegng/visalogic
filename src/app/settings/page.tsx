"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, LogOut, Building2 } from "lucide-react";

export default function Settings() {
  const [businessName, setBusinessName] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("Thanks for choosing us! We'd love if you could leave a quick 5-star review here:");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUserEmail(session.user.email || "");
      setUserId(session.user.id);

      // Try to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        if (data.business_name) setBusinessName(data.business_name);
        if (data.google_review_link) setGoogleLink(data.google_review_link);
        if (data.default_message) setDefaultMessage(data.default_message);
      } else if (error && error.code === 'PGRST116') {
        // Record doesn't exist yet, we'll create it on save
        console.log("No profile yet");
      }
    };
    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      if (!userId) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId, 
          business_name: businessName,
          google_review_link: googleLink,
          default_message: defaultMessage,
          updated_at: new Date().toISOString()
        });

      if (error) {
        // If the table doesn't exist yet, show a helpful message
        if (error.code === '42P01') {
          throw new Error("Database tables are not set up yet. (Need to run SQL in Supabase dashboard)");
        }
        throw error;
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!userEmail) return <div className="min-h-screen bg-slate-50"></div>;

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
              <Link href="/dashboard" className="px-3 py-1.5 hover:text-slate-900 transition">Overview</Link>
              <span className="px-3 py-1.5 text-slate-400 cursor-not-allowed">Customers</span>
              <Link href="/settings" className="px-3 py-1.5 bg-slate-100 text-slate-900 rounded-md transition">Settings</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-slate-600 transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Workspace Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure your review link and default messaging.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
          <form onSubmit={handleSave}>
            <div className="p-8 space-y-8">
              
              {/* Business Name Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Business Name</h3>
                <p className="text-sm text-slate-500 mb-3">This brands your review request messages and interactive interface.</p>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., Bello Heating & Air"
                    className="w-full text-sm pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm"
                    required
                  />
                </div>
              </div>

              <hr className="border-slate-100" />
              
              {/* Google Link Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Google Review Link</h3>
                <p className="text-sm text-slate-500 mb-3">This is the direct link customers will click to leave a review.</p>
                <input 
                  type="url" 
                  value={googleLink}
                  onChange={(e) => setGoogleLink(e.target.value)}
                  placeholder="https://g.page/r/example/review"
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm"
                  required
                />
              </div>

              <hr className="border-slate-100" />

              {/* Message Template Section */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-semibold text-slate-900">Default SMS Message</h3>
                  <span className="text-xs text-slate-400 font-mono">{defaultMessage.length}/120 chars</span>
                </div>
                <p className="text-sm text-slate-500 mb-3">This message will be pre-filled on your dashboard. Your Google link will be automatically attached to the end.</p>
                <textarea 
                  value={defaultMessage}
                  onChange={(e) => setDefaultMessage(e.target.value)}
                  rows={3}
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-sm resize-none"
                  required
                />
                
                {/* Live Preview Box */}
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live Preview (What the customer sees)</p>
                  <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm inline-block max-w-[80%]">
                    {defaultMessage} {googleLink || "[Your Link Here]"}
                  </p>
                </div>
              </div>

            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                {status === "success" && <span className="text-sm font-medium text-green-600">✅ Settings saved successfully!</span>}
                {status === "error" && <span className="text-sm font-medium text-red-600">❌ {errorMessage}</span>}
              </div>
              <button 
                type="submit"
                disabled={status === "loading"}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition disabled:opacity-50 active:scale-[0.98] shadow-sm"
              >
                {status === "loading" ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
