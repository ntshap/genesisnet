import React, { useState, useEffect, useCallback } from 'react';
import Joyride from 'react-joyride';
import { useAuth } from './context/AuthContext.jsx';
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
  Monitor,
  Home,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Download,
  Package,
  FileCheck,
  HelpCircle
} from 'lucide-react';
import ControlPanel from './components/ControlPanel/ControlPanel_neubrutalism';
import RealtimeLog from './components/RealtimeLog/RealtimeLog_neubrutalism';
import MetricsDisplay from './components/MetricsDisplay/MetricsDisplay_neubrutalism';
import NetworkVisualization from './components/NetworkVisualization/NetworkVisualization_neubrutalism';
import genesisLogo from './assets/genesisnet-logo.png';
import DemoControlPanel from './components/DemoControlPanel';
import useInteractiveDemo from './hooks/useInteractiveDemo';
import { DEMO_CONFIG } from './utils/demoConfig';

function Dashboard({ onBackToLanding }) {
  console.log('Dashboard: Component mounting/rendering');
  
  // Get authentication info and logout function
  const { user, logout } = useAuth();
  
  const [searchCriteria, setSearchCriteria] = useState({
    dataType: 'weather',
    location: 'Global',
    timeRange: '2024-01-01 to 2024-12-31',
    maxPrice: '100',
    minReputation: '7.0'
  });
  
  const [showDemoControls, setShowDemoControls] = useState(DEMO_CONFIG.DEMO_MODE);
  const [runTour, setRunTour] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [autoStarted, setAutoStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('network'); // Add active tab state
  const [showWalletHistory, setShowWalletHistory] = useState(false); // Add wallet history state
  const [isScanning, setIsScanning] = useState(false); // Add scanning state

  // Use the enhanced interactive demo hook
  const {
    logs = [],
    metrics = { totalTransactions: 0, successRate: 0, averageLatency: 0, activeNodes: 0, totalVolume: 0, pendingRequests: 0 },
    networkData = { nodes: [], connections: [] },
    searchResults = [],
    activeConnections = [],
    transactionPool = [],
    dataDeliveries = [],
    activeDownloads = [],
    completedDeliveries = [],
    walletBalance = 0,
    paymentHistory = [],
    pendingPayments = [],
    fundingHistory = [],
    agentStatus,
    isSearching = false,
    isNegotiating = false,
    selectedProvider = null,
    negotiationStatus = null,
    lastUpdate,
    startSearch,
    negotiate,
    downloadData,
    refresh,
    addLog,
    clearLogs,
    isConnectedToICP = false,
    isMockMode = true,
    connectionStatus = 'connecting',
    isLoading = false,
    error = null,
    clearError
  } = useInteractiveDemo() || {};

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value,
    }));
  }, []);

  const handleStartAgent = useCallback(async () => {
    try {
      if (startSearch && typeof startSearch === 'function') {
        await startSearch(searchCriteria);
      }
    } catch (error) {
      console.error('Failed to start agent:', error);
    }
  }, [startSearch, searchCriteria]);

  const handleNegotiate = useCallback(async (provider) => {
    try {
      if (negotiate && typeof negotiate === 'function') {
        if (provider) {
          await negotiate(provider);
        } else if (searchResults && searchResults.length > 0) {
          // Use first available provider if no specific provider selected
          await negotiate(searchResults[0]);
        }
      }
    } catch (error) {
      console.error('Failed to negotiate:', error);
    }
  }, [negotiate, searchResults]);

  const handleRefresh = useCallback(() => {
    try {
      if (refresh && typeof refresh === 'function') {
        refresh();
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  }, [refresh]);

  const handleScan = useCallback(() => {
    try {
      if (isScanning) return; // Prevent multiple scans
      
      setIsScanning(true);
      // Trigger network scan animation and data refresh
      addLog('scan', 'Initiating network topology scan...', 'info', 'network-scanner');
      
      // Simulate scanning process with realistic delay
      setTimeout(() => {
        addLog('scan', 'Discovering new nodes and connections...', 'info', 'network-scanner');
        
        setTimeout(() => {
          const detectedNodes = Math.floor(Math.random() * 5) + 18;
          addLog('scan', `Network scan complete - ${detectedNodes} nodes detected`, 'success', 'network-scanner');
          
          // Trigger a refresh after scan
          if (refresh && typeof refresh === 'function') {
            refresh();
          }
          setIsScanning(false);
        }, 1500);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to scan network:', error);
      addLog('scan', 'Network scan failed - retrying...', 'error', 'network-scanner');
      setIsScanning(false);
    }
  }, [refresh, addLog, isScanning]);

  // Demo scenario handling
  const handleScenarioStart = useCallback((scenario) => {
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
  }, [handleStartAgent]);

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
  }, [autoStarted, handleScenarioStart]);

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
  }, [showDemoControls, currentScenario, handleScenarioStart, handleRefresh]);

  // Guided tour steps definition - direct dashboard features explanation
  const tourSteps = [
    {
      target: '[data-tour="search-input"]',
      content: "Enter your search queries here to generate content from the neural network.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '[data-tour="start-agent-button"]',
      content: "Click this button to start the agent and begin generating content based on your query.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '.network-visualization',
      content: "This visualization shows the neural network in action, demonstrating how information flows through the system.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '.metrics-display',
      content: "Monitor key performance metrics such as accuracy, processing time, and efficiency in real-time.",
      placement: "left",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '.realtime-log',
      content: "The Real-time Log displays system activity and agent behavior as it happens.",
      placement: "left",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '.wallet-balance',
      content: "Your ICP cryptocurrency balance for data transactions.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '[data-tour="header-tour-button"]',
      content: "You can restart this tour anytime by clicking this button.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    }
  ];

  return (
    <div className="min-h-screen bg-yellow-50 text-black relative">
      {/* Guided tour overlay */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        scrollToFirstStep
        disableScrolling
        spotlightClicks
        spotlight={true}
        hideBackButton={false}
        hideCloseButton={false}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#000000',
            backgroundColor: '#ffffff',
            arrowColor: '#000000',
            textColor: '#000000',
            overlayColor: 'rgba(0, 0, 0, 0.75)',
            width: 320
          },
          spotlight: {
            backgroundColor: 'transparent',
            borderRadius: 0
          },
          tooltipContainer: {
            textAlign: 'left',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14px',
            border: '2px solid #000000',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            backgroundColor: '#ffffff'
          },
          tooltip: {
            fontSize: '14px',
            padding: '8px 0',
            backgroundColor: '#ffffff',
            color: '#000000'
          },
          buttonBack: {
            marginRight: 10,
            backgroundColor: '#fde047',
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '6px 12px',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
          },
          buttonNext: {
            backgroundColor: '#fde047',
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '6px 12px',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
          },
          buttonSkip: {
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'bold'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
        locale={{
          back: 'Prev',
          close: 'Done',
          last: 'Finish',
          next: 'Next',
          skip: 'Skip'
        }}
        floaterProps={{
          disableAnimation: true,
          styles: {
            floater: {
              filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.3))'
            },
            arrow: {
              color: '#000000',
              length: 6,
              spread: 10
            }
          }
        }}
        disableOverlay={false}
        disableOverlayClose={false}
        tooltipComponent={({
          continuous,
          index,
          step,
          backProps,
          closeProps,
          primaryProps,
          skipProps,
          isLastStep,
        }) => (
          <div className="p-4 bg-white border-2 border-black rounded">
            <div className="mb-2 font-bold text-black text-base">{step.content}</div>
            <div className="flex justify-between items-center">
              <div>
                {index > 0 && (
                  <button 
                    {...backProps} 
                    className="px-4 py-1 mr-2 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded"
                  >
                    Prev
                  </button>
                )}
                {!isLastStep && (
                  <button 
                    {...skipProps} 
                    className="px-4 py-1 bg-gray-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded"
                  >
                    Skip
                  </button>
                )}
              </div>
              <button 
                {...(isLastStep ? closeProps : primaryProps)} 
                className="px-4 py-1 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded"
              >
                {isLastStep ? 'Done' : 'Next'}
              </button>
            </div>
          </div>
        )}
        callback={(data) => {
          const { action, index, status, type } = data;
          
          if (status === 'finished' || status === 'skipped') {
            setRunTour(false);
          }
        }}
      />
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-300 border-4 border-black text-black p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{error}</span>
            {clearError && (
              <button onClick={clearError} className="ml-2 text-black hover:text-gray-600 font-black">
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="relative z-50 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-lg bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 relative">
                  <div className="w-full h-full rounded-lg bg-white border-2 border-black flex items-center justify-center">
                    <img 
                      src={genesisLogo} 
                      alt="GenesisNet" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-black text-black">
                    GenesisNet
                  </h1>
                  <p className="text-xs text-purple-600 font-bold">Data Marketplace</p>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center space-x-1">
                <button 
                  onClick={() => setActiveTab('network')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all network-tab ${
                    activeTab === 'network' ? 'bg-cyan-300' : 'bg-white'
                  }`}
                >
                  <Network size={16} />
                  <span>Network</span>
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                    activeTab === 'analytics' ? 'bg-pink-300' : 'bg-white'
                  }`}
                >
                  <BarChart3 size={16} />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>
            
            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {/* User Profile Button */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-lime-300 text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <User size={16} />
                  <span>{user?.username || 'User'}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden group-hover:block z-50">
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        logout();
                        onBackToLanding();
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-bold text-black hover:bg-yellow-100 rounded flex items-center"
                    >
                      <ArrowLeft size={14} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Back to Landing Button */}
              {onBackToLanding && (
                <button 
                  onClick={onBackToLanding}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-300 text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <ArrowLeft size={16} />
                  <span>Landing</span>
                </button>
              )}
              {/* Help Tour Button */}
              <button
                onClick={() => setRunTour(true)}
                data-tour="header-tour-button"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-yellow-300 text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                aria-label="Start guided tour"
              >
                <HelpCircle size={16} />
                <span>Tour</span>
              </button>
              
              {/* Wallet Balance & History */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] wallet-balance">
                  <ShoppingCart size={14} />
                  <span className="text-xs text-black font-black">{walletBalance.toFixed(2)} ICP</span>
                  {pendingPayments.length > 0 && (
                    <div className="w-2 h-2 rounded-full bg-orange-500 border border-black animate-pulse"></div>
                  )}
                </div>
                
                {/* Wallet History Button */}
                <button 
                  onClick={() => setShowWalletHistory(!showWalletHistory)}
                  className="px-2 py-1.5 rounded-lg bg-blue-300 text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  💰
                </button>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-lime-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className={`w-2 h-2 rounded-full ${
                  isConnectedToICP ? 'bg-green-500 border border-black' : 
                  isMockMode ? 'bg-yellow-500 border border-black' : 'bg-red-500 border border-black'
                }`}></div>
                <span className="text-xs text-black font-black">{agentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - 3 Column Dashboard */}
      <main className="flex h-[calc(100vh-80px)] pt-2">
        {/* Left Sidebar - Control Panel & Navigation */}
        <aside className="w-80 bg-white border-r-4 border-black shadow-[8px_0px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-neubrutalism mt-2 ml-2 rounded-tl-lg">
          <div className="p-4 space-y-4">
            {/* Network Control Header */}
            <div className="border-b-4 border-black pb-3">
              <h2 className="text-sm font-black text-black uppercase tracking-wide">Network Control</h2>
              <p className="text-xs text-purple-600 mt-1 font-bold">System parameters and controls</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                <div className="text-lg font-black text-black">{metrics.activeProviders || 24}</div>
                <div className="text-xs text-black font-bold">Active Nodes</div>
              </div>
              <div className="bg-green-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                <div className="text-lg font-black text-black">{metrics.totalTransactions || 156}</div>
                <div className="text-xs text-black font-bold">Connections</div>
              </div>
            </div>

            {/* Search Results Panel */}
            {searchResults.length > 0 && (
              <div className="bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3">Search Results ({searchResults.length})</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {searchResults.map((provider, index) => (
                    <div key={provider.id} className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                      {/* Provider Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <h4 className="text-sm font-black text-black truncate">{provider.name}</h4>
                          <div className={`w-2 h-2 rounded-full border border-black flex-shrink-0 ${
                            selectedProvider?.id === provider.id && isNegotiating ? 'bg-yellow-500' :
                            provider.availability === 'available' ? 'bg-green-500' : 'bg-orange-500'
                          }`}></div>
                        </div>
                        <div className="text-sm font-black text-green-600 flex-shrink-0">{provider.currentPrice} ICP</div>
                      </div>
                      
                      {/* Provider Details */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex space-x-3 text-xs">
                          <span className="text-black font-bold">Quality: <span className="text-blue-600">{provider.dataQuality}/10</span></span>
                          <span className="text-black font-bold">Rep: <span className="text-purple-600">{provider.reputation}/10</span></span>
                        </div>
                        <div className="text-xs text-gray-600 font-medium">{provider.type.toUpperCase()}</div>
                      </div>
                      
                      {/* Action Button */}
                      <button 
                        onClick={() => handleNegotiate(provider)}
                        disabled={isNegotiating}
                        className="w-full px-3 py-2 bg-lime-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded text-sm text-black font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedProvider?.id === provider.id && isNegotiating ? 'Negotiating...' : 'Negotiate'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negotiation Status */}
            {negotiationStatus && selectedProvider && (
              <div className="bg-purple-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                <h3 className="text-sm font-black text-black uppercase tracking-wide mb-2">
                  Negotiating with {selectedProvider.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full border border-black animate-pulse ${
                    negotiationStatus === 'connecting' ? 'bg-blue-500' :
                    negotiationStatus === 'authenticating' ? 'bg-yellow-500' :
                    negotiationStatus === 'price_discussion' ? 'bg-orange-500' :
                    negotiationStatus === 'quality_verification' ? 'bg-purple-500' :
                    negotiationStatus === 'contract_creation' ? 'bg-cyan-500' :
                    negotiationStatus === 'success' ? 'bg-green-500' :
                    negotiationStatus === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-xs text-black font-bold">
                    {negotiationStatus === 'connecting' && 'Establishing connection...'}
                    {negotiationStatus === 'authenticating' && 'Authenticating credentials...'}
                    {negotiationStatus === 'price_discussion' && 'Discussing pricing...'}
                    {negotiationStatus === 'quality_verification' && 'Verifying data quality...'}
                    {negotiationStatus === 'contract_creation' && 'Creating smart contract...'}
                    {negotiationStatus === 'success' && '✅ Contract signed successfully!'}
                    {negotiationStatus === 'failed' && '❌ Negotiation failed'}
                  </span>
                </div>
              </div>
            )}

            {/* Data Deliveries Panel */}
            {(dataDeliveries.length > 0 || completedDeliveries.length > 0) && (
              <div className="bg-cyan-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3">
                  📦 Data Deliveries ({dataDeliveries.length + completedDeliveries.length})
                </h3>
                
                {/* Active Deliveries */}
                {dataDeliveries.map((delivery) => (
                  <div key={delivery.id} className="mb-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black">{delivery.provider}</span>
                        <span className="px-1 py-0.5 bg-blue-300 border border-black rounded text-xs font-black">
                          {delivery.dataType?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-600">{delivery.package.size}</span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold capitalize">{delivery.status.replace('_', ' ')}</span>
                        <span className="font-black">{delivery.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 border border-black rounded-full h-2">
                        <div 
                          className="bg-cyan-500 border-r border-black h-full rounded-full transition-all duration-300"
                          style={{ width: `${delivery.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      📊 {delivery.package.records} records • 📁 {delivery.package.files} files
                    </div>
                  </div>
                ))}

                {/* Completed Deliveries - Ready for Download */}
                {completedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="mb-3 p-3 bg-green-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black">{delivery.provider}</span>
                        <span className="px-1 py-0.5 bg-green-300 border border-black rounded text-xs font-black">
                          READY
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-600">{delivery.package.size}</span>
                    </div>
                    
                    <div className="mb-2 text-xs text-gray-600">
                      📊 {delivery.package.records} records • 📁 {delivery.package.files} files
                    </div>
                    
                    <button
                      onClick={() => downloadData && downloadData(delivery)}
                      className="w-full px-3 py-2 bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded text-xs text-black font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      🔽 Download Data Package
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Active Downloads Panel */}
            {activeDownloads.length > 0 && (
              <div className="bg-green-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3">
                  🔽 Active Downloads ({activeDownloads.length})
                </h3>
                
                {activeDownloads.map((download) => (
                  <div key={download.id} className="mb-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black truncate">{download.fileName}</span>
                      <span className="text-xs font-bold text-green-600">{download.speed}</span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold capitalize">{download.status}</span>
                        <span className="font-black">{download.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 border border-black rounded-full h-2">
                        <div 
                          className="bg-green-500 border-r border-black h-full rounded-full transition-all duration-300"
                          style={{ width: `${download.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      📦 {download.size}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Control Panel Component */}
            <div data-tour="control-panel" className="bg-yellow-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
              <ControlPanel
                searchCriteria={searchCriteria}
                onInputChange={handleInputChange}
                onStartAgent={handleStartAgent}
                onRefresh={handleRefresh}
                agentStatus={agentStatus}
                isLoading={isLoading}
                connectionStatus={connectionStatus}
                error={error}
                isSearching={isSearching}
              />
            </div>

            {/* System Parameters */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-black uppercase tracking-wide">System Parameters</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-pink-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                  <span className="text-xs text-black font-bold">Network Load</span>
                  <span className="text-xs font-black text-black">73%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-pink-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                  <span className="text-xs text-black font-bold">Latency</span>
                  <span className="text-xs font-black text-black">{metrics.networkLatency || 42}ms</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-pink-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                  <span className="text-xs text-black font-bold">Throughput</span>
                  <span className="text-xs font-black text-black">2.4 GB/s</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 network-actions">
              <button 
                onClick={handleNegotiate}
                className="w-full px-3 py-2 bg-cyan-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg text-sm font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Initialize Network
              </button>
              <button 
                onClick={handleRefresh}
                className="w-full px-3 py-2 bg-lime-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg text-sm font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Refresh Data
              </button>
            </div>

            {/* Network Nodes List */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-black uppercase tracking-wide">Network Nodes</h3>
              <div className="space-y-2">
                {[
                  { id: "CORE-01", status: "online", load: "67%" },
                  { id: "CORE-02", status: "online", load: "45%" },
                  { id: "EDGE-A1", status: "online", load: "89%" },
                  { id: "EDGE-B2", status: "maintenance", load: "0%" },
                  { id: "RELAY-X1", status: "online", load: "23%" },
                  { id: "CORE-03", status: "online", load: "78%" },
                  { id: "EDGE-C3", status: "online", load: "56%" },
                  { id: "RELAY-Y2", status: "online", load: "34%" },
                  { id: "EDGE-D4", status: "offline", load: "0%" },
                  { id: "CORE-04", status: "online", load: "91%" }
                ].map((node, idx) => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-orange-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full border border-black ${
                        node.status === 'online' ? 'bg-green-500' : 
                        node.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs text-black font-black">{node.id}</span>
                    </div>
                    <span className="text-xs text-black font-black">{node.load}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Configuration Panel */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-black uppercase tracking-wide">Advanced Settings</h3>
              <div className="space-y-2">
                <div className="p-2 bg-purple-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                  <label className="text-xs text-black font-bold block mb-1">Network Timeout</label>
                  <input type="range" className="w-full" min="1" max="30" defaultValue="15" />
                  <span className="text-xs text-black font-black">15s</span>
                </div>
                <div className="p-2 bg-purple-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                  <label className="text-xs text-black font-bold block mb-1">Max Connections</label>
                  <input type="range" className="w-full" min="10" max="100" defaultValue="50" />
                  <span className="text-xs text-black font-black">50</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Content based on Active Tab */}
        <section className="flex-1 bg-yellow-100 relative">
          <div className="h-full p-4 pt-2">
            <div className="h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden relative mt-2">
              
              {activeTab === 'network' && (
                <>
                  {/* Network Visualization Header */}
                  <div className="absolute top-0 left-0 right-0 z-10 bg-cyan-300 border-b-4 border-black p-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-black text-black">Network Topology</h2>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 border border-black rounded-full"></div>
                          <span className="text-xs text-black font-black">Live View</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={handleScan}
                            disabled={isScanning}
                            className={`px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded text-xs text-black font-black transition-all ${
                              isScanning 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-blue-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                          >
                            {isScanning ? 'SCANNING...' : 'SCAN'}
                          </button>
                          <button 
                            onClick={handleRefresh}
                            className="px-2 py-1 bg-lime-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded text-xs text-black font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            REFRESH
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Network Visualization Component */}
                  <div className="pt-16 h-full network-visualization">
                    <NetworkVisualization
                      agentStatus={agentStatus}
                      networkData={networkData}
                      onNegotiate={handleNegotiate}
                      isLoading={isLoading}
                      searchResults={searchResults}
                      selectedProvider={selectedProvider}
                      negotiationStatus={negotiationStatus}
                    />
                  </div>
                </>
              )}

              {activeTab === 'analytics' && (
                <>
                  {/* Analytics Header */}
                  <div className="absolute top-0 left-0 right-0 z-10 bg-pink-300 border-b-4 border-black p-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-black text-black">Data Analytics Dashboard</h2>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 border border-black rounded-full"></div>
                          <span className="text-xs text-black font-black">Real-time</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-2 py-1 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded text-xs text-black font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                            EXPORT
                          </button>
                          <button 
                            onClick={handleRefresh}
                            className="px-2 py-1 bg-lime-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded text-xs text-black font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            REFRESH
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Content */}
                  <div className="pt-16 h-full p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Key Metrics Overview */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-cyan-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 text-center">
                          <div className="text-2xl font-black text-black mb-1">{metrics.totalTransactions || 67}</div>
                          <div className="text-xs font-bold text-black uppercase">Total Transactions</div>
                        </div>
                        <div className="bg-yellow-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 text-center">
                          <div className="text-2xl font-black text-black mb-1">{metrics.dataVolume || '2.4TB'}</div>
                          <div className="text-xs font-bold text-black uppercase">Data Processed</div>
                        </div>
                        <div className="bg-lime-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 text-center">
                          <div className="text-2xl font-black text-black mb-1">{metrics.activeUsers || 89}</div>
                          <div className="text-xs font-bold text-black uppercase">Active Users</div>
                        </div>
                        <div className="bg-purple-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 text-center">
                          <div className="text-2xl font-black text-black mb-1">{Math.round((metrics.successRate || 0.987) * 100)}%</div>
                          <div className="text-xs font-bold text-black uppercase">Success Rate</div>
                        </div>
                      </div>

                      {/* Transaction Volume Chart */}
                      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                        <h3 className="text-lg font-black text-black mb-4">Transaction Volume (24h)</h3>
                        <div className="flex items-end space-x-2 h-32">
                          {[65, 89, 45, 78, 92, 67, 83, 76, 94, 56, 88, 72].map((height, index) => (
                            <div key={index} className="flex-1 bg-gradient-to-t from-cyan-400 to-blue-500 border-2 border-black rounded-t" style={{height: `${height}%`}}>
                              <div className="text-xs text-white font-black text-center pt-1">{height}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-bold text-black">
                          <span>00:00</span>
                          <span>06:00</span>
                          <span>12:00</span>
                          <span>18:00</span>
                          <span>24:00</span>
                        </div>
                      </div>

                      {/* Data Categories Breakdown */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                          <h3 className="text-lg font-black text-black mb-4">Data Categories</h3>
                          <div className="space-y-3">
                            {[
                              { name: 'Financial Data', value: 45, color: 'bg-cyan-400' },
                              { name: 'IoT Sensors', value: 23, color: 'bg-yellow-400' },
                              { name: 'Research Data', value: 18, color: 'bg-pink-400' },
                              { name: 'AI Training', value: 14, color: 'bg-purple-400' }
                            ].map((category, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-24 text-xs font-bold text-black">{category.name}</div>
                                <div className="flex-1 bg-gray-200 border-2 border-black rounded-full h-4">
                                  <div className={`${category.color} h-4 rounded-full border-r-2 border-black`} style={{width: `${category.value}%`}}></div>
                                </div>
                                <div className="text-xs font-black text-black w-8">{category.value}%</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                          <h3 className="text-lg font-black text-black mb-4">Regional Distribution</h3>
                          <div className="space-y-3">
                            {[
                              { region: 'North America', nodes: 847, percentage: 35 },
                              { region: 'Europe', nodes: 623, percentage: 26 },
                              { region: 'Asia Pacific', nodes: 534, percentage: 22 },
                              { region: 'Others', nodes: 412, percentage: 17 }
                            ].map((region, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-lime-100 border-2 border-black rounded">
                                <div>
                                  <div className="text-xs font-black text-black">{region.region}</div>
                                  <div className="text-xs font-bold text-black">{region.nodes} nodes</div>
                                </div>
                                <div className="text-lg font-black text-black">{region.percentage}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Performance Trends */}
                      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                        <h3 className="text-lg font-black text-black mb-4">Performance Trends (7 days)</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-xs font-bold text-black uppercase mb-2">Avg Latency</div>
                            <div className="text-2xl font-black text-green-600">{metrics.networkLatency || 42}ms</div>
                            <div className="text-xs text-black font-bold">↓ 12% from last week</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-black uppercase mb-2">Throughput</div>
                            <div className="text-2xl font-black text-blue-600">4.7K</div>
                            <div className="text-xs text-black font-bold">↑ 8% from last week</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-black uppercase mb-2">Error Rate</div>
                            <div className="text-2xl font-black text-red-600">0.02%</div>
                            <div className="text-xs text-black font-bold">↓ 0.01% from last week</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Right Sidebar - Metrics & Logs */}
        <aside className="w-80 bg-white border-l-4 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-neubrutalism mt-2 mr-2 rounded-tr-lg">
          <div className="p-4 space-y-4">
            {/* System Overview Header */}
            <div className="border-b-4 border-black pb-3">
              <h2 className="text-sm font-black text-black uppercase tracking-wide">
                {activeTab === 'network' ? 'System Overview' : 'Analytics Overview'}
              </h2>
              <p className="text-xs text-purple-600 mt-1 font-bold">
                {activeTab === 'network' ? 'Real-time monitoring & analytics' : 'Data insights & statistics'}
              </p>
            </div>

            {activeTab === 'network' && (
              <>
                {/* Performance Metrics */}
                <div className="bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3 metrics-display">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black text-black">PERFORMANCE</h3>
                    <span className="text-xs text-black font-bold">Live</span>
                  </div>
                  <MetricsDisplay metrics={metrics} />
                </div>

                {/* Resource Usage Charts */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide">Resource Usage</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-blue-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-black font-bold">CPU Usage</span>
                        <span className="text-xs font-black text-black">67%</span>
                      </div>
                      <div className="w-full bg-white border-2 border-black rounded-full h-2">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full border-r-2 border-black" style={{width: '67%'}}></div>
                      </div>
                    </div>
                    
                    <div className="bg-green-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-black font-bold">Memory</span>
                        <span className="text-xs font-black text-black">52%</span>
                      </div>
                      <div className="w-full bg-white border-2 border-black rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-2 rounded-full border-r-2 border-black" style={{width: '52%'}}></div>
                      </div>
                    </div>

                    <div className="bg-pink-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-black font-bold">Network I/O</span>
                        <span className="text-xs font-black text-black">84%</span>
                      </div>
                      <div className="w-full bg-white border-2 border-black rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full border-r-2 border-black" style={{width: '84%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Activity Log */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide">Activity Log</h3>
                  <div className="h-96 realtime-log">
                    <RealtimeLog logs={logs} />
                  </div>
                </div>

                {/* Active Connections */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide">Active Connections</h3>
                  <div className="space-y-2">
                    {activeConnections.length > 0 ? activeConnections.map((conn, index) => (
                      <div key={index} className="p-2 bg-cyan-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-black font-black">{conn.provider}</span>
                          <div className={`w-2 h-2 rounded-full border border-black ${
                            conn.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-black font-bold">{conn.dataType}</span>
                          <span className="text-xs text-black font-black">{conn.price} ICP</span>
                        </div>
                      </div>
                    )) : [
                      { peer: "peer-001.genesis.net", region: "US-East", ping: "12ms", status: "stable" },
                      { peer: "peer-047.genesis.net", region: "EU-West", ping: "45ms", status: "stable" },
                      { peer: "peer-123.genesis.net", region: "Asia-Pac", ping: "78ms", status: "unstable" },
                      { peer: "peer-089.genesis.net", region: "US-West", ping: "23ms", status: "stable" }
                    ].map((conn, index) => (
                      <div key={index} className="p-2 bg-cyan-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-black font-black">{conn.peer}</span>
                          <div className={`w-2 h-2 rounded-full border border-black ${
                            conn.status === 'stable' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-black font-bold">{conn.region}</span>
                          <span className="text-xs text-black font-black">{conn.ping}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction Pool */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide">Transaction Pool</h3>
                  <div className="space-y-2">
                    {transactionPool.length > 0 ? transactionPool.slice(0, 5).map((tx, index) => (
                      <div key={index} className="p-2 bg-lime-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-black font-black">{tx.id}</span>
                          <div className={`w-1.5 h-1.5 rounded-full border border-black ${
                            tx.status === 'confirmed' ? 'bg-green-500' : 
                            tx.status === 'processing' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-black font-bold">{tx.type}</span>
                          <span className="text-xs text-black font-black">{tx.amount}</span>
                        </div>
                      </div>
                    )) : [
                      { id: "TX001", type: "Data Transfer", amount: "0.5 ICP", status: "pending" },
                      { id: "TX002", type: "Smart Contract", amount: "1.2 ICP", status: "confirming" },
                      { id: "TX003", type: "Governance Vote", amount: "0.1 ICP", status: "confirmed" }
                    ].map((tx, index) => (
                      <div key={index} className="p-2 bg-lime-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-black font-black">{tx.id}</span>
                          <div className={`w-1.5 h-1.5 rounded-full border border-black ${
                            tx.status === 'confirmed' ? 'bg-green-500' : 
                            tx.status === 'confirming' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-black font-bold">{tx.type}</span>
                          <span className="text-xs text-black font-black">{tx.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'analytics' && (
              <>
                {/* Quick Stats */}
                <div className="bg-pink-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black text-black">QUICK STATS</h3>
                    <PieChart size={16} className="text-black" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-black font-bold">Revenue (24h)</span>
                      <span className="text-xs font-black text-green-600">+$12.4K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-black font-bold">New Users</span>
                      <span className="text-xs font-black text-blue-600">+127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-black font-bold">Data Requests</span>
                      <span className="text-xs font-black text-purple-600">4,891</span>
                    </div>
                  </div>
                </div>

                {/* Top Data Providers */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide">Top Data Providers</h3>
                  <div className="space-y-2">
                    {[
                      { name: "WeatherAPI Global", volume: "847 GB", earnings: "2.4 ICP", trend: "up" },
                      { name: "FinanceStream Inc", volume: "623 GB", earnings: "1.8 ICP", trend: "up" },
                      { name: "IoT Sensors Network", volume: "534 GB", earnings: "1.5 ICP", trend: "down" },
                      { name: "Research Data Hub", volume: "412 GB", earnings: "1.2 ICP", trend: "up" }
                    ].map((provider, index) => (
                      <div key={index} className="p-2 bg-yellow-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-black font-black">{provider.name}</span>
                          {provider.trend === 'up' ? 
                            <TrendingUp size={12} className="text-green-600" /> : 
                            <TrendingDown size={12} className="text-red-600" />
                          }
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-black font-bold">{provider.volume}</span>
                          <span className="text-xs text-black font-black">{provider.earnings}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Trends */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide">Market Trends</h3>
                  <div className="bg-cyan-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-black font-bold">Data Price Index</span>
                      <LineChart size={14} className="text-black" />
                    </div>
                    <div className="text-lg font-black text-green-600 mb-1">↑ 8.7%</div>
                    <div className="text-xs text-black font-bold">vs last month</div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { category: "Financial", change: "+12.4%", color: "text-green-600" },
                      { category: "Weather", change: "+5.8%", color: "text-green-600" },
                      { category: "IoT", change: "-2.1%", color: "text-red-600" },
                      { category: "Research", change: "+7.3%", color: "text-green-600" }
                    ].map((trend, index) => (
                      <div key={index} className="flex justify-between p-2 bg-purple-100 border border-black rounded">
                        <span className="text-xs text-black font-bold">{trend.category}</span>
                        <span className={`text-xs font-black ${trend.color}`}>{trend.change}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Analytics Events */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-wide">Recent Events</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[
                      { time: "14:32", event: "New data source registered", type: "info" },
                      { time: "14:28", event: "High volume alert triggered", type: "warning" },
                      { time: "14:25", event: "Payment processed: 2.4 ICP", type: "success" },
                      { time: "14:22", event: "API rate limit reached", type: "error" },
                      { time: "14:18", event: "New user subscription", type: "info" },
                      { time: "14:15", event: "Data quality check passed", type: "success" }
                    ].map((event, index) => (
                      <div key={index} className="p-2 bg-lime-100 border border-black rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-black">{event.time}</span>
                          <div className={`w-2 h-2 rounded-full border border-black ${
                            event.type === 'success' ? 'bg-green-500' :
                            event.type === 'warning' ? 'bg-yellow-500' :
                            event.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <div className="text-black font-bold">{event.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
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
      <footer className="bg-white border-t-4 border-black shadow-[0px_-8px_0px_0px_rgba(0,0,0,1)] px-4 py-2">
        <div className="flex justify-between items-center text-xs font-black">
          <div className="flex items-center space-x-4">
            <span className="text-black">STATUS: <span className="text-green-600">{agentStatus?.toUpperCase()}</span></span>
            <span className="text-black">MODE: <span className="text-yellow-600">{isMockMode ? 'TRAINING' : 'LIVE'}</span></span>
            {lastUpdate && (
              <span className="text-black">UPDATED: <span className="text-cyan-600">{lastUpdate.toLocaleTimeString()}</span></span>
            )}
          </div>
          
          {DEMO_CONFIG.DEMO_MODE && (
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">DEMO MODE ACTIVE</span>
            </div>
          )}
        </div>
      </footer>

      {/* Wallet History Modal */}
      {showWalletHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-black">💰 WALLET FUNDING HISTORY</h2>
              <button 
                onClick={() => setShowWalletHistory(false)}
                className="px-3 py-1 bg-red-300 text-black font-black border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white border-2 border-black p-3 rounded">
                <h3 className="font-black text-black mb-2">Current Balance</h3>
                <div className="text-2xl font-black text-green-600">{walletBalance.toFixed(2)} ICP</div>
              </div>
              
              <div className="bg-white border-2 border-black p-3 rounded">
                <h3 className="font-black text-black mb-3">Funding Sources</h3>
                {fundingHistory.length > 0 ? (
                  <div className="space-y-2">
                    {fundingHistory.map((funding, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-100 border border-black rounded">
                        <div>
                          <div className="font-black text-sm">{funding.source}</div>
                          <div className="text-xs text-gray-600">{funding.description}</div>
                          <div className="text-xs text-gray-500">{new Date(funding.timestamp).toLocaleDateString()}</div>
                        </div>
                        <div className="font-black text-green-600">+{funding.amount.toFixed(2)} ICP</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No funding history available</div>
                )}
              </div>
              
              {paymentHistory.length > 0 && (
                <div className="bg-white border-2 border-black p-3 rounded">
                  <h3 className="font-black text-black mb-3">Recent Payments</h3>
                  <div className="space-y-2">
                    {paymentHistory.slice(-5).map((payment, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-50 border border-black rounded">
                        <div>
                          <div className="font-black text-sm">{payment.dataProvider}</div>
                          <div className="text-xs text-gray-600">{payment.dataType} - {payment.records} records</div>
                          <div className="text-xs text-gray-500">{new Date(payment.timestamp).toLocaleDateString()}</div>
                        </div>
                        <div className="font-black text-red-600">-{payment.amount.toFixed(2)} ICP</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
