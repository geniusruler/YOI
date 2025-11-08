import React from 'react';
import { Text } from '@react-three/drei';

/**
 * FitzRandolph Gate - The iconic main entrance to Princeton University
 * Located on Nassau Street, this is the ceremonial entrance
 */

interface FitzRandolphGateProps {
  position?: [number, number, number];
  onEnter?: () => void;
}

export function FitzRandolphGate({ 
  position = [0, 0, -45],
  onEnter 
}: FitzRandolphGateProps) {
  
  return (
    <group position={position}>
      {/* Gate Posts - Tall stone pillars */}
      <group>
        {/* Left Pillar */}
        <mesh position={[-6, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 9, 1.2]} />
          <meshStandardMaterial color="#c9b899" roughness={0.9} />
        </mesh>
        {/* Left Pillar Cap */}
        <mesh position={[-6, 9.5, 0]} castShadow>
          <boxGeometry args={[1.6, 0.8, 1.6]} />
          <meshStandardMaterial color="#b89968" roughness={0.85} />
        </mesh>
        {/* Left Pillar Ornament */}
        <mesh position={[-6, 10.5, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#d4a574" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Right Pillar */}
        <mesh position={[6, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 9, 1.2]} />
          <meshStandardMaterial color="#c9b899" roughness={0.9} />
        </mesh>
        {/* Right Pillar Cap */}
        <mesh position={[6, 9.5, 0]} castShadow>
          <boxGeometry args={[1.6, 0.8, 1.6]} />
          <meshStandardMaterial color="#b89968" roughness={0.85} />
        </mesh>
        {/* Right Pillar Ornament */}
        <mesh position={[6, 10.5, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#d4a574" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Wrought Iron Gates - Classic Princeton design */}
      <group>
        {/* Left Gate */}
        <mesh position={[-3, 4, 0]} castShadow>
          <boxGeometry args={[0.1, 7, 4]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Vertical bars - Left */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = -5 + i * 0.8;
          return (
            <mesh key={`left-bar-${i}`} position={[x, 4, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 7, 8]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
            </mesh>
          );
        })}

        {/* Right Gate */}
        <mesh position={[3, 4, 0]} castShadow>
          <boxGeometry args={[0.1, 7, 4]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Vertical bars - Right */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 1 + i * 0.8;
          return (
            <mesh key={`right-bar-${i}`} position={[x, 4, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 7, 8]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
            </mesh>
          );
        })}

        {/* Decorative Top Arch */}
        <mesh position={[0, 7.5, 0]} castShadow>
          <torusGeometry args={[6.5, 0.08, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Gate Lamps - Classic lantern style */}
      <group>
        {/* Left Lamp */}
        <mesh position={[-6, 7, 1]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 6]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
        </mesh>
        <mesh position={[-6, 7.5, 1]} castShadow>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial 
            color="#ffe4b5" 
            emissive="#ffa500" 
            emissiveIntensity={0.5}
            transparent 
            opacity={0.8}
          />
        </mesh>
        <pointLight position={[-6, 7.5, 1]} intensity={0.8} distance={15} color="#ffa500" />

        {/* Right Lamp */}
        <mesh position={[6, 7, 1]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 6]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
        </mesh>
        <mesh position={[6, 7.5, 1]} castShadow>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial 
            color="#ffe4b5" 
            emissive="#ffa500" 
            emissiveIntensity={0.5}
            transparent 
            opacity={0.8}
          />
        </mesh>
        <pointLight position={[6, 7.5, 1]} intensity={0.8} distance={15} color="#ffa500" />
      </group>

      {/* Princeton University Crest/Shield */}
      <group position={[0, 7.5, 0.5]}>
        <mesh castShadow>
          <boxGeometry args={[2, 2.4, 0.2]} />
          <meshStandardMaterial color="#ff6600" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Shield border */}
        <mesh position={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[2.2, 2.6, 0.1]} />
          <meshStandardMaterial color="#000000" roughness={0.4} />
        </mesh>
        {/* Book symbol (simplified) */}
        <mesh position={[0, 0.3, 0.25]} castShadow>
          <boxGeometry args={[1, 0.6, 0.1]} />
          <meshStandardMaterial color="#000000" roughness={0.3} />
        </mesh>
        {/* Latin motto area */}
        <mesh position={[0, -0.6, 0.25]} castShadow>
          <boxGeometry args={[1.6, 0.4, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>

      {/* Welcome Sign */}
      <Text
        position={[0, 10, 1]}
        fontSize={0.8}
        color="#ff6600"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#000000"
        maxWidth={12}
        textAlign="center"
      >
        PRINCETON UNIVERSITY
      </Text>

      <Text
        position={[0, 9, 1]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
        maxWidth={10}
        textAlign="center"
      >
        FitzRandolph Gate
      </Text>

      <Text
        position={[0, 8.2, 1]}
        fontSize={0.35}
        color="#d4a574"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        maxWidth={10}
        textAlign="center"
        italics
      >
        "Dei sub numine viget"
      </Text>

      {/* Stone Foundation/Steps */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[16, 0.6, 6]} />
        <meshStandardMaterial color="#a89988" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.6, 1]} receiveShadow>
        <boxGeometry args={[14, 0.4, 4]} />
        <meshStandardMaterial color="#b8a898" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.85, 1.8]} receiveShadow>
        <boxGeometry args={[12, 0.3, 2]} />
        <meshStandardMaterial color="#c9b8a8" roughness={0.9} />
      </mesh>

      {/* Plaque - "Founded 1746" */}
      <mesh position={[0, 2, 0.7]} castShadow>
        <boxGeometry args={[3, 0.8, 0.15]} />
        <meshStandardMaterial color="#6b5d4f" roughness={0.7} metalness={0.3} />
      </mesh>
      <Text
        position={[0, 2, 0.85]}
        fontSize={0.25}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.8}
        textAlign="center"
      >
        FOUNDED 1746
      </Text>

      {/* Entrance Interactive Zone */}
      {onEnter && (
        <mesh 
          position={[0, 2, 3]} 
          onClick={onEnter}
          onPointerOver={(e) => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[8, 6, 2]} />
          <meshStandardMaterial 
            color="#88ff88" 
            transparent 
            opacity={0} 
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Walkway leading through gate */}
      <mesh position={[0, 0.02, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 15]} />
        <meshStandardMaterial color="#8b7d6b" roughness={0.8} />
      </mesh>

      {/* Ground path pattern - cobblestones */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => {
          const x = -3 + col * 2;
          const z = 0 + row * 1.8;
          return (
            <mesh 
              key={`stone-${row}-${col}`} 
              position={[x, 0.03, z]} 
              rotation={[-Math.PI / 2, 0, Math.random() * 0.2]}
              receiveShadow
            >
              <circleGeometry args={[0.4, 6]} />
              <meshStandardMaterial color="#7a6d5a" roughness={0.95} />
            </mesh>
          );
        })
      )}
    </group>
  );
}
