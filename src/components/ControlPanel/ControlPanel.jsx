import React, { useState, useEffect } from 'react';
import { Search, Settings, Server, FileCheck, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const ControlPanel = ({
  onSearch,
  searchCriteria,
  setSearchCriteria,
  onConnect,
  connectionStatus,
  availableServers,
  connectedNodes,
  selectedRegion,
  setSelectedRegion,
  walletBalance
}) => {
  // Only log on first render and when onSearch prop changes
  useEffect(() => {
    console.log('=== CONTROL PANEL PROPS DEBUG ===');
    console.log('ControlPanel: onSearch function type:', typeof onSearch);
    console.log('ControlPanel: onSearch exists:', !!onSearch);
    console.log('ControlPanel: searchCriteria:', searchCriteria);
    console.log('=== END CONTROL PANEL PROPS DEBUG ===');
  }, [onSearch]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [dataTypeOpen, setDataTypeOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDataType = () => {
    setDataTypeOpen(!dataTypeOpen);
  };

  const toggleRegion = () => {
    setRegionOpen(!regionOpen);
  };

  const handleSearch = () => {
    console.log('=== CONTROL PANEL SEARCH DEBUG START ===');
    console.log('ControlPanel: handleSearch called with criteria:', searchCriteria);
    console.log('ControlPanel: onSearch function type:', typeof onSearch);
    console.log('ControlPanel: setSearchCriteria function type:', typeof setSearchCriteria);
    console.log('ControlPanel: All props:', {
      onSearch: typeof onSearch,
      searchCriteria,
      setSearchCriteria: typeof setSearchCriteria,
      connectionStatus,
      availableServers,
      connectedNodes,
      selectedRegion,
      walletBalance
    });
    
    // Test if basic JavaScript execution works
    try {
      console.log('ControlPanel: Basic JS execution test - Math.random():', Math.random());
      console.log('ControlPanel: Basic JS execution test - Date.now():', Date.now());
      
      // Remove alert, focus on debugging
      console.log('ControlPanel: Search button functionality confirmed - proceeding with search logic');
    } catch (testError) {
      console.error('ControlPanel: Basic JS execution failed:', testError);
    }
    
    if (!searchCriteria.dataType || !searchCriteria.location) {
      console.log('ControlPanel: Validation failed - missing dataType or location');
      console.log('ControlPanel: searchCriteria.dataType:', searchCriteria.dataType);
      console.log('ControlPanel: searchCriteria.location:', searchCriteria.location);
      addNotification({
        type: 'error',
        message: 'Please select a data type and enter a location',
        title: 'Search Error',
        severity: 'error'
      });
      return;
    }
    
    console.log('ControlPanel: Validation passed, criteria complete');
    
    if (onSearch && typeof onSearch === 'function') {
      console.log('ControlPanel: onSearch function is available');
      console.log('ControlPanel: About to call onSearch with criteria:', searchCriteria);
      try {
        console.log('ControlPanel: Executing onSearch...');
        const result = onSearch(searchCriteria);
        console.log('ControlPanel: onSearch returned:', result);
        console.log('ControlPanel: Result type:', typeof result);
        console.log('ControlPanel: Is result a Promise?', result instanceof Promise);
        
        if (result instanceof Promise) {
          console.log('ControlPanel: Handling promise result...');
          result.then(res => {
            console.log('ControlPanel: Promise resolved with:', res);
          }).catch(err => {
            console.error('ControlPanel: Promise rejected with:', err);
            console.error('ControlPanel: Error details:', err.message, err.stack);
          });
        }
      } catch (error) {
        console.error('ControlPanel: Error calling onSearch:', error);
        console.error('ControlPanel: Error stack:', error.stack);
        addNotification({
          type: 'error',
          message: 'Search failed: ' + error.message,
          title: 'Search Error',
          severity: 'error'
        });
      }
    } else {
      console.error('ControlPanel: onSearch function not available!');
      console.error('ControlPanel: onSearch value:', onSearch);
      console.error('ControlPanel: typeof onSearch:', typeof onSearch);
      addNotification({
        type: 'error', 
        message: 'Search function not available',
        title: 'System Error',
        severity: 'error'
      });
    }
    console.log('=== CONTROL PANEL SEARCH DEBUG END ===');
  };

  const handleDataTypeSelect = (type) => {
    console.log('ControlPanel: Data type selected:', type);
    setSearchCriteria({ ...searchCriteria, dataType: type });
    setDataTypeOpen(false);
  };

  const handleRegionSelect = (region) => {
    console.log('ControlPanel: Region selected:', region);
    setSelectedRegion(region);
    setRegionOpen(false);
  };

  const formatBalance = (balance) => {
    if (!balance && balance !== 0) return 'N/A';
    return parseFloat(balance).toFixed(2);
  };

  return (
    <div className="w-full">
      {/* Control Panel Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <Search size={16} className="text-black" />
          <span className="text-sm font-black text-black uppercase tracking-wide">Data Search</span>
        </div>
        <button 
          onClick={toggleExpand}
          className="text-black hover:text-gray-700 transition-colors"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Data Type Selection */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Data Type</label>
            <div className="relative">
              <button 
                onClick={toggleDataType}
                className="w-full flex justify-between items-center px-3 py-2 border-2 border-black rounded bg-white hover:bg-gray-50 transition-colors text-sm"
              >
                <span className="capitalize">{searchCriteria.dataType || "Select Data Type"}</span>
                {dataTypeOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {dataTypeOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {['weather', 'financial', 'social', 'scientific', 'health'].map((type) => (
                    <div 
                      key={type} 
                      className="px-3 py-2 hover:bg-yellow-100 cursor-pointer capitalize text-sm border-b border-gray-200 last:border-b-0"
                      onClick={() => handleDataTypeSelect(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Location Input */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Location</label>
            <input
              type="text"
              value={searchCriteria.location || ''}
              onChange={(e) => {
                console.log('ControlPanel: Location changed:', e.target.value);
                setSearchCriteria({ ...searchCriteria, location: e.target.value });
              }}
              placeholder="e.g. Global, USA, Europe"
              className="w-full px-3 py-2 border-2 border-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          {/* Time Range Input */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Time Range</label>
            <input
              type="text"
              value={searchCriteria.timeRange || ''}
              onChange={(e) => {
                console.log('ControlPanel: Time range changed:', e.target.value);
                setSearchCriteria({ ...searchCriteria, timeRange: e.target.value });
              }}
              placeholder="e.g. Last 30 days, 2024"
              className="w-full px-3 py-2 border-2 border-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          {/* Max Price Input */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Max Price (ICP)</label>
            <input
              type="text"
              value={searchCriteria.maxPrice || ''}
              onChange={(e) => {
                console.log('ControlPanel: Max price changed:', e.target.value);
                setSearchCriteria({ ...searchCriteria, maxPrice: e.target.value });
              }}
              placeholder="e.g. 10.5"
              className="w-full px-3 py-2 border-2 border-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          {/* Search Button */}
          <button
            onClick={(e) => {
              console.log('=== BUTTON CLICK EVENT ===');
              console.log('Button clicked! Event:', e);
              console.log('Button disabled?', e.target.disabled);
              console.log('searchCriteria:', searchCriteria);
              console.log('Validation check - dataType:', searchCriteria.dataType);
              console.log('Validation check - location:', searchCriteria.location);
              console.log('Should be enabled?', !(!searchCriteria.dataType || !searchCriteria.location));
              
              // Prevent any default behavior
              e.preventDefault();
              e.stopPropagation();
              
              console.log('About to call handleSearch...');
              handleSearch();
            }}
            disabled={!searchCriteria.dataType || !searchCriteria.location}
            className="w-full px-4 py-3 bg-green-300 text-black font-black border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
          >
            🔍 Search Providers
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
