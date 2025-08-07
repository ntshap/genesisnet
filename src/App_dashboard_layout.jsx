import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  User, 
  Search, 
  Handshake, 
  RefreshCw,
  Settings,
  Zap,
  Activity,
  Wifi,
  WifiOff,
  Network,
  Database,
  Shield,
  Target,
  Layers,
  Cpu,
  Server,
  Monitor
} from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import RealtimeLog from './components/RealtimeLog';
import MetricsDisplay from './components/MetricsDisplay';
import NetworkVisualization from './components/NetworkVisualization';
import genesisLogo from './assets/genesisnet.png';
import DemoControlPanel from './components/DemoControlPanel';
import useCanisterData from './hooks/useCanisterData';
import { DEMO_CONFIG } from './utils/demoConfig';

function App() {
  const [searchCriteria, setSearchCriteria] = useState({
    dataType: 'weather',
    location: 'Global',
    timeRange: '2024-01-01 to 2024-12-31',
    maxPrice: '100',
    minReputation: '7.0'
  });
  
  const [showDemoControls, setShowDemoControls] = useState(DEMO_CONFIG.DEMO_MODE);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [autoStarted, setAutoStarted] = useState(false);

  // Use the enhanced hook for all data management
  const {
    logs,
    metrics,
    networkData,
    agentStatus,
    connectionStatus,
    isLoading,
    error,
    lastUpdate,
    startSearch,
    negotiate,
    refresh,
    clearError,
    isConnectedToICP,
    isMockMode
  } = useCanisterData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value,
    }));
  };

  const handleStartAgent = async () => {
    try {
      await startSearch(searchCriteria);
    } catch (error) {
      console.error('Failed to start agent:', error);
    }
  };

  const handleNegotiate = async () => {
    try {
      await negotiate();
    } catch (error) {
      console.error('Failed to negotiate:', error);
    }
  };

  const handleRefresh = () => {
    refresh();
  };

  // Demo scenario handling
  const handleScenarioStart = (scenario) => {
    setCurrentScenario(scenario);
    
    // Update search criteria based on scenario
    setSearchCriteria({
      dataType: scenario.searchParams.dataType,
      location: scenario.searchParams.location,
      timeRange: scenario.searchParams.timeRange,
      maxPrice: scenario.searchParams.maxPrice,
      minReputation: scenario.searchParams.minReputation
    });
    
    // Auto-start the agent if the scenario requires it
    if (scenario.autoStart) {
      setTimeout(() => {
        handleStartAgent();
        setAutoStarted(true);
      }, 1000);
    }
  };

  // Auto-start demo scenario on first load
  useEffect(() => {
    if (DEMO_CONFIG.DEMO_MODE && DEMO_CONFIG.AUTO_START && !autoStarted) {
      const demoScenario = DEMO_CONFIG.DEFAULT_SCENARIO;
      if (demoScenario) {
        setTimeout(() => {
          handleScenarioStart(demoScenario);
        }, 2000);
      }
    }
  }, [autoStarted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if not in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case 'd':
          if (DEMO_CONFIG.DEMO_MODE) {
            setShowDemoControls(!showDemoControls);
          }
          break;
        case ' ':
          e.preventDefault();
          if (currentScenario) {
            // Toggle scenario
            setCurrentScenario(null);
          } else if (DEMO_CONFIG.DEMO_MODE) {
            handleScenarioStart(DEMO_CONFIG.DEFAULT_SCENARIO);
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleRefresh();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDemoControls, currentScenario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-purple-900/10"></div>
      </div>
      
      {/* Top Navigation Bar */}
      <header className="relative z-50 bg-slate-900/95 backdrop-blur-xl border-b border-cyan-400/20 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 p-0.5 relative">
                  <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                    <img 
                      src={genesisLogo} 
                      alt="GenesisNet" 
                      className="w-6 h-6 object-contain filter brightness-150"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    GenesisNet
                  </h1>
                  <p className="text-xs text-cyan-400/60 font-mono">v2.0</p>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center space-x-1">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 text-sm font-medium border border-cyan-400/20 hover:bg-cyan-400/20 transition-all">
                  <Network size={16} />
                  <span>Network</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-400 text-sm hover:text-cyan-400 hover:bg-slate-800/50 transition-all">
                  <Users size={16} />
                  <span>Agents</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-400 text-sm hover:text-cyan-400 hover:bg-slate-800/50 transition-all">
                  <BarChart3 size={16} />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>
            
            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-cyan-400/20">
                <div className={`w-2 h-2 rounded-full ${
                  isConnectedToICP ? 'bg-emerald-400 animate-pulse' : 
                  isMockMode ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs text-cyan-400 font-mono">{agentStatus}</span>
              </div>
              
              {/* Demo Controls */}
              {DEMO_CONFIG.DEMO_MODE && (
                <button
                  onClick={() => setShowDemoControls(!showDemoControls)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-xs font-bold hover:scale-105 transition-all"
                >
                  Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - 3 Column Dashboard */}
      <main className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Control Panel & Navigation */}
        <aside className="w-72 bg-slate-900/95 backdrop-blur-xl border-r border-cyan-400/20 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/30">
          <div className="p-4 space-y-4">
            {/* Network Control Header */}
            <div className="border-b border-cyan-400/20 pb-3">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wide">Network Control</h2>
              <p className="text-xs text-slate-400 mt-1">System parameters and controls</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/60 border border-blue-400/30 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-400">{metrics.activeProviders || 24}</div>
                <div className="text-xs text-blue-400/70">Active Nodes</div>
              </div>
              <div className="bg-slate-800/60 border border-emerald-400/30 rounded-lg p-3">
                <div className="text-lg font-bold text-emerald-400">{metrics.totalTransactions || 156}</div>
                <div className="text-xs text-emerald-400/70">Connections</div>
              </div>
            </div>

            {/* Control Panel Component */}
            <div className="bg-slate-800/40 border border-cyan-400/20 rounded-lg p-3">
              <ControlPanel
                searchCriteria={searchCriteria}
                onInputChange={handleInputChange}
                onStartAgent={handleStartAgent}
                onRefresh={handleRefresh}
                agentStatus={agentStatus}
                isLoading={isLoading}
                connectionStatus={connectionStatus}
                error={error}
              />
            </div>

            {/* System Parameters */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">System Parameters</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-700/50">
                  <span className="text-xs text-slate-300">Network Load</span>
                  <span className="text-xs font-mono text-cyan-400">73%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-700/50">
                  <span className="text-xs text-slate-300">Latency</span>
                  <span className="text-xs font-mono text-cyan-400">{metrics.networkLatency || 42}ms</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-700/50">
                  <span className="text-xs text-slate-300">Throughput</span>
                  <span className="text-xs font-mono text-cyan-400">2.4 GB/s</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button 
                onClick={handleNegotiate}
                className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                Initialize Network
              </button>
              <button 
                onClick={handleRefresh}
                className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-600/60 transition-all"
              >
                Refresh Data
              </button>
            </div>

            {/* Network Nodes List */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Network Nodes</h3>
              <div className="space-y-2">
                {[
                  { id: "CORE-01", status: "online", load: "67%" },
                  { id: "CORE-02", status: "online", load: "45%" },
                  { id: "EDGE-A1", status: "online", load: "89%" },
                  { id: "EDGE-B2", status: "maintenance", load: "0%" },
                  { id: "RELAY-X1", status: "online", load: "23%" }
                ].map((node, idx) => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-700/50">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        node.status === 'online' ? 'bg-emerald-400 animate-pulse' : 
                        node.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-xs text-slate-300 font-mono">{node.id}</span>
                    </div>
                    <span className="text-xs text-cyan-400 font-mono">{node.load}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Network Visualization */}
        <section className="flex-1 bg-slate-900/60 relative">
          <div className="h-full p-4">
            <div className="h-full bg-slate-800/40 border border-cyan-400/20 rounded-lg overflow-hidden relative">
              {/* Visualization Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-cyan-400/20 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-cyan-400">Network Topology</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-400 font-mono">Live View</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-xs text-blue-400 hover:bg-blue-500/30 transition-all">
                        SCAN
                      </button>
                      <button 
                        onClick={handleRefresh}
                        className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-400 hover:bg-slate-600/50 transition-all"
                      >
                        REFRESH
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Network Visualization Component */}
              <div className="pt-14 h-full">
                <NetworkVisualization
                  agentStatus={agentStatus}
                  networkData={networkData}
                  onNegotiate={handleNegotiate}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Metrics & Logs */}
        <aside className="w-80 bg-slate-900/95 backdrop-blur-xl border-l border-cyan-400/20 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/30">
          <div className="p-4 space-y-4">
            {/* System Overview Header */}
            <div className="border-b border-cyan-400/20 pb-3">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wide">System Overview</h2>
              <p className="text-xs text-slate-400 mt-1">Real-time monitoring & analytics</p>
            </div>

            {/* Performance Metrics */}
            <div className="bg-slate-800/40 border border-cyan-400/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-cyan-400">PERFORMANCE</h3>
                <span className="text-xs text-slate-400 font-mono">Live</span>
              </div>
              <MetricsDisplay metrics={metrics} />
            </div>

            {/* Resource Usage Charts */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Resource Usage</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">CPU Usage</span>
                    <span className="text-xs font-mono text-cyan-400">67%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full" style={{width: '67%'}}></div>
                  </div>
                </div>
                
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Memory</span>
                    <span className="text-xs font-mono text-cyan-400">52%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-1.5 rounded-full" style={{width: '52%'}}></div>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Network I/O</span>
                    <span className="text-xs font-mono text-cyan-400">84%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-1.5 rounded-full" style={{width: '84%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Activity Log */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Activity Log</h3>
              <div className="bg-slate-800/40 border border-cyan-400/20 rounded-lg max-h-64 overflow-hidden">
                <RealtimeLog logs={logs} />
              </div>
            </div>

            {/* Active Connections */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Active Connections</h3>
              <div className="space-y-2">
                {[
                  { peer: "peer-001.genesis.net", region: "US-East", ping: "12ms", status: "stable" },
                  { peer: "peer-047.genesis.net", region: "EU-West", ping: "45ms", status: "stable" },
                  { peer: "peer-123.genesis.net", region: "Asia-Pac", ping: "78ms", status: "unstable" },
                  { peer: "peer-089.genesis.net", region: "US-West", ping: "23ms", status: "stable" }
                ].map((conn, index) => (
                  <div key={index} className="p-2 bg-slate-800/40 rounded border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-cyan-400 font-mono">{conn.peer}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        conn.status === 'stable' ? 'bg-emerald-400' : 'bg-yellow-400'
                      }`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{conn.region}</span>
                      <span className="text-xs text-slate-300 font-mono">{conn.ping}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Pool */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Transaction Pool</h3>
              <div className="space-y-2">
                {[
                  { id: "TX001", type: "Data Transfer", amount: "0.5 ICP", status: "pending" },
                  { id: "TX002", type: "Smart Contract", amount: "1.2 ICP", status: "confirming" },
                  { id: "TX003", type: "Governance Vote", amount: "0.1 ICP", status: "confirmed" }
                ].map((tx, index) => (
                  <div key={index} className="p-2 bg-slate-800/40 rounded border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-cyan-400 font-mono">{tx.id}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        tx.status === 'confirmed' ? 'bg-emerald-400' : 
                        tx.status === 'confirming' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{tx.type}</span>
                      <span className="text-xs text-white font-mono">{tx.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Demo Controls Overlay */}
      {showDemoControls && DEMO_CONFIG.DEMO_MODE && (
        <DemoControlPanel 
          onClose={() => setShowDemoControls(false)}
          onScenarioStart={handleScenarioStart}
          currentScenario={currentScenario}
        />
      )}

      {/* Footer Status Bar */}
      <footer className="bg-slate-900/90 backdrop-blur-xl border-t border-cyan-400/20 px-4 py-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">STATUS: <span className="text-emerald-400">{agentStatus?.toUpperCase()}</span></span>
            <span className="text-slate-400">MODE: <span className="text-yellow-400">{isMockMode ? 'DEMO' : 'LIVE'}</span></span>
            {lastUpdate && (
              <span className="text-slate-400">UPDATED: <span className="text-cyan-400">{lastUpdate.toLocaleTimeString()}</span></span>
            )}
          </div>
          
          {DEMO_CONFIG.DEMO_MODE && (
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">DEMO MODE ACTIVE</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
