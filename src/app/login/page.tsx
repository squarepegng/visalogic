     1|"use client";
     2|
     3|import { useState, useRef, useEffect } from "react";
     4|import { supabase } from "@/lib/supabase";
     5|import { useRouter } from "next/navigation";
     6|import Link from "next/link";
     7|
     8|type AuthMode = 'login' | 'signup' | 'reset';
     9|
    10|export default function AuthPage() {
    11|  const [mode, setMode] = useState<AuthMode>('signup');
    12|  const [email, setEmail] = useState("");
    13|  const [password, setPassword] = useState("");
    14|  const [showPassword, setShowPassword] = useState(false);
    15|  
    16|  const [loading, setLoading] = useState(false);
    17|  const [error, setError] = useState<string | null>(null);
    18|  const [success, setSuccess] = useState<string | null>(null);
    19|  
    20|  const router = useRouter();
    21|  const emailInputRef = useRef<HTMLInputElement>(null);
    22|
    23|  useEffect(() => {
    24|    if (emailInputRef.current) {
    25|      emailInputRef.current.focus();
    26|    }
    27|    setError(null);
    28|    setSuccess(null);
    29|  }, [mode]);
    30|
    31|  const handleSubmit = async (e: React.FormEvent) => {
    32|    e.preventDefault();
    33|    setLoading(true);
    34|    setError(null);
    35|    setSuccess(null);
    36|
    37|    try {
    38|      if (mode === 'signup') {
    39|        const { data, error } = await supabase.auth.signUp({ email, password });
    40|        if (error) {
    41|          if (error.message.includes("already registered")) {
    42|            throw new Error("This email is already registered. Please log in.");
    43|          }
    44|          throw error;
    45|        }
    46|        router.push("/dashboard");
    47|      } 
    48|      else if (mode === 'login') {
    49|        const { error } = await supabase.auth.signInWithPassword({ email, password });
    50|        if (error) {
    51|          if (error.message.includes("Invalid login")) {
    52|            throw new Error("Incorrect email or password. Please try again.");
    53|          }
    54|          throw error;
    55|        }
    56|        router.push("/dashboard");
    57|      }
    58|      else if (mode === 'reset') {
    59|        const { error } = await supabase.auth.resetPasswordForEmail(email, {
    60|          redirectTo: 'https://visalogic-flax.vercel.app/reset-password',
    61|        });
    62|        if (error) throw error;
    63|        setSuccess("Password reset link sent! Check your email inbox.");
    64|      }
    65|    } catch (err: any) {
    66|      setError(err.message);
    67|    } finally {
    68|      setLoading(false);
    69|    }
    70|  };
    71|
    72|  return (
    73|    <div className="min-h-screen flex bg-white">
    74|      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
    75|        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
    76|          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-600/20 blur-[120px]"></div>
    77|        </div>
    78|
    79|        <div className="relative z-10">
    80|          <Link href="/" className="font-bold text-2xl flex items-center gap-2">
    81|            🦗 ReviewMantis
    82|          </Link>
    83|        </div>
    84|        
    85|        <div className="relative z-10 max-w-lg">
    86|          <h2 className="text-4xl font-bold mb-6 leading-tight">
    87|            "We fired Podium, switched to ReviewMantis, and doubled our Google Reviews in 30 days."
    88|          </h2>
    89|          <div className="flex items-center gap-4">
    90|            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold">
    91|              JD
    92|            </div>
    93|            <div>
    94|              <p className="font-semibold text-lg">John Davis</p>
    95|              <p className="text-slate-400">Owner, Davis Plumbing</p>
    96|            </div>
    97|          </div>
    98|        </div>
    99|        
   100|        <div className="relative z-10 flex gap-4 text-sm text-slate-400">
   101|          <span>© 2026 ReviewMantis</span>
   102|        </div>
   103|      </div>
   104|
   105|      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
   106|        <div className="w-full max-w-md">
   107|          
   108|          <Link href="/" className="lg:hidden font-bold text-2xl text-emerald-600 flex items-center gap-2 mb-10 justify-center">
   109|            🦗 ReviewMantis
   110|          </Link>
   111|
   112|          <div className="mb-8">
   113|            <h1 className="text-3xl font-bold text-slate-900 mb-2">
   114|              {mode === 'signup' && "Create an account"}
   115|              {mode === 'login' && "Welcome back"}
   116|              {mode === 'reset' && "Reset your password"}
   117|            </h1>
   118|            <p className="text-slate-500">
   119|              {mode === 'signup' && "Start sending automated review requests today."}
   120|              {mode === 'login' && "Enter your details to access your dashboard."}
   121|              {mode === 'reset' && "We will email you a link to securely reset your password."}
   122|            </p>
   123|          </div>
   124|
   125|          <form onSubmit={handleSubmit} className="space-y-5">
   126|            <div>
   127|              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
   128|                Email address
   129|              </label>
   130|              <input 
   131|                id="email"
   132|                type="email" 
   133|                ref={emailInputRef}
   134|                value={email}
   135|                onChange={(e) => setEmail(e.target.value)}
   136|                placeholder="name@company.com"
   137|                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition"
   138|                required
   139|              />
   140|            </div>
   141|            
   142|            {mode !== 'reset' && (
   143|              <div>
   144|                <div className="flex justify-between items-center mb-1.5">
   145|                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
   146|                    Password
   147|                  </label>
   148|                  {mode === 'login' && (
   149|                    <button 
   150|                      type="button"
   151|                      onClick={() => setMode('reset')}
   152|                      className="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition"
   153|                    >
   154|                      Forgot password?
   155|                    </button>
   156|                  )}
   157|                </div>
   158|                <div className="relative">
   159|                  <input 
   160|                    id="password"
   161|                    type={showPassword ? "text" : "password"} 
   162|                    value={password}
   163|                    onChange={(e) => setPassword(e.target.value)}
   164|                    placeholder={mode === 'signup' ? "Create a password (min 6 chars)" : "Enter your password"}
   165|                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition pr-12"
   166|                    required
   167|                    minLength={6}
   168|                  />
   169|                  <button
   170|                    type="button"
   171|                    onClick={() => setShowPassword(!showPassword)}
   172|                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
   173|                    tabIndex={-1}
   174|                  >
   175|                    {showPassword ? "Hide" : "Show"}
   176|                  </button>
   177|                </div>
   178|              </div>
   179|            )}
   180|
   181|            {error && (
   182|              <div className="flex items-start gap-2 text-sm p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
   183|                <p>{error}</p>
   184|              </div>
   185|            )}
   186|            {success && (
   187|              <div className="flex items-start gap-2 text-sm p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
   188|                <p>{success}</p>
   189|              </div>
   190|            )}
   191|
   192|            <button 
   193|              type="submit"
   194|              disabled={loading}
   195|              className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-700 transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-sm shadow-blue-600/20"
   196|            >
   197|              {loading ? "Please wait..." : (
   198|                mode === 'signup' ? "Create account" : 
   199|                mode === 'login' ? "Log in" : 
   200|                "Send reset link"
   201|              )}
   202|            </button>
   203|          </form>
   204|
   205|          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
   206|            {mode === 'signup' && (
   207|              <p>Already have an account? <button onClick={() => setMode('login')} className="text-emerald-600 font-semibold hover:underline">Log in</button></p>
   208|            )}
   209|            {mode === 'login' && (
   210|              <p>Don't have an account? <button onClick={() => setMode('signup')} className="text-emerald-600 font-semibold hover:underline">Sign up</button></p>
   211|            )}
   212|            {mode === 'reset' && (
   213|              <p>Remembered your password? <button onClick={() => setMode('login')} className="text-emerald-600 font-semibold hover:underline">Back to log in</button></p>
   214|            )}
   215|          </div>
   216|
   217|        </div>
   218|      </div>
   219|    </div>
   220|  );
   221|}
   222|