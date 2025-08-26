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
  Search,
  Filter
} from 'lucide-react';

const getLogLevelColor = (level) => {
  switch (level) {
    case 'error': return 'text-red-600 bg-red-200';
    case 'warning': return 'text-yellow-700 bg-yellow-200';
    case 'success': return 'text-green-700 bg-green-200';
    case 'info': return 'text-blue-700 bg-blue-200';
    case 'debug': return 'text-gray-700 bg-gray-200';
    default: return 'text-black bg-white';
  }
};

const getLogIcon = (level) => {
  switch (level) {
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    case 'success': return CheckCircle;
    case 'info': return Info;
    case 'debug': return Bug;
    default: return Activity;
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
    '[16:25:04] [DEBUG] Negotiation parameters: price=50 ICP, quality=8.5',
    '[16:25:05] [SUCCESS] ✅ Negotiation successful! Price agreed: 45 ICP',
    '[16:25:06] [INFO] 📊 Data transfer initiated from Provider #1',
    '[16:25:07] [SUCCESS] ✅ Data received and validated successfully',
    '[16:25:08] [INFO] 💰 Payment processed: 45 ICP transferred',
    '[16:25:09] [SUCCESS] ✅ Transaction completed successfully',
    '[16:25:10] [INFO] 📈 Network performance metrics updated',
    '[16:25:11] [DEBUG] Cache refresh initiated',
    '[16:25:12] [INFO] Analytics data synchronized',
    '[16:25:13] [DEBUG] Background tasks scheduled',
    '[16:25:14] [INFO] System optimization complete',
    '[16:25:15] [SUCCESS] All systems operational',
    '[16:25:16] [INFO] Monitoring active connections',
    '[16:25:17] [DEBUG] Memory usage: 67% of available',
    '[16:25:18] [INFO] New peer connection established',
    '[16:25:19] [DEBUG] Garbage collection cycle completed',
    '[16:25:20] [INFO] Network latency optimized to 42ms',
    '[16:25:21] [SUCCESS] Health check passed for all nodes',
    '[16:25:22] [INFO] Real-time monitoring active'
  ];

  const displayLogs = logs && logs.length > 0 ? logs : defaultLogs;

  // Parse log level from log message
  const parseLog = (logMessage) => {
    // Handle different log formats
    let messageText, level, timestamp, source;
    
    if (typeof logMessage === 'object' && logMessage !== null) {
      // Handle log objects from useRealData
      messageText = logMessage.message || JSON.stringify(logMessage);
      level = logMessage.level || 'info';
      timestamp = logMessage.timestamp ? new Date(logMessage.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
      source = logMessage.source || 'system';
    } else {
      // Handle string logs
      messageText = typeof logMessage === 'string' ? logMessage : String(logMessage);
      
      const levelMatch = messageText.match(/\[(ERROR|WARNING|SUCCESS|INFO|DEBUG)\]/i);
      const timeMatch = messageText.match(/\[([^\]]+)\]/);
      
      level = 'info';
      if (levelMatch) {
        level = levelMatch[1].toLowerCase();
      } else if (messageText.includes('error') || messageText.includes('❌')) {
        level = 'error';
      } else if (messageText.includes('warning') || messageText.includes('⚠️')) {
        level = 'warning';
      } else if (messageText.includes('success') || messageText.includes('✅')) {
        level = 'success';
      } else if (messageText.includes('debug')) {
        level = 'debug';
      }
      
      timestamp = timeMatch ? timeMatch[1] : new Date().toLocaleTimeString();
      source = 'system';
    }

    return {
      level,
      timestamp,
      message: messageText.replace(/^\[[^\]]+\]\s*\[(ERROR|WARNING|SUCCESS|INFO|DEBUG)\]\s*/i, '').trim() || messageText,
      fullMessage: messageText,
      source
    };
  };

  const filteredLogs = displayLogs.filter(log => {
    const parsed = parseLog(log);
    
    // Filter by level
    if (filter !== 'all' && parsed.level !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !parsed.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Removed auto-scrolling behavior completely
  
  const handleScroll = () => {
    // Manual scroll handling only
  };

  const levels = ['all', 'error', 'warning', 'success', 'info', 'debug'];

  return (
    <div className="h-full flex flex-col bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="bg-orange-300 border-b-2 border-black p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center">
            <Activity size={12} className="text-black" />
          </div>
          <span className="text-sm font-black text-black">Activity Log</span>
          <span className="bg-white border border-black px-2 py-1 rounded text-xs font-bold text-black">
            {filteredLogs.length}
          </span>
        </div>
        
        {onClearLogs && (
          <button
            onClick={onClearLogs}
            className="p-1 bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            title="Clear logs"
          >
            <Trash2 size={12} className="text-black" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-orange-100 border-b-2 border-black p-2 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-white border-2 border-black rounded text-xs font-bold placeholder-gray-500 focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all"
          />
        </div>

        {/* Level Filter */}
        <div className="flex flex-wrap gap-1">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-2 py-1 text-xs font-bold border-2 border-black rounded transition-all ${
                filter === level 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:translate-x-1 hover:translate-y-1'
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Log Content */}
      <div 
        ref={logContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 space-y-1 bg-orange-50 scrollbar-neubrutalism"
      >
        {filteredLogs.map((log, index) => {
          const parsed = parseLog(log);
          const LogIcon = getLogIcon(parsed.level);
          const colorClass = getLogLevelColor(parsed.level);
          
          return (
            <div
              key={index}
              className={`flex items-start space-x-2 p-2 rounded border border-black ${colorClass} text-xs font-bold`}
            >
              <LogIcon size={12} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-black">
                    {parsed.timestamp}
                  </span>
                  <span className={`px-1 py-0.5 rounded text-xs font-black border border-black ${
                    parsed.level === 'error' ? 'bg-red-300' :
                    parsed.level === 'warning' ? 'bg-yellow-300' :
                    parsed.level === 'success' ? 'bg-green-300' :
                    parsed.level === 'info' ? 'bg-blue-300' :
                    'bg-gray-300'
                  }`}>
                    {parsed.level.toUpperCase()}
                  </span>
                  {parsed.source && parsed.source !== 'system' && (
                    <span className="px-1 py-0.5 rounded text-xs font-black border border-black bg-purple-200">
                      {parsed.source}
                    </span>
                  )}
                </div>
                <div className="break-words">
                  {parsed.message}
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex items-center space-x-2 p-2 bg-blue-200 border border-black rounded">
            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-black">Loading new entries...</span>
          </div>
        )}
        
        <div ref={logEndRef} />
      </div>

      {/* Status bar with manual scroll button */}
      <div className="bg-orange-300 border-t-2 border-black p-2 flex items-center justify-between">
        <span className="text-xs font-bold text-black">
          {filteredLogs.length} log entries
        </span>
        <button
          onClick={() => logEndRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="text-xs font-bold hover:underline"
        >
          Scroll to End →
        </button>
      </div>
    </div>
  );
};

export default RealtimeLog;
