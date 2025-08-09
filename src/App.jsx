import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function AppContent() {
  // Get auth state from context
  const { isAuthenticated, login, logout } = useAuth();
  
  // State to track if we should show landing page or login/dashboard
  const [showDashboard, setShowDashboard] = useState(() => {
    try {
      const saved = localStorage.getItem('genesisnet-dashboard-state');
      console.log('App: Loading dashboard state from localStorage:', saved);
      return saved === 'true';
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return false;
    }
  });
  
  // State to control showing login page
  const [showLogin, setShowLogin] = useState(false);

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
    setShowDashboard(false);
    setShowLogin(false);
  };
  
  const handleLogin = (userData) => {
    console.log('App: Logging in user:', userData);
    login(userData);
    setShowDashboard(true);
    setShowLogin(false);
  };

  return (
    <div className="app-container">
      {showDashboard ? (
        <Dashboard onBackToLanding={handleBackToLanding} />
      ) : showLogin ? (
        <LoginPage onLogin={handleLogin} onBackToLanding={handleBackToLanding} />
      ) : (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
    </div>
  );
}

// Wrap the app with the authentication provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
