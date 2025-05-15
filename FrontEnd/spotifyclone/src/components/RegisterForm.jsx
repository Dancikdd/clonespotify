import React, { useState } from "react";

function RegisterForm({ onRegister, onSwitchToLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation: lowercase and contains @
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Email must be lowercase and contain a valid @ address.");
      return;
    }
    // Password validation: at least 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions to continue.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed. Please try again.");
      }
      const data = await res.json();
      console.log('Register response:', data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("is_admin", data.is_admin); // Add this line
      localStorage.setItem("name", data.name); // Store the name
      setTimeout(() => onRegister(), 1000);
    } catch (err) {
      setError(err.message);
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
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white mb-6">Sign up for free to start listening.</h1>
          {error && <div className="mb-4 text-center text-red-400 text-sm p-3 bg-red-900 bg-opacity-30 rounded-md w-full">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="email-register">
                What's your email?
              </label>
              <input
                id="email-register"
                type="email"
                placeholder="Enter your email."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="password-register">
                Create a password
              </label>
              <input
                id="password-register"
                type="password"
                placeholder="Create a password."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="name-register">
                What should we call you?
              </label>
              <input
                id="name-register"
                type="text"
                placeholder="Enter a profile name."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954]"
              />
              <p className="text-xs text-gray-400 mt-1">This appears on your profile.</p>
            </div>
            <div className="space-y-2 pt-2">
              <label htmlFor="termsAccepted" className="flex items-start text-xs text-gray-400">
                <input 
                  type="checkbox" 
                  id="termsAccepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#1DB954] bg-gray-700 border-gray-600 rounded mr-2 mt-0.5 focus:ring-[#1DB954] focus:ring-offset-black"
                />
                <span>By clicking on sign-up, you agree to Spotify's <a href="#" className="underline hover:text-[#1DB954]">Terms and Conditions of Use</a>.</span>
              </label>
              <p className="text-xs text-gray-400 pl-6">
                To learn more about how Spotify collects, uses, shares and protects your personal data, please see <a href="#" className="underline hover:text-[#1DB954]">Spotify's Privacy Policy</a>.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold py-3 rounded-full transition-colors uppercase tracking-wider text-sm mt-2"
            >
              Sign Up
            </button>
          </form>
          <hr className="border-gray-700 my-6 w-full" />
          <p className="text-center text-gray-400 text-sm w-full">
            Already have an account?
            <button 
              onClick={onSwitchToLogin} 
              className="font-semibold text-white hover:text-[#1DB954] focus:outline-none underline ml-1"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;