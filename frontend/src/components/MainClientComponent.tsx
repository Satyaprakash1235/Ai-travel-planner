"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import TripForm from "./TripForm";
import ItineraryCard from "./ItineraryCard";
import axios from "axios";

const GlobeView = dynamic(() => import("./GlobeView"), { ssr: false });

export default function MainClientComponent() {
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleGenerate = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/plan-trip", data);
      setItinerary(res.data.plan);
    } catch (error) {
      console.error(error);
      // Fallback for demo purposes if backend isn't reachable
      const mockPlan = {
          destination: data.destination,
          days: data.days,
          itinerary: Array.from({length: data.days}).map((_, i) => ({
              day: i+1,
              theme: `Exploring ${data.destination}`,
              places: [{name: `${data.destination} Landmark ${i+1}`, description: "A great place featuring beautiful architecture and local culture. You'll definitely want to bring a camera!"}]
          }))
      };
      setItinerary(mockPlan);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="absolute inset-0 z-0 bg-slate-950">
        <GlobeView />
      </div>
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {/* Top Navbar Header */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">TripGenie AI</span>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors text-sm font-medium border border-white/10 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md">
            View Source
          </a>
        </div>

        {!itinerary ? (
          <div className="w-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 mt-12">
            <TripForm onSubmit={handleGenerate} loading={loading} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-start pt-[12vh] pb-4 animate-in slide-in-from-bottom-10 fade-in zoom-in-95 duration-500">
            <ItineraryCard plan={itinerary} onReset={() => setItinerary(null)} />
          </div>
        )}
      </div>
    </>
  );
}
