import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

/**
 * Realistic Human Avatar
 * Male figure in red shirt, blue jeans, brown shoes
 * Proper human proportions with simple walking animation
 */

interface RealisticAvatarProps {
  position: [number, number, number];
  rotation: number;
  isMoving?: boolean;
  movementDirection?: { forward: number; strafe: number };
}

export function RealisticAvatar({ 
  position, 
  rotation, 
  isMoving = false,
  movementDirection = { forward: 0, strafe: 0 }
}: RealisticAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const walkCycle = useRef(0);

  // Walking animation
  useFrame((state, delta) => {
    if (!isMoving || !leftLegRef.current || !rightLegRef.current || !leftArmRef.current || !rightArmRef.current) {
      // Reset to standing position when not moving
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      walkCycle.current = 0;
      return;
    }

    // Update walk cycle
    walkCycle.current += delta * 5;

    // Leg swing (opposite)
    const legSwing = Math.sin(walkCycle.current) * 0.5;
    leftLegRef.current.rotation.x = legSwing;
    rightLegRef.current.rotation.x = -legSwing;

    // Arm swing (opposite to legs)
    const armSwing = Math.sin(walkCycle.current) * 0.3;
    leftArmRef.current.rotation.x = -armSwing;
    rightArmRef.current.rotation.x = armSwing;
  });

  // Skin tone
  const skinColor = '#F4C2A0';
  const shirtColor = '#DC143C'; // Red
  const jeansColor = '#1E3A8A'; // Blue
  const shoesColor = '#8B4513'; // Brown

  return (
    <group 
      ref={groupRef}
      position={position} 
      rotation={[0, rotation, 0]}
    >
      {/* Head */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Torso (Red Shirt) */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.25]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.35, 0.2, 0.2]} />
        <meshStandardMaterial color={jeansColor} />
      </mesh>

      {/* Left Arm */}
      <group 
        ref={leftArmRef}
        position={[0.25, 1.35, 0]}
      >
        {/* Upper Arm */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.3, 8]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.25, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.57, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group 
        ref={rightArmRef}
        position={[-0.25, 1.35, 0]}
      >
        {/* Upper Arm */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.3, 8]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.25, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.57, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group 
        ref={leftLegRef}
        position={[0.1, 0.65, 0]}
      >
        {/* Thigh (Blue Jeans) */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.075, 0.5, 8]} />
          <meshStandardMaterial color={jeansColor} />
        </mesh>
        {/* Shin (Blue Jeans) */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.07, 0.45, 8]} />
          <meshStandardMaterial color={jeansColor} />
        </mesh>
        {/* Foot (Brown Shoe) */}
        <mesh position={[0, -0.95, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.25]} />
          <meshStandardMaterial color={shoesColor} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group 
        ref={rightLegRef}
        position={[-0.1, 0.65, 0]}
      >
        {/* Thigh (Blue Jeans) */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.075, 0.5, 8]} />
          <meshStandardMaterial color={jeansColor} />
        </mesh>
        {/* Shin (Blue Jeans) */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.07, 0.45, 8]} />
          <meshStandardMaterial color={jeansColor} />
        </mesh>
        {/* Foot (Brown Shoe) */}
        <mesh position={[0, -0.95, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.25]} />
          <meshStandardMaterial color={shoesColor} />
        </mesh>
      </group>
    </group>
  );
}
