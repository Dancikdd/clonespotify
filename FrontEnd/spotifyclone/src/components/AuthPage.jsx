import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthPage({ mode, onAuthSuccess, onShowLogin, onShowRegister, onBack }) {
  if (mode === "login") {
    return (
      <LoginForm 
        onLogin={onAuthSuccess} 
        onSwitchToRegister={onShowRegister} 
        onBack={onBack}
      />
    );
  }
  if (mode === "register") {
    return (
      <RegisterForm 
        onRegister={onAuthSuccess} 
        onSwitchToLogin={onShowLogin} 
        onBack={onBack}
      />
    );
  }
  return null;
}

export default AuthPage;