import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, ChevronDown } from 'lucide-react';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="absolute top-6 left-6 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-lg border border-white/20 px-4 py-3 hover:bg-black/80 transition-colors"
      >
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            <User size={18} className="text-orange-400" />
          </div>
        )}
        <div className="text-left">
          <div className="text-white text-sm">{user.name}</div>
          <div className="text-white/60 text-xs">{user.email}</div>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden z-20 shadow-xl">
            <div className="p-4 border-b border-white/10">
              <p className="text-white/80 text-sm mb-1">Signed in as</p>
              <p className="text-white">{user.name}</p>
              <p className="text-white/60 text-xs">{user.email}</p>
            </div>
            
            <button
              onClick={async () => {
                await signOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 transition-colors text-left"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
