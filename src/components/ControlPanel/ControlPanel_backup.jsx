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
      name: "Cuaca & Iklim",
      dataType: "weather",
      location: "Indonesia",
      timeRange: "2024-01-01 to 2024-12-31",
      maxPrice: 50,
      minReputation: 7.0
    },
    {
      name: "Data Finansial",
      dataType: "financial",
      location: "Global",
      timeRange: "2024-01-01 to 2024-06-30",
      maxPrice: 200,
      minReputation: 8.5
    },
    {
      name: "Data Sosial Media",
      dataType: "social",
      location: "Southeast Asia",
      timeRange: "2024-03-01 to 2024-03-31",
      maxPrice: 100,
      minReputation: 6.0
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

  const getConnectionStatusIndicator = () => {
    if (connectionStatus.isInitialized && !connectionStatus.fallbackToMock) {
      return <span className="flex items-center text-green-400"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>ICP Connected</span>;
    } else if (connectionStatus.fallbackToMock) {
      return <span className="flex items-center text-yellow-400"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>Mock Mode</span>;
    } else {
      return <span className="flex items-center text-red-400"><span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>Disconnected</span>;
    }
  };

  const isDisabled = isLoading || agentStatus === 'Searching' || agentStatus === 'Negotiating';

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 flex flex-col relative">
      {/* Header with connection status */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold text-cyan-400">Control Panel</h2>
        <div className="text-xs">
          {getConnectionStatusIndicator()}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-md">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Quick presets */}
      <div className="mb-4">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          ⚡ Quick Presets {showPresets ? '▼' : '▶'}
        </button>
        
        {showPresets && (
          <div className="mt-2 space-y-2">
            {presetQueries.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(preset)}
                className="w-full text-left p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 transition-colors"
                disabled={isDisabled}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 flex-grow">
        {/* Basic fields */}
        <div>
          <label htmlFor="dataType" className="block text-sm font-medium text-gray-300 mb-1">
            Jenis Data *
          </label>
          <input
            type="text"
            id="dataType"
            name="dataType"
            value={searchCriteria.dataType || ''}
            onChange={onInputChange}
            placeholder="e.g., weather, financial, social"
            disabled={isDisabled}
            className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
            Lokasi
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={searchCriteria.location || ''}
            onChange={onInputChange}
            placeholder="e.g., Indonesia, Global, Asia"
            disabled={isDisabled}
            className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        <div>
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-300 mb-1">
            Rentang Waktu
          </label>
          <input
            type="text"
            id="timeRange"
            name="timeRange"
            value={searchCriteria.timeRange || ''}
            onChange={onInputChange}
            placeholder="e.g., 2024-01-01 to 2024-06-30"
            disabled={isDisabled}
            className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300 mb-1">
            Harga Maksimum (ICP)
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={searchCriteria.maxPrice || ''}
            onChange={onInputChange}
            placeholder="e.g., 100"
            disabled={isDisabled}
            min="0"
            step="1"
            className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Advanced mode toggle */}
        <div className="pt-2">
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            🔧 Advanced {isAdvancedMode ? '▼' : '▶'}
          </button>
        </div>

        {/* Advanced fields */}
        {isAdvancedMode && (
          <div className="space-y-4 pt-2 border-t border-gray-700">
            <div>
              <label htmlFor="minReputation" className="block text-sm font-medium text-gray-300 mb-1">
                Reputasi Minimum
              </label>
              <input
                type="number"
                id="minReputation"
                name="minReputation"
                value={searchCriteria.minReputation || ''}
                onChange={onInputChange}
                placeholder="e.g., 7.5"
                disabled={isDisabled}
                min="0"
                max="10"
                step="0.1"
                className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={onStartAgent}
          disabled={isDisabled || !searchCriteria.dataType}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Mulai Agen Pencari Data'
          )}
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Status display */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Status:</span>
          <span className={`font-medium ${getStatusColor(agentStatus)}`}>
            {agentStatus}
            {(agentStatus === 'Searching' || agentStatus === 'Negotiating') && (
              <span className="ml-2 inline-block w-2 h-2 bg-current rounded-full animate-pulse"></span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
