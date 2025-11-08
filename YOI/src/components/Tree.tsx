import React from 'react';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

export function Tree({ position, scale = 1 }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#4A2511" roughness={0.9} />
      </mesh>
      
      {/* Foliage - bottom layer */}
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[2, 3, 8]} />
        <meshStandardMaterial color="#1e4620" roughness={0.8} />
      </mesh>
      
      {/* Foliage - middle layer */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <coneGeometry args={[1.5, 2.5, 8]} />
        <meshStandardMaterial color="#2d5a2f" roughness={0.8} />
      </mesh>
      
      {/* Foliage - top layer */}
      <mesh position={[0, 7, 0]} castShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#3d6b3f" roughness={0.8} />
      </mesh>
    </group>
  );
}
