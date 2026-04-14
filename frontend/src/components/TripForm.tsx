"use client";

import { useState } from "react";
import { Plane, Calendar, WalletCards, Star } from "lucide-react";

export default function TripForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("Moderate");
  const [interests, setInterests] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ destination, days, budget, interests });
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full max-w-md shadow-2xl z-10 text-white">
      <h2 className="text-3xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
        Design Your Journey
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <div className="space-y-1">
          <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <Plane size={16}/> Destination
          </label>
          <input
            required
            type="text"
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="e.g. Tokyo, Paris, Bali"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <Calendar size={16}/> Duration (Days)
          </label>
          <input
            required
            type="number"
            min="1" max="30"
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <WalletCards size={16}/> Budget
          </label>
          <select
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition appearance-none"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option className="bg-slate-900 text-white">Budget-friendly</option>
            <option className="bg-slate-900 text-white">Moderate</option>
            <option className="bg-slate-900 text-white">Luxury</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <Star size={16}/> Interests
          </label>
          <input
            required
            type="text"
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="e.g. Food, Museums, Hiking"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : "Generate Itinerary"}
        </button>

      </form>
    </div>
  );
}
