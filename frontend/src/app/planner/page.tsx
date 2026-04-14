"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TravelForm from "@/components/planner/TravelForm";
import ItineraryDisplay from "@/components/planner/ItineraryDisplay";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Three.js components to avoid SSR mismatch
const GlobeWithMarkers = dynamic(() => import("@/components/planner/GlobeWithMarkers"), { ssr: false });

export default function PlannerPage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [originCoords, setOriginCoords] = useState<any>(null);
  const [destinationCoords, setDestinationCoords] = useState<any>(null);

  const handlePlanGenerated = (newPlan: any) => {
    setPlan(newPlan);
    if (newPlan.places) {
      setPlaces(newPlan.places);
    }
    if (newPlan.origin_coords) {
      setOriginCoords(newPlan.origin_coords);
    }
    if (newPlan.destination_coords) {
      setDestinationCoords(newPlan.destination_coords);
    }
  };

  const handleBackToForm = () => {
    setPlan(null);
    setPlaces([]);
    setOriginCoords(null);
    setDestinationCoords(null);
  };

  return (
    <main className="w-full h-screen overflow-hidden bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900 flex flex-col md:flex-row">
      
      {/* LEFT SIDE: 3D GLOBE (60%) */}
      <div className="relative w-full md:w-[60%] h-[50vh] md:h-screen z-0">
        {/* Back Button */}
        <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/70 hover:text-white bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all hover:scale-105 shadow-lg">
          <ArrowLeft size={16} /> Home
        </Link>
        <GlobeWithMarkers 
          places={places} 
          origin={originCoords} 
          destination={destinationCoords} 
        />
      </div>

      {/* RIGHT SIDE: TOOLS & DISPLAY (40%) */}
      <div className="w-full md:w-[40%] h-[50vh] md:h-screen z-10 relative md:shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.5)] bg-slate-900/80 backdrop-blur-2xl border-l border-white/10">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full"
            >
              <TravelForm onPlanGenerated={handlePlanGenerated} />
            </motion.div>
          ) : (
            <motion.div 
              key="display"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full relative"
            >
              <button 
                onClick={handleBackToForm}
                className="absolute top-2 right-2 z-50 flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800/80 py-1.5 px-3 rounded-full border border-white/10 hover:bg-slate-700 transition"
              >
                New Trip <ArrowRight size={14} />
              </button>
              <ItineraryDisplay plan={plan} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
