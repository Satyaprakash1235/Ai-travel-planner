"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent px-4 pt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          TripGenie AI v1.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          AI Travel Planner
        </h1>
        <h2 className="text-xl md:text-3xl text-slate-300 font-medium mb-6">
          Plan your perfect trip with AI in seconds
        </h2>
        
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Say goodbye to hours of research. Our advanced AI crafts personalized, day-by-day itineraries tailored to your budget, interests, and dreams.
        </p>
        
        <Link 
          href="/planner"
          className="group inline-flex items-center gap-2 bg-white text-slate-950 font-bold px-8 py-4 rounded-full text-lg hover:scale-105 hover:bg-emerald-50 transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)]"
        >
          Start Planning
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
