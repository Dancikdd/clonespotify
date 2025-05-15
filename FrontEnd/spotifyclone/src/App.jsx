import React, { useState } from "react";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";

function App() {
  const [authMode, setAuthMode] = useState(null); // null, 'login', or 'register'
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleShowLogin = () => setAuthMode("login");
  const handleShowRegister = () => setAuthMode("register");
  const handleAuthSuccess = () => {
    setIsAuthenticated(() => !!localStorage.getItem("token"));
    setAuthMode(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAuthMode(null);
  };
  const handleBack = () => setAuthMode(null);

  if (authMode) {
    return (
      <AuthPage
        mode={authMode}
        onAuthSuccess={handleAuthSuccess}
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onBack={handleBack}
      />
    );
  }

  return (
    <HomePage
      onShowLogin={handleShowLogin}
      onShowRegister={handleShowRegister}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    />
  );
}

export default App;