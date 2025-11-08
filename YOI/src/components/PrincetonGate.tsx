import React from 'react';
import { Text } from '@react-three/drei';

/**
 * Princeton University Entrance Gate
 * A grand entrance gate with the Princeton shield/logo
 * Positioned at the southern entrance of the campus
 */

interface PrincetonGateProps {
  position?: [number, number, number];
}

export function PrincetonGate({ position = [0, 0, -40] }: PrincetonGateProps) {
  return (
    <group position={position}>
      {/* Main Gate Pillars - Left and Right */}
      <group>
        {/* Left Pillar */}
        <group position={[-6, 0, 0]}>
          {/* Base */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.6, 1.8]} />
            <meshStandardMaterial color="#8B7355" roughness={0.8} />
          </mesh>
          
          {/* Main column */}
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[1.5, 5, 1.5]} />
            <meshStandardMaterial color="#D4A76A" roughness={0.7} metalness={0.1} />
          </mesh>
          
          {/* Column details */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[1.6, 0.3, 1.6]} />
            <meshStandardMaterial color="#8B7355" roughness={0.6} />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <boxGeometry args={[1.6, 0.3, 1.6]} />
            <meshStandardMaterial color="#8B7355" roughness={0.6} />
          </mesh>
          
          {/* Capital/top */}
          <mesh position={[0, 5.8, 0]} castShadow>
            <boxGeometry args={[2, 0.6, 2]} />
            <meshStandardMaterial color="#8B7355" roughness={0.6} />
          </mesh>
          
          {/* Decorative sphere on top */}
          <mesh position={[0, 6.5, 0]} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#FF6B35" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Right Pillar - Mirror of left */}
        <group position={[6, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.6, 1.8]} />
            <meshStandardMaterial color="#8B7355" roughness={0.8} />
          </mesh>
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[1.5, 5, 1.5]} />
            <meshStandardMaterial color="#D4A76A" roughness={0.7} metalness={0.1} />
          </mesh>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[1.6, 0.3, 1.6]} />
            <meshStandardMaterial color="#8B7355" roughness={0.6} />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <boxGeometry args={[1.6, 0.3, 1.6]} />
            <meshStandardMaterial color="#8B7355" roughness={0.6} />
          </mesh>
          <mesh position={[0, 5.8, 0]} castShadow>
            <boxGeometry args={[2, 0.6, 2]} />
            <meshStandardMaterial color="#8B7355" roughness={0.6} />
          </mesh>
          <mesh position={[0, 6.5, 0]} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#FF6B35" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Gate Arch connecting the pillars */}
      <group position={[0, 5.5, 0]}>
        {/* Main arch beam */}
        <mesh castShadow>
          <boxGeometry args={[13, 0.8, 1.5]} />
          <meshStandardMaterial color="#D4A76A" roughness={0.7} metalness={0.1} />
        </mesh>
        
        {/* Decorative top piece */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[14, 0.4, 1.6]} />
          <meshStandardMaterial color="#8B7355" roughness={0.6} />
        </mesh>
      </group>

      {/* Princeton Shield/Logo */}
      <group position={[0, 6, 0.8]}>
        {/* Shield background */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 3, 0.2]} />
          <meshStandardMaterial color="#FF6B35" metalness={0.3} roughness={0.5} />
        </mesh>
        
        {/* Shield border */}
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[2.6, 3.1, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>
        
        {/* Center emblem circle */}
        <mesh position={[0, 0.3, 0.21]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
          <meshStandardMaterial color="#000000" metalness={0.2} roughness={0.7} />
        </mesh>
        
        {/* Inner circle */}
        <mesh position={[0, 0.3, 0.27]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.05, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* "P" letter */}
        <Text
          position={[0, 0.3, 0.3]}
          fontSize={0.6}
          color="#FF6B35"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          P
        </Text>
        
        {/* Top section text */}
        <Text
          position={[0, 1.2, 0.21]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          PRINCETON
        </Text>
        
        {/* Bottom section text */}
        <Text
          position={[0, -0.6, 0.21]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          UNIVERSITY
        </Text>
        
        {/* Latin motto "Dei sub numine viget" */}
        <Text
          position={[0, -1.2, 0.21]}
          fontSize={0.12}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          fontStyle="italic"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          Dei sub numine viget
        </Text>
      </group>

      {/* Side walls extending from pillars */}
      <group>
        {/* Left wall */}
        <mesh position={[-9, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 3, 2]} />
          <meshStandardMaterial color="#8B7355" roughness={0.8} />
        </mesh>
        <mesh position={[-11.5, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 2.4, 1.8]} />
          <meshStandardMaterial color="#A0826D" roughness={0.8} />
        </mesh>
        
        {/* Right wall */}
        <mesh position={[9, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 3, 2]} />
          <meshStandardMaterial color="#8B7355" roughness={0.8} />
        </mesh>
        <mesh position={[11.5, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 2.4, 1.8]} />
          <meshStandardMaterial color="#A0826D" roughness={0.8} />
        </mesh>
      </group>

      {/* Welcome sign above the gate */}
      <group position={[0, 8, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.6}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.03}
          outlineColor="#FF6B35"
        >
          WELCOME TO PRINCETON
        </Text>
      </group>

      {/* Decorative lanterns on pillars */}
      <group>
        {/* Left lantern */}
        <group position={[-6, 5, 1.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.4, 0.6, 0.4]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFA500" 
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight position={[0, -0.4, 0]} intensity={2} color="#FFA500" distance={8} />
        </group>
        
        {/* Right lantern */}
        <group position={[6, 5, 1.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.4, 0.6, 0.4]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFA500" 
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight position={[0, -0.4, 0]} intensity={2} color="#FFA500" distance={8} />
        </group>
      </group>

      {/* Ground paving beneath the gate */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 6]} />
        <meshStandardMaterial 
          color="#6B5D54" 
          roughness={0.9}
        />
      </mesh>

      {/* Decorative paving pattern */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <mesh 
          key={i}
          position={[x, 0.03, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[1.5, 5]} />
          <meshStandardMaterial 
            color="#8B7355" 
            roughness={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}
