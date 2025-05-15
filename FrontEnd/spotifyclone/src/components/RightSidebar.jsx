import React from "react";

const RightSidebar = () => (
  <aside className="w-80 min-h-screen bg-[#181818] text-white flex flex-col gap-4 p-4 border-l border-gray-900 overflow-y-auto">
    {/* Liked Songs */}
    <div className="bg-[#232323] rounded-2xl p-4 flex flex-col items-center shadow mb-2">
      <div className="w-32 h-32 bg-gray-700 rounded-xl mb-3"></div>
      <div className="font-bold text-lg mb-1">Liked Songs</div>
      <div className="text-gray-400 text-xs mb-2">Playlist • 160 songs</div>
      <button className="bg-[#1DB954] text-black font-bold px-6 py-2 rounded-full text-sm shadow hover:scale-105 transition-transform">Play</button>
    </div>
    {/* Artist Info */}
    <div className="bg-[#232323] rounded-2xl p-4 shadow mb-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div>
          <div className="font-bold">back to friends</div>
          <div className="text-gray-400 text-xs">sombr</div>
        </div>
      </div>
      <div className="text-gray-400 text-xs mb-2">28,310,911 monthly listeners</div>
      <button className="border border-gray-400 text-white rounded-full px-4 py-1 text-xs font-bold hover:border-white">Follow</button>
      <div className="mt-3">
        <div className="font-bold text-sm mb-1">About the artist</div>
        <div className="text-xs text-gray-400">late nights and young romance. instagram: @somb.r</div>
      </div>
    </div>
    {/* Credits */}
    <div className="bg-[#232323] rounded-2xl p-4 shadow mb-2">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-sm">Credits</div>
        <button className="text-xs text-gray-400 hover:underline">Show all</button>
      </div>
      <div className="text-xs text-gray-400">sombr<br/>Main Artist, Producer</div>
      <div className="text-xs text-gray-400 mt-2">Shane Boose<br/>Writer</div>
    </div>
    {/* On tour */}
    <div className="bg-[#232323] rounded-2xl p-4 shadow mb-2">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-sm">On tour</div>
        <button className="text-xs text-gray-400 hover:underline">Show all</button>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gray-700 rounded-lg px-2 py-1 text-xs font-bold">May 25</div>
        <div className="text-xs text-gray-400">Dublin<br/>sombr</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-gray-700 rounded-lg px-2 py-1 text-xs font-bold">May 26</div>
        <div className="text-xs text-gray-400">Dublin<br/>Nessa Barrett, sombr</div>
      </div>
    </div>
    {/* Next in queue */}
    <div className="bg-[#232323] rounded-2xl p-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-sm">Next in queue</div>
        <button className="text-xs text-gray-400 hover:underline">Open queue</button>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
        <div>
          <div className="font-bold text-xs">Blood // Water</div>
          <div className="text-gray-400 text-xs">grandson</div>
        </div>
      </div>
    </div>
  </aside>
);

export default RightSidebar; 