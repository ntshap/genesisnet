import React from 'react';
import { Zap, Target } from 'lucide-react';

const ModeToggle = ({ activeMode = 'training', onModeChange }) => {
  return (
    <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 flex">
      <button
        className={`py-1.5 px-3 rounded-md flex items-center text-xs font-bold transition-all duration-200 ${
          activeMode === 'training'
            ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-purple-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onModeChange('training')}
      >
        <Zap className="h-3.5 w-3.5 mr-1.5" />
        Training
      </button>
      <button
        className={`py-1.5 px-3 rounded-md flex items-center text-xs font-bold transition-all duration-200 ${
          activeMode === 'live'
            ? 'bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-red-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onModeChange('live')}
      >
        <Target className="h-3.5 w-3.5 mr-1.5" />
        Live
      </button>
    </div>
  );
};

export default ModeToggle;
