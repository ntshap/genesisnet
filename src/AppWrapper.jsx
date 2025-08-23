import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './Dashboard';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { WalletProvider } from './context/WalletContext';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleEnterDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    setShowDashboard(false);
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        <WalletProvider>
          {showDashboard ? (
            <Dashboard onBackToLanding={handleBackToLanding} />
          ) : (
            <LandingPage onEnterDashboard={handleEnterDashboard} />
          )}
        </WalletProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
