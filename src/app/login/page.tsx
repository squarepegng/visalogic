"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    setError(null);
    setSuccess(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("This email is already registered. Please log in.");
          }
          throw error;
        }
        router.push("/dashboard");
      } 
      else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login")) {
            throw new Error("Incorrect email or password. Please try again.");
          }
          throw error;
        }
        router.push("/dashboard");
      }
      else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://visalogic-flax.vercel.app/reset-password',
        });
        if (error) throw error;
        setSuccess("Password reset link sent! Check your email inbox.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <Link href="/" className="font-bold text-2xl flex items-center gap-2">
            🚀 ReviewRocket
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            "We fired Podium, switched to ReviewRocket, and doubled our Google Reviews in 30 days."
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold">
              JD
            </div>
            <div>
              <p className="font-semibold text-lg">John Davis</p>
              <p className="text-slate-400">Owner, Davis Plumbing</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4 text-sm text-slate-400">
          <span>© 2026 ReviewRocket</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          
          <Link href="/" className="lg:hidden font-bold text-2xl text-blue-600 flex items-center gap-2 mb-10 justify-center">
            🚀 ReviewRocket
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {mode === 'signup' && "Create an account"}
              {mode === 'login' && "Welcome back"}
              {mode === 'reset' && "Reset your password"}
            </h1>
            <p className="text-slate-500">
              {mode === 'signup' && "Start sending automated review requests today."}
              {mode === 'login' && "Enter your details to access your dashboard."}
              {mode === 'reset' && "We will email you a link to securely reset your password."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input 
                id="email"
                type="email" 
                ref={emailInputRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition"
                required
              />
            </div>
            
            {mode !== 'reset' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? "Create a password (min 6 chars)" : "Enter your password"}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-sm p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 text-sm p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
                <p>{success}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-sm shadow-blue-600/20"
            >
              {loading ? "Please wait..." : (
                mode === 'signup' ? "Create account" : 
                mode === 'login' ? "Log in" : 
                "Send reset link"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            {mode === 'signup' && (
              <p>Already have an account? <button onClick={() => setMode('login')} className="text-blue-600 font-semibold hover:underline">Log in</button></p>
            )}
            {mode === 'login' && (
              <p>Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-600 font-semibold hover:underline">Sign up</button></p>
            )}
            {mode === 'reset' && (
              <p>Remembered your password? <button onClick={() => setMode('login')} className="text-blue-600 font-semibold hover:underline">Back to log in</button></p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
