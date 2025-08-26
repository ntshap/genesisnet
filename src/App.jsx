import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { WalletProvider } from './context/WalletContext.jsx';

function AppContent() {
  // Get auth state from context
  const { isAuthenticated, login, logout, user } = useAuth();
  
  // Log current authentication state
  useEffect(() => {
    console.log('AppContent: Current auth state:', { 
      isAuthenticated, 
      userExists: !!user, 
      user 
    });
    
    // Debug: Show all localStorage values
    console.log('AppContent: localStorage contents:', {
      token: localStorage.getItem('genesisnet-token'),
      user: localStorage.getItem('genesisnet-user'),
      users: localStorage.getItem('genesisnet-users'),
      dashboardState: localStorage.getItem('genesisnet-dashboard-state')
    });
  }, [isAuthenticated, user]);
  
  // State to track if we should show landing page or login/dashboard
  const [showDashboard, setShowDashboard] = useState(() => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('genesisnet-token');
      const user = localStorage.getItem('genesisnet-user');
      const savedState = localStorage.getItem('genesisnet-dashboard-state');
      
      console.log('App: Loading initial state - token exists:', !!token, 'user exists:', !!user);
      
      // If user is logged in, show dashboard regardless of saved state
      if (token && user) {
        console.log('App: Found token and user in localStorage, showing dashboard');
        return true;
      }
      
      // Otherwise use saved state
      console.log('App: No token/user, using saved dashboard state:', savedState);
      return savedState === 'true';
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return false;
    }
  });
  
  // State to control showing login/register pages
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Save dashboard state to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('App: Saving dashboard state to localStorage:', showDashboard);
      localStorage.setItem('genesisnet-dashboard-state', showDashboard.toString());
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [showDashboard]);

  const handleEnterDashboard = () => {
    if (isAuthenticated) {
      console.log('App: Entering dashboard');
      setShowDashboard(true);
    } else {
      console.log('App: Showing login page');
      setShowLogin(true);
    }
  };

  const handleBackToLanding = () => {
    console.log('App: Going back to landing page');
    
    // If user is authenticated, go to dashboard instead of landing
    if (isAuthenticated) {
      console.log('App: User is authenticated, showing dashboard');
      setShowDashboard(true);
      setShowLogin(false);
      setShowRegister(false);
      return;
    }
    
    // Otherwise go to landing page
    setShowDashboard(false);
    setShowLogin(false);
    setShowRegister(false);
  };
  
  const handleLogin = (userData) => {
    console.log('App: Logging in user:', userData);
    login(userData);
    setShowDashboard(true);
    setShowLogin(false);
  };

  const handleCreateAccount = () => {
    console.log('App: Showing register page');
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    console.log('App: Going back to login page');
    setShowRegister(false);
    setShowLogin(true);
  };

  // Effect to redirect to dashboard if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('App: User is authenticated, ensuring dashboard is shown');
      // Make sure we redirect to dashboard when auth state changes
      setShowDashboard(true);
      setShowLogin(false);
      setShowRegister(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="app-container">
      {showDashboard ? (
        isAuthenticated ? (
          // User is authenticated, show dashboard
          <Dashboard onBackToLanding={handleBackToLanding} />
        ) : (
          // Dashboard state is true but user is not authenticated - show login
          <LoginPage 
            onLogin={handleLogin} 
            onBackToLanding={handleBackToLanding}
            onCreateAccount={handleCreateAccount}
          />
        )
      ) : showLogin ? (
        // Show login page
        <LoginPage 
          onLogin={handleLogin} 
          onBackToLanding={handleBackToLanding}
          onCreateAccount={handleCreateAccount}
        />
      ) : showRegister ? (
        <RegisterPage
          onBackToLogin={handleBackToLogin}
          onBackToLanding={handleBackToLanding}
        />
      ) : (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
    </div>
  );
}

// Wrap the app with the authentication, notification, and wallet providers
function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
