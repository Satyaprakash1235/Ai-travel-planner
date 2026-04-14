"use client";

import { useState } from "react";
import { Send, Map, Users, Wallet, Navigation } from "lucide-react";

export default function TravelForm({
  onPlanGenerated,
}: {
  onPlanGenerated: (plan: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    budget: "moderate",
    members: "couple"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.from_location.trim() || !formData.to_location.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      onPlanGenerated(data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-6 overflow-y-auto custom-scrollbar">
      <div className="border-b border-white/10 pb-6 mb-6 flex items-center gap-3">
         <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center">
           <Map className="text-white" size={20} />
         </div>
         <div>
           <h2 className="text-white font-bold text-lg">Plan Your Trip</h2>
           <p className="text-slate-400 text-xs">Fill in details to get a customized itinerary</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
           <label className="text-sm text-slate-300 font-medium mb-2 block">Starting Point</label>
           <div className="relative">
             <Navigation className="absolute left-3 top-3.5 text-slate-500" size={18} />
             <input type="text" value={formData.from_location} onChange={e => setFormData({...formData, from_location: e.target.value})} required className="w-full bg-slate-950 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. New York" />
           </div>
        </div>

        <div>
           <label className="text-sm text-slate-300 font-medium mb-2 block">Destination</label>
           <div className="relative">
             <Map className="absolute left-3 top-3.5 text-slate-500" size={18} />
             <input type="text" value={formData.to_location} onChange={e => setFormData({...formData, to_location: e.target.value})} required className="w-full bg-slate-950 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. Paris" />
           </div>
        </div>

        <div>
           <label className="text-sm text-slate-300 font-medium mb-2 block">Budget</label>
           <div className="relative">
             <Wallet className="absolute left-3 top-3.5 text-slate-500" size={18} />
             <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-slate-950 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                <option value="low">Low Budget</option>
                <option value="moderate">Moderate Budget</option>
                <option value="high">High Budget</option>
             </select>
           </div>
        </div>

        <div>
           <label className="text-sm text-slate-300 font-medium mb-2 block">Travel Party</label>
           <div className="relative">
             <Users className="absolute left-3 top-3.5 text-slate-500" size={18} />
             <select value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="w-full bg-slate-950 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                <option value="single">Single</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
             </select>
           </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
          {loading ? (
             <div className="flex space-x-2 items-center">
                 <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             </div>
          ) : (
            <>Generate Itinerary <Send size={18} /></>
          )}
        </button>
      </form>
    </div>
  );
}
