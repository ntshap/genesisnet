import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './Dashboard';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleEnterDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    setShowDashboard(false);
  };

  return (
    <>
      {showDashboard ? (
        <Dashboard onBackToLanding={handleBackToLanding} />
      ) : (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
    </>
  );
}

export default App;
