import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';

interface FirstPersonControlsProps {
  onPositionChange?: (position: [number, number, number], rotation: number) => void;
  enabled?: boolean;
}

export function FirstPersonControls({ onPositionChange, enabled = true }: FirstPersonControlsProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  
  // Create velocity and direction vectors using object literals instead of Vector3
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const direction = useRef({ x: 0, y: 0, z: 0 });
  const [moveState, setMoveState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMoveState(prev => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMoveState(prev => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMoveState(prev => ({ ...prev, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMoveState(prev => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMoveState(prev => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMoveState(prev => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMoveState(prev => ({ ...prev, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMoveState(prev => ({ ...prev, right: false }));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled]);

  useFrame((state, delta) => {
    if (!controlsRef.current || !enabled) return;

    const controls = controlsRef.current;
    const speed = 10.0;

    // Update velocity based on movement state
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(moveState.forward) - Number(moveState.backward);
    direction.current.x = Number(moveState.right) - Number(moveState.left);
    
    // Normalize direction vector
    const length = Math.sqrt(direction.current.x * direction.current.x + direction.current.z * direction.current.z);
    if (length > 0) {
      direction.current.x /= length;
      direction.current.z /= length;
    }

    if (moveState.forward || moveState.backward) {
      velocity.current.z -= direction.current.z * speed * delta;
    }
    if (moveState.left || moveState.right) {
      velocity.current.x -= direction.current.x * speed * delta;
    }

    // Move the camera
    if (controls.moveRight && controls.moveForward) {
      controls.moveRight(-velocity.current.x * delta);
      controls.moveForward(-velocity.current.z * delta);
    }

    // Keep camera at a fixed height (eye level)
    camera.position.y = 1.7;

    // Report position changes
    if (onPositionChange) {
      const pos: [number, number, number] = [
        camera.position.x,
        camera.position.y,
        camera.position.z
      ];
      const rot = camera.rotation.y;
      onPositionChange(pos, rot);
    }
  });

  if (!enabled) return null;

  return <PointerLockControls ref={controlsRef} />;
}
