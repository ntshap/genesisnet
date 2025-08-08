import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

function AppContent() {
  // Get auth state from context
  const { isAuthenticated, login, logout, register } = useAuth();
  
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
  
  // State to control showing login page or register page
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
    setShowDashboard(false);
    setShowLogin(false);
    setShowRegister(false);
  };
  
  const handleLogin = (userData) => {
    console.log('App: Logging in user:', userData);
    login(userData);
    setShowDashboard(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleCreateAccount = () => {
    console.log('App: Showing registration page');
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleRegister = (userData) => {
    console.log('App: Registering user:', userData);
    register(userData);
    setShowDashboard(true);
    setShowRegister(false);
  };

  const handleBackToLogin = () => {
    console.log('App: Going back to login page');
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <div className="app-container">
      {showDashboard ? (
        <Dashboard onBackToLanding={handleBackToLanding} />
      ) : showLogin ? (
        <LoginPage onLogin={handleLogin} onBackToLanding={handleBackToLanding} onCreateAccount={handleCreateAccount} />
      ) : showRegister ? (
        <RegisterPage onRegister={handleRegister} onBackToLogin={handleBackToLogin} />
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
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
