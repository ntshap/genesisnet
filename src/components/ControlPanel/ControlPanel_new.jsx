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
      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <p className="text-red-300 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full shadow-lg ${
            connectionStatus?.isInitialized ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 shadow-red-400/50'
          }`}></div>
          <span className="text-sm font-medium text-gray-200">
            {connectionStatus?.fallbackToMock ? 'Demo Mode' : 'Production'}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="text-gray-400 hover:text-cyan-400 transition-all duration-200 hover:scale-110"
          title="Refresh connection"
        >
          🔄
        </button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-200 hover:border-purple-400/50 backdrop-blur-sm"
        >
          <span className="flex items-center space-x-3">
            <span className="text-lg">⚡</span>
            <span className="font-semibold">Quick Presets</span>
          </span>
          <span className={`transform transition-transform duration-200 ${showPresets ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {showPresets && (
          <div className="space-y-2 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            {presetQueries.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(preset)}
                disabled={isDisabled}
                className="w-full p-4 text-left bg-gray-600/30 hover:bg-gray-600/50 rounded-lg border border-gray-500/30 transition-all duration-200 hover:border-cyan-400/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="font-semibold text-white mb-1">{preset.name}</div>
                <div className="text-xs text-gray-400">
                  {preset.dataType} • {preset.location} • {preset.maxPrice} ICP • Rep: {preset.minReputation}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="space-y-5">
        {/* Data Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Data Type *
          </label>
          <input
            type="text"
            name="dataType"
            value={searchCriteria.dataType || ''}
            onChange={onInputChange}
            placeholder="e.g., weather, financial, social, iot"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={searchCriteria.location || ''}
            onChange={onInputChange}
            placeholder="e.g., Global, Indonesia, US-East, Smart Cities"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Time Range
          </label>
          <input
            type="text"
            name="timeRange"
            value={searchCriteria.timeRange || ''}
            onChange={onInputChange}
            placeholder="e.g., 2024-01-01 to 2024-12-31"
            disabled={isDisabled}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Maximum Price (ICP)
          </label>
          <input
            type="number"
            name="maxPrice"
            value={searchCriteria.maxPrice || ''}
            onChange={onInputChange}
            placeholder="100"
            disabled={isDisabled}
            min="0"
            step="1"
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <span className={`transform transition-transform duration-200 ${isAdvancedMode ? 'rotate-90' : ''}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="font-medium">Advanced Options</span>
        </button>

        {isAdvancedMode && (
          <div className="space-y-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            {/* Min Reputation */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Minimum Reputation (0-10)
              </label>
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
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={onStartAgent}
            disabled={isDisabled || !searchCriteria.dataType}
            className={`w-full px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform ${
              isDisabled || !searchCriteria.dataType
                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25 hover:scale-105 border border-cyan-400/50'
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
            className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-lg text-gray-300 hover:text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🔄</span>
              <span>Refresh Data</span>
            </div>
          </button>
        </div>

        {/* Status Display */}
        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Agent Status:</span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${getStatusColor(agentStatus)}`}>
                {agentStatus}
              </span>
              {(agentStatus === 'Searching' || agentStatus === 'Negotiating') && (
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
