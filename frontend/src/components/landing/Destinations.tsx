"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";

const destinations = [
  {
    name: "Paris, France",
    caption: "The City of Light",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
  },
  {
    name: "Maldives",
    caption: "Tropical Paradise",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2065&auto=format&fit=crop",
  },
  {
    name: "Swiss Alps",
    caption: "Majestic Mountains",
    img: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=2080&auto=format&fit=crop",
  },
  {
    name: "Dubai, UAE",
    caption: "Modern Marvels",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Destinations() {
  return (
    <section className="py-24 bg-transparent px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Popular Destinations</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Explore some of the most beautiful and highly-rated places curated for our travelers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              key={i}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl shadow-black/50"
            >
              <Image 
                src={dest.img} 
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full transform group-hover:translate-y-[-8px] transition-transform duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="text-emerald-400" size={18} />
                  <h3 className="text-2xl font-bold text-white tracking-wide">{dest.name}</h3>
                </div>
                <p className="text-emerald-300 text-sm font-medium">{dest.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
