import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainPortal from './components/MainPortal';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn ? <MainPortal onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </>
  );
};

export default App;