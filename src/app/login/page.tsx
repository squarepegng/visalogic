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
  const [success, setSuccess] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    if (isResetMode) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (type === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        // Supabase returns a specific error if the user exists
        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("This email is already registered. Please sign in instead.");
          }
          throw error;
        }
        
        // With autoconfirm ON, signup actually returns a session instantly
        if (data.session) {
          router.push("/dashboard");
        } else {
          // Fallback just in case
          router.push("/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.includes("Invalid login")) {
            throw new Error("Incorrect email or password.");
          }
          throw error;
        }
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://visalogic-flax.vercel.app/reset-password',
      });
      if (error) throw error;
      setSuccess("Password reset link sent! Check your email.");
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
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          {isResetMode ? "Reset Password" : "Welcome Back"}
        </h1>
        <p className="text-slate-500 text-center mb-6">
          {isResetMode ? "Enter your email to receive a reset link" : "Sign in to your account or create a new one"}
        </p>
        
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
          
          {!isResetMode && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button 
                  type="button"
                  onClick={() => { setIsResetMode(true); setError(null); setSuccess(null); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:border-blue-600 focus:outline-none transition"
                required={!isResetMode}
              />
            </div>
          )}

          {error && <div className="text-red-700 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{error}</div>}
          {success && <div className="text-green-700 text-sm p-3 bg-green-50 border border-green-200 rounded-lg">{success}</div>}

          {isResetMode ? (
            <div className="pt-2">
              <button 
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mb-3"
              >
                Send Reset Link
              </button>
              <button 
                type="button"
                onClick={() => { setIsResetMode(false); setError(null); setSuccess(null); }}
                className="w-full text-slate-600 font-medium hover:text-slate-900"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-4">
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
                className="w-full bg-white text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 border border-slate-200"
              >
                Create Account
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
