import React, { useState, useEffect } from 'react';
import { PerspectiveCamera, Sky, OrbitControls } from '@react-three/drei';
import { PrincetonBuilding } from './PrincetonBuilding';
import { Tree } from './Tree';
import { SafeAvatar } from './SafeAvatar';
import { FirstPersonControls } from './FirstPersonControls';
import { allBuildings, Building } from '../data/princetonCampusData';
import { useAuth } from '../contexts/AuthContext';

interface PrincetonCampusSceneProps {
  showLabels?: boolean;
  timeOfDay?: 'day' | 'sunset' | 'night';
  viewMode?: 'orbital' | 'first-person';
  onBuildingSelect?: (building: Building | null) => void;
  movementState?: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  };
}

export function PrincetonCampusScene({
  showLabels = true,
  timeOfDay = 'day',
  viewMode = 'orbital',
  onBuildingSelect,
  movementState,
}: PrincetonCampusSceneProps) {
  const { user } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 1.7, -30]);
  const [playerRotation, setPlayerRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // Lighting configuration
  const getLightingConfig = () => {
    switch (timeOfDay) {
      case 'sunset':
        return {
          sunPosition: [100, 30, 50] as [number, number, number],
          ambientIntensity: 0.5,
          directionalIntensity: 1.2,
          skyInclination: 0.5,
          skyAzimuth: 0.25,
          skyTurbidity: 10,
          skyRayleigh: 2,
          fogColor: '#ff9966',
          fogNear: 50,
          fogFar: 150,
        };
      case 'night':
        return {
          sunPosition: [-100, -20, -100] as [number, number, number],
          ambientIntensity: 0.3,
          directionalIntensity: 0.4,
          skyInclination: 0.7,
          skyAzimuth: 0,
          skyTurbidity: 0.1,
          skyRayleigh: 0.5,
          fogColor: '#0a0a1a',
          fogNear: 30,
          fogFar: 100,
        };
      default: // day
        return {
          sunPosition: [100, 100, 50] as [number, number, number],
          ambientIntensity: 0.8,
          directionalIntensity: 1.5,
          skyInclination: 0.3,
          skyAzimuth: 0.15,
          skyTurbidity: 8,
          skyRayleigh: 2,
          fogColor: '#87CEEB',
          fogNear: 50,
          fogFar: 150,
        };
    }
  };

  const lighting = getLightingConfig();

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
    if (onBuildingSelect) {
      onBuildingSelect(building);
    }
  };

  const handlePositionChange = (position: [number, number, number], rotation: number) => {
    setPlayerPosition(position);
    setPlayerRotation(rotation);
    
    const moving = movementState
      ? (movementState.forward || movementState.backward || movementState.left || movementState.right)
      : false;
    setIsMoving(moving);
  };

  // Tree positions for realistic campus landscaping
  const treePositions: [number, number, number][] = [
    // Front lawn trees
    [-12, 0, -15], [12, 0, -15], [-12, 0, -5], [12, 0, -5],
    // Nassau Hall area
    [-25, 0, 35], [25, 0, 35], [-15, 0, 50], [15, 0, 50],
    // Pathways
    [-8, 0, 20], [8, 0, 20], [-8, 0, 30], [8, 0, 30],
    // Residential areas
    [-45, 0, -35], [-45, 0, -20], [-45, 0, 5],
    [45, 0, -35], [45, 0, -20], [45, 0, 5],
    // Library area
    [-10, 0, 65], [10, 0, 65], [0, 0, 75],
    // Eating clubs area
    [45, 0, -5], [45, 0, 10], [45, 0, 25], [45, 0, 40],
    [70, 0, -5], [70, 0, 10], [70, 0, 25],
    // Athletic area
    [-65, 0, 25], [-65, 0, 45], [-50, 0, 70],
  ];

  return (
    <>
      {/* Camera */}
      {viewMode === 'orbital' ? (
        <>
          <PerspectiveCamera makeDefault position={[0, 60, -20]} fov={60} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={20}
            maxDistance={150}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0, 20]}
          />
        </>
      ) : (
        <>
          <PerspectiveCamera makeDefault position={[0, 1.7, -30]} fov={75} />
          <FirstPersonControls
            onPositionChange={handlePositionChange}
            enabled={true}
            movementState={movementState}
          />
        </>
      )}

      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={lighting.sunPosition}
        inclination={lighting.skyInclination}
        azimuth={lighting.skyAzimuth}
        turbidity={lighting.skyTurbidity}
        rayleigh={lighting.skyRayleigh}
      />

      {/* Lighting */}
      <ambientLight intensity={lighting.ambientIntensity} />
      <directionalLight
        position={lighting.sunPosition}
        intensity={lighting.directionalIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />
      <hemisphereLight
        args={['#87CEEB', '#3d6b1f', 0.5]}
        position={[0, 50, 0]}
      />

      {/* Night lights */}
      {timeOfDay === 'night' && (
        <>
          <pointLight position={[0, 10, 0]} intensity={0.5} distance={50} color="#FFA500" />
          <pointLight position={[50, 10, 20]} intensity={0.5} distance={50} color="#FFA500" />
          <pointLight position={[-40, 10, 20]} intensity={0.5} distance={50} color="#FFA500" />
          <pointLight position={[0, 10, 70]} intensity={0.7} distance={60} color="#FFA500" />
        </>
      )}

      {/* Fog for depth */}
      <fog attach="fog" args={[lighting.fogColor, lighting.fogNear, lighting.fogFar]} />

      {/* Ground Plane - Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#3d5a3d" roughness={0.9} />
      </mesh>

      {/* Main Central Pathway - McCosh Walk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 20]} receiveShadow>
        <planeGeometry args={[10, 120]} />
        <meshStandardMaterial color="#a89988" roughness={0.7} />
      </mesh>

      {/* Cross pathways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -20]} receiveShadow>
        <planeGeometry args={[80, 4]} />
        <meshStandardMaterial color="#a89988" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 40]} receiveShadow>
        <planeGeometry args={[80, 5]} />
        <meshStandardMaterial color="#a89988" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, 0.02, 15]} receiveShadow>
        <planeGeometry args={[5, 100]} />
        <meshStandardMaterial color="#a89988" roughness={0.7} />
      </mesh>

      {/* Entrance Gate */}
      <group position={[0, 0, -40]}>
        <mesh position={[-4, 3, 0]} castShadow>
          <boxGeometry args={[0.8, 6, 0.8]} />
          <meshStandardMaterial color="#D4A574" />
        </mesh>
        <mesh position={[4, 3, 0]} castShadow>
          <boxGeometry args={[0.8, 6, 0.8]} />
          <meshStandardMaterial color="#D4A574" />
        </mesh>
        <mesh position={[0, 5.5, 0]} castShadow>
          <boxGeometry args={[9, 1, 0.6]} />
          <meshStandardMaterial color="#D4A574" />
        </mesh>
        <mesh position={[0, 5.5, 0.4]} castShadow>
          <boxGeometry args={[1.5, 1.5, 0.2]} />
          <meshStandardMaterial color="#FF6600" />
        </mesh>
      </group>

      {/* All Princeton Buildings */}
      {allBuildings.map((building) => (
        <PrincetonBuilding
          key={building.id}
          building={building}
          showLabel={showLabels}
          isSelected={selectedBuilding?.id === building.id}
          onClick={() => handleBuildingClick(building)}
        />
      ))}

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree
          key={`tree-${i}`}
          position={pos}
          scale={0.8 + Math.random() * 0.5}
        />
      ))}

      {/* Player Avatar (first-person mode) */}
      {viewMode === 'first-person' && (
        <>
          <SafeAvatar
            position={playerPosition}
            rotation={playerRotation}
            isMoving={isMoving}
            movementDirection={{
              forward: movementState?.forward ? 1 : (movementState?.backward ? -1 : 0),
              strafe: movementState?.left ? 1 : (movementState?.right ? -1 : 0),
            }}
          />
        </>
      )}
    </>
  );
}
