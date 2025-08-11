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

  const isDisabled = isLoading || agentStatus === 'Searching' || agentStatus === 'Negotiating';

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-200 border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-800 text-sm font-bold">{error}</p>
          </div>
        </div>
      )}
      {/* Connection Status panel removed as requested */}

      {/* Quick Presets */}
      <div className="space-y-3">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full bg-purple-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center">
                <Bookmark size={16} className="text-purple-600" />
              </div>
              <div className="text-left">
                <span className="font-black text-black text-base">Quick Presets</span>
                <p className="text-xs text-purple-800 font-bold">Ready-to-use search templates</p>
              </div>
            </div>
            {showPresets ? 
              <ChevronUp size={18} className="text-black" /> : 
              <ChevronDown size={18} className="text-black" />
            }
          </div>
        </button>

        {showPresets && (
          <div className="bg-purple-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 space-y-2">
            {presetQueries.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(preset)}
                disabled={isDisabled}
                className="w-full p-3 text-left bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-black text-sm">
                    {preset.name}
                  </h4>
                  <div className="bg-yellow-300 border border-black px-2 py-1 rounded text-xs text-black font-bold">
                    {preset.maxPrice} ICP
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-blue-300 border border-black text-black px-2 py-1 rounded text-xs font-bold">
                    {preset.dataType}
                  </span>
                  <span className="bg-green-300 border border-black text-black px-2 py-1 rounded text-xs font-bold">
                    {preset.location}
                  </span>
                  <span className="bg-pink-300 border border-black text-black px-2 py-1 rounded text-xs font-bold">
                    Rep: {preset.minReputation}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-cyan-400 border-2 border-black rounded-lg flex items-center justify-center">
            <Database size={16} className="text-black" />
          </div>
          <h4 className="text-lg font-black text-black">Search Parameters</h4>
        </div>

        {/* Data Type */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-black text-black">
            <Database size={16} className="text-blue-600" />
            <span>Data Type</span>
            <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="dataType"
            value={searchCriteria.dataType}
            onChange={onInputChange}
            disabled={isDisabled}
            placeholder="e.g., weather, financial, social"
            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold placeholder-gray-500 focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            data-tour="search-input"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-black text-black">
            <MapPin size={16} className="text-green-600" />
            <span>Location</span>
          </label>
          <input
            type="text"
            name="location"
            value={searchCriteria.location}
            onChange={onInputChange}
            disabled={isDisabled}
            placeholder="e.g., Global, Indonesia, Asia"
            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold placeholder-gray-500 focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          />
        </div>

        {/* Time Range */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-black text-black">
            <Calendar size={16} className="text-purple-600" />
            <span>Time Range</span>
          </label>
          <input
            type="text"
            name="timeRange"
            value={searchCriteria.timeRange}
            onChange={onInputChange}
            disabled={isDisabled}
            placeholder="e.g., 2024-01-01 to 2024-12-31"
            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold placeholder-gray-500 focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-black text-black">
            <DollarSign size={16} className="text-yellow-600" />
            <span>Max Price (ICP)</span>
          </label>
          <input
            type="number"
            name="maxPrice"
            value={searchCriteria.maxPrice}
            onChange={onInputChange}
            disabled={isDisabled}
            placeholder="100"
            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold placeholder-gray-500 focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          />
        </div>

        {/* Min Reputation */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-black text-black">
            <Star size={16} className="text-orange-600" />
            <span>Min Reputation</span>
          </label>
          <input
            type="number"
            name="minReputation"
            value={searchCriteria.minReputation}
            onChange={onInputChange}
            disabled={isDisabled}
            step="0.1"
            min="0"
            max="10"
            placeholder="7.0"
            className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold placeholder-gray-500 focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          />
        </div>

  {/* Start Button */}
  <button data-tour="start-agent-button"
          onClick={onStartAgent}
          disabled={isDisabled}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-400 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-black text-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <Play size={20} />
            )}
            <span>
              {isLoading ? 'Starting...' : 'Start Agent Search'}
            </span>
          </div>
        </button>

        {/* Status Display */}
        <div className="bg-gray-100 border-2 border-black rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-black">Agent Status:</span>
            <span className="text-sm font-black text-blue-600">{agentStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
