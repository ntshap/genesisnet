import React, { useEffect, useRef, useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Bug, 
  FileText,
  Trash2,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';

const getLogLevelColor = (level) => {
  switch (level) {
    case 'error': return 'text-primary-500';
    case 'warning': return 'text-accent-400';
    case 'success': return 'text-primary-300';
    case 'info': return 'text-accent-300';
    case 'debug': return 'text-gray-400';
    default: return 'text-gray-300';
  }
};

const RealtimeLog = ({ logs, isLoading, onClearLogs }) => {
  const logEndRef = useRef(null);
  const logContainerRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Use default logs if none provided
  const defaultLogs = [
    '[16:24:53] [INFO] GenesisNet interface initialized',
    '[16:24:54] [INFO] System ready for data search',
    '[16:24:55] [DEBUG] Loading network topology...',
    '[16:24:56] [INFO] ICP network connection established',
    '[16:24:57] [DEBUG] Canister health check: OK',
    '[16:24:58] [INFO] Discovered 4 active data providers',
    '[16:24:59] [DEBUG] Provider reputation scores updated',
    '[16:25:00] [INFO] 🚀 Auto-starting GenesisNet simulation...',
    '[16:25:01] [INFO] 🔍 Search initiated for "weather" data globally',
    '[16:25:02] [SUCCESS] Found 3 matching data providers',
    '[16:25:03] [INFO] 🤝 Starting negotiation with Provider #1',
    '[16:25:04] [DEBUG] Negotiation parameters: price=50 ICP, quality=8.5'
  ];

  const displayLogs = logs && logs.length > 0 ? logs : defaultLogs;

  // Removed auto-scrolling behavior completely
  
  const handleScroll = () => {
    // Manual scroll handling only
  };

  const parseLogLevel = (log) => {
    if (log.includes('[ERROR]') || log.includes('Error') || log.includes('failed')) return 'error';
    if (log.includes('[WARN]') || log.includes('Warning')) return 'warning';
    if (log.includes('[SUCCESS]') || log.includes('successful') || log.includes('completed')) return 'success';
    if (log.includes('[INFO]') || log.includes('started') || log.includes('initialized')) return 'info';
    if (log.includes('[DEBUG]') || log.includes('Debug')) return 'debug';
    return 'default';
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-emerald-400';
      case 'info': return 'text-cyan-400';
      case 'debug': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error': return <AlertCircle size={12} className="text-primary-500" />;
      case 'warning': return <AlertTriangle size={12} className="text-accent-400" />;
      case 'success': return <CheckCircle size={12} className="text-primary-300" />;
      case 'info': return <Info size={12} className="text-primary-400" />;
      case 'debug': return <Bug size={12} className="text-gray-400" />;
      default: return <FileText size={12} className="text-white" />;
    }
  };

  const getLogBgColor = (level) => {
    switch (level) {
      case 'error': return 'hover:bg-primary-900/20 border-l-primary-500';
      case 'warning': return 'hover:bg-accent-900/20 border-l-accent-500';
      case 'success': return 'hover:bg-primary-900/20 border-l-primary-300';
      case 'info': return 'hover:bg-accent-900/20 border-l-accent-400';
      case 'debug': return 'hover:bg-gray-800/50 border-l-gray-500';
      default: return 'hover:bg-white/5 border-l-white/20';
    }
  };

  const filteredLogs = displayLogs.filter(log => {
    const level = parseLogLevel(log);
    const matchesFilter = filter === 'all' || level === filter;
    const matchesSearch = searchTerm === '' || log.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const logCounts = {
    all: displayLogs.length,
    error: displayLogs.filter(log => parseLogLevel(log) === 'error').length,
    warning: displayLogs.filter(log => parseLogLevel(log) === 'warning').length,
    success: displayLogs.filter(log => parseLogLevel(log) === 'success').length,
    info: displayLogs.filter(log => parseLogLevel(log) === 'info').length,
    debug: displayLogs.filter(log => parseLogLevel(log) === 'debug').length
  };

  const formatTimestamp = (log) => {
    const timestampMatch = log.match(/\[(\d{2}:\d{2}:\d{2})\]/);
    if (timestampMatch) {
      return {
        timestamp: timestampMatch[1],
        message: log.replace(timestampMatch[0], '').trim()
      };
    }
    return { timestamp: '', message: log };
  };

  const formatLogMessage = (message) => {
    // Add emoji highlighting for common terms
    return message
      .replace(/🚀|🔍|🤝|⚡|🌐|💼|📊/g, '<span class="text-lg">$&</span>')
      .replace(/\b(Provider|ICP|GenesisNet|canister)\b/gi, '<span class="text-primary-400 font-medium">$&</span>');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Activity size={16} className="text-primary-400" />
          <span className="text-sm font-semibold text-white">Live System Logs</span>
          {isLoading && (
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse shadow-primary-400/50"></div>
          )}
        </div>
        <button
          onClick={onClearLogs}
          className="p-1 text-gray-400 hover:text-primary-400 transition-colors glass rounded"
          title="Clear logs"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Compact Controls */}
      <div className="p-3 border-b border-white/10 flex-shrink-0">
        {/* Quick Filter buttons - Compact */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All', color: 'text-gray-300', icon: Filter },
            { key: 'error', label: 'Err', color: 'text-primary-500', icon: AlertCircle },
            { key: 'success', label: 'Ok', color: 'text-primary-300', icon: CheckCircle },
            { key: 'info', label: 'Info', color: 'text-primary-400', icon: Info }
          ].map(({ key, label, color, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-lg text-xs transition-all font-medium flex items-center space-x-1 ${
                filter === key 
                  ? `glass bg-white/20 text-white` 
                  : `${color} hover:bg-white/10 glass-dark`
              }`}
            >
              <Icon size={12} />
              <span>{label}</span>
              <span className="text-xs opacity-75">({logCounts[key]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Log display - Main content area */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={logContainerRef}
          onScroll={handleScroll}
          className="h-full p-3 overflow-y-auto text-xs font-mono scrollbar-custom"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText size={32} className="mx-auto mb-3 text-gray-600" />
              <div className="text-sm text-gray-400">No logs found</div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log, index) => {
                const level = parseLogLevel(log);
                const { timestamp, message } = formatTimestamp(log);
                
                return (
                  <div 
                    key={index} 
                    className={`p-3 glass rounded-lg border-l-2 ${getLogBgColor(level)} text-xs hover:bg-white/5 transition-all duration-200`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 mt-0.5">{getLogIcon(level)}</span>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          {timestamp && (
                            <span className="text-xs text-gray-500 font-mono bg-dark-800/50 px-2 py-0.5 rounded">
                              {timestamp}
                            </span>
                          )}
                          <span className={`text-xs uppercase font-semibold ${getLogColor(level)} bg-dark-800/30 px-2 py-0.5 rounded`}>
                            {level}
                          </span>
                        </div>
                        <div 
                          className={`break-words ${getLogColor(level)} leading-relaxed`}
                          dangerouslySetInnerHTML={{ __html: formatLogMessage(message) }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Compact Footer */}
      <div className="border-t border-white/10 p-3 flex items-center justify-between text-xs flex-shrink-0 glass-dark">
        <div className="flex items-center space-x-4 text-gray-400">
          <span className="font-medium">{filteredLogs.length} / {displayLogs.length} logs</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => logEndRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center space-x-1"
          >
            <span>Scroll to End</span>
            <ChevronDown size={12} />
          </button>
          <div className="text-gray-500 flex items-center space-x-1">
            <Activity size={12} />
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeLog;
