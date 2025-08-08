import React from 'react';
import { Zap, School } from 'lucide-react';

const ModeToggle = ({ mode, onChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-white border-2 border-black rounded-lg p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <button
        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
          mode === 'training' 
            ? 'bg-cyan-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]' 
            : 'hover:bg-gray-100'
        }`}
        onClick={() => onChange('training')}
      >
        <School className="w-4 h-4 mr-1.5" />
        Training Mode
      </button>
      <button
        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
          mode === 'live' 
            ? 'bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]' 
            : 'hover:bg-gray-100'
        }`}
        onClick={() => onChange('live')}
      >
        <Zap className="w-4 h-4 mr-1.5" />
        Live Mode
      </button>
    </div>
  );
};

export default ModeToggle;
