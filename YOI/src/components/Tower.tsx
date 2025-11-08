import React from 'react';

interface TowerProps {
  position: [number, number, number];
  height: number;
  color: string;
}

export function Tower({ position, height, color }: TowerProps) {
  return (
    <group position={position}>
      {/* Tower base */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, height, 3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Tower windows */}
      {Array.from({ length: Math.floor(height / 3) }).map((_, i) => (
        <group key={`tower-window-${i}`}>
          {/* Four sides of windows */}
          <mesh position={[0, i * 3 + 2, 1.51]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshStandardMaterial 
              color="#FFE4B5" 
              emissive="#FFA500" 
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0, i * 3 + 2, -1.51]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshStandardMaterial 
              color="#FFE4B5" 
              emissive="#FFA500" 
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[1.51, i * 3 + 2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshStandardMaterial 
              color="#FFE4B5" 
              emissive="#FFA500" 
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[-1.51, i * 3 + 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshStandardMaterial 
              color="#FFE4B5" 
              emissive="#FFA500" 
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}
      
      {/* Spire base */}
      <mesh position={[0, height + 0.5, 0]} castShadow>
        <boxGeometry args={[3.5, 1, 3.5]} />
        <meshStandardMaterial color="#2C1810" roughness={0.9} />
      </mesh>
      
      {/* Spire */}
      <mesh position={[0, height + 3, 0]} castShadow>
        <coneGeometry args={[2, 4, 4]} />
        <meshStandardMaterial color="#2C1810" roughness={0.9} />
      </mesh>
    </group>
  );
}
