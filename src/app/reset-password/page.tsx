     1|"use client";
     2|
     3|import { useState } from "react";
     4|import { supabase } from "@/lib/supabase";
     5|import { useRouter } from "next/navigation";
     6|import Link from "next/link";
     7|
     8|export default function ResetPassword() {
     9|  const [password, setPassword] = useState("");
    10|  const [loading, setLoading] = useState(false);
    11|  const [error, setError] = useState<string | null>(null);
    12|  const router = useRouter();
    13|
    14|  const handleUpdatePassword = async (e: React.FormEvent) => {
    15|    e.preventDefault();
    16|    setLoading(true);
    17|    setError(null);
    18|
    19|    try {
    20|      const { error } = await supabase.auth.updateUser({
    21|        password: password
    22|      });
    23|
    24|      if (error) throw error;
    25|      
    26|      router.push("/dashboard");
    27|    } catch (err: any) {
    28|      setError(err.message);
    29|    } finally {
    30|      setLoading(false);
    31|    }
    32|  };
    33|
    34|  return (
    35|    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
    36|      <Link href="/" className="font-bold text-2xl text-emerald-600 mb-8">🦗 ReviewMantis</Link>
    37|      
    38|      <div className="bg-white p-8 rounded-2xl border shadow-sm w-full max-w-md">
    39|        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Set New Password</h1>
    40|        <p className="text-slate-500 text-center mb-6">Enter your new secure password below.</p>
    41|        
    42|        <form onSubmit={handleUpdatePassword} className="space-y-4">
    43|          <div>
    44|            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
    45|            <input 
    46|              type="password" 
    47|              value={password}
    48|              onChange={(e) => setPassword(e.target.value)}
    49|              className="w-full p-3 rounded-lg border focus:border-blue-600 focus:outline-none transition"
    50|              required
    51|              minLength={6}
    52|            />
    53|          </div>
    54|
    55|          {error && <div className="text-red-700 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{error}</div>}
    56|
    57|          <div className="pt-4">
    58|            <button 
    59|              type="submit"
    60|              disabled={loading}
    61|              className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
    62|            >
    63|              Update Password and Login
    64|            </button>
    65|          </div>
    66|        </form>
    67|      </div>
    68|    </div>
    69|  );
    70|}
    71|