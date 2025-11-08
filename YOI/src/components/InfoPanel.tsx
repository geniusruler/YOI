import React from 'react';
import { X } from 'lucide-react';
import { EatingClub } from '../types/campus';

interface InfoPanelProps {
  club: EatingClub | null;
  onClose: () => void;
}

export function InfoPanel({ club, onClose }: InfoPanelProps) {
  if (!club) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-6 pointer-events-auto shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-white">{club.name}</h2>
              {club.nickname && (
                <span className="text-white/60 text-sm">({club.nickname})</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/70">Founded {club.founded}</span>
              <span className="text-white/40">•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                club.type === 'bicker' 
                  ? 'bg-yellow-500/20 text-yellow-300' 
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {club.type === 'bicker' ? 'Bicker Club' : 'Sign-in Club'}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-white/70 capitalize">{club.style} Style</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-white/80 mb-4 text-sm leading-relaxed">
          {club.description}
        </p>
        
        <div>
          <h3 className="text-white/90 text-sm mb-2">Features & Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {club.features.map((feature, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 text-sm text-white/70 bg-white/5 px-3 py-2 rounded-lg"
              >
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
