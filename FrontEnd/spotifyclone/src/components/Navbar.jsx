import React from "react";

const Navbar = ({ onShowLogin, onShowRegister, isAuthenticated, isAdmin, userName, onLogout }) => {
  return (
    <nav className="bg-[#181818] px-6 py-3 flex items-center justify-between">
      {/* Left side - Navigation arrows */}
      <div className="flex items-center space-x-4">
        <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:scale-105 transition-transform">
          <img src="/assets/frontend-assets/left_arrow.png" alt="Back" className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:scale-105 transition-transform">
          <img src="/assets/frontend-assets/right_arrow.png" alt="Forward" className="w-4 h-4" />
        </button>
      </div>

      {/* Center - Search bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <img src="/assets/frontend-assets/search.png" alt="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="w-full bg-[#242424] text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <button className="text-gray-400 hover:text-white">
              <img src="/assets/frontend-assets/bell.png" alt="Notifications" className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2 bg-black rounded-full px-2 py-1 cursor-pointer hover:bg-[#282828]">
              <img src="/assets/frontend-assets/img1.jpg" alt="Profile" className="w-6 h-6 rounded-full" />
              <span className="text-white font-medium">{userName}</span>
              <img src="/assets/frontend-assets/arrow.png" alt="Menu" className="w-4 h-4" />
            </div>
            {isAdmin && (
              <button className="text-gray-400 hover:text-white">
                <img src="/assets/frontend-assets/zoom.png" alt="Admin" className="w-6 h-6" />
              </button>
            )}
            <button onClick={onLogout} className="text-gray-400 hover:text-white">
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onShowLogin}
              className="text-gray-400 hover:text-white font-bold"
            >
              Log in
            </button>
            <button
              onClick={onShowRegister}
              className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;