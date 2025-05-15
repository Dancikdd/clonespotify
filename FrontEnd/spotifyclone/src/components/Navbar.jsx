import React from "react";

const Navbar = ({ onShowLogin, onShowRegister, isAuthenticated, onLogout }) => (
  <header className="w-full bg-[#181818] flex items-center justify-between px-8 py-4 border-b border-gray-800 sticky top-0 z-10">
    <div className="flex items-center gap-4">
      <button className="text-white hover:text-[#1DB954]">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      </button>
      <input
        type="text"
        placeholder="What do you want to play?"
        className="bg-[#232323] text-white px-4 py-2 rounded-full w-72 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
      />
    </div>
    <nav className="flex items-center gap-6">
      <a href="#" className="text-gray-300 hover:text-white font-semibold">Premium</a>
      <a href="#" className="text-gray-300 hover:text-white font-semibold">Support</a>
      <a href="#" className="text-gray-300 hover:text-white font-semibold">Download</a>
      <span className="text-gray-500">|</span>
      {!isAuthenticated ? (
        <>
          <a href="#" className="text-gray-300 hover:text-white font-semibold" onClick={onShowRegister}>Sign up</a>
          <button className="bg-white text-black font-bold px-6 py-2 rounded-full ml-2 hover:scale-105 transition-transform" onClick={onShowLogin}>Log in</button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">User</span>
          <button className="bg-[#1DB954] text-black font-bold px-4 py-2 rounded-full ml-2 hover:bg-[#1ED760] transition-colors" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  </header>
);

export default Navbar; 