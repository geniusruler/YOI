import React from 'react';

export function Ground() {
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>
      
      {/* Pathways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 100]} />
        <meshStandardMaterial color="#6B7280" roughness={0.8} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0, -10]} receiveShadow>
        <planeGeometry args={[80, 3]} />
        <meshStandardMaterial color="#6B7280" roughness={0.8} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color="#6B7280" roughness={0.8} />
      </mesh>
      
      {/* Central courtyard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.05, -5]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#3d6b1f" roughness={0.9} />
      </mesh>
    </group>
  );
}
