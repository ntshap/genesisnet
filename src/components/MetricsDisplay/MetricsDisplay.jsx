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
    const color = isPositive ? 'text-primary-300' : 'text-accent-400';
    const Icon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <span className={`text-xs ${color} ml-2 animate-pulse font-medium flex items-center space-x-1`}>
        <Icon size={12} />
        <span>{Math.abs(change)}</span>
      </span>
    );
  };

  const metricItems = [
    {
      key: 'totalTransactions',
      label: 'Total Transactions',
      icon: BarChart3,
      gradient: 'from-primary-500 to-accent-600',
      description: 'Number of completed transactions'
    },
    {
      key: 'averagePricePerDataUnit',
      label: 'Average Price',
      icon: DollarSign,
      gradient: 'from-primary-600 to-accent-500',
      description: 'Average price per data unit (ICP)'
    },
    {
      key: 'networkLatency',
      label: 'Network Latency',
      icon: Zap,
      gradient: 'from-accent-500 to-primary-600',
      description: 'Average network response time'
    },
    {
      key: 'activeProviders',
      label: 'Active Providers',
      icon: Users,
      gradient: 'from-accent-600 to-primary-500',
      description: 'Currently active data providers'
    },
    {
      key: 'successfulNegotiations',
      label: 'Successful Deals',
      icon: CheckCircle,
      gradient: 'from-primary-500 to-accent-500',
      description: 'Number of successful negotiations'
    },
    {
      key: 'networkUtilization',
      label: 'Network Usage',
      icon: Activity,
      gradient: 'from-accent-500 to-primary-600',
      description: 'Current network utilization'
    }
  ];

  const getMetricColor = (key, value) => {
    switch (key) {
      case 'networkLatency':
        if (value < 100) return 'text-primary-300';
        if (value < 200) return 'text-accent-300';
        return 'text-primary-400';
      case 'averagePricePerDataUnit':
        if (value < 50) return 'text-primary-300';
        if (value < 100) return 'text-accent-300';
        return 'text-primary-400';
      default:
        return 'text-white';
    }
  };

  const getMetricStatus = (key, value) => {
    switch (key) {
      case 'networkLatency':
        if (value < 100) return { status: 'Excellent', color: 'bg-primary-500' };
        if (value < 200) return { status: 'Good', color: 'bg-accent-500' };
        return { status: 'Poor', color: 'bg-primary-600' };
      case 'activeProviders':
        if (value >= 3) return { status: 'Healthy', color: 'bg-primary-500' };
        if (value >= 1) return { status: 'Limited', color: 'bg-accent-500' };
        return { status: 'Critical', color: 'bg-primary-600' };
      case 'networkUtilization':
        if (value >= 80) return { status: 'High', color: 'bg-primary-600' };
        if (value >= 50) return { status: 'Medium', color: 'bg-accent-500' };
        return { status: 'Low', color: 'bg-primary-500' };
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
    <div className="h-full flex flex-col p-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <BarChart3 size={16} className="text-primary-400" />
          <span className="text-sm font-semibold text-white">Network Metrics</span>
        </div>
        {isLoading && (
          <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-custom space-y-4">
        {/* Key Metrics - Grid */}
        <div className="grid grid-cols-2 gap-3">
          {metricItems.slice(0, 4).map((item) => {
            const value = displayMetrics[item.key];
            const IconComponent = item.icon;
            const status = getMetricStatus(item.key, value);
            
            return (
              <div key={item.key} className="glass p-4 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center shadow-glow`}>
                    <IconComponent size={16} className="text-white" />
                  </div>
                  {getChangeIndicator(item.key)}
                </div>
                
                <div className={`text-xl font-bold mb-1 ${getMetricColor(item.key, value)}`}>
                  {formatValue(value, item.key)}
                </div>
                
                <div className="text-xs text-gray-400 mb-2">{item.label}</div>
                
                {status && (
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${status.color} rounded-full`}></div>
                    <span className="text-xs text-gray-500">{status.status}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Success Rate Card */}
        <div className="glass p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-glow">
              <CheckCircle size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Success Rate</div>
              <div className="text-xs text-gray-400">Negotiation Performance</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-emerald-400">
              {getSuccessRate()}%
            </div>
            <div className="text-xs text-gray-500">
              {displayMetrics.successfulNegotiations || 38} of {displayMetrics.totalTransactions || 42} deals
            </div>
          </div>
        </div>

        {/* Network Utilization */}
        <div className="glass p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-glow">
              <Activity size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Network Utilization</span>
                <span className="text-sm font-bold text-primary-400">
                  {displayMetrics.networkUtilization || 85}%
                </span>
              </div>
              <div className="text-xs text-gray-400">Current network load</div>
            </div>
          </div>
          
          <div className="w-full glass-dark rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-700 shadow-glow"
              style={{ width: `${Math.min(displayMetrics.networkUtilization || 85, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Additional Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Wifi size={14} className="text-primary-400" />
              <span className="text-xs text-gray-400">Latency</span>
            </div>
            <div className={`text-lg font-bold ${getMetricColor('networkLatency', displayMetrics.networkLatency)}`}>
              {formatValue(displayMetrics.networkLatency || 120, 'networkLatency')}
            </div>
          </div>
          
          <div className="glass p-3">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign size={14} className="text-emerald-400" />
              <span className="text-xs text-gray-400">Avg Price</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {formatValue(displayMetrics.averagePricePerDataUnit || 15.5, 'averagePricePerDataUnit')} ICP
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 pt-3 mt-4 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
