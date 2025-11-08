import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type * as THREE from 'three';
import { CampusBuilding as CampusBuildingType } from '../data/campusBuildings';

interface CampusBuildingProps {
  building: CampusBuildingType;
  isSelected: boolean;
  onSelect: () => void;
  showLabel: boolean;
}

export function CampusBuilding({ building, isSelected, onSelect, showLabel }: CampusBuildingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && (isSelected || hovered)) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + getBuildingHeight(building.size) / 2;
    } else if (meshRef.current) {
      meshRef.current.position.y = getBuildingHeight(building.size) / 2;
    }
  });

  const getBuildingDimensions = (size: string): [number, number, number] => {
    switch (size) {
      case 'small':
        return [4, 4, 4];
      case 'medium':
        return [6, 6, 6];
      case 'large':
        return [8, 8, 8];
      case 'xlarge':
        return [10, 10, 10];
      default:
        return [6, 6, 6];
    }
  };

  const getBuildingHeight = (size: string): number => {
    return getBuildingDimensions(size)[1];
  };

  const dimensions = getBuildingDimensions(building.size);
  const height = dimensions[1];

  return (
    <group position={building.position} rotation={[0, building.rotation, 0]}>
      {/* Building */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (building.interactable) {
            onSelect();
          }
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = building.interactable ? 'pointer' : 'default';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={dimensions} />
        <meshStandardMaterial 
          color={building.color}
          metalness={0.1}
          roughness={0.8}
          emissive={isSelected || hovered ? building.color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, height + 0.5, 0]} castShadow>
        <coneGeometry args={[dimensions[0] * 0.7, 1.5, 4]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Text
          position={[0, height + 2, 0]}
          fontSize={0.8}
          color={isSelected ? '#ff6b35' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {building.name}
        </Text>
      )}

      {/* Type indicator */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[dimensions[0] * 0.6, 32]} />
        <meshStandardMaterial 
          color={getTypeColor(building.type)}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'academic':
      return '#4169E1';
    case 'dining':
      return '#FF8C00';
    case 'library':
      return '#8B4513';
    case 'cafe':
      return '#D2691E';
    case 'research':
      return '#9370DB';
    case 'athletic':
      return '#DC143C';
    case 'residence':
      return '#32CD32';
    case 'administrative':
      return '#DAA520';
    default:
      return '#808080';
  }
}
