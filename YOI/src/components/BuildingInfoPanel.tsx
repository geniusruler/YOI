import React from 'react';
import { X, MapPin, Info } from 'lucide-react';
import { CampusBuilding } from '../data/campusBuildings';
import { campusBuildings } from '../data/campusBuildings';

interface BuildingInfoPanelProps {
  buildingId: string | null;
  onClose: () => void;
}

export function BuildingInfoPanel({ buildingId, onClose }: BuildingInfoPanelProps) {
  if (!buildingId) return null;

  const building = campusBuildings.find(b => b.id === buildingId);
  if (!building) return null;

  const getTypeIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'academic':
        return <span className={iconClass}>🎓</span>;
      case 'dining':
        return <span className={iconClass}>🍽️</span>;
      case 'library':
        return <span className={iconClass}>📚</span>;
      case 'cafe':
        return <span className={iconClass}>☕</span>;
      case 'research':
        return <span className={iconClass}>🔬</span>;
      case 'athletic':
        return <span className={iconClass}>🏃</span>;
      case 'residence':
        return <span className={iconClass}>🏠</span>;
      case 'administrative':
        return <span className={iconClass}>🏛️</span>;
      default:
        return <MapPin className={iconClass} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'dining':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'library':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cafe':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'research':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'athletic':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'residence':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'administrative':
        return 'bg-yellow-600/20 text-yellow-500 border-yellow-600/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="fixed top-20 left-6 w-96 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-40 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/30 to-orange-800/30 p-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getTypeIcon(building.type)}
            <h2 className="text-white text-xl">{building.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getTypeColor(building.type)}`}>
          <span className="capitalize">{building.type}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Info size={16} />
            <h3 className="text-sm uppercase tracking-wide">About</h3>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            {building.description}
          </p>
        </div>

        {building.features && building.features.length > 0 && (
          <div>
            <h3 className="text-sm uppercase tracking-wide text-orange-400 mb-2">
              Features & Amenities
            </h3>
            <ul className="space-y-2">
              {building.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {building.isResidentialCollege && building.capacity && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Residential Capacity</span>
              <span className="text-white">{building.capacity} students</span>
            </div>
          </div>
        )}

        {building.type === 'residence' && !building.isResidentialCollege && building.capacity && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Capacity</span>
              <span className="text-white">{building.capacity} students</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
