import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function RotatingWireframeGlobe() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // Calculate node positions once
  const nodePositions = useMemo(() => {
    const n = 50;
    const positions = new Float32Array(n * 3);
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      
      positions[i * 3] = Math.cos(theta) * radiusAtY * 2.5;
      positions[i * 3 + 1] = y * 2.5;
      positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * 2.5;
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Base Wireframe Sphere - Extremely low poly */}
      <Sphere args={[2.5, 12, 12]}>
        <meshBasicMaterial 
          color="#06b6d4" 
          wireframe={true} 
          transparent={true} 
          opacity={0.15} 
        />
      </Sphere>
      
      {/* Single Points Object instead of 50 individual Meshes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodePositions.length / 3}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial 
          color="#06b6d4" 
          size={0.08} 
          sizeAttenuation={true} 
          transparent={true}
          opacity={0.8}
        />
      </points>
    </group>
  );
}

export default function CyberGlobe() {
  return (
    <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
      {/* Cap DPR to 1 to prevent massive pixel rendering on Retina/Mobile screens */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={1} gl={{ antialias: false, alpha: true }}>
        <RotatingWireframeGlobe />
      </Canvas>
    </div>
  );
}
