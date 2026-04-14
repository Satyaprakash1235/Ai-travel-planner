import Hero from "@/components/landing/Hero";
import Destinations from "@/components/landing/Destinations";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900 text-slate-50 relative selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Navbar Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:block">TripGenie AI</span>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/planner" className="text-white hover:text-emerald-300 transition-colors text-sm font-medium">Log In</a>
          <a href="/planner" className="text-white hover:scale-105 transition-all text-sm font-medium border border-white/20 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md">
            Start Planning
          </a>
        </div>
      </div>

      <Hero />
      <Destinations />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}
