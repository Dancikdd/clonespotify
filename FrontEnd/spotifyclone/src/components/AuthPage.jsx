import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div>
        {showRegister ? (
          <>
            <RegisterForm onRegister={() => setIsAuthenticated(true)} />
            <p>
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onLogin={() => setIsAuthenticated(true)} />
            <p>
              Don't have an account?{" "}
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome! You are logged in.</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AuthPage;