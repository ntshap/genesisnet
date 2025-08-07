import React, { useState, useEffect } from 'react';

const MetricsDisplay = ({ metrics, lastUpdate, isLoading }) => {
  const [previousMetrics, setPreviousMetrics] = useState(metrics);
  const [changes, setChanges] = useState({});

  // Use default metrics if none provided
  const defaultMetrics = {
    totalTransactions: 42,
    averagePricePerDataUnit: 15.5,
    networkLatency: 120,
    activeProviders: 4,
    successfulNegotiations: 38,
    networkUtilization: 85
  };

  const displayMetrics = metrics && Object.keys(metrics).length > 0 ? metrics : defaultMetrics;

  useEffect(() => {
    if (displayMetrics && previousMetrics) {
      const newChanges = {};
      Object.keys(displayMetrics).forEach(key => {
        if (displayMetrics[key] !== previousMetrics[key]) {
          newChanges[key] = displayMetrics[key] - (previousMetrics[key] || 0);
        }
      });
      setChanges(newChanges);
      
      // Clear changes after animation
      setTimeout(() => setChanges({}), 2000);
    }
    setPreviousMetrics(displayMetrics);
  }, [displayMetrics]);

  const formatValue = (value, key) => {
    if (typeof value !== 'number') return value || '0';
    
    switch (key) {
      case 'averagePricePerDataUnit':
        return value.toFixed(2);
      case 'networkLatency':
        return `${value}ms`;
      case 'networkUtilization':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getChangeIndicator = (key) => {
    const change = changes[key];
    if (!change) return null;
    
    const isPositive = change > 0;
    const color = isPositive ? 'text-emerald-400' : 'text-red-400';
    const arrow = isPositive ? '↗' : '↘';
    
    return (
      <span className={`text-xs ${color} ml-2 animate-pulse font-medium`}>
        {arrow} {Math.abs(change)}
      </span>
    );
  };

  const metricItems = [
    {
      key: 'totalTransactions',
      label: 'Total Transactions',
      icon: '💼',
      gradient: 'from-blue-500 to-purple-600',
      description: 'Number of completed transactions'
    },
    {
      key: 'averagePricePerDataUnit',
      label: 'Average Price',
      icon: '💰',
      gradient: 'from-green-500 to-emerald-600',
      description: 'Average price per data unit (ICP)'
    },
    {
      key: 'networkLatency',
      label: 'Network Latency',
      icon: '⚡',
      gradient: 'from-yellow-500 to-orange-600',
      description: 'Average network response time'
    },
    {
      key: 'activeProviders',
      label: 'Active Providers',
      icon: '🌐',
      gradient: 'from-cyan-500 to-blue-600',
      description: 'Currently active data providers'
    },
    {
      key: 'successfulNegotiations',
      label: 'Successful Deals',
      icon: '🤝',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Number of successful negotiations'
    },
    {
      key: 'networkUtilization',
      label: 'Network Usage',
      icon: '📊',
      gradient: 'from-indigo-500 to-purple-600',
      description: 'Current network utilization'
    }
  ];

  const getMetricColor = (key, value) => {
    switch (key) {
      case 'networkLatency':
        if (value < 100) return 'text-emerald-400';
        if (value < 200) return 'text-yellow-400';
        return 'text-red-400';
      case 'averagePricePerDataUnit':
        if (value < 50) return 'text-emerald-400';
        if (value < 100) return 'text-yellow-400';
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const getMetricStatus = (key, value) => {
    switch (key) {
      case 'networkLatency':
        if (value < 100) return { status: 'Excellent', color: 'bg-emerald-500' };
        if (value < 200) return { status: 'Good', color: 'bg-yellow-500' };
        return { status: 'Poor', color: 'bg-red-500' };
      case 'activeProviders':
        if (value >= 3) return { status: 'Healthy', color: 'bg-emerald-500' };
        if (value >= 1) return { status: 'Limited', color: 'bg-yellow-500' };
        return { status: 'Critical', color: 'bg-red-500' };
      case 'networkUtilization':
        if (value >= 80) return { status: 'High', color: 'bg-red-500' };
        if (value >= 50) return { status: 'Medium', color: 'bg-yellow-500' };
        return { status: 'Low', color: 'bg-emerald-500' };
      default:
        return null;
    }
  };

  const getSuccessRate = () => {
    const total = displayMetrics.totalTransactions || 0;
    const successful = displayMetrics.successfulNegotiations || 0;
    return total > 0 ? Math.round((successful / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Network Metrics
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          )}
          <span>Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}</span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricItems.map(({ key, label, icon, gradient, description }) => {
          const value = displayMetrics[key] || 0;
          const status = getMetricStatus(key, value);
          
          return (
            <div 
              key={key} 
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-300 hover:scale-105"
              title={description}
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-lg group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{icon}</span>
                  {status && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${status.color} shadow-sm`}></div>
                      <span className={`text-xs font-medium ${
                        status.color === 'bg-emerald-500' ? 'text-emerald-400' :
                        status.color === 'bg-yellow-500' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {status.status}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <p className={`text-2xl font-bold mb-1 ${getMetricColor(key, value)}`}>
                    {formatValue(value, key)}
                    {getChangeIndicator(key)}
                  </p>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors font-medium">
                    {label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Network Health */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Network Health</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i <= Math.ceil((displayMetrics.activeProviders || 0)) ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {displayMetrics.activeProviders || 0}/5 providers active
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Success Rate</span>
            <span className="text-lg font-bold text-emerald-400">
              {getSuccessRate()}%
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {displayMetrics.successfulNegotiations || 0} of {displayMetrics.totalTransactions || 0} deals
          </div>
        </div>

        {/* Performance Status */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Performance</span>
            <span className={`text-lg font-bold ${getMetricColor('networkLatency', displayMetrics.networkLatency)}`}>
              {formatValue(displayMetrics.networkLatency || 0, 'networkLatency')}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Average response time
          </div>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">Network Utilization</span>
          <span className="text-sm font-bold text-cyan-400">
            {displayMetrics.networkUtilization || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(displayMetrics.networkUtilization || 0, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
