import React, { useState } from 'react';
import { 
  Play, 
  RefreshCw, 
  Settings, 
  Database, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star,
  ChevronDown,
  ChevronUp,
  Bookmark,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

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
      case 'Initializing': return 'text-accent-400';
      case 'Searching': return 'text-primary-400';
      case 'Negotiating': return 'text-accent-300';
      case 'Active': return 'text-primary-300';
      case 'Error': return 'text-primary-500';
      default: return 'text-gray-400';
    }
  };

  const isDisabled = isLoading || agentStatus === 'Searching' || agentStatus === 'Negotiating';

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="glass-card p-4 border border-red-500/30">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="glass p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full shadow-lg transition-all duration-300 ${
              connectionStatus?.isInitialized 
                ? 'bg-primary-400 shadow-primary-400/50 animate-pulse' 
                : 'bg-accent-500 shadow-accent-500/50'
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
            className="p-2 text-gray-400 hover:text-primary-400 transition-all duration-200 hover:scale-110 glass rounded-lg"
            title="Refresh connection"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between p-4 glass hover:bg-white/20 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
              <Bookmark size={16} className="text-white" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-base text-white">Quick Presets</span>
              <p className="text-xs text-purple-400 hidden sm:block">Ready-to-use search templates</p>
            </div>
          </div>
          {showPresets ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>

        {showPresets && (
          <div className="space-y-2 glass-card p-4">
            {presetQueries.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(preset)}
                disabled={isDisabled}
                className="w-full p-4 text-left glass hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors duration-300 text-sm lg:text-base">
                    {preset.name}
                  </h4>
                  <div className="text-xs glass px-3 py-1 rounded-full text-gray-300 self-start sm:self-center">
                    {preset.maxPrice} ICP
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs">
                      {preset.dataType}
                    </span>
                    <span className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded-full text-xs">
                      {preset.location}
                    </span>
                    <span className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded-full text-xs">
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
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
            <Database size={16} className="text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white">Search Parameters</h4>
        </div>

        {/* Data Type */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
            <Database size={16} className="text-primary-400" />
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
            className="w-full px-4 py-3 glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
            <MapPin size={16} className="text-primary-400" />
            <span>Location</span>
          </label>
          <input
            type="text"
            name="location"
            value={searchCriteria.location || ''}
            onChange={onInputChange}
            placeholder="e.g., Global, Indonesia, US-East"
            disabled={isDisabled}
            className="w-full px-4 py-3 glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Time Range */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
            <Calendar size={16} className="text-primary-400" />
            <span>Time Range</span>
          </label>
          <input
            type="text"
            name="timeRange"
            value={searchCriteria.timeRange || ''}
            onChange={onInputChange}
            placeholder="e.g., 2024-01-01 to 2024-12-31"
            disabled={isDisabled}
            className="w-full px-4 py-3 glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
            <DollarSign size={16} className="text-primary-400" />
            <span>Maximum Price (ICP)</span>
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
            className="w-full px-4 py-3 glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Advanced Options */}
        <button
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-primary-400 transition-colors py-2"
        >
          {isAdvancedMode ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium">Advanced Options</span>
        </button>

        {isAdvancedMode && (
          <div className="glass-card p-4 space-y-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
                <Star size={16} className="text-primary-400" />
                <span>Minimum Reputation (0-10)</span>
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
                className="w-full px-4 py-3 glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              ? 'glass text-gray-400 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white shadow-glow hover:scale-105'
          }`}
        >
          {isLoading || agentStatus === 'Searching' ? (
            <div className="flex items-center justify-center space-x-3">
              <RefreshCw size={18} className="animate-spin" />
              <span>Searching for Data...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <Play size={18} />
              <span>Start Data Search</span>
            </div>
          )}
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-full px-6 py-3 glass hover:bg-white/10 text-gray-300 hover:text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw size={16} />
            <span>Refresh Data</span>
          </div>
        </button>
      </div>

      {/* Status Display */}
      <div className="glass p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-300">Agent Status:</span>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-bold ${getStatusColor(agentStatus)}`}>
              {agentStatus}
            </span>
            {(agentStatus === 'Searching' || agentStatus === 'Negotiating') && (
              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            )}
            {agentStatus === 'Active' && <CheckCircle size={16} className="text-emerald-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
