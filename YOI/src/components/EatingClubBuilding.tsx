import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { EatingClub } from '../types/campus';
import { ColonialBuilding } from './buildings/ColonialBuilding';
import { GothicBuilding } from './buildings/GothicBuilding';
import { TudorBuilding } from './buildings/TudorBuilding';
import { ModernBuilding } from './buildings/ModernBuilding';
import { VictorianBuilding } from './buildings/VictorianBuilding';

interface EatingClubBuildingProps {
  club: EatingClub;
  isSelected: boolean;
  onClick: () => void;
  showLabel: boolean;
  timeOfDay: 'day' | 'sunset' | 'night';
}

export function EatingClubBuilding({ 
  club, 
  isSelected, 
  onClick, 
  showLabel,
  timeOfDay 
}: EatingClubBuildingProps) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current && isSelected) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (groupRef.current) {
      groupRef.current.position.y = 0;
    }
  });

  const getBuildingComponent = () => {
    const commonProps = {
      color: club.color,
      size: club.size,
      isSelected,
      isHovered: hovered,
      timeOfDay
    };

    switch (club.style) {
      case 'gothic':
        return <GothicBuilding {...commonProps} />;
      case 'tudor':
        return <TudorBuilding {...commonProps} />;
      case 'modern':
        return <ModernBuilding {...commonProps} />;
      case 'victorian':
        return <VictorianBuilding {...commonProps} />;
      default:
        return <ColonialBuilding {...commonProps} />;
    }
  };

  return (
    <group 
      ref={groupRef}
      position={club.position} 
      rotation={[0, club.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {getBuildingComponent()}
      
      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, 6.5, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Label */}
      {showLabel && (
        <Html
          position={[0, 14, 0]}
          center
          distanceFactor={15}
          occlude
        >
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap pointer-events-none backdrop-blur-sm border border-white/20">
            <div>{club.name}</div>
            {club.nickname && (
              <div className="text-xs text-white/70">{club.nickname}</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
