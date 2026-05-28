"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <Link href="/" className="font-bold text-2xl text-blue-600 mb-8">🚀 ReviewRocket</Link>
      
      <div className="bg-white p-8 rounded-2xl border shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Sign In</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border focus:border-blue-600 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border focus:border-blue-600 focus:outline-none transition"
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">{error}</div>}

          <div className="flex gap-4 pt-4">
            <button 
              onClick={(e) => handleAuth(e, 'login')}
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              Sign In
            </button>
            <button 
              onClick={(e) => handleAuth(e, 'signup')}
              disabled={loading}
              className="w-full bg-blue-50 text-blue-700 font-semibold py-3 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 border border-blue-200"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
