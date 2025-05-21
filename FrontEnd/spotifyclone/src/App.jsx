import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import AdminDashboard from "./admin/AdminDashboard";
import SearchResults from "./components/SearchResults";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("is_admin") === "true");
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");
  const [searchResults, setSearchResults] = useState([]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("is_admin") === "true");
    setUserName(localStorage.getItem("name") || "");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("name");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserName("");
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`http://localhost:5050/api/songs/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (err) {
      setSearchResults([]);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <AuthPage mode="login" onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <AuthPage mode="register" onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
         <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/"
          element={
            <HomePage
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              userName={userName}
              onLogout={handleLogout}
              onSearch={handleSearch}
              results={searchResults}
            />
          }
        />
        {/* Redirect any other unknown routes to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;