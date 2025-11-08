import React, { useRef } from 'react';

interface BuildingProps {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
}

export function Building({ position, width, height, depth, color }: BuildingProps) {
  const meshRef = useRef(null);
  
  return (
    <group position={position}>
      {/* Main building body */}
      <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, height + 0.5, 0]} castShadow>
        <boxGeometry args={[width + 0.5, 1, depth + 0.5]} />
        <meshStandardMaterial color="#2C1810" roughness={0.9} />
      </mesh>
      
      {/* Windows */}
      {Array.from({ length: Math.floor(width / 2) }).map((_, i) => (
        <group key={`windows-${i}`}>
          {Array.from({ length: Math.floor(height / 3) }).map((_, j) => (
            <group key={`window-${i}-${j}`}>
              {/* Front windows */}
              <mesh position={[(i - Math.floor(width / 4)) * 2, j * 3 + 2, depth / 2 + 0.01]}>
                <planeGeometry args={[0.8, 1.5]} />
                <meshStandardMaterial 
                  color="#FFE4B5" 
                  emissive="#FFA500" 
                  emissiveIntensity={0.3}
                />
              </mesh>
              
              {/* Back windows */}
              <mesh 
                position={[(i - Math.floor(width / 4)) * 2, j * 3 + 2, -depth / 2 - 0.01]}
                rotation={[0, Math.PI, 0]}
              >
                <planeGeometry args={[0.8, 1.5]} />
                <meshStandardMaterial 
                  color="#FFE4B5" 
                  emissive="#FFA500" 
                  emissiveIntensity={0.3}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      
      {/* Door */}
      <mesh position={[0, 1.5, depth / 2 + 0.01]}>
        <planeGeometry args={[1.5, 3]} />
        <meshStandardMaterial color="#4A2511" />
      </mesh>
    </group>
  );
}
