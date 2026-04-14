"use client";

import { motion } from "framer-motion";
import { Navigation, Bus, Train, Calendar, MapPin, Map as MapIcon } from "lucide-react";

export default function ItineraryDisplay({ plan }: { plan: any }) {
  if (!plan) return null;

  // Since Google Maps API key is an open question in the plan,
  // we'll use an embedded Google map centered on the destination.
  const mapQuery = encodeURIComponent(plan.destination || "World");

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">{plan.destination} Itinerary</h2>
        <div className="flex flex-wrap gap-4 text-emerald-400 text-sm font-medium">
          <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full"><Calendar size={16} /> {plan.days} Days</div>
          <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full"><Bus size={16} /> {plan.transportation}</div>
        </div>
        <p className="text-slate-300 mt-4 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
          {plan.reply}
        </p>
      </motion.div>

      {/* Embedded Map */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <MapIcon className="text-emerald-400" size={20} />
          <h3 className="text-lg font-bold text-white">Interactive Map</h3>
        </div>
        <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
            {/* If there's an API key we would use the Places Maps API embed */}
            <iframe 
                title="Google Maps"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                allowFullScreen
            ></iframe>
        </div>
      </motion.div>

      {/* Recommended Places */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl"
      >
        <h3 className="text-lg font-bold text-white mb-4">Daily Schedule</h3>
        <div className="space-y-4">
          {plan.places && plan.places.map((place: any, i: number) => (
            <div key={i} className="flex gap-4 items-start bg-slate-950/50 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                <MapPin className="text-emerald-400" size={18} />
              </div>
              <div>
                <h4 className="text-white font-bold">{place.name}</h4>
                <div className="text-xs text-emerald-400 mb-1 font-medium bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full mt-1">Day {place.day} • {place.type}</div>
                <p className="text-slate-400 text-sm mt-1">{place.description}</p>
              </div>
            </div>
          ))}
          {(!plan.places || plan.places.length === 0) && (
             <p className="text-slate-500 text-sm">No specific places generated yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
