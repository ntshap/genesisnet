import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './Dashboard';

function App() {
  // Initialize state from localStorage to persist dashboard state across reloads
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

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('App: Saving dashboard state to localStorage:', showDashboard);
      localStorage.setItem('genesisnet-dashboard-state', showDashboard.toString());
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [showDashboard]);

  const handleEnterDashboard = () => {
    console.log('App: Entering dashboard');
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    console.log('App: Going back to landing page');
    setShowDashboard(false);
  };

  return (
    <div className="app-container">
      {showDashboard ? (
        <Dashboard onBackToLanding={handleBackToLanding} />
      ) : (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
    </div>
  );
}

export default App;
