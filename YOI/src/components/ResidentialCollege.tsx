import React from 'react';
import { Building } from './Building';
import { Tower } from './Tower';

interface ResidentialCollegeProps {
  position: [number, number, number];
  name: string;
  color: string;
  rotation?: number;
  large?: boolean;
}

export function ResidentialCollege({ 
  position, 
  name, 
  color, 
  rotation = 0,
  large = false 
}: ResidentialCollegeProps) {
  const scale = large ? 1.3 : 1;
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main building */}
      <Building 
        position={[0, 0, 0]} 
        width={8 * scale} 
        height={12} 
        depth={6 * scale} 
        color={color}
      />
      
      {/* Side wing */}
      <Building 
        position={[0, 0, 8 * scale]} 
        width={8 * scale} 
        height={10} 
        depth={4 * scale} 
        color={color}
      />
      
      {/* Tower */}
      <Tower 
        position={[-3 * scale, 0, 3 * scale]} 
        height={16} 
        color={color}
      />
      
      {/* Courtyard wall */}
      <Building 
        position={[6 * scale, 0, 4 * scale]} 
        width={2} 
        height={8} 
        depth={6 * scale} 
        color={color}
      />
    </group>
  );
}
