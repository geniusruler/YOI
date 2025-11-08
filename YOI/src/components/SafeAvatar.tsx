import React, { useState, useEffect } from 'react';
import { RealisticAvatar } from './RealisticAvatar';

/**
 * Safe Avatar Wrapper
 * Ensures avatar always loads with fallback
 * Error boundary for avatar rendering
 */

interface SafeAvatarProps {
  position: [number, number, number];
  rotation: number;
  isMoving?: boolean;
  movementDirection?: { forward: number; strafe: number };
}

export function SafeAvatar(props: SafeAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Error boundary simulation
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.message.includes('Avatar') || event.message.includes('RealisticAvatar')) {
        console.error('Avatar rendering error:', event.error);
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  // If error, show fallback cube avatar
  if (hasError) {
    return <FallbackCubeAvatar {...props} />;
  }

  // If still loading, show placeholder
  if (isLoading) {
    return <LoadingAvatar {...props} />;
  }

  // Try to render realistic avatar
  try {
    return <RealisticAvatar {...props} />;
  } catch (error) {
    console.error('Failed to render RealisticAvatar:', error);
    setHasError(true);
    return <FallbackCubeAvatar {...props} />;
  }
}

// Fallback: Simple stylized 3D human made of cubes
function FallbackCubeAvatar({ position, rotation }: SafeAvatarProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#F4C2A0" />
      </mesh>

      {/* Body (Red Shirt) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshStandardMaterial color="#DC143C" />
      </mesh>

      {/* Arms */}
      <mesh position={[0.35, 1.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#DC143C" />
      </mesh>
      <mesh position={[-0.35, 1.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#DC143C" />
      </mesh>

      {/* Legs (Blue Jeans) */}
      <mesh position={[0.12, 0.5, 0]} castShadow>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>
      <mesh position={[-0.12, 0.5, 0]} castShadow>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>

      {/* Feet (Brown Shoes) */}
      <mesh position={[0.12, 0.05, 0.08]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-0.12, 0.05, 0.08]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Indicator that this is fallback mode */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

// Loading placeholder
function LoadingAvatar({ position, rotation }: SafeAvatarProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1.5, 8, 16]} />
        <meshStandardMaterial 
          color="#FF6600" 
          transparent 
          opacity={0.5}
          wireframe
        />
      </mesh>
    </group>
  );
}
