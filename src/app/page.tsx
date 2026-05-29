import Link from 'next/link';
import { 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ArrowRight,
  HelpCircle
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFCF9] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Premium Sticky Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-emerald-100/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-950">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
              <Send size={16} />
            </div>
            <span>Review<span className="text-emerald-600 font-extrabold">Mantis</span></span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded-full">🦗 MVP</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition">How it Works</a>
            <a href="#pricing" className="hover:text-emerald-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition">
              Log in
            </Link>
            <Link href="/dashboard" className="bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition hover:shadow-md active:scale-[0.98]">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 bg-gradient-to-b from-emerald-50/30 via-transparent to-transparent">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles size={14} className="text-emerald-600" />
            <span>The #1 Premium Podium CRM Alternative</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 mb-8 leading-[1.1]">
            Get 5-Star Google Reviews <br className="hidden sm:inline" />
            on <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Autopilot.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop paying bloated platforms $250+/month. Enter your customer's phone number, click send, and watch your business dominate Google Maps local search.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/dashboard" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 hover:shadow-xl transition duration-150 flex items-center justify-center gap-2 active:scale-[0.98]">
              Start Sending Reviews <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-base font-semibold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
              See How It Works
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Zap size={14} className="text-emerald-500" /> Setup in 60 seconds</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Cancel anytime</span>
          </div>
        </div>

        {/* Visual Mockup Showcase (Inspired by UI Layouts) */}
        <div className="max-w-5xl mx-auto px-6 mt-16 md:mt-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative">
            {/* Window bar */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-1.5">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="text-xs text-slate-400 font-mono ml-4">app.reviewmantis.com/dashboard</span>
            </div>
            
            {/* Mock Dashboard UI Layout */}
            <div className="bg-slate-50/50 p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Left Sidebar Mock */}
              <div className="hidden md:block col-span-1 space-y-6">
                <div className="h-6 w-28 bg-slate-200 rounded-md"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center px-3"><div className="w-4 h-4 bg-emerald-600 rounded-sm"></div></div>
                  <div className="h-8 bg-slate-100 rounded-lg"></div>
                  <div className="h-8 bg-slate-100 rounded-lg"></div>
                  <div className="h-8 bg-slate-100 rounded-lg"></div>
                </div>
              </div>
              
              {/* Main Workspace Mock */}
              <div className="col-span-3 space-y-6">
                {/* Metrics Mock */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="w-4 h-4 bg-emerald-100 rounded-full"></div>
                    <div className="h-5 w-8 bg-slate-800 rounded"></div>
                    <div className="h-3 w-16 bg-slate-300 rounded"></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="w-4 h-4 bg-indigo-100 rounded-full"></div>
                    <div className="h-5 w-8 bg-slate-800 rounded"></div>
                    <div className="h-3 w-16 bg-slate-300 rounded"></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="w-4 h-4 bg-slate-100 rounded-full"></div>
                    <div className="h-5 w-12 bg-slate-800 rounded"></div>
                    <div className="h-3 w-16 bg-slate-300 rounded"></div>
                  </div>
                </div>

                {/* Main Activity Mock */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="h-5 w-32 bg-slate-800 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between px-4">
                      <div className="h-4 w-32 bg-slate-300 rounded"></div>
                      <div className="h-5 w-16 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full">Delivered</div>
                    </div>
                    <div className="h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between px-4">
                      <div className="h-4 w-28 bg-slate-300 rounded"></div>
                      <div className="h-5 w-16 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full">Delivered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Enterprise Power, Lean Price</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">Everything You Need to Dominate Local Maps Search</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAFCF9] p-8 rounded-2xl border border-emerald-100/50 hover:border-emerald-200 transition duration-300 group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">One-Click Request SMS</h3>
              <p className="text-slate-600 leading-relaxed">
                No bloated pipelines. Simply enter your customer's phone number and click send. Our system fires a friendly, optimized text request containing your exact Google link.
              </p>
            </div>

            <div className="bg-[#FAFCF9] p-8 rounded-2xl border border-emerald-100/50 hover:border-emerald-200 transition duration-300 group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Passive Conversion Tracker</h3>
              <p className="text-slate-600 leading-relaxed">
                Skip standard CRM headaches. Monitor sent, delivered, and conversion estimations natively on a highly visual, light-themed dashboard showing clear ROI instantly.
              </p>
            </div>

            <div className="bg-[#FAFCF9] p-8 rounded-2xl border border-emerald-100/50 hover:border-emerald-200 transition duration-300 group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Custom SMS Templates</h3>
              <p className="text-slate-600 leading-relaxed">
                Build your own unique text brand template. Embed smart shortcuts to auto-append personalized links, saving manual work and boosting reply rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-[#FAFCF9]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Simple Process</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">How ReviewMantis Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="relative space-y-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-950">Configure Google Link</h3>
              <p className="text-slate-600 leading-relaxed">
                Insert your Google Business Review link and write a customized text template in your settings in under 60 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-950">Send Instant SMS</h3>
              <p className="text-slate-600 leading-relaxed">
                When you finish a job, enter the customer's phone number on your dashboard. Click Send—we deliver the request natively.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-950">Watch Rankings Rise</h3>
              <p className="text-slate-600 leading-relaxed">
                Your customers click, review, and leave 5 stars. Google Maps algorithm pushes your profile to the top of search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-emerald-500 text-5xl mb-6">“</div>
          <p className="text-2xl md:text-3xl font-medium tracking-tight text-slate-950 leading-relaxed mb-8">
            "We were paying $299/mo for Podium, but we only used the SMS review request feature. Switching to ReviewMantis saved us over $3,000 a year, and our Google Reviews actually doubled in the first month."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 font-bold rounded-full flex items-center justify-center">
              TB
            </div>
            <div className="text-left">
              <h4 className="font-bold text-slate-950">Tobi Bello</h4>
              <p className="text-xs text-slate-500">Founder, Bello Heating & Air</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#FAFCF9]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Simple Pricing</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">One Flat Rate. Unlimited Potential.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative max-w-lg mx-auto">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
            <div className="p-10 text-center">
              <h3 className="text-xl font-bold text-slate-950 mb-2">ReviewMantis Pro</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for plumbing, HVAC, electrical, and local services.</p>
              
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-950">$29</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>

              <Link href="/dashboard" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-xl transition flex items-center justify-center gap-2 mb-8">
                Start Free Trial
              </Link>

              <div className="border-t border-slate-100 pt-8 text-left space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Unlimited SMS requests</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Custom message templates</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Dynamic Google Maps Review link appending</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Real-time delivery & metrics dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Got Questions?</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">Frequently Asked Questions</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-lg text-slate-950 mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-emerald-600" />
                Is there really no setup fee?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed ml-7">
                No hidden fees or setup charges. You can start sending reviews immediately upon upgrading to Pro.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-lg text-slate-950 mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-emerald-600" />
                How many SMS requests can I send per month?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed ml-7">
                Your subscription includes unlimited SMS requests so you can text every single customer you complete a job for without worrying about billing surprises.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-lg text-slate-950 mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-emerald-600" />
                Do I need to download any apps?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed ml-7">
                Nope! ReviewMantis is fully cloud-based and optimized perfectly for mobile browsers. You can save our dashboard as a shortcut on your iPhone/Android home screen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-6 h-6 bg-emerald-600 text-white rounded flex items-center justify-center">
              <Send size={12} />
            </div>
            <span>ReviewMantis 🦗</span>
          </div>
          <p className="text-sm">© 2026 ReviewMantis. All rights reserved. Premium B2B Local SEO Software.</p>
        </div>
      </footer>
    </div>
  );
}