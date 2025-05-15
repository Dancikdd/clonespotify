import React from "react";

const PlayerBar = () => (
  <div className="fixed bottom-0 left-0 w-full bg-[#181818] border-t border-gray-900 flex items-center justify-between px-8 py-3 z-50 shadow-2xl">
    {/* Song Info */}
    <div className="flex items-center gap-4 min-w-[200px]">
      <div className="w-12 h-12 bg-gray-700 rounded shadow"></div>
      <div>
        <div className="text-white font-bold text-sm leading-tight">back to friends</div>
        <div className="text-gray-400 text-xs">sombr</div>
      </div>
    </div>
    {/* Player Controls */}
    <div className="flex flex-col items-center flex-1">
      <div className="flex items-center gap-6 mb-1">
        <button className="text-gray-400 hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19V5l12 7-12 7z"/></svg></button>
        <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow hover:scale-105 transition-transform"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
        <button className="text-gray-400 hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 5v14l-12-7z"/></svg></button>
      </div>
      <div className="flex items-center gap-2 w-96 max-w-full">
        <span className="text-xs text-gray-400">0:02</span>
        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-1 bg-[#1DB954] w-1/4 rounded-full"></div>
        </div>
        <span className="text-xs text-gray-400">3:19</span>
      </div>
    </div>
    {/* Extra Controls */}
    <div className="flex items-center gap-4 min-w-[200px] justify-end">
      <button className="text-gray-400 hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17v-2h6v2H3zm0-4v-2h12v2H3zm0-4V7h18v2H3z"/></svg></button>
      <button className="text-gray-400 hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7h-1V3H9v4H8c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-4 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4-8H8V9h8v2z"/></svg></button>
      <button className="text-gray-400 hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17h7v-2h-7a2 2 0 1 1-2-2V3h-2z"/></svg></button>
    </div>
  </div>
);

export default PlayerBar; 