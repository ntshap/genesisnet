import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  X, 
  Zap
} from 'lucide-react';
import { DEMO_CONFIG, demoControls } from '../../utils/demoConfig';

const DemoControlPanel = ({ onScenarioStart, onReset, isVisible, onToggleVisibility }) => {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(DEMO_CONFIG.ANIMATION_SPEED);

  const handleScenarioStart = () => {
    const scenario = demoControls.startScenario(selectedScenario);
    if (scenario && onScenarioStart) {
      onScenarioStart(scenario);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setAnimationSpeed(newSpeed);
    demoControls.setAnimationSpeed(newSpeed);
  };

  const handleReset = () => {
    demoControls.resetDemo();
    if (onReset) onReset();
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white p-3 rounded-lg shadow-glow transition-all duration-300 hover:scale-105"
        title="Show demo controls"
      >
        Demo
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 glass-card p-4 shadow-xl max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-semibold">Demo Controls</h3>
        </div>
        <button
          onClick={onToggleVisibility}
          className="text-gray-400 hover:text-white transition-colors p-1 glass rounded"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scenario Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Demo Scenario
        </label>
        <select
          value={selectedScenario}
          onChange={(e) => setSelectedScenario(parseInt(e.target.value))}
          className="w-full px-3 py-2 glass text-white focus:outline-none focus:ring-2 focus:ring-primary-400/50"
        >
          {DEMO_CONFIG.DEMO_SCENARIOS.map((scenario, index) => (
            <option key={index} value={index} className="bg-dark-800 text-white">
              {scenario.name}
            </option>
          ))}
        </select>
        
        {selectedScenario !== null && (
          <p className="text-xs text-gray-400 mt-2 glass-dark p-2 rounded">
            {DEMO_CONFIG.DEMO_SCENARIOS[selectedScenario]?.description}
          </p>
        )}
      </div>

      {/* Animation Speed */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center space-x-2">
          <Zap size={16} className="text-primary-400" />
          <span>Animation Speed: {animationSpeed}x</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={animationSpeed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          className="w-full h-2 glass-dark rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Slow</span>
          <span>Normal</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleScenarioStart}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium shadow-glow hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Play size={16} />
          <span>Start Scenario</span>
        </button>
        
        <button
          onClick={handleReset}
          className="w-full glass hover:bg-white/10 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
        >
          <RotateCcw size={16} />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Demo Info */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Mode:</span>
            <span className="text-purple-400">Demo</span>
          </div>
          <div className="flex justify-between">
            <span>Scenarios:</span>
            <span>{DEMO_CONFIG.DEMO_SCENARIOS.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Auto-Activity:</span>
            <span className={DEMO_CONFIG.NETWORK_SIMULATION.AUTO_BACKGROUND_ACTIVITY ? 'text-green-400' : 'text-red-400'}>
              {DEMO_CONFIG.NETWORK_SIMULATION.AUTO_BACKGROUND_ACTIVITY ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">Quick Actions:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              // Trigger a simulated negotiation
              console.log('🤝 Simulating negotiation...');
            }}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded transition-colors"
          >
            🤝 Negotiate
          </button>
          
          <button
            onClick={() => {
              // Add a new provider
              console.log('🆕 Adding provider...');
            }}
            className="text-xs bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded transition-colors"
          >
            🆕 Add Provider
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">Keyboard Shortcuts:</p>
        <div className="text-xs text-gray-500 space-y-1">
          <div><kbd className="bg-gray-700 px-1 rounded">Space</kbd> Start/Stop</div>
          <div><kbd className="bg-gray-700 px-1 rounded">R</kbd> Reset</div>
          <div><kbd className="bg-gray-700 px-1 rounded">D</kbd> Toggle Controls</div>
        </div>
      </div>
    </div>
  );
};

export default DemoControlPanel;
