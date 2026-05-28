import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl text-emerald-600">🦗 ReviewMantis</div>
          <div className="space-x-4">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium">Login</Link>
            <Link href="/dashboard" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">Get Started ($29/mo)</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          The #1 Podium Alternative
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6 leading-tight">
          Get 5-Star Reviews on <span className="text-emerald-600">Autopilot.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Stop paying bloated CRMs $250/month. Type your customer's phone number, click send, and watch your Google ranking explode.
        </p>
        <Link href="/dashboard">
          <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-emerald-700 transition transform hover:scale-105">
            Start Sending Reviews
          </button>
        </Link>
        <p className="mt-4 text-sm text-slate-500">Takes 60 seconds to set up. Cancel anytime.</p>
      </main>

      {/* Value Prop */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-bold text-xl mb-2">1. Enter Phone Number</h3>
            <p className="text-slate-600">Just finished a job? Type their number into your dashboard on your phone.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="font-bold text-xl mb-2">2. We Send the SMS</h3>
            <p className="text-slate-600">Our system instantly texts them a friendly request with your exact Google link.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
            <h3 className="font-bold text-xl mb-2">3. Watch Rankings Rise</h3>
            <p className="text-slate-600">More 5-star reviews means you show up first on Google Maps when people search.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
