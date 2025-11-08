import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Eye, 
  User, 
  Volume2, 
  VolumeX, 
  Zap, 
  ZapOff,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';

/**
 * Compact Controls Menu
 * Consolidated UI with collapsible sections
 * Only shows selected mode and relevant controls
 */

interface CompactControlsMenuProps {
  // View mode
  viewMode: 'orbital' | 'first-person';
  onViewModeChange: (mode: 'orbital' | 'first-person') => void;
  
  // Voice controls
  voiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
  
  // Graphics controls
  lowGraphicsMode: boolean;
  onGraphicsToggle: (lowMode: boolean) => void;
  
  // FPS display
  showFPS?: boolean;
}

export function CompactControlsMenu({
  viewMode,
  onViewModeChange,
  voiceEnabled,
  onVoiceToggle,
  lowGraphicsMode,
  onGraphicsToggle,
  showFPS = true
}: CompactControlsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    view: boolean;
    voice: boolean;
    graphics: boolean;
  }>({
    view: true,
    voice: false,
    graphics: false
  });

  const toggleSection = (section: 'view' | 'voice' | 'graphics') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Compact Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-3 shadow-lg transition-all transform hover:scale-105"
        title="Controls Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-40 bg-slate-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-orange-500/30 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-slate-800/90 backdrop-blur-sm px-4 py-3 border-b border-slate-700">
            <h3 className="text-white flex items-center gap-2">
              <Menu className="w-5 h-5 text-orange-400" />
              <span>Campus Controls</span>
            </h3>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            
            {/* VIEW MODE SECTION */}
            <div className="bg-slate-800/50 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('view')}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-orange-400" />
                  <span>View Mode</span>
                </div>
                {expandedSections.view ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedSections.view && (
                <div className="px-4 pb-4 space-y-2">
                  {/* Current Mode Display */}
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-200">
                      {viewMode === 'orbital' ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Bird's Eye View</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4" />
                          <span className="text-sm">Third-Person Walk</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <button
                    onClick={() => onViewModeChange(viewMode === 'orbital' ? 'first-person' : 'orbital')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {viewMode === 'orbital' ? (
                      <>
                        <User className="w-4 h-4" />
                        <span>Switch to Walk Mode</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Switch to Overview</span>
                      </>
                    )}
                  </button>

                  {/* View Mode Info */}
                  <div className="text-xs text-slate-400 space-y-1">
                    {viewMode === 'orbital' ? (
                      <p>• Click and drag to rotate camera</p>
                    ) : (
                      <>
                        <p>• WASD to move your avatar</p>
                        <p>• Camera follows automatically</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* VOICE GUIDE SECTION */}
            <div className="bg-slate-800/50 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('voice')}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {voiceEnabled ? (
                    <Volume2 className="w-5 h-5 text-orange-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-500" />
                  )}
                  <span>Voice Guide</span>
                </div>
                {expandedSections.voice ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedSections.voice && (
                <div className="px-4 pb-4 space-y-2">
                  {/* Voice Toggle */}
                  <button
                    onClick={() => onVoiceToggle(!voiceEnabled)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      voiceEnabled
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {voiceEnabled ? (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Voice: ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Voice: OFF</span>
                      </>
                    )}
                  </button>

                  {/* Voice Info */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-300">
                      {voiceEnabled
                        ? 'AI narrator will speak as you explore campus buildings and locations.'
                        : 'Enable voice for AI-powered audio narration of campus features.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* GRAPHICS SECTION */}
            <div className="bg-slate-800/50 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('graphics')}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {lowGraphicsMode ? (
                    <ZapOff className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Zap className="w-5 h-5 text-orange-400" />
                  )}
                  <span>Graphics</span>
                </div>
                {expandedSections.graphics ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedSections.graphics && (
                <div className="px-4 pb-4 space-y-2">
                  {/* Graphics Toggle */}
                  <button
                    onClick={() => onGraphicsToggle(!lowGraphicsMode)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      lowGraphicsMode
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {lowGraphicsMode ? (
                      <>
                        <ZapOff className="w-4 h-4" />
                        <span>Low Performance Mode</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>High Quality Mode</span>
                      </>
                    )}
                  </button>

                  {/* Graphics Info */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-300">
                      {lowGraphicsMode
                        ? 'Running in performance mode. Shadows and details reduced for better FPS.'
                        : 'Full graphics enabled with shadows, lighting, and all visual effects.'}
                    </p>
                  </div>

                  {/* Performance Tip */}
                  {!lowGraphicsMode && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-2">
                      <p className="text-xs text-blue-200 flex items-start gap-2">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>If you experience lag, try switching to Low Performance Mode</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-800/90 backdrop-blur-sm px-4 py-3 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              Press <kbd className="px-1 py-0.5 bg-slate-700 rounded text-orange-300">ESC</kbd> to close menu
            </p>
          </div>
        </div>
      )}

      {/* Keyboard shortcut to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
        />
      )}
    </>
  );
}
