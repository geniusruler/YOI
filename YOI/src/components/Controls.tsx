import React from 'react';
import { Eye, EyeOff, Sun, Sunset, Moon, Camera } from 'lucide-react';

interface ControlsProps {
  showLabels: boolean;
  onToggleLabels: () => void;
  timeOfDay: 'day' | 'sunset' | 'night';
  onTimeOfDayChange: (time: 'day' | 'sunset' | 'night') => void;
  onCameraPreset: (position: [number, number, number]) => void;
}

export function Controls({ 
  showLabels, 
  onToggleLabels, 
  timeOfDay, 
  onTimeOfDayChange,
  onCameraPreset 
}: ControlsProps) {
  const presets = [
    { name: 'Overview', position: [40, 35, 40] as [number, number, number] },
    { name: 'Street View', position: [0, 3, 35] as [number, number, number] },
    { name: 'Bird\'s Eye', position: [0, 80, 0.1] as [number, number, number] },
    { name: 'Close Up', position: [15, 15, 15] as [number, number, number] },
  ];

  return (
    <div className="absolute top-24 right-6 z-10 flex flex-col gap-3">
      {/* Labels Toggle */}
      <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/20 p-3">
        <button
          onClick={onToggleLabels}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm w-full"
        >
          {showLabels ? <Eye size={16} /> : <EyeOff size={16} />}
          <span>{showLabels ? 'Hide' : 'Show'} Labels</span>
        </button>
      </div>

      {/* Time of Day */}
      <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/20 p-3">
        <div className="text-white/60 text-xs mb-2">Time of Day</div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onTimeOfDayChange('day')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              timeOfDay === 'day'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sun size={16} />
            <span>Day</span>
          </button>
          <button
            onClick={() => onTimeOfDayChange('sunset')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              timeOfDay === 'sunset'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sunset size={16} />
            <span>Sunset</span>
          </button>
          <button
            onClick={() => onTimeOfDayChange('night')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              timeOfDay === 'night'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Moon size={16} />
            <span>Night</span>
          </button>
        </div>
      </div>

      {/* Camera Presets */}
      <div className="bg-black/70 backdrop-blur-md rounded-lg border border-white/20 p-3">
        <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
          <Camera size={14} />
          <span>Camera Presets</span>
        </div>
        <div className="flex flex-col gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onCameraPreset(preset.position)}
              className="px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors text-left"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
