import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span className="font-bold text-xl tracking-tight">VisaLogic</span>
            </div>
            <div>
              <Link href="/assessment">
                <Button variant="secondary" className="font-semibold rounded-full">
                  Take Assessment &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 text-center">
        <div className="inline-flex mb-8 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold tracking-wide">
          Updated for 2026 IRCC Draw Criteria
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Calculate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Canada Express Entry</span> score in 60 seconds.
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Don't guess your chances. Find out exactly where you stand in the Comprehensive Ranking System (CRS) and get a personalized roadmap to secure your Invitation to Apply.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <Link href="/assessment" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105 text-lg font-bold">
              Start Free Assessment
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground font-medium">Takes less than 1 minute</span>
        </div>
        
        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 text-left">
          <Card className="bg-secondary/30 border-border/50 shadow-none">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <CardTitle className="text-xl">Instant CRS Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Our algorithm mirrors the official IRCC criteria to give you a highly accurate estimate instantly without waiting.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/30 border-border/50 shadow-none">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm dark:text-indigo-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              </div>
              <CardTitle className="text-xl">Personalized Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Discover exactly which areas (like IELTS scores or work experience) to prioritize to boost your points.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/30 border-border/50 shadow-none">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-sm dark:text-emerald-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <CardTitle className="text-xl">100% Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your data is never shared with third parties. We calculate everything securely to protect your privacy.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-12 text-center text-muted-foreground text-sm">
        <p>&copy; 2026 VisaLogic. Not affiliated with the Canadian Government.</p>
      </footer>
    </div>
  );
}