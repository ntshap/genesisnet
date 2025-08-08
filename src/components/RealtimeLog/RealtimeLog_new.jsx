import React, { useEffect, useRef, useState } from 'react';

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
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  const getLogBgColor = (level) => {
    switch (level) {
      case 'error': return 'hover:bg-red-900/20 border-l-red-500';
      case 'warning': return 'hover:bg-yellow-900/20 border-l-yellow-500';
      case 'success': return 'hover:bg-emerald-900/20 border-l-emerald-500';
      case 'info': return 'hover:bg-cyan-900/20 border-l-cyan-500';
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
      .replace(/\b(Provider|ICP|GenesisNet|canister)\b/gi, '<span class="text-purple-400 font-medium">$&</span>');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Live System Logs
        </h2>
        <div className="flex items-center space-x-3">
          {isLoading && (
            <div className="flex items-center space-x-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          )}
          <button
            onClick={onClearLogs}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors font-medium"
            title="Clear logs"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', color: 'text-gray-300', bg: 'from-gray-600 to-gray-700' },
            { key: 'error', label: 'Errors', color: 'text-red-400', bg: 'from-red-600 to-red-700' },
            { key: 'warning', label: 'Warnings', color: 'text-yellow-400', bg: 'from-yellow-600 to-yellow-700' },
            { key: 'success', label: 'Success', color: 'text-emerald-400', bg: 'from-emerald-600 to-emerald-700' },
            { key: 'info', label: 'Info', color: 'text-cyan-400', bg: 'from-cyan-600 to-cyan-700' },
            { key: 'debug', label: 'Debug', color: 'text-gray-500', bg: 'from-gray-500 to-gray-600' }
          ].map(({ key, label, color, bg }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === key 
                  ? `bg-gradient-to-r ${bg} text-white shadow-lg` 
                  : `bg-white/5 ${color} hover:bg-white/10 border border-white/10`
              }`}
            >
              {label} ({logCounts[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Log display */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex flex-col">
        <div 
          ref={logContainerRef}
          onScroll={handleScroll}
          className="p-4 overflow-y-auto text-sm font-mono max-h-96 min-h-80"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-4xl mb-4">📝</div>
              <div className="text-lg font-medium mb-2">No logs found</div>
              <div className="text-sm">
                {searchTerm || filter !== 'all' ? 'Try adjusting your filter or search terms' : 'Logs will appear here when system activity occurs'}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log, index) => {
                const level = parseLogLevel(log);
                const { timestamp, message } = formatTimestamp(log);
                
                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg transition-all duration-200 border-l-2 ${getLogBgColor(level)} group`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 mt-0.5 text-sm">{getLogIcon(level)}</span>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          {timestamp && (
                            <span className="text-xs text-gray-500 font-mono bg-gray-800/50 px-2 py-1 rounded">
                              {timestamp}
                            </span>
                          )}
                          <span className={`text-xs uppercase font-semibold px-2 py-1 rounded ${getLogColor(level)} bg-current/10`}>
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

        {/* Footer controls */}
        <div className="border-t border-white/10 p-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-400">
            <span className="font-medium">
              {filteredLogs.length} / {displayLogs.length} logs
            </span>
          </div>
          
          <button
            onClick={() => logEndRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            <span>Scroll to bottom</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealtimeLog;
