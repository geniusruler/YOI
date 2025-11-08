import { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import type * as THREE from 'three';
import { Building } from '../data/princetonCampusData';

interface PrincetonBuildingProps {
  building: Building;
  onClick?: () => void;
  showLabel?: boolean;
  isSelected?: boolean;
}

export function PrincetonBuilding({ 
  building, 
  onClick, 
  showLabel = true,
  isSelected = false 
}: PrincetonBuildingProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Building style variations
  const getBuildingGeometry = () => {
    const [width, height, depth] = building.size;

    switch (building.style) {
      case 'classical':
        // Circular rotunda style
        return (
          <group>
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[width / 2, width / 2, height, 24]} />
              <meshStandardMaterial color={building.color} roughness={0.8} />
            </mesh>
            {/* Dome */}
            <mesh position={[0, height, 0]} castShadow>
              <sphereGeometry args={[width / 2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Columns */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <mesh
                  key={`col-${i}`}
                  position={[
                    Math.sin(angle) * (width / 2 - 1),
                    height / 2,
                    Math.cos(angle) * (width / 2 - 1)
                  ]}
                  castShadow
                >
                  <cylinderGeometry args={[0.4, 0.4, height, 12]} />
                  <meshStandardMaterial color="#ffffff" />
                </mesh>
              );
            })}
          </group>
        );

      case 'collegiate-gothic':
        return (
          <group>
            {/* Main building */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color={building.color} roughness={0.85} />
            </mesh>
            {/* Gothic roof */}
            <mesh position={[0, height, 0]} castShadow>
              <boxGeometry args={[width + 1, 2, depth + 1]} />
              <meshStandardMaterial color="#5d4e37" />
            </mesh>
            {/* Windows */}
            {Array.from({ length: Math.floor(width / 4) }).map((_, i) => {
              const x = -width / 2 + 2 + i * 4;
              return (
                <mesh key={`win-${i}`} position={[x, height / 2, depth / 2 + 0.1]} castShadow>
                  <boxGeometry args={[1.5, 3, 0.2]} />
                  <meshStandardMaterial color="#5d7a8a" transparent opacity={0.7} />
                </mesh>
              );
            })}
            {/* Entrance */}
            <mesh position={[0, 3, depth / 2 + 0.1]} castShadow>
              <boxGeometry args={[3, 6, 0.5]} />
              <meshStandardMaterial color="#4a3520" />
            </mesh>
          </group>
        );

      case 'colonial':
        return (
          <group>
            {/* Main building */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color={building.color} roughness={0.8} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, height, 0]} castShadow>
              <boxGeometry args={[width + 1, 1.5, depth + 1]} />
              <meshStandardMaterial color="#6b4423" />
            </mesh>
            {/* Columns */}
            {[-width / 4, width / 4].map((x, i) => (
              <mesh key={`col-${i}`} position={[x, height / 2, depth / 2 + 0.5]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, height, 12]} />
                <meshStandardMaterial color="#f5f5dc" />
              </mesh>
            ))}
            {/* Windows in grid */}
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: Math.floor(width / 3.5) }).map((_, col) => {
                const x = -width / 2 + 2 + col * 3.5;
                const y = 3 + row * 3;
                return (
                  <mesh key={`win-${row}-${col}`} position={[x, y, depth / 2 + 0.1]} castShadow>
                    <boxGeometry args={[1.2, 2.5, 0.2]} />
                    <meshStandardMaterial color="#6b94a8" transparent opacity={0.7} />
                  </mesh>
                );
              })
            )}
          </group>
        );

      case 'modern':
        return (
          <group>
            {/* Main building */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial 
                color={building.color} 
                roughness={0.4} 
                metalness={0.3} 
              />
            </mesh>
            {/* Flat roof */}
            <mesh position={[0, height, 0]} castShadow>
              <boxGeometry args={[width + 0.5, 0.5, depth + 0.5]} />
              <meshStandardMaterial color="#686868" />
            </mesh>
            {/* Glass facade */}
            <mesh position={[0, height / 2, depth / 2 + 0.3]} castShadow>
              <boxGeometry args={[width - 4, height - 2, 0.5]} />
              <meshStandardMaterial 
                color="#d0e8f0" 
                transparent 
                opacity={0.5} 
                metalness={0.8} 
              />
            </mesh>
          </group>
        );

      case 'victorian':
        return (
          <group>
            {/* Main building */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color={building.color} roughness={0.85} />
            </mesh>
            {/* Steep roof */}
            <mesh position={[0, height, 0]} castShadow>
              <boxGeometry args={[width + 1, 1.5, depth + 1]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Tower/turret */}
            <mesh position={[-width / 3, height * 0.7, -depth / 3]} castShadow>
              <cylinderGeometry args={[2, 2, height * 0.6, 12]} />
              <meshStandardMaterial color={building.color} />
            </mesh>
            <mesh position={[-width / 3, height + 1, -depth / 3]} castShadow>
              <coneGeometry args={[2.5, 3, 12]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        );

      default:
        // Simple box
        return (
          <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={building.color} roughness={0.8} />
          </mesh>
        );
    }
  };

  const labelColor = building.type === 'eating-club' ? '#8B6B47' : '#ff6600';
  const emissiveColor = isSelected ? '#ff6600' : (hovered ? '#ffa500' : '#000000');
  const emissiveIntensity = isSelected ? 0.5 : (hovered ? 0.3 : 0);

  return (
    <group 
      position={building.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {getBuildingGeometry()}
      
      {/* Selection/hover highlight */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[building.size[0] * 0.6, building.size[0] * 0.7, 32]} />
          <meshBasicMaterial color={isSelected ? '#ff6600' : '#ffa500'} transparent opacity={0.5} />
        </mesh>
      )}

      {/* Label */}
      {showLabel && (
        <Text
          position={[0, building.size[1] + 2, 0]}
          fontSize={building.type === 'residential' ? 0.9 : 0.7}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#000000"
        >
          {building.name.toUpperCase()}
        </Text>
      )}

      {/* Building type indicator */}
      {hovered && (
        <Text
          position={[0, building.size[1] + 3.5, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {building.type.replace('-', ' ').toUpperCase()}
        </Text>
      )}
    </group>
  );
}
