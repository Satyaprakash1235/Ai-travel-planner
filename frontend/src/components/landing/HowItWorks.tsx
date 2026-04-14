"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Tell Us Your Dreams",
    desc: "Enter your destination, preferred duration, and interests into our interactive 3D portal.",
  },
  {
    num: "02",
    title: "AI Crafts Your Plan",
    desc: "Our advanced algorithm analyzes thousands of possibilities to build your perfect, personalized day-by-day itinerary.",
  },
  {
    num: "03",
    title: "Explore & Save",
    desc: "Review your detailed trip plan, see interactive map markers, and save it to your account.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-transparent px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Three simple steps to your dream vacation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              key={i}
              className="relative bg-slate-950/50 rounded-3xl p-8 border border-white/5 hover:border-emerald-500/30 transition-colors"
            >
              <div className="text-6xl font-black text-white/5 absolute top-4 right-6 pointer-events-none">
                {step.num}
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-xl mb-6">
                {i + 1}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
