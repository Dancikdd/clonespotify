import React, { useState } from "react";

function LoginForm({ onLogin, onSwitchToRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setLoading(false);
        setError("Server error: Invalid JSON response");
        console.error("JSON parse error:", jsonErr);
        return;
      }
      console.log("Login response:", data);
      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Invalid credentials");
        return;
      }
      if (!data.token) {
        setLoading(false);
        setError("Login failed: No token returned by server.");
        return;
      }
      localStorage.setItem("token", data.token);
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        onLogin();
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError("Network error: " + (err.message || "Unknown error"));
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 sm:p-6">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo and Back Button */}
        <div className="w-full flex flex-col items-center mb-6 relative">
          <button onClick={onBack} className="absolute left-0 top-1 text-white hover:text-[#1DB954] px-2 py-1 rounded focus:outline-none">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <svg role="img" height="60" width="185" aria-hidden="true" viewBox="0 0 167 48" className="fill-current text-white mx-auto">
            <path d="M83.425 1.658C37.54 1.658 0 23.048 0 47.862h166.85C166.85 23.048 129.31 1.658 83.425 1.658zm0 14.762c18.931 0 34.331 8.727 34.331 19.479H49.094c0-10.752 15.4-19.479 34.331-19.479z"></path>
          </svg>
        </div>
        <div className="bg-[#181818] p-8 rounded-lg shadow-xl border border-gray-800 w-full flex flex-col items-center">
          <h1 className="text-2xl sm:text-2xl font-bold text-center text-white mb-6">Log in to Spotify</h1>
          {error && <div className="mb-4 text-center text-red-400 text-sm p-3 bg-red-900 bg-opacity-30 rounded-md w-full">{error}</div>}
          {success && <div className="mb-4 text-center text-green-400 text-sm p-3 bg-green-900 bg-opacity-30 rounded-md w-full flex items-center justify-center">Logging in... <span className="ml-2 animate-spin inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></span></div>}
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-300" htmlFor="rememberMe">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#1DB954] bg-gray-800 border-gray-600 rounded focus:ring-[#1DB954] focus:ring-offset-0"
                  disabled={loading}
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-sm text-white hover:text-[#1DB954] underline">Forgot your password?</a>
            </div>
            <button
              type="submit"
              className={`w-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold py-3 rounded-full transition-colors uppercase tracking-wider text-sm mt-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <hr className="border-gray-700 my-6 w-full" />
          <p className="text-center text-gray-400 text-sm w-full">
            Don't have an account?
            <button 
              onClick={onSwitchToRegister} 
              className="font-semibold text-white hover:text-[#1DB954] focus:outline-none underline ml-1"
              disabled={loading}
            >
              Sign up for Spotify
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;