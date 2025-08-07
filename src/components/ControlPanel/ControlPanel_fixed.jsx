import React, { useState } from 'react';

const ControlPanel = ({ 
  searchCriteria, 
  onInputChange, 
  onStartAgent, 
  agentStatus, 
  connectionStatus,
  onRefresh,
  isLoading,
  error 
}) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const presetQueries = [
    {
      name: "Weather & Climate Data",
      dataType: "weather",
      location: "Indonesia",
      timeRange: "2024-01-01 to 2024-12-31",
      maxPrice: 50,
      minReputation: 7.0
    },
    {
      name: "Financial Market Data",
      dataType: "financial",
      location: "Global",
      timeRange: "2024-01-01 to 2024-06-30",
      maxPrice: 200,
      minReputation: 8.5
    },
    {
      name: "Social Media Analytics",
      dataType: "social",
      location: "Southeast Asia",
      timeRange: "2024-03-01 to 2024-03-31",
      maxPrice: 100,
      minReputation: 6.0
    },
    {
      name: "IoT Sensor Data",
      dataType: "iot",
      location: "Smart Cities",
      timeRange: "2024-06-01 to 2024-12-31",
      maxPrice: 75,
      minReputation: 8.0
    }
  ];

  const handlePresetSelect = (preset) => {
    Object.keys(preset).forEach(key => {
      if (key !== 'name') {
        onInputChange({ target: { name: key, value: preset[key] } });
      }
    });
    setShowPresets(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Idle': return 'text-gray-400';
      case 'Initializing': return 'text-yellow-400';
      case 'Searching': return 'text-blue-400';
      case 'Negotiating': return 'text-purple-400';
      case 'Active': return 'text-green-400';
      case 'Error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const isDisabled = isLoading || agentStatus === 'Searching' || agentStatus === 'Negotiating';

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <span className="text-red-400 text-lg">⚠️</span>
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full shadow-lg transition-all duration-300 ${
              connectionStatus?.isInitialized 
                ? 'bg-emerald-400 shadow-emerald-400/50 animate-pulse' 
                : 'bg-red-400 shadow-red-400/50'
            }`}></div>
            <div>
              <span className="text-sm font-semibold text-white">
                {connectionStatus?.fallbackToMock ? 'Demo Mode' : 'Production'}
              </span>
              <p className="text-xs text-gray-400">
                {connectionStatus?.isInitialized ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-all duration-200 hover:scale-110 hover:bg-cyan-400/10 rounded-lg"
            title="Refresh connection"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl text-purple-300 hover:text-purple-200 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg">⚡</span>
            </div>
            <div className="text-left">
              <span className="font-semibold">Quick Presets</span>
              <p className="text-xs text-purple-400">Ready-to-use search templates</p>
            </div>
          </div>
          <svg className={`w-5 h-5 transform transition-transform duration-300 ${showPresets ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {showPresets && (
          <div className="space-y-2 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            {presetQueries.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(preset)}
                disabled={isDisabled}
                className="w-full p-4 text-left bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {preset.name}
                  </h4>
                  <div className="text-xs bg-gray-800/50 px-2 py-1 rounded-full text-gray-400">
                    {preset.maxPrice} ICP
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                      {preset.dataType}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                      {preset.location}
                    </span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      Rep: {preset.minReputation}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center">
            <span className="text-cyan-400 text-sm">🔍</span>
          </div>
          <h4 className="text-lg font-semibold text-white">Search Parameters</h4>
        </div>

        {/* Data Type */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
            <span>Data Type</span>
            <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="dataType"
            value={searchCriteria.dataType || ''}
            onChange={onInputChange}
            placeholder="e.g., weather, financial, social, iot"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-200">Location</label>
          <input
            type="text"
            name="location"
            value={searchCriteria.location || ''}
            onChange={onInputChange}
            placeholder="e.g., Global, Indonesia, US-East"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Time Range */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-200">Time Range</label>
          <input
            type="text"
            name="timeRange"
            value={searchCriteria.timeRange || ''}
            onChange={onInputChange}
            placeholder="e.g., 2024-01-01 to 2024-12-31"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-200">Maximum Price (ICP)</label>
          <input
            type="number"
            name="maxPrice"
            value={searchCriteria.maxPrice || ''}
            onChange={onInputChange}
            placeholder="100"
            disabled={isDisabled}
            min="0"
            step="1"
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Advanced Options */}
        <button
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors py-2"
        >
          <svg className={`w-4 h-4 transform transition-transform duration-200 ${isAdvancedMode ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Advanced Options</span>
        </button>

        {isAdvancedMode && (
          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-200">Minimum Reputation (0-10)</label>
              <input
                type="number"
                name="minReputation"
                value={searchCriteria.minReputation || ''}
                onChange={onInputChange}
                placeholder="7.0"
                disabled={isDisabled}
                step="0.1"
                min="0"
                max="10"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <button
          onClick={onStartAgent}
          disabled={isDisabled || !searchCriteria.dataType}
          className={`w-full group relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
            isDisabled || !searchCriteria.dataType
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xl hover:shadow-cyan-500/25 hover:scale-105 border border-cyan-400/50'
          }`}
        >
          {isLoading || agentStatus === 'Searching' ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching for Data...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <span className="text-lg">🔍</span>
              <span>Start Data Search</span>
            </div>
          )}
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-xl text-gray-300 hover:text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>🔄</span>
            <span>Refresh Data</span>
          </div>
        </button>
      </div>

      {/* Status Display */}
      <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-300">Agent Status:</span>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-bold ${getStatusColor(agentStatus)}`}>
              {agentStatus}
            </span>
            {(agentStatus === 'Searching' || agentStatus === 'Negotiating') && (
              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
