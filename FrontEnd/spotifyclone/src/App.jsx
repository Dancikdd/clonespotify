import React, { useState } from "react";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";

function App() {
  const [authMode, setAuthMode] = useState(null); // null, 'login', or 'register'
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("is_admin") === "true");
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");

  const handleShowLogin = () => setAuthMode("login");
  const handleShowRegister = () => setAuthMode("register");
  const handleAuthSuccess = () => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("is_admin") === "true"); // update admin state
    setUserName(localStorage.getItem("name") || "");
    setAuthMode(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin"); // clear admin flag
    localStorage.removeItem("name");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserName("");
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
      isAdmin={isAdmin}
      userName={userName}
      onLogout={handleLogout}
    />
  );
}

export default App;