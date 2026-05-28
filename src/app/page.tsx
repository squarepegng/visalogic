     1|import Link from 'next/link';
     2|
     3|export default function LandingPage() {
     4|  return (
     5|    <div className="min-h-screen bg-slate-50 flex flex-col">
     6|      {/* Navbar */}
     7|      <nav className="border-b bg-white p-4">
     8|        <div className="max-w-6xl mx-auto flex justify-between items-center">
     9|          <div className="font-bold text-xl text-emerald-600">🦗 ReviewMantis</div>
    10|          <div className="space-x-4">
    11|            <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium">Login</Link>
    12|            <Link href="/dashboard" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">Get Started ($29/mo)</Link>
    13|          </div>
    14|        </div>
    15|      </nav>
    16|
    17|      {/* Hero */}
    18|      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
    19|        <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
    20|          The #1 Podium Alternative
    21|        </div>
    22|        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6 leading-tight">
    23|          Get 5-Star Reviews on <span className="text-emerald-600">Autopilot.</span>
    24|        </h1>
    25|        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
    26|          Stop paying bloated CRMs $250/month. Type your customer's phone number, click send, and watch your Google ranking explode.
    27|        </p>
    28|        <Link href="/dashboard">
    29|          <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-emerald-700 transition transform hover:scale-105">
    30|            Start Sending Reviews
    31|          </button>
    32|        </Link>
    33|        <p className="mt-4 text-sm text-slate-500">Takes 60 seconds to set up. Cancel anytime.</p>
    34|      </main>
    35|
    36|      {/* Value Prop */}
    37|      <section className="bg-white py-20 border-t">
    38|        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
    39|          <div>
    40|            <div className="text-4xl mb-4">📱</div>
    41|            <h3 className="font-bold text-xl mb-2">1. Enter Phone Number</h3>
    42|            <p className="text-slate-600">Just finished a job? Type their number into your dashboard on your phone.</p>
    43|          </div>
    44|          <div>
    45|            <div className="text-4xl mb-4">✉️</div>
    46|            <h3 className="font-bold text-xl mb-2">2. We Send the SMS</h3>
    47|            <p className="text-slate-600">Our system instantly texts them a friendly request with your exact Google link.</p>
    48|          </div>
    49|          <div>
    50|            <div className="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
    51|            <h3 className="font-bold text-xl mb-2">3. Watch Rankings Rise</h3>
    52|            <p className="text-slate-600">More 5-star reviews means you show up first on Google Maps when people search.</p>
    53|          </div>
    54|        </div>
    55|      </section>
    56|    </div>
    57|  );
    58|}
    59|