"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { MapPin } from "lucide-react";

interface GlobeProps {
  places: any[];
  origin?: { lat: number; lng: number } | null;
  destination?: { lat: number; lng: number } | null;
}

const Globe = ({ places, origin, destination }: GlobeProps) => {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [globeOb, setGlobeOb] = useState<ThreeGlobe | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

  useEffect(() => {
    const globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');
    
    const material = globe.globeMaterial() as THREE.MeshPhongMaterial;
    material.color = new THREE.Color(0xffffff); 
    material.emissive = new THREE.Color(0x111111);
    material.emissiveIntensity = 0.5;
    material.shininess = 0.7;
    
    setGlobeOb(globe);
  }, []);

  useEffect(() => {
    if (!globeOb) return;

    // 1. Arcs (Long distance flight)
    if (origin && destination) {
      const arcData = [{
        startLat: origin.lat,
        startLng: origin.lng,
        endLat: destination.lat,
        endLng: destination.lng,
        color: ['#10b981', '#6366f1']
      }];

      globeOb
        .arcsData(arcData)
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(4)
        .arcDashInitialGap(() => Math.random() * 5)
        .arcDashAnimateTime(1000)
        .arcStroke(0.5);
    } else {
      globeOb.arcsData([]);
    }

    // 2. Paths (Local Route from Day 1 to Day 5)
    if (origin && destination && places.length > 0) {
      // Sort places by day then type
      const sortedPlaces = [...places].sort((a, b) => (a.day || 0) - (b.day || 0));
      
      const routePoints = [
        [origin.lng, origin.lat],
        ...sortedPlaces.map(p => [p.lng, p.lat]),
        [destination.lng, destination.lat]
      ];

      globeOb
        .pathsData([routePoints])
        .pathColor(() => '#34d399')
        .pathDashLength(0.01)
        .pathDashGap(0.004)
        .pathDashAnimateTime(10000)
        .pathStroke(0.3);
    } else {
      globeOb.pathsData([]);
    }

    // 3. Auto-Focus (Pointing correctly)
    if (destination && globeRef.current) {
        // Simple rotation to target lat/lng
        // Longitude is around Y axis, Latitude is around X axis
        const phi = (90 - destination.lat) * (Math.PI / 180);
        const theta = (destination.lng + 90) * (Math.PI / 180);
        
        // We want the point to face the camera (Z axis)
        // This is a rough approximation for ThreeGlobe rotation
        globeRef.current.rotation.set(0, -theta, 0); 
    }

  }, [globeOb, origin, destination, places]);

  useFrame(() => {
    if (globeRef.current && places.length === 0 && !origin) {
      globeRef.current.rotation.y += 0.001; 
    }
  });

  if (!globeOb) return null;

  const renderMarker = (place: any, type: 'activity' | 'origin' | 'destination') => {
    const coords = globeOb.getCoords(place.lat, place.lng, 0.06);
    const isSpecial = type !== 'activity';
    
    return (
      <Html 
        key={`${type}-${place.name}`} 
        position={[coords.x * 1.2, coords.y * 1.2, coords.z * 1.2]}
        center
        zIndexRange={[100, 0]}
      >
        <div 
          className="relative group cursor-pointer"
          onMouseEnter={() => setHoveredPlace(place.name)}
          onMouseLeave={() => setHoveredPlace(null)}
        >
          <div className={`w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-white/20 animate-bounce
            ${type === 'origin' ? 'bg-amber-500 text-white scale-110 ring-2 ring-amber-400/50' : 
              type === 'destination' ? 'bg-indigo-500 text-white scale-125 ring-2 ring-indigo-400/50' : 
              'bg-emerald-500/80 backdrop-blur-md text-white hover:scale-125'}`}
          >
            <MapPin size={type === 'destination' ? 20 : 16} />
          </div>
          
          <div className={`absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white p-3 rounded-xl w-48 shadow-2xl z-50 transition-opacity duration-300
            ${hoveredPlace === place.name || isSpecial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {type === 'origin' && <span className="bg-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-white uppercase">Origin</span>}
              {type === 'destination' && <span className="bg-indigo-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-white uppercase">Destination</span>}
              <h4 className={`font-bold text-sm ${type === 'origin' ? 'text-amber-400' : type === 'destination' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                {place.name}
              </h4>
            </div>
            {(hoveredPlace === place.name || !isSpecial) && (
              <p className="text-xs text-slate-300 leading-snug">{place.description}</p>
            )}
          </div>
        </div>
      </Html>
    );
  };

  return (
    <group>
      <primitive object={globeOb} ref={globeRef} scale={1.2} />
      {origin && renderMarker({ ...origin, name: "Home", description: "Your starting location" }, 'origin')}
      {destination && renderMarker({ ...destination, name: "Destination", description: "Your target city" }, 'destination')}
      {places.map((place) => renderMarker(place, 'activity'))}
    </group>
  );
};

export default function GlobeWithMarkers({ places, origin, destination }: GlobeProps) {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 bg-transparent">
      <Canvas camera={{ position: [0, 0, 300], fov: 45 }}>
        <ambientLight intensity={1.5} color={0xffffff} />
        <PointLightWrapper />
        <Globe places={places} origin={origin} destination={destination} />
        <OrbitControls enableZoom={true} enablePan={true} autoRotate={!origin} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

function PointLightWrapper() {
  return (
    <>
      <directionalLight position={[100, 100, 50]} intensity={2} color={0x34d399} />
      <directionalLight position={[-100, -100, -50]} intensity={2} color={0x818cf8} />
    </>
  );
}

