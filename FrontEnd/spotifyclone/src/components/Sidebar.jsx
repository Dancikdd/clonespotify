// Update for Sidebar.js - Change from w-96 to fixed w-64
import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ likedSongs, setCurrentPage, isAuthenticated, setShowAuthModal, onHomeClick, playSong }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: "/assets/frontend-assets/home.png", label: "Home", page: 'home' },
    { icon: "/assets/frontend-assets/search.png", label: "Search", page: 'search' },
    { icon: "/assets/frontend-assets/stack.png", label: "Your Library", page: 'library' },
  ];

  return (
    <div className="w-64 flex-shrink-0 bg-black h-screen overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <img src="/assets/frontend-assets/spotify_logo.png" alt="Spotify" className="h-10" />
      </div>

      {/* Main Menu */}
      <div className="px-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center space-x-4 w-full px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800"
            onClick={() => {
              if (item.page === 'home') {
                // Use onHomeClick instead of full page reload
                onHomeClick();
              } else {
                setCurrentPage(item.page);
              }
            }}
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Conditional content based on authentication state */}
      {isAuthenticated ? (
        <>
          {/* Create Playlist and Liked Songs (Logged In) */}
          <div className="mt-6 px-2">
            <div className="flex items-center space-x-4 px-4 py-2 cursor-pointer text-gray-400 hover:text-white" onClick={() => console.log('Create Playlist clicked')}>
              <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                <img src="/assets/frontend-assets/plus.png" alt="Create Playlist" className="w-4 h-4" />
              </div>
              <span className="font-medium">Create Playlist</span>
            </div>
            <div className="flex items-center space-x-4 px-4 py-2 cursor-pointer text-gray-400 hover:text-white" onClick={() => setCurrentPage('library')}> {/* Link to Your Library page */}
              <div className="w-6 h-6 bg-gradient-to-br from-purple-700 to-blue-500 rounded flex items-center justify-center">
                <img src="/assets/frontend-assets/like.png" alt="Liked Songs" className="w-4 h-4" />
              </div>
              <span className="font-medium">Liked Songs</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 my-2 border-t border-gray-800"></div>

          {/* Liked Songs List (dynamic, Logged In) */}
          <div className="flex-1 overflow-y-auto px-2">
            {likedSongs.map((song) => (
              <div
                key={song.id}
                className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer truncate"
                onClick={() => playSong(song)}
              >
                {song.title} - {song.artist}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Create Playlist (Logged Out) */}
          <div className="mt-6 px-6 py-4 bg-[#242424] mx-2 rounded-lg">
            <p className="text-white font-bold mb-2">Create your first playlist</p>
            <p className="text-gray-400 text-sm mb-4">It's easy, we'll help you</p>
            <button className="bg-white text-black text-sm font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform" onClick={() => setShowAuthModal(true)}>Create playlist</button>
          </div>

          {/* Find Podcasts (Logged Out) */}
          <div className="mt-4 px-6 py-4 bg-[#242424] mx-2 rounded-lg">
            <p className="text-white font-bold mb-2">Let's find some podcasts to follow</p>
            <p className="text-gray-400 text-sm mb-4">We'll keep you updated on new episodes</p>
            <button className="bg-white text-black text-sm font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform">Browse podcasts</button>
          </div>
        </>
      )}

      {/* Bottom Links and Language (Always visible) */}
      <div className="mt-auto px-2 pb-4 text-gray-400 text-xs">
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
          <a href="#" className="hover:underline">Legal</a>
          <a href="#" className="hover:underline">Safety & Privacy Center</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookies</a>
          <a href="#" className="hover:underline">About Ads</a>
          <a href="#" className="hover:underline">Accessibility</a>
        </div>
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
          <a href="#" className="hover:underline">Cookies</a>
        </div>
        {/* Language Dropdown (Placeholder) */}
        <button className="flex items-center border border-gray-400 text-gray-400 text-sm px-3 py-1 rounded-full hover:text-white hover:border-white transition-colors">
          <img src="/assets/frontend-assets/globe-icon.png" alt="Language" className="w-4 h-4 mr-2 filter invert" /> {/* Placeholder icon */}
          English
        </button>
      </div>

      {/* Install App */}
      <div className="p-4">
        <button className="flex items-center space-x-4 w-full px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800" onClick={() => console.log('Install App clicked')}>
          <img src="/assets/frontend-assets/mini-player.png" alt="Install App" className="w-6 h-6" />
          <span className="font-medium">Install App</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;