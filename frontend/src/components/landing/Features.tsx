"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Map, Bookmark } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Itinerary Generation",
    desc: "Our LLM instantly crafts personalized trips down to the hour.",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    desc: "Discover hidden gems and local favorites tailored to your interests.",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    desc: "Visualize your entire journey on our immersive 3D globe.",
  },
  {
    icon: Bookmark,
    title: "Save Your Trips",
    desc: "Keep all your dream vacations safely stored in your account.",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-transparent px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why TripGenie?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Experience the future of travel planning with our cutting-edge features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={i}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <feat.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
