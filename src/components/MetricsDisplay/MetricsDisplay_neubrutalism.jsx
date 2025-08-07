import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle, 
  Activity,
  BarChart3,
  Zap,
  Wifi
} from 'lucide-react';

const MetricsDisplay = ({ metrics, lastUpdate, isLoading }) => {
  const [previousMetrics, setPreviousMetrics] = useState(metrics);
  const [changes, setChanges] = useState({});

  // Use default metrics if none provided
  const defaultMetrics = {
    totalTransactions: 42,
    averagePricePerDataUnit: 0.125,
    networkLatency: 45,
    activeProviders: 18,
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
        // Round price to nearest whole number
        return `${Math.round(value)} ICP`;
      case 'networkLatency':
        return `${Math.round(value)}ms`;
      case 'networkUtilization':
        return `${Math.round(value)}%`;
      default:
        return Math.round(value).toString();
    }
  };

  const getSuccessRate = () => {
    const total = displayMetrics.totalTransactions || 0;
    const successful = displayMetrics.successfulNegotiations || 0;
    return total > 0 ? Math.round((successful / total) * 100) : 0;
  };

  const getChangeIndicator = (key) => {
    const change = changes[key];
    if (!change) return null;

    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <span className={`text-xs ${color} font-black flex items-center space-x-1`}>
        <Icon size={12} />
        <span>{Math.round(Math.abs(change))}</span>
      </span>
    );
  };

  const metricItems = [
    { key: 'totalTransactions', label: 'Transactions', icon: BarChart3 },
    { key: 'averagePricePerDataUnit', label: 'Average Price', icon: DollarSign },
    { key: 'networkLatency', label: 'Network Latency', icon: Zap },
    { key: 'activeProviders', label: 'Active Providers', icon: Users }
  ];

  return (
    <div className="space-y-3">
      {/* Key Metrics - Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metricItems.map((item) => {
          const value = displayMetrics[item.key];
          const IconComponent = item.icon;
          
          const colors = [
            'from-purple-200 to-pink-200',
            'from-green-200 to-emerald-200', 
            'from-blue-200 to-cyan-200',
            'from-yellow-200 to-orange-200'
          ];
          
          return (
            <div key={item.key} className={`bg-gradient-to-br ${colors[metricItems.indexOf(item)]} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3`}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center">
                  <IconComponent size={12} className="text-black" />
                </div>
                {getChangeIndicator(item.key)}
              </div>
              
              <div className="text-lg font-black text-black mb-1">
                {formatValue(value, item.key)}
              </div>
              
              <div className="text-xs text-black font-bold">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Success Rate */}
      <div className="bg-gradient-to-r from-green-200 to-emerald-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center">
              <CheckCircle size={12} className="text-black" />
            </div>
            <span className="text-xs font-black text-black">Success Rate</span>
          </div>
          <span className="text-lg font-black text-black">{getSuccessRate()}%</span>
        </div>
        <div className="w-full bg-white border-2 border-black rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
            style={{ width: `${getSuccessRate()}%` }}
          ></div>
        </div>
      </div>

      {/* Network Utilization */}
      <div className="bg-gradient-to-r from-blue-200 to-cyan-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center">
              <Activity size={12} className="text-black" />
            </div>
            <span className="text-xs font-black text-black">Network Utilization</span>
          </div>
          <span className="text-lg font-black text-black">
            {displayMetrics.networkUtilization || 85}%
          </span>
        </div>
        <div className="w-full bg-white border-2 border-black rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
            style={{ width: `${Math.min(displayMetrics.networkUtilization || 85, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2 border-t-2 border-black">
        <div className="text-xs text-black font-bold">
          Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
