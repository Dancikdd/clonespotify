import React from "react";

const Sidebar = () => (
  <aside className="w-64 min-h-screen bg-[#121212] text-white flex flex-col justify-between p-6 border-r border-gray-900 shadow-xl">
    <div>
      <div className="flex flex-col items-center mb-8">
        <svg role="img" height="48" width="140" aria-hidden="true" viewBox="0 0 167 48" className="fill-current text-white mb-4">
          <path d="M83.425 1.658C37.54 1.658 0 23.048 0 47.862h166.85C166.85 23.048 129.31 1.658 83.425 1.658zm0 14.762c18.931 0 34.331 8.727 34.331 19.479H49.094c0-10.752 15.4-19.479 34.331-19.479z"></path>
        </svg>
        <div className="w-full border-b border-gray-800 mb-4"></div>
      </div>
      <nav className="space-y-2">
        <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#232323] font-semibold transition-colors">Your Library</button>
      </nav>
      <div className="mt-8 space-y-4">
        <div className="bg-[#232323] rounded-xl p-4 mb-2 shadow hover:shadow-lg transition-shadow">
          <p className="font-bold mb-2">Create your first playlist</p>
          <p className="text-sm mb-3">It's easy, we'll help you</p>
          <button className="bg-white text-black font-bold px-4 py-2 rounded-full text-sm shadow hover:scale-105 transition-transform">Create playlist</button>
        </div>
        <div className="bg-[#232323] rounded-xl p-4 shadow hover:shadow-lg transition-shadow">
          <p className="font-bold mb-2">Let's find some podcasts to follow</p>
          <p className="text-sm mb-3">We'll keep you updated on new episodes</p>
          <button className="bg-white text-black font-bold px-4 py-2 rounded-full text-sm shadow hover:scale-105 transition-transform">Browse podcasts</button>
        </div>
      </div>
    </div>
    <div className="text-xs text-gray-400 space-y-2 mt-8">
      <div className="flex flex-wrap gap-2 mb-2">
        <a href="#" className="hover:underline">Legal</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookies</a>
      </div>
      <button className="border border-gray-600 rounded-full px-3 py-1 flex items-center gap-2 hover:border-white transition-colors">
        <span className="material-icons text-base">language</span> English
      </button>
    </div>
  </aside>
);

export default Sidebar; 