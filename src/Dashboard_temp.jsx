import React, { useState, useEffect, useCallback } from 'react';
import Joyride from 'react-joyride';
import { useAuth } from './context/AuthContext.jsx';
import { useNotifications } from './context/NotificationContext.jsx';
import { useWallet } from './context/WalletContext.jsx';
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
  HelpCircle,
  Bell
} from 'lucide-react';
import ControlPanel from './components/ControlPanel/ControlPanel_neubrutalism';

import RealtimeLog from './components/RealtimeLog/RealtimeLog_neubrutalism';
import MetricsDisplay from './components/MetricsDisplay/MetricsDisplay_neubrutalism';
import NetworkVisualization from './components/NetworkVisualization/NetworkVisualization_neubrutalism';
import genesisLogo from './assets/genesisnet-logo.png';
import DemoControlPanel from './components/DemoControlPanel';
import useRealData from './hooks/useRealData';
import { DEMO_CONFIG } from './utils/demoConfig';
import AccountSettingsPanel from './components/AccountSettingsPanel.jsx';
import SettingsIcon from './components/shared/SettingsIcon.jsx';
import NotificationCenter from './components/NotificationCenter/NotificationCenter.jsx';
import WalletInfoPanel from './components/WalletInfoPanel.jsx';

function Dashboard({ onBackToLanding }) {
  console.log('Dashboard: Component mounting/rendering');

  // Get authentication info and logout function
  const { user, logout } = useAuth();
  
  // Get notification functions
  const { addNotification } = useNotifications();
  
  // Access wallet context
  const { balance, address, isInitialized: walletInitialized } = useWallet();
  
  const [searchCriteria, setSearchCriteria] = useState({
    dataType: 'weather',
    location: 'Global',
    timeRange: '2024-01-01 to 2024-12-31',
    maxPrice: '100',
    minReputation: '7.0'
  });
  
  const [showDemoControls, setShowDemoControls] = useState(DEMO_CONFIG.DEMO_MODE);
  const [isScanning, setIsScanning] = useState(false); // Added missing state
  const [runTour, setRunTour] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  
  // Generate welcome notification on mount
  useEffect(() => {
    // Welcome notification
    addNotification({
      title: 'Welcome to GenesisNet',
      message: `Hello ${user?.name || 'User'}! Your decentralized data marketplace is ready.`,
      severity: 'info',
      category: 'system',
      type: 'persistent',
      action: {
        label: 'Start Tour',
        onClick: () => setRunTour(true)
      }
    });
    
    // System status notification
    addNotification({
      title: 'System Status',
      message: 'All systems operational. Network connectivity: 100%',
      severity: 'success',
      category: 'system',
      type: 'persistent'
    });
    
    // Sample transaction notification
    const timer = setTimeout(() => {
      addNotification({
        title: 'New Transaction',
        message: 'Transaction #TX78902 completed successfully',
        severity: 'success',
        category: 'transaction',
        type: 'toast',
        duration: 5000,
        action: {
          label: 'View Details',
          onClick: () => console.log('View transaction details')
        }
      });
    }, 3000);
    
    // Cleanup timer to prevent memory leaks
    return () => clearTimeout(timer);
  }, [addNotification, user, setRunTour]);
  const [autoStarted, setAutoStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('network');
  const [showWalletHistory, setShowWalletHistory] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [isNetworkNodesDropdownOpen, setIsNetworkNodesDropdownOpen] = useState(false);
  const [isActiveConnectionsDropdownOpen, setIsActiveConnectionsDropdownOpen] = useState(true);
  const [isTransactionPoolDropdownOpen, setIsTransactionPoolDropdownOpen] = useState(true);
  const [userSettings, setUserSettings] = useState({ theme: 'light', accentColor: '#FFD600', language: 'id', notifications: true, avatar: '' });
  
  // Toggle functions for dropdowns
  const toggleNetworkNodesDropdown = () => {
    setIsNetworkNodesDropdownOpen(!isNetworkNodesDropdownOpen);
  };
  
  const toggleActiveConnectionsDropdown = () => {
    setIsActiveConnectionsDropdownOpen(!isActiveConnectionsDropdownOpen);
  };
  
  const toggleTransactionPoolDropdown = () => {
    setIsTransactionPoolDropdownOpen(!isTransactionPoolDropdownOpen);
  };


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
    addFunds,
    transferFunds,
    getWalletInfo,
    icpWalletAddress,
    transactionHistory,
    isConnectedToICP = false,
    connectionStatus = 'connected',
    isLoading = false,
    error = null,
    clearError
  } = useRealData() || {};

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
        // Add notification for agent starting
        addNotification({
          title: 'Agent Activated',
          message: `Searching for ${searchCriteria.dataType} data in ${searchCriteria.location}`,
          severity: 'info',
          category: 'agent',
          type: 'persistent'
        });
        
        await startSearch(searchCriteria);
        
        // Add notification for agent success
        addNotification({
          title: 'Search Complete',
          message: 'Data search completed successfully',
          severity: 'success',
          category: 'agent',
          type: 'toast',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Failed to start agent:', error);
      
      // Add notification for agent error
      addNotification({
        title: 'Agent Error',
        message: 'Failed to initialize data search. Please try again.',
        severity: 'error',
        category: 'agent',
        type: 'persistent'
      });
    }
  }, [startSearch, searchCriteria, addNotification]);

  const handleNegotiate = useCallback(async (provider) => {
    try {
      let selectedProvider = provider;
      
      if (!selectedProvider && searchResults && searchResults.length > 0) {
        // Use first available provider if no specific provider selected
        selectedProvider = searchResults[0];
      }
      
      if (negotiate && typeof negotiate === 'function' && selectedProvider) {
        // Add notification for negotiation started
        addNotification({
          title: 'Negotiation Started',
          message: `Negotiating with provider: ${selectedProvider.name || 'Provider'}`,
          severity: 'info',
          category: 'transaction',
          type: 'persistent'
        });
        
        await negotiate(selectedProvider);
        
        // Add notification for successful negotiation
        addNotification({
          title: 'Negotiation Complete',
          message: `Successfully negotiated with ${selectedProvider.name || 'Provider'} for data access`,
          severity: 'success',
          category: 'transaction',
          type: 'persistent',
          action: {
            label: 'View Contract',
            onClick: () => console.log('View contract details')
          }
        });
      }
    } catch (error) {
      console.error('Failed to negotiate:', error);
      
      // Add notification for negotiation error
      addNotification({
        title: 'Negotiation Failed',
        message: 'Unable to complete negotiation with provider. Please try again.',
        severity: 'error',
        category: 'transaction',
        type: 'persistent'
      });
    }
  }, [negotiate, searchResults, addNotification]);

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
      
      // Add notification for scan started
      addNotification({
        title: 'Network Scan Started',
        message: 'Scanning network for new nodes and connections...',
        severity: 'info',
        category: 'network',
        type: 'persistent'
      });
      
      // Simulate scanning process with realistic delay
      setTimeout(() => {
        addLog('scan', 'Discovering new nodes and connections...', 'info', 'network-scanner');
        
        setTimeout(() => {
          const detectedNodes = Math.floor(Math.random() * 5) + 18;
          addLog('scan', 'Network scan complete - ' + detectedNodes + ' nodes detected', 'success', 'network-scanner');
          
          // Add notification for scan completed
          addNotification({
            title: 'Network Scan Complete',
            message: `${detectedNodes} nodes detected in the network`,
            severity: 'success',
            category: 'network',
            type: 'persistent',
            action: {
              label: 'View Network',
              onClick: () => console.log('View network action clicked')
            }
          });
          
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
      
      // Add notification for scan error
      addNotification({
        title: 'Network Scan Failed',
        message: 'Error scanning the network. Please try again.',
        severity: 'error',
        category: 'network',
        type: 'persistent'
      });
      
      setIsScanning(false);
    }
  }, [refresh, addLog, isScanning, addNotification]);

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

  // Enhanced tour steps with clearer instructions and better targeting
  const tourSteps = [
    {
      target: '[data-tour="search-input"]',
      content: "🔍 Search Input: Masukkan pertanyaan atau kata kunci di sini untuk mencari data dari jaringan neural. Contoh: 'weather data Jakarta' atau 'stock prices 2024'",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '[data-tour="start-agent-button"]',
      content: "🚀 Start Agent: Klik tombol ini untuk memulai agen AI dan mulai mencari data berdasarkan query Anda. Proses akan dimulai setelah Anda mengklik tombol ini.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '[data-tour="network-visualization"]',
      content: "🌐 Network Visualization: Visualisasi ini menunjukkan jaringan neural yang aktif, dengan node yang berkedip saat data mengalir. Anda dapat melihat bagaimana informasi bergerak antar node.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '[data-tour="metrics-display"]',
      content: "📊 Metrics Display: Monitor metrik kinerja utama seperti akurasi, waktu pemrosesan, dan efisiensi secara real-time. Data ini diperbarui setiap detik.",
      placement: "left",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '[data-tour="realtime-log"]',
      content: "📝 Real-time Log: Log ini menampilkan aktivitas sistem dan perilaku agen secara real-time. Anda dapat melihat setiap langkah yang dilakukan oleh sistem.",
      placement: "left",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '.wallet-balance',
      content: "💰 Wallet Balance: Saldo ICP cryptocurrency Anda untuk transaksi data. Setiap pencarian dan download data akan menggunakan saldo ini.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    },
    {
      target: '[data-tour="header-tour-button"]',
      content: "🔄 Tour Button: Anda dapat memulai ulang tur ini kapan saja dengan mengklik tombol ini. Berguna jika Anda ingin melihat penjelasan fitur lagi.",
      placement: "bottom",
      disableBeacon: true,
      spotlightClicks: false
    }
  ];

  // Filter tour steps to only include steps with existing target elements
  const getValidTourSteps = () => {
    return tourSteps.filter(step => {
      const targetElement = document.querySelector(step.target);
      return targetElement !== null;
    });
  };

  // State untuk menyimpan valid tour steps
  const [validTourSteps, setValidTourSteps] = useState([]);

  // Update valid tour steps when component mounts or when runTour changes
  useEffect(() => {
    const validSteps = tourSteps.filter(step => {
      const targetElement = document.querySelector(step.target);
      return targetElement !== null;
    });
    setValidTourSteps(validSteps);
    console.log('Valid tour steps:', validSteps);
  }, [runTour]);


  

  return (
    <>
      <div className="min-h-screen bg-yellow-50 text-black relative flex flex-col">
      <Joyride
        steps={validTourSteps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        scrollToFirstStep={true}
        scrollToStep={true}
        disableScrolling={false}
        spotlight={true}
        hideBackButton={false}
        hideCloseButton={false}
        disableOverlayClose={false}
        disableOverlay={false}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#FFD600',
            backgroundColor: '#ffffff',
            arrowColor: '#FFD600',
            textColor: '#000000',
            overlayColor: 'rgba(0, 0, 0, 0.8)',
            width: 380
          },
          spotlight: {
            backgroundColor: 'rgba(255, 214, 0, 0.25)',
            borderRadius: '8px',
            border: '3px solid #FFD600',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 214, 0, 1), inset 0 0 15px rgba(255, 214, 0, 0.3)'
          },
          tooltipContainer: {
            textAlign: 'left',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            border: '3px solid #000000',
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1), 0 0 20px rgba(255, 214, 0, 0.3)',
            backgroundColor: '#ffffff',
            maxWidth: '360px',
            minWidth: '280px',
            background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)'
          },
          tooltip: {
            fontSize: '14px',
            padding: '10px 0',
            backgroundColor: '#ffffff',
            color: '#000000',
            lineHeight: '1.5',
            fontWeight: '500'
          },
          buttonBack: {
            marginRight: 12,
            backgroundColor: '#FFD600',
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '8px 16px',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          },
          buttonNext: {
            backgroundColor: '#FFD600',
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '8px 16px',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          },
          buttonSkip: {
            color: '#666666',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'underline',
            transition: 'all 0.2s ease'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          },
          arrow: {
            color: '#FFD600',
            length: 12,
            spread: 20,
            border: '2px solid #000000'
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
          disableAnimation: false,
          disableOverlayAnimation: false,
          styles: {
            floater: {
              filter: 'drop-shadow(0px 0px 20px rgba(255, 214, 0, 0.7))'
            },
            arrow: {
              color: '#FFD600',
              length: 20,
              spread: 30,
              border: '4px solid #000000',
              boxShadow: '0 0 20px rgba(255, 214, 0, 1), 0 0 40px rgba(255, 214, 0, 0.6)'
            }
          }
        }}
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
          <div className="p-5 bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden max-w-sm sm:max-w-md">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-yellow-400 transition-all duration-300 ease-out"
                style={{ width: ((index + 1) / tourSteps.length) * 100 + '%' }}
              ></div>
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-black font-black text-xs">{index + 1}</span>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Langkah {index + 1} dari {tourSteps.length}
                </div>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {Math.round(((index + 1) / tourSteps.length) * 100)}%
              </div>
            </div>
            
            {/* Content */}
            <div className="mb-4">
              <div className="text-black text-sm leading-relaxed font-medium">
                {step.content}
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <div className="flex gap-2">
                {index > 0 && (
                  <button
                    {...backProps}
                    className="px-3 py-2 bg-gray-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-xs"
                  >
                    ← Prev
                  </button>
                )}
                {!isLastStep && (
                  <button
                    {...skipProps}
                    className="px-3 py-2 bg-gray-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-gray-700 font-bold rounded-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-xs"
                  >
                    Skip
                  </button>
                )}
              </div>
              <button
                {...(isLastStep ? closeProps : primaryProps)}
                className="px-4 py-2 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black font-bold rounded-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-xs"
              >
                {isLastStep ? 'Done ✓' : 'Next →'}
              </button>
            </div>
          </div>
        )}
        callback={(data) => {
          const { action, index, status, type, step } = data;
          
          console.log('Tour callback:', { action, index, status, type, step });
          
          if (status === 'finished' || status === 'skipped') {
            setRunTour(false);
            if (status === 'finished') {
              console.log('Tour completed successfully!');
            }
          }
          
          // Handle step navigation
          if (type === 'step:after') {
            console.log('Tour step ' + (index + 1) + ' completed');
          }
          
          if (type === 'step:before') {
            console.log('Tour step ' + (index + 1) + ' starting');
            // Check if target element exists
            if (step && step.target) {
              const targetElement = document.querySelector(step.target);
              console.log('Target element for step ' + (index + 1) + ':', targetElement);
              if (!targetElement) {
                console.warn('Target element not found: ' + step.target);
              }
            }
          }
          
          // Handle tour start
          if (type === 'tour:start') {
            console.log('Tour started');
            // Check all target elements
            tourSteps.forEach((step, idx) => {
              const targetElement = document.querySelector(step.target);
              console.log('Step ' + (idx + 1) + ' target (' + step.target + '):', targetElement);
            });
          }
          
          // Handle errors
          if (status === 'error') {
            console.error('Tour error:', data);
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
      <header className="relative z-50 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full">
        <div className="px-2 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-16 h-16 rounded-lg bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 relative flex items-center justify-center">
              <div className="w-full h-full rounded-lg bg-white border-2 border-black flex items-center justify-center cursor-pointer" onClick={onBackToLanding}>
                <img src={genesisLogo} alt="GenesisNet" className="w-10 h-10 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-black">GenesisNet</h1>
              <p className="text-xs text-purple-600 font-bold">Data Marketplace</p>
            </div>
          </div>
          
          {/* Center: Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 md:space-x-2">
            <button
              onClick={() => setActiveTab('network')}
              className={'flex items-center space-x-2 px-3 py-2 rounded-lg text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ' + 
                (activeTab === 'network' ? 'bg-cyan-300' : 'bg-white')
              }
            >
              <Network size={16} />
              <span>Network</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={'flex items-center space-x-2 px-3 py-2 rounded-lg text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ' + 
                (activeTab === 'analytics' ? 'bg-pink-300' : 'bg-white')
              }
            >
              <BarChart3 size={16} />
              <span>Analytics</span>
            </button>
            
          </div>

          {/* Right: User, Wallet, and Status Controls */}
          <div className="flex flex-wrap items-center gap-2 md:space-x-3">
            <NotificationCenter />
            <button
              onClick={() => {
                // Test notification with random types
                const types = ['info', 'success', 'warning', 'error'];
                const categories = ['system', 'transaction', 'network', 'agent', 'download'];
                const severity = types[Math.floor(Math.random() * types.length)];
                const category = categories[Math.floor(Math.random() * categories.length)];
                
                addNotification({
                  title: `Test ${severity.charAt(0).toUpperCase() + severity.slice(1)} Notification`,
                  message: `This is a test ${category} notification with ${severity} severity`,
                  severity: severity,
                  category: category,
                  type: 'persistent',
                  action: {
                    label: 'Dismiss',
                    onClick: () => console.log('Test notification dismissed')
                  }
                });
              }}
              className="p-2 rounded-lg bg-purple-200 hover:bg-purple-300 border-2 border-black"
              aria-label="Test notification"
            >
              <Bell className="w-5 h-5" />
            </button>
            <SettingsIcon onClick={() => setShowSettingsPanel(true)} />
            {/* Landing button removed. Navigation now on logo. */}
            <button
              onClick={() => setRunTour(true)}
              data-tour="header-tour-button"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all relative group"
              aria-label="Start guided tour"
            >
              <div className="absolute inset-0 bg-yellow-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <HelpCircle size={18} className="relative z-10" />
              <span className="relative z-10">Tour Guide</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-black rounded-full animate-pulse"></div>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowWalletHistory(!showWalletHistory)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-yellow-300 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all wallet-balance"
                aria-label="Show wallet balance"
              >
                <ShoppingCart size={18} className="mr-1" />
                <span className="font-bold text-sm">{balance ? balance.toFixed(2) : "0.00"} ICP</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-lime-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className={'w-2 h-2 rounded-full ' + 
                (isConnectedToICP ? 'bg-green-500 border border-black' :
                'bg-red-500 border border-black')
              }></div>
              <span className="text-xs text-black font-black">{agentStatus}</span>
            </div>
          </div>
        </div>
      </header>
      {/* Main Layout - 3 Column Dashboard */}
      {/* Settings Panel Modal */}
      {showSettingsPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 px-2 py-1 bg-red-300 text-black font-black border-2 border-black rounded shadow hover:bg-red-400"
              onClick={() => setShowSettingsPanel(false)}
            ></button>
            <AccountSettingsPanel settings={userSettings} onChange={setUserSettings} />
          </div>
        </div>
      )}
      <main className="flex h-[calc(100vh-80px)] pt-2">
        {/* Left Sidebar - Control Panel & Navigation */}
            {/* Network Control Header */}
            <div className="border-b-4 border-black pb-3">
              <h2 className="text-sm font-black text-black uppercase tracking-wide">Network Control</h2>
              <p className="text-xs text-purple-600 mt-1 font-bold">System parameters and controls</p>
            </div>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
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
                          <div className={"w-2 h-2 rounded-full border border-black flex-shrink-0 " + 
                            (selectedProvider?.id === provider.id && isNegotiating ? 'bg-yellow-500' :
                            provider.availability === 'available' ? 'bg-green-500' : 'bg-orange-500')
                          }></div>
                        </div>
                        <div className="text-sm font-black text-green-600 flex-shrink-0">{provider.currentPrice} ICP</div>
                      </div>
                      
                      {/* Provider Details */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex space-x-3 text-xs">
                          <span className="text-black font-bold">Quality: <span className="text-blue-600">{provider.dataQuality}/10</span></span>
                          <span className="text-black font-bold">Rep: <span className="text-purple-600">{provider.reputation}/10</span></span>
                        </div>
                        <div className="text-xs text-gray-600 font-medium">{provider.type?.toUpperCase()}</div>
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
                  <div className={'w-3 h-3 rounded-full border border-black animate-pulse ' + 
                    (negotiationStatus === 'connecting' ? 'bg-blue-500' :
                    negotiationStatus === 'authenticating' ? 'bg-yellow-500' :
                    negotiationStatus === 'price_discussion' ? 'bg-orange-500' :
                    negotiationStatus === 'quality_verification' ? 'bg-purple-500' :
                    negotiationStatus === 'contract_creation' ? 'bg-cyan-500' :
                    negotiationStatus === 'success' ? 'bg-green-500' :
                    negotiationStatus === 'failed' ? 'bg-red-500' : 'bg-gray-500')
                  }></div>
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
                          style={{ width: delivery.progress + '%' }}
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
                          style={{ width: download.progress + '%' }}
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
            {/* Network Nodes Dropdown */}
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between p-2 bg-blue-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded cursor-pointer hover:bg-blue-300 transition-colors"
                onClick={toggleNetworkNodesDropdown}
              >
                <h3 className="text-xs font-black text-black uppercase tracking-wide">Network Nodes</h3>
                <div className={'transform transition-transform duration-200 ' + (isNetworkNodesDropdownOpen ? "rotate-180" : "")}>
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {isNetworkNodesDropdownOpen && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
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
                        <div className={"w-2 h-2 rounded-full border border-black " + 
                          (node.status === "online" ? "bg-green-500" :
                          node.status === "maintenance" ? "bg-yellow-500" : "bg-red-500")
                        }></div>
                        <span className="text-xs text-black font-black">{node.id}</span>
                      </div>
                      <span className="text-xs text-black font-black">{node.load}</span>
                    </div>
                  ))}
                </div>
              )}
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
              
              {/* Network Tab Content */}
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
                            className={"px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded text-xs text-black font-black transition-all " + 
                              (isScanning
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
                            }
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
                  <div className="pt-16 h-full network-visualization" data-tour="network-visualization">
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
              {/* Analytics Tab Content */}
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
                      <div className="bg-purple-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 text-center">
                        <div className="text-2xl font-black text-black mb-1">{Math.round((metrics.successRate || 0.987) * 100)}%</div>
                        <div className="text-xs font-bold text-black uppercase">Success Rate</div>
                      </div>
                      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4">
                        <h3 className="text-lg font-black text-black mb-4">Transaction Volume (24h)</h3>
                        <div className="space-y-3">
                          {[
                            { name: 'Financial', value: 45, color: 'bg-green-300' },
                            { name: 'Weather', value: 30, color: 'bg-blue-300' },
                            { name: 'IoT', value: 15, color: 'bg-yellow-300' },
                            { name: 'Research', value: 10, color: 'bg-purple-300' }
                          ].map((category, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-24 text-xs font-bold text-black">{category.name}</div>
                              <div className="flex-1 bg-gray-200 border-2 border-black rounded-full h-4">
                                <div className={category.color + " h-4 rounded-full border-r-2 border-black"} style={{width: category.value + "%"}}></div>
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
                <div className="bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-3 metrics-display" data-tour="metrics-display">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black text-black">PERFORMANCE</h3>
                    <span className="text-xs text-black font-bold">Live</span>
                  </div>
                  <MetricsDisplay metrics={metrics} lastUpdate={lastUpdate} />
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
                  <div className="h-96 realtime-log" data-tour="realtime-log">
                    <RealtimeLog logs={logs} />
                  </div>
                </div>
                {/* Active Connections Dropdown */}
                <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between p-2 bg-cyan-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded cursor-pointer hover:bg-cyan-300 transition-colors"
                    onClick={toggleActiveConnectionsDropdown}
                  >
                    <h3 className="text-xs font-black text-black uppercase tracking-wide">Active Connections</h3>
                    <div className={'transform transition-transform duration-200 ' + (isActiveConnectionsDropdownOpen ? "rotate-180" : "")}>
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {isActiveConnectionsDropdownOpen && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {activeConnections.length > 0 ? activeConnections.map((conn, index) => (
                        <div key={index} className="p-2 bg-cyan-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-black font-black">{conn.provider}</span>
                            <div className={'w-2 h-2 rounded-full border border-black ' + 
                              (conn.status === 'active' ? 'bg-green-500' : 'bg-yellow-500')
                            }></div>
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
                            <div className={"w-2 h-2 rounded-full border border-black " + (conn.status === 'stable' ? 'bg-green-500' : 'bg-yellow-500')
                            }></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-black font-bold">{conn.region}</span>
                            <span className="text-xs text-black font-black">{conn.ping}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Transaction Pool Dropdown */}
                <div className="space-y-3">
                  <div 
                    className="flex items-center justify-between p-2 bg-lime-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded cursor-pointer hover:bg-lime-300 transition-colors"
                    onClick={toggleTransactionPoolDropdown}
                  >
                    <h3 className="text-xs font-black text-black uppercase tracking-wide">Transaction Pool</h3>
                    <div className={'transform transition-transform duration-200 ' + (isTransactionPoolDropdownOpen ? "rotate-180" : "")}>
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {isTransactionPoolDropdownOpen && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {transactionPool.length > 0 ? transactionPool.slice(0, 5).map((tx, index) => (
                        <div key={index} className="p-2 bg-lime-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-black font-black">{tx.id}</span>
                            <div className={"w-1.5 h-1.5 rounded-full border border-black " + 
                              (tx.status === 'confirmed' ? 'bg-green-500' :
                              tx.status === 'processing' ? 'bg-yellow-500' : 'bg-blue-500')
                            }></div>
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
                            <div className={"w-1.5 h-1.5 rounded-full border border-black " + 
                              (tx.status === 'confirmed' ? 'bg-green-500' :
                              tx.status === 'confirming' ? 'bg-yellow-500' : 'bg-blue-500')
                            }></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-black font-bold">{tx.type}</span>
                            <span className="text-xs text-black font-black">{tx.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                        <span className={"text-xs font-black " + trend.color}>{trend.change}</span>
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
                          <div className={"w-2 h-2 rounded-full border border-black " + 
                            (event.type === 'success' ? 'bg-green-500' :
                            event.type === 'warning' ? 'bg-yellow-500' :
                            event.type === 'error' ? 'bg-red-500' : 'bg-blue-500')
                          }></div>
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
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-black">💰 ICP WALLET</h2>
              <button
                onClick={() => setShowWalletHistory(false)}
                className="px-3 py-1 bg-red-300 text-black font-black border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                ✕
              </button>
            </div>
            
            <WalletInfoPanel />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
