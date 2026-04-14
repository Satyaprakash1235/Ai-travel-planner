"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import * as THREE from "three";

const Globe = () => {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [globeOb, setGlobeOb] = useState<ThreeGlobe | null>(null);

  useEffect(() => {
    const globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');
    
    // Tweak to create a cool aesthetic dark globe
    const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
    globeMaterial.color = new THREE.Color(0xffffff); // Natural
    globeMaterial.emissive = new THREE.Color(0x111111); // Natural Glow
    globeMaterial.emissiveIntensity = 0.2;
    globeMaterial.shininess = 0.7;
    
    setGlobeOb(globe);
  }, []);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001; // Slow constant rotation
    }
  });

  if (!globeOb) return null;

  return (
    <primitive object={globeOb} ref={globeRef} scale={1.2} />
  );
};

export default function GlobeView() {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 bg-transparent">
      <Canvas camera={{ position: [0, 0, 300], fov: 45 }}>
        <ambientLight intensity={1.5} color={0xffffff} />
        <directionalLight position={[100, 100, 50]} intensity={2} color={0x34d399} />
        <directionalLight position={[-100, -100, -50]} intensity={2} color={0x818cf8} />
        <Globe />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
