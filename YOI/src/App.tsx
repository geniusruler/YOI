import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Building } from './data/princetonCampusData';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PrincetonCampusScene } from './components/PrincetonCampusScene';
import { BuildingInfoPanel } from './components/BuildingInfoPanel';
import { UserMenu } from './components/UserMenu';
import { Controls } from './components/Controls';
import { ChatAgent } from './components/ChatAgent';
import { CompactControlsMenu } from './components/CompactControlsMenu';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { AvatarCreationPage } from './components/auth/AvatarCreationPage';
import { WebGLContextManager } from './components/WebGLContextManager';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'avatar'>('login');
  const [signupData, setSignupData] = useState<{ email: string; password: string; name: string } | null>(null);
  
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 60, -20]);
  const [showLabels, setShowLabels] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [viewMode, setViewMode] = useState<'orbital' | 'first-person'>('orbital');
  const [movementState, setMovementState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const [lowGraphicsMode, setLowGraphicsMode] = useState(false);

  const handleSignupSubmit = (email: string, password: string, name: string) => {
    setSignupData({ email, password, name });
    setAuthView('avatar');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-orange-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading Princeton Campus...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    return (
      <>
        {authView === 'login' && (
          <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
        )}
        
        {authView === 'signup' && (
          <SignupPage
            onSwitchToLogin={() => setAuthView('login')}
            onSignupSuccess={handleSignupSubmit}
          />
        )}
        
        {authView === 'avatar' && signupData && (
          <AvatarCreationPage signupData={signupData} />
        )}
      </>
    );
  }

  // Show main app when logged in
  return (
    <div className="w-full h-screen bg-slate-900 relative overflow-hidden">
      {/* User Menu */}
      <UserMenu />
      
      {/* Compact Controls Menu */}
      <CompactControlsMenu
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        voiceEnabled={false}
        onVoiceToggle={() => {}}
        lowGraphicsMode={lowGraphicsMode}
        onGraphicsToggle={setLowGraphicsMode}
      />
      
      {/* Chat Agent */}
      <ChatAgent />
      
      {/* 3D Canvas */}
      <Canvas 
        shadows={!lowGraphicsMode}
        dpr={lowGraphicsMode ? [1, 1] : [1, 2]} 
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: !lowGraphicsMode,
          powerPreference: lowGraphicsMode ? 'low-power' : 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = !lowGraphicsMode;
          gl.shadowMap.type = lowGraphicsMode ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
        }}
      >
        {/* WebGL Context Loss Manager */}
        <WebGLContextManager 
          onContextLost={() => console.warn('WebGL context lost')}
          onContextRestored={() => console.log('WebGL context restored')}
          onLowMemory={() => setLowGraphicsMode(true)}
        />
        
        {/* Princeton Campus Scene */}
        <PrincetonCampusScene
          showLabels={showLabels}
          timeOfDay={timeOfDay}
          viewMode={viewMode}
          movementState={movementState}
          onBuildingSelect={(building) => setSelectedBuilding(building)}
        />
      </Canvas>
      
      {/* Building Info Panel */}
      <BuildingInfoPanel 
        building={selectedBuilding} 
        onClose={() => setSelectedBuilding(null)} 
      />
      
      {/* Controls (orbital view only) */}
      {viewMode === 'orbital' && (
        <Controls 
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(!showLabels)}
          timeOfDay={timeOfDay}
          onTimeOfDayChange={setTimeOfDay}
          onCameraPreset={setCameraPosition}
        />
      )}
      
      {/* First-person mode instructions */}
      {viewMode === 'first-person' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 px-6 py-3 z-30">
          <p className="text-white text-sm">
            <span className="text-orange-400">WASD</span> to move • 
            <span className="text-orange-400 ml-2">Mouse</span> to look around • 
            <span className="text-orange-400 ml-2">ESC</span> to unlock
          </p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
